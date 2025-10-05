/**
 * GET /api/rates/current
 * Get current exchange rates for all supported currencies
 */
import { NextRequest, NextResponse } from 'next/server';
import { fetchExchangeRates } from '@/lib/api/exchangeRates';

export async function GET(req: NextRequest) {
  try {
    const rates = await fetchExchangeRates();

    return NextResponse.json({
      success: true,
      rates,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch rates:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve exchange rates' },
      { status: 500 }
    );
  }
}
