/**
 * Exchange Rate API Integration
 * Using ExchangeRate-API (free tier) for all 6 currencies including COP and GTQ
 */

export interface ExchangeRates {
  USD: number;
  MXN: number;
  BRL: number;
  ARS: number;
  COP: number;
  GTQ: number;
}

interface ExchangeRateAPIResponse {
  result: string;
  rates: Record<string, number>;
  base: string;
  time_last_updated: number;
}

const CACHE_DURATION = 30 * 1000; // 30 seconds
let ratesCache: {
  data: ExchangeRates | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

/**
 * Fetch live exchange rates from ExchangeRate-API
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  // Check cache
  const now = Date.now();
  if (ratesCache.data && (now - ratesCache.timestamp) < CACHE_DURATION) {
    return ratesCache.data;
  }

  try {
    // Primary API: ExchangeRate-API (free, no rate limits)
    const apiUrl = process.env.EXCHANGE_RATE_API_URL || 'https://api.exchangerate-api.com/v4/latest';
    const response = await fetch(`${apiUrl}/USD`, {
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.statusText}`);
    }

    const data: ExchangeRateAPIResponse = await response.json();

    const rates: ExchangeRates = {
      USD: 1.0,
      MXN: data.rates.MXN || 20.0,
      BRL: data.rates.BRL || 5.0,
      ARS: data.rates.ARS || 1000.0,
      COP: data.rates.COP || 4000.0,
      GTQ: data.rates.GTQ || 7.8,
    };

    // Update cache
    ratesCache = {
      data: rates,
      timestamp: now,
    };

    return rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);

    // Return fallback rates if API fails
    if (ratesCache.data) {
      return ratesCache.data;
    }

    // Last resort fallback rates
    return {
      USD: 1.0,
      MXN: 20.0,
      BRL: 5.0,
      ARS: 1000.0,
      COP: 4000.0,
      GTQ: 7.8,
    };
  }
}

/**
 * Get rate for a specific currency
 */
export async function getCurrencyRate(currency: keyof ExchangeRates): Promise<number> {
  const rates = await fetchExchangeRates();
  return rates[currency];
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  from: keyof ExchangeRates,
  to: keyof ExchangeRates
): Promise<number> {
  const rates = await fetchExchangeRates();

  if (from === to) {
    return amount;
  }

  // Convert to USD first, then to target currency
  const usdAmount = amount / rates[from];
  const targetAmount = usdAmount * rates[to];

  return targetAmount;
}

/**
 * Get historical rates (simplified - uses current rate as fallback)
 * In production, integrate with a service that provides historical data
 */
export async function getHistoricalRates(date: Date): Promise<ExchangeRates> {
  // For now, return current rates
  // In production, integrate with APIs like exchangeratesapi.io (paid) or forex APIs
  return fetchExchangeRates();
}

/**
 * Format currency amount with proper decimals
 */
export function formatCurrencyAmount(amount: number, currency: keyof ExchangeRates): string {
  const decimals = currency === 'ARS' || currency === 'COP' ? 0 : 2;
  return amount.toFixed(decimals);
}
