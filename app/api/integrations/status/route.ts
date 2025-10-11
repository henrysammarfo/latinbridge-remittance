/**
 * GET /api/integrations/status
 * Check status of all external integrations
 */
import { NextRequest, NextResponse } from 'next/server';
import { testAPIs } from '@/lib/api/exchangeRates';
import { getStripeStatus } from '@/lib/api/stripe';

export async function GET(req: NextRequest) {
  try {
    // Test Exchange Rate APIs
    const exchangeRateStatus = await testAPIs();

    // Check Stripe configuration
    const stripeStatus = getStripeStatus();

    // Check Didit configuration
    const diditStatus = {
      configured: !!(process.env.DIDIT_API_KEY && process.env.DIDIT_APP_ID),
      hasApiKey: !!process.env.DIDIT_API_KEY,
      hasAppId: !!process.env.DIDIT_APP_ID,
      ready: !!(process.env.DIDIT_API_KEY && process.env.DIDIT_APP_ID),
    };

    // Check smart contract configuration
    const contractStatus = {
      configured: !!(
        process.env.NEXT_PUBLIC_USER_REGISTRY &&
        process.env.NEXT_PUBLIC_REMITTANCE_VAULT &&
        process.env.NEXT_PUBLIC_SAVINGS_POOL &&
        process.env.NEXT_PUBLIC_MICROLOAN_MANAGER
      ),
      addresses: {
        userRegistry: process.env.NEXT_PUBLIC_USER_REGISTRY || 'NOT_SET',
        remittanceVault: process.env.NEXT_PUBLIC_REMITTANCE_VAULT || 'NOT_SET',
        savingsPool: process.env.NEXT_PUBLIC_SAVINGS_POOL || 'NOT_SET',
        microloanManager: process.env.NEXT_PUBLIC_MICROLOAN_MANAGER || 'NOT_SET',
        exchangeRateOracle: process.env.NEXT_PUBLIC_EXCHANGE_RATE_ORACLE || 'NOT_SET',
        paymentNetworks: process.env.NEXT_PUBLIC_PAYMENT_NETWORKS || 'NOT_SET',
      },
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      integrations: {
        exchangeRates: {
          primary: {
            name: 'ExchangeRate-API',
            status: exchangeRateStatus.primary.status,
            currencies: exchangeRateStatus.primary.currencies,
          },
          backup: {
            name: 'FreeCurrencyAPI',
            status: exchangeRateStatus.backup.status,
            currencies: exchangeRateStatus.backup.currencies,
          },
        },
        stripe: stripeStatus,
        didit: diditStatus,
        smartContracts: contractStatus,
      },
    });
  } catch (error: any) {
    console.error('Integration status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check integration status' },
      { status: 500 }
    );
  }
}
