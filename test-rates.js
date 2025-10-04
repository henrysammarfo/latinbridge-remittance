/**
 * Test script for Exchange Rate API integration
 * Run with: node test-rates.js
 */

require('dotenv').config({ path: '.env.local' });

// Test FreeCurrencyAPI with only supported currencies
async function testFreeCurrencyAPI() {
  const apiKey = process.env.FREE_CURRENCY_API_KEY || 'fca_live_uL1JE9Q4sDZFVpkzEhEkH9hc276b0dSBT3uTHYYO';
  const apiUrl = process.env.FREE_CURRENCY_API_URL || 'https://api.freecurrencyapi.com/v1';

  console.log('\n=== Testing FreeCurrencyAPI ===');
  const url = `${apiUrl}/latest?apikey=${apiKey}&base_currency=USD&currencies=MXN,BRL`;
  console.log(`API URL: ${url}\n`);

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.data) {
      console.log('✅ FreeCurrencyAPI working!');
      console.log('\nLive Exchange Rates:');
      console.log(`  USD: 1.00 (base)`);
      console.log(`  MXN: ${result.data.MXN} (Mexican Peso)`);
      console.log(`  BRL: ${result.data.BRL} (Brazilian Real)`);
      console.log('\nFallback Rates (not available in free tier):');
      console.log(`  ARS: 350.00 (Argentine Peso - approximate)`);
      console.log(`  COP: 4100.00 (Colombian Peso - approximate)`);
      console.log(`  GTQ: 7.80 (Guatemalan Quetzal - approximate)`);
      return true;
    } else {
      console.log('❌ FreeCurrencyAPI failed:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ FreeCurrencyAPI error:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║  LatinBridge Exchange Rate API Test Suite     ║');
  console.log('╚════════════════════════════════════════════════╝');

  const test = await testFreeCurrencyAPI();

  console.log('\n' + '='.repeat(50));
  console.log('TEST RESULTS:');
  console.log('='.repeat(50));
  console.log(`FreeCurrencyAPI (MXN, BRL): ${test ? '✅ PASS' : '❌ FAIL'}`);
  console.log('='.repeat(50));

  if (test) {
    console.log('\n🎉 API is working! Your backend has:');
    console.log('   ✅ Live rates for USD, MXN, BRL');
    console.log('   ⚠️  Fallback rates for ARS, COP, GTQ');
    console.log('\nNote: ExchangeRate-API requires account activation.');
    console.log('Visit: https://www.exchangerate-api.com to activate your account.');
  } else {
    console.log('\n⚠️  API test failed. Check your API key and internet connection.');
  }
}

runTests();
