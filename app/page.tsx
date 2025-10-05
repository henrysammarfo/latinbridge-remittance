export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>LatinBridge Backend API</h1>
      <p>Cross-border remittance platform for Latin America</p>

      <h2>Available Endpoints:</h2>
      <ul>
        <li><strong>POST /api/auth/connect</strong> - Initialize wallet connection</li>
        <li><strong>POST /api/auth/verify</strong> - Verify signature and get JWT</li>
        <li><strong>GET /api/rates/current</strong> - Get current exchange rates</li>
      </ul>

      <h2>Smart Contracts:</h2>
      <ul>
        <li>RemittanceVault - Core remittance with multi-currency support</li>
        <li>UserRegistry - KYC and user management</li>
        <li>ExchangeRateOracle - Live rate management</li>
        <li>SavingsPool - 5% APY yield farming</li>
        <li>MicroloanManager - Credit-based lending</li>
        <li>PaymentNetworks - PIX/SPEI/PSE/CoDi/ACH integration</li>
      </ul>

      <h2>Status:</h2>
      <p>Backend infrastructure ready for deployment to Polkadot Paseo testnet</p>
    </div>
  );
}
