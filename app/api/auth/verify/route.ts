/**
 * POST /api/auth/verify
 * Verify wallet signature and issue JWT token
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifySignature, generateToken, generateAuthMessage } from '@/lib/auth/jwt';
import { isAddress } from '@/lib/blockchain/contracts';

// This should match the nonceStore in connect/route.ts
// In production, use a shared store like Redis
const nonceStore = new Map<string, { nonce: string; timestamp: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, signature } = body;

    // Validate inputs
    if (!address || !isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature required' },
        { status: 400 }
      );
    }

    // Get stored nonce
    const stored = nonceStore.get(address.toLowerCase());

    if (!stored) {
      return NextResponse.json(
        { error: 'No nonce found. Please reconnect.' },
        { status: 400 }
      );
    }

    // Check nonce age (5 minutes max)
    const now = Date.now();
    if (now - stored.timestamp > 5 * 60 * 1000) {
      nonceStore.delete(address.toLowerCase());
      return NextResponse.json(
        { error: 'Nonce expired. Please reconnect.' },
        { status: 400 }
      );
    }

    // Recreate the message
    const message = generateAuthMessage(address, stored.nonce);

    // Verify signature
    const isValid = verifySignature(message, signature, address);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Delete used nonce
    nonceStore.delete(address.toLowerCase());

    // Generate JWT token
    const token = await generateToken(address);

    return NextResponse.json({
      success: true,
      token,
      address,
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
