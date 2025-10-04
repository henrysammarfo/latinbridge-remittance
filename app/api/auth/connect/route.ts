/**
 * POST /api/auth/connect
 * Initialize wallet connection and get authentication nonce
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateNonce, generateAuthMessage } from '@/lib/auth/jwt';
import { isAddress } from '@/lib/blockchain/contracts';

// In-memory nonce storage (use Redis in production)
const nonceStore = new Map<string, { nonce: string; timestamp: number }>();

// Clean up old nonces (older than 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [address, data] of nonceStore.entries()) {
    if (now - data.timestamp > 5 * 60 * 1000) {
      nonceStore.delete(address);
    }
  }
}, 60000);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = body;

    // Validate address
    if (!address || !isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Generate nonce
    const nonce = generateNonce();
    const message = generateAuthMessage(address, nonce);

    // Store nonce with timestamp
    nonceStore.set(address.toLowerCase(), {
      nonce,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message,
      nonce,
    });
  } catch (error) {
    console.error('Connection error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize connection' },
      { status: 500 }
    );
  }
}
