/**
 * Stripe Payment Processing Integration
 * Handles fiat on-ramp for USD deposits
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Only initialize if keys are available
let stripe: any = null;

if (STRIPE_SECRET_KEY) {
  try {
    const Stripe = require('stripe');
    stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28',
    });
  } catch (error) {
    console.warn('Stripe initialization failed:', error);
  }
}

export interface PaymentIntentData {
  amount: number;
  currency: string;
  customerEmail?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface StripePaymentIntentResponse {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

/**
 * Create a payment intent for fiat on-ramp
 */
export async function createPaymentIntent(
  data: PaymentIntentData
): Promise<StripePaymentIntentResponse> {
  if (!stripe) {
    throw new Error('Stripe not initialized. Please configure STRIPE_SECRET_KEY.');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100), // Convert to cents
      currency: data.currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      description: data.description || 'LatinBridge Deposit',
      metadata: {
        platform: 'LatinBridge',
        ...data.metadata,
      },
      receipt_email: data.customerEmail,
    });

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret!,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    };
  } catch (error: any) {
    console.error('Stripe payment intent creation failed:', error);
    throw new Error(error.message || 'Payment intent creation failed');
  }
}

/**
 * Get payment intent status
 */
export async function getPaymentIntent(paymentIntentId: string) {
  if (!stripe) {
    throw new Error('Stripe not initialized');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
    };
  } catch (error: any) {
    console.error('Failed to retrieve payment intent:', error);
    throw new Error('Payment intent retrieval failed');
  }
}

/**
 * Confirm payment and process deposit
 */
export async function confirmPayment(
  paymentIntentId: string,
  walletAddress: string
): Promise<{ success: boolean; message: string; data?: any }> {
  if (!stripe) {
    return {
      success: false,
      message: 'Stripe not configured',
    };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return {
        success: false,
        message: `Payment status: ${paymentIntent.status}`,
      };
    }

    // In production: Call smart contract to mint/transfer tokens to wallet
    // For now: Return success with payment data
    return {
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        walletAddress,
      },
    };
  } catch (error: any) {
    console.error('Payment confirmation failed:', error);
    return {
      success: false,
      message: error.message || 'Payment confirmation failed',
    };
  }
}

/**
 * Create a customer for recurring payments
 */
export async function createCustomer(email: string, name?: string, walletAddress?: string) {
  if (!stripe) {
    throw new Error('Stripe not initialized');
  }

  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        walletAddress: walletAddress || '',
        platform: 'LatinBridge',
      },
    });

    return {
      id: customer.id,
      email: customer.email,
    };
  } catch (error: any) {
    console.error('Customer creation failed:', error);
    throw new Error('Customer creation failed');
  }
}

/**
 * Handle Stripe webhooks
 */
export async function handleStripeWebhook(
  payload: string,
  signature: string
): Promise<{ success: boolean; event?: any; error?: string }> {
  if (!stripe) {
    return { success: false, error: 'Stripe not initialized' };
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        // Process the successful payment
        // Update database, mint tokens, etc.
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { success: true, event };
  } catch (error: any) {
    console.error('Webhook handling failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if Stripe is properly configured
 */
export function isStripeConfigured(): boolean {
  return stripe !== null && !!STRIPE_SECRET_KEY && !!STRIPE_PUBLISHABLE_KEY;
}

/**
 * Get Stripe configuration status
 */
export function getStripeStatus() {
  return {
    configured: isStripeConfigured(),
    hasSecretKey: !!STRIPE_SECRET_KEY,
    hasPublishableKey: !!STRIPE_PUBLISHABLE_KEY,
    ready: isStripeConfigured(),
  };
}
