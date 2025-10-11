/**
 * POST /api/payments/create-intent
 * Create a Stripe payment intent for fiat on-ramp
 */
import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/api/stripe';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, email, walletAddress } = await req.json();

    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Amount and currency are required' },
        { status: 400 }
      );
    }

    if (amount < 1) {
      return NextResponse.json(
        { error: 'Minimum amount is $1' },
        { status: 400 }
      );
    }

    const paymentIntent = await createPaymentIntent({
      amount,
      currency,
      customerEmail: email,
      description: `LatinBridge Deposit - ${amount} ${currency}`,
      metadata: {
        walletAddress: walletAddress || '',
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      paymentIntent,
    });
  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
