/**
 * Exchange Rate API Integration
 * Using FreeCurrencyAPI for available currencies (USD, MXN, BRL)
 * Using fallback rates for unavailable currencies (ARS, COP, GTQ)
 */

export interface ExchangeRates {
  USD: number;
  MXN: number;
  BRL: number;
  ARS: number;
  COP: number;
  GTQ: number;
}

interface FreeCurrencyAPIResponse {
  data: Record<string, number>;
}

const CACHE_DURATION = 30 * 1000; // 30 seconds
let ratesCache: {
  data: ExchangeRates | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

// Approximate fallback rates for currencies not available in free tier
// These are updated periodically based on market rates
const FALLBACK_RATES = {
  USD: 1.0,
  MXN: 17.5,   // Mexican Peso (available in API - this is backup)
  BRL: 5.0,    // Brazilian Real (available in API - this is backup)
  ARS: 350.0,  // Argentine Peso (approximate as of 2025)
  COP: 4100.0, // Colombian Peso (approximate as of 2025)
  GTQ: 7.8,    // Guatemalan Quetzal (approximate as of 2025)
};

/**
 * Fetch from FreeCurrencyAPI
 * Supports: MXN, BRL (from the 32 available currencies)
 * Does NOT support: ARS, COP, GTQ (will use fallback)
 */
async function fetchFromFreeCurrencyAPI(): Promise<Partial<ExchangeRates> | null> {
  try {
    const apiKey = process.env.FREE_CURRENCY_API_KEY || 'fca_live_uL1JE9Q4sDZFVpkzEhEkH9hc276b0dSBT3uTHYYO';
    const apiUrl = process.env.FREE_CURRENCY_API_URL || 'https://api.freecurrencyapi.com/v1';

    // Only request currencies that are supported in the free tier
    const currencies = 'MXN,BRL';
    const response = await fetch(
      `${apiUrl}/latest?apikey=${apiKey}&base_currency=USD&currencies=${currencies}`,
      { next: { revalidate: 30 } }
    );

    if (!response.ok) {
      throw new Error(`FreeCurrencyAPI error: ${response.statusText}`);
    }

    const result: FreeCurrencyAPIResponse = await response.json();

    if (!result.data) {
      throw new Error('Invalid API response format');
    }

    return {
      USD: 1.0,
      MXN: result.data.MXN,
      BRL: result.data.BRL,
    };
  } catch (error) {
    console.error('FreeCurrencyAPI failed:', error);
    return null;
  }
}

/**
 * Fetch live exchange rates with fallback strategy
 * 1. Try FreeCurrencyAPI for MXN and BRL
 * 2. Use cached data if available
 * 3. Use hardcoded fallback rates as last resort
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  // Check cache first
  const now = Date.now();
  if (ratesCache.data && (now - ratesCache.timestamp) < CACHE_DURATION) {
    console.log('Using cached exchange rates');
    return ratesCache.data;
  }

  // Try to fetch live rates for available currencies
  console.log('Fetching rates from FreeCurrencyAPI...');
  const partialRates = await fetchFromFreeCurrencyAPI();

  let rates: ExchangeRates;

  if (partialRates && partialRates.MXN && partialRates.BRL) {
    // Combine live rates with fallback rates
    console.log('Using live rates for MXN and BRL, fallback for ARS, COP, GTQ');
    rates = {
      USD: 1.0,
      MXN: partialRates.MXN,
      BRL: partialRates.BRL,
      ARS: FALLBACK_RATES.ARS,
      COP: FALLBACK_RATES.COP,
      GTQ: FALLBACK_RATES.GTQ,
    };
  } else {
    // Use cached data if API failed
    if (ratesCache.data) {
      console.log('API failed, using stale cached rates');
      return ratesCache.data;
    }

    // Last resort: use all fallback rates
    console.warn('Using all fallback rates (API unavailable)');
    rates = { ...FALLBACK_RATES };
  }

  // Update cache with fresh data
  ratesCache = {
    data: rates,
    timestamp: now,
  };

  console.log('Exchange rates updated successfully');
  return rates;
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

/**
 * Get all rates with metadata
 */
export async function getRatesWithMetadata(): Promise<{
  rates: ExchangeRates;
  timestamp: number;
  source: string;
  liveRates: string[];
  fallbackRates: string[];
}> {
  const rates = await fetchExchangeRates();

  return {
    rates,
    timestamp: Date.now(),
    source: ratesCache.data ? 'cache' : 'api',
    liveRates: ['USD', 'MXN', 'BRL'],
    fallbackRates: ['ARS', 'COP', 'GTQ'],
  };
}

/**
 * Update fallback rates manually (for admin use)
 */
export function updateFallbackRate(currency: keyof ExchangeRates, rate: number): void {
  if (currency !== 'USD' && currency !== 'MXN' && currency !== 'BRL') {
    FALLBACK_RATES[currency] = rate;
    console.log(`Updated fallback rate for ${currency}: ${rate}`);

    // Invalidate cache to force refresh
    ratesCache = { data: null, timestamp: 0 };
  }
}
