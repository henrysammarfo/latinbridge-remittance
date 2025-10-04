/**
 * Exchange Rate API Integration
 * Using ExchangeRate-API (Primary) and FreeCurrencyAPI (Backup)
 * Supports all 6 Latin American currencies: USD, MXN, BRL, ARS, COP, GTQ
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
  conversion_rates: Record<string, number>;
  base_code: string;
  time_last_update_unix: number;
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

/**
 * Fetch from ExchangeRate-API (Primary)
 * API Key: bdf21f86a1-7f24eff18a-t3l73p
 */
async function fetchFromExchangeRateAPI(): Promise<ExchangeRates | null> {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY || 'bdf21f86a1-7f24eff18a-t3l73p';
    const apiUrl = process.env.EXCHANGE_RATE_API_URL || 'https://v6.exchangerate-api.com/v6';

    const response = await fetch(`${apiUrl}/${apiKey}/latest/USD`, {
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      throw new Error(`ExchangeRate-API error: ${response.statusText}`);
    }

    const data: ExchangeRateAPIResponse = await response.json();

    if (data.result !== 'success') {
      throw new Error('ExchangeRate-API returned unsuccessful result');
    }

    return {
      USD: 1.0,
      MXN: data.conversion_rates.MXN || 20.0,
      BRL: data.conversion_rates.BRL || 5.0,
      ARS: data.conversion_rates.ARS || 1000.0,
      COP: data.conversion_rates.COP || 4000.0,
      GTQ: data.conversion_rates.GTQ || 7.8,
    };
  } catch (error) {
    console.error('ExchangeRate-API failed:', error);
    return null;
  }
}

/**
 * Fetch from FreeCurrencyAPI (Backup)
 * API Key: fca_live_uL1JE9Q4sDZFVpkzEhEkH9hc276b0dSBT3uTHYYO
 */
async function fetchFromFreeCurrencyAPI(): Promise<ExchangeRates | null> {
  try {
    const apiKey = process.env.FREE_CURRENCY_API_KEY || 'fca_live_uL1JE9Q4sDZFVpkzEhEkH9hc276b0dSBT3uTHYYO';
    const apiUrl = process.env.FREE_CURRENCY_API_URL || 'https://api.freecurrencyapi.com/v1';

    const currencies = 'MXN,BRL,ARS,COP,GTQ';
    const response = await fetch(
      `${apiUrl}/latest?apikey=${apiKey}&base_currency=USD&currencies=${currencies}`,
      { next: { revalidate: 30 } }
    );

    if (!response.ok) {
      throw new Error(`FreeCurrencyAPI error: ${response.statusText}`);
    }

    const result: FreeCurrencyAPIResponse = await response.json();

    return {
      USD: 1.0,
      MXN: result.data.MXN || 20.0,
      BRL: result.data.BRL || 5.0,
      ARS: result.data.ARS || 1000.0,
      COP: result.data.COP || 4000.0,
      GTQ: result.data.GTQ || 7.8,
    };
  } catch (error) {
    console.error('FreeCurrencyAPI failed:', error);
    return null;
  }
}

/**
 * Fetch live exchange rates with fallback strategy
 * 1. Try ExchangeRate-API (Primary)
 * 2. Try FreeCurrencyAPI (Backup)
 * 3. Use cached data if available
 * 4. Use hardcoded fallback rates as last resort
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  // Check cache first
  const now = Date.now();
  if (ratesCache.data && (now - ratesCache.timestamp) < CACHE_DURATION) {
    console.log('Using cached exchange rates');
    return ratesCache.data;
  }

  // Try primary API (ExchangeRate-API)
  console.log('Fetching rates from ExchangeRate-API...');
  let rates = await fetchFromExchangeRateAPI();

  // Try backup API if primary fails
  if (!rates) {
    console.log('Primary API failed, trying FreeCurrencyAPI...');
    rates = await fetchFromFreeCurrencyAPI();
  }

  // Use cached data if both APIs fail
  if (!rates) {
    console.error('All exchange rate APIs failed');
    if (ratesCache.data) {
      console.log('Using stale cached rates');
      return ratesCache.data;
    }

    // Last resort fallback rates (approximate values)
    console.warn('Using hardcoded fallback rates');
    rates = {
      USD: 1.0,
      MXN: 20.0,
      BRL: 5.0,
      ARS: 1000.0,
      COP: 4000.0,
      GTQ: 7.8,
    };
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
}> {
  const rates = await fetchExchangeRates();

  return {
    rates,
    timestamp: Date.now(),
    source: ratesCache.data ? 'cache' : 'api',
  };
}
