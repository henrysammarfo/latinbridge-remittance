/**
 * GET /api/kyc/status?sessionId=xxx
 * Get KYC verification status
 */
import { NextRequest, NextResponse } from 'next/server';
import { getVerificationStatus } from '@/lib/api/didit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const status = await getVerificationStatus(sessionId);

    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error: any) {
    console.error('KYC status retrieval error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve KYC status' },
      { status: 500 }
    );
  }
}
