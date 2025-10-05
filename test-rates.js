require('dotenv').config({ path: '.env.local' });

async function testExchangeRateAPI() {
  const apiKey = '0eafc98275744c50fadabce2';
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
  
  console.log('\n=== Testing ExchangeRate-API ===');
  console.log(`URL: ${url}\n`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.result === 'success') {
      console.log('✅ ExchangeRate-API WORKING!\n');
      console.log('ALL 6 Latin American Currencies:');
      console.log(`  USD: 1.00`);
      console.log(`  MXN: ${data.conversion_rates.MXN}`);
      console.log(`  BRL: ${data.conversion_rates.BRL}`);
      console.log(`  ARS: ${data.conversion_rates.ARS}`);
      console.log(`  COP: ${data.conversion_rates.COP}`);
      console.log(`  GTQ: ${data.conversion_rates.GTQ}`);
      return true;
    } else {
      console.log('❌ API Error:', data['error-type']);
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function testFreeCurrencyAPI() {
  const apiKey = 'fca_live_uL1JE9Q4sDZFVpkzEhEkH9hc276b0dSBT3uTHYYO';
  const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=USD&currencies=MXN,BRL`;
  
  console.log('\n=== Testing FreeCurrencyAPI ===');
  console.log(`URL: ${url}\n`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data) {
      console.log('✅ FreeCurrencyAPI WORKING!\n');
      console.log('Partial Coverage:');
      console.log(`  MXN: ${data.data.MXN}`);
      console.log(`  BRL: ${data.data.BRL}`);
      return true;
    } else {
      console.log('❌ API Error:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   LatinBridge API Test Suite          ║');
  console.log('╚════════════════════════════════════════╝');
  
  const test1 = await testExchangeRateAPI();
  const test2 = await testFreeCurrencyAPI();
  
  console.log('\n' + '='.repeat(50));
  console.log('RESULTS:');
  console.log('='.repeat(50));
  console.log(`ExchangeRate-API (6 currencies): ${test1 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`FreeCurrencyAPI (2 currencies):  ${test2 ? '✅ PASS' : '❌ FAIL'}`);
  console.log('='.repeat(50));
  
  if (test1) {
    console.log('\n🎉 PERFECT! 100% live coverage for all 6 currencies!');
  } else if (test2) {
    console.log('\n✅ Backup working! Using fallbacks for ARS, COP, GTQ');
  }
}

main();
