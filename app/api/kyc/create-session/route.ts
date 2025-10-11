/**
 * POST /api/kyc/create-session
 * Create a Didit KYC verification session
 */
import { NextRequest, NextResponse } from 'next/server';
import { createVerificationSession } from '@/lib/api/didit';

export async function POST(req: NextRequest) {
  try {
    const { userAddress, workflowId } = await req.json();

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 }
      );
    }

    const session = await createVerificationSession(userAddress, workflowId);

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error: any) {
    console.error('KYC session creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create KYC session' },
      { status: 500 }
    );
  }
}
