/**
 * Exchange Rate API Integration
 * Using ExchangeRate-API (Primary) for ALL 6 currencies
 * Using FreeCurrencyAPI (Backup) for MXN and BRL
 * Provides 100% live coverage for all Latin American currencies!
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
  source: string;
} = {
  data: null,
  timestamp: 0,
  source: 'none',
};

/**
 * Fetch from ExchangeRate-API (Primary - supports ALL currencies!)
 */
async function fetchFromExchangeRateAPI(): Promise<ExchangeRates | null> {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      console.warn('EXCHANGE_RATE_API_KEY not configured');
      return null;
    }
    const apiUrl = process.env.EXCHANGE_RATE_API_URL || 'https://v6.exchangerate-api.com/v6';

    const response = await fetch(`${apiUrl}/${apiKey}/latest/USD`, {
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      throw new Error(`ExchangeRate-API error: ${response.statusText}`);
    }

    const data: ExchangeRateAPIResponse = await response.json();

    if (data.result !== 'success') {
      throw new Error(`ExchangeRate-API result: ${data.result}`);
    }

    return {
      USD: 1.0,
      MXN: data.conversion_rates.MXN,
      BRL: data.conversion_rates.BRL,
      ARS: data.conversion_rates.ARS,
      COP: data.conversion_rates.COP,
      GTQ: data.conversion_rates.GTQ,
    };
  } catch (error) {
    console.error('ExchangeRate-API failed:', error);
    return null;
  }
}

/**
 * Fetch from FreeCurrencyAPI (Backup - supports MXN, BRL only)
 */
async function fetchFromFreeCurrencyAPI(): Promise<Partial<ExchangeRates> | null> {
  try {
    const apiKey = process.env.FREE_CURRENCY_API_KEY;
    if (!apiKey) {
      console.warn('FREE_CURRENCY_API_KEY not configured');
      return null;
    }
    const apiUrl = process.env.FREE_CURRENCY_API_URL || 'https://api.freecurrencyapi.com/v1';

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
 * Fetch live exchange rates with multi-tier fallback strategy
 * 1. Try ExchangeRate-API (Primary - ALL 6 currencies)
 * 2. Try FreeCurrencyAPI (Backup - MXN, BRL only)
 * 3. Use cached data if available
 * 4. Use hardcoded fallback rates as last resort
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  // Check cache first
  const now = Date.now();
  if (ratesCache.data && (now - ratesCache.timestamp) < CACHE_DURATION) {
    console.log(`Using cached exchange rates (source: ${ratesCache.source})`);
    return ratesCache.data;
  }

  // Try primary API (ExchangeRate-API) - supports ALL currencies!
  console.log('Fetching rates from ExchangeRate-API (Primary)...');
  let rates = await fetchFromExchangeRateAPI();

  if (rates) {
    console.log('✅ SUCCESS: All 6 currencies fetched from ExchangeRate-API');
    ratesCache = {
      data: rates,
      timestamp: now,
      source: 'ExchangeRate-API (All Live)',
    };
    return rates;
  }

  // Try backup API (FreeCurrencyAPI) - supports MXN and BRL
  console.log('Primary API failed, trying FreeCurrencyAPI (Backup)...');
  const partialRates = await fetchFromFreeCurrencyAPI();

  if (partialRates && partialRates.MXN && partialRates.BRL) {
    console.log('⚠️  Using FreeCurrencyAPI for MXN and BRL, fallback for ARS, COP, GTQ');
    rates = {
      USD: 1.0,
      MXN: partialRates.MXN,
      BRL: partialRates.BRL,
      ARS: 350.0,  // Approximate fallback
      COP: 4100.0, // Approximate fallback
      GTQ: 7.8,    // Approximate fallback
    };

    ratesCache = {
      data: rates,
      timestamp: now,
      source: 'FreeCurrencyAPI (Partial) + Fallback',
    };
    return rates;
  }

  // Use cached data if both APIs fail
  if (ratesCache.data) {
    console.warn('⚠️  All APIs failed, using stale cached rates');
    return ratesCache.data;
  }

  // Last resort: hardcoded fallback rates
  console.error('❌ All APIs failed and no cache available, using hardcoded fallback');
  rates = {
    USD: 1.0,
    MXN: 17.5,
    BRL: 5.0,
    ARS: 350.0,
    COP: 4100.0,
    GTQ: 7.8,
  };

  ratesCache = {
    data: rates,
    timestamp: now,
    source: 'Hardcoded Fallback',
  };

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
 */
export async function getHistoricalRates(date: Date): Promise<ExchangeRates> {
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
 * Get all rates with metadata and source information
 */
export async function getRatesWithMetadata(): Promise<{
  rates: ExchangeRates;
  timestamp: number;
  source: string;
  allLive: boolean;
}> {
  const rates = await fetchExchangeRates();

  return {
    rates,
    timestamp: Date.now(),
    source: ratesCache.source,
    allLive: ratesCache.source.includes('ExchangeRate-API'),
  };
}

/**
 * Test both APIs and return status
 */
export async function testAPIs(): Promise<{
  primary: { status: string; currencies: number };
  backup: { status: string; currencies: number };
}> {
  const primaryRates = await fetchFromExchangeRateAPI();
  const backupRates = await fetchFromFreeCurrencyAPI();

  return {
    primary: {
      status: primaryRates ? 'OK' : 'FAILED',
      currencies: primaryRates ? 6 : 0,
    },
    backup: {
      status: backupRates ? 'OK' : 'FAILED',
      currencies: backupRates ? 2 : 0,
    },
  };
}
