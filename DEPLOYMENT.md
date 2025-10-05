# LatinBridge Backend Deployment Guide

## Prerequisites

- Node.js 22+ and npm 10+
- MetaMask wallet funded with PAS tokens on Polkadot Paseo testnet
- All API keys configured in `.env.local`

## Getting Testnet Tokens

1. Visit Polkadot Faucet: https://faucet.polkadot.io
2. Select "Paseo Testnet" network
3. Enter your wallet address
4. Request PAS tokens for gas fees

## Deployment Steps

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Compile Smart Contracts

```bash
npx hardhat compile
```

Expected output: "Compiled 6 Solidity files successfully"

### 3. Deploy to Polkadot Paseo Testnet

```bash
npx hardhat run scripts/deploy.js --network passetHub
```

This will:
- Deploy all 6 smart contracts
- Configure contract interconnections (oracle, user registry)
- Save deployment addresses to `deployments/passetHub.json`
- Automatically update `.env.local` with contract addresses

### 4. Verify Contracts on Block Explorer

Visit the block explorer links printed in deployment output:
https://blockscout-passet-hub.parity-testnet.parity.io

### 5. Start Development Server

```bash
npm run dev
```

Server runs at http://localhost:3000

### 6. Test API Endpoints

```bash
# Test exchange rates
curl http://localhost:3000/api/rates/current

# Test wallet authentication (requires MetaMask)
curl -X POST http://localhost:3000/api/auth/connect \
  -H "Content-Type: application/json" \
  -d '{"address":"0xYourWalletAddress"}'
```

## Production Deployment

### Environment Variables

Ensure all production environment variables are set:

```bash
# Required for production
JWT_SECRET=<generate-strong-random-secret>
NEXT_PUBLIC_APP_URL=https://yourdomain.com
DIDIT_WEBHOOK_SECRET=<from-didit-dashboard>
```

### Deploy to Vercel/Netlify

```bash
# Build production bundle
npm run build

# Deploy (Vercel example)
vercel --prod
```

## Contract Interaction Examples

### Update Exchange Rates (Admin Only)

```javascript
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const oracle = new ethers.Contract(
  process.env.CONTRACT_EXCHANGE_RATE_ORACLE,
  OracleABI,
  signer
);

// Update rates (with 18 decimals)
await oracle.batchUpdateRates(
  [0, 1, 2, 3, 4, 5], // USD, MXN, BRL, ARS, COP, GTQ
  [
    ethers.parseUnits('1', 18),
    ethers.parseUnits('20', 18),
    ethers.parseUnits('5', 18),
    ethers.parseUnits('1000', 18),
    ethers.parseUnits('4000', 18),
    ethers.parseUnits('7.8', 18),
  ]
);
```

### Send Remittance

```javascript
const vault = new ethers.Contract(
  process.env.CONTRACT_REMITTANCE_VAULT,
  VaultABI,
  signer
);

// Deposit funds first
await vault.depositFunds(0, ethers.parseUnits('100', 18)); // 100 USD

// Send remittance
await vault.sendRemittance(
  '0xRecipientAddress',
  0, // USD
  1, // MXN
  ethers.parseUnits('100', 18)
);
```

## Troubleshooting

### "Insufficient funds for gas"
- Request more PAS tokens from the faucet
- Check wallet balance: https://blockscout-passet-hub.parity-testnet.parity.io

### "Contract not deployed"
- Verify deployment completed successfully
- Check `.env.local` has all contract addresses
- Verify you're connecting to the correct network (Chain ID: 420420422)

### "Nonce too high"
- Reset MetaMask account: Settings > Advanced > Reset Account

## Network Configuration

| Parameter | Value |
|-----------|-------|
| Network Name | Polkadot Paseo Asset Hub |
| RPC URL | https://testnet-passet-hub-eth-rpc.polkadot.io |
| Chain ID | 420420422 |
| Currency Symbol | PAS |
| Block Explorer | https://blockscout-passet-hub.parity-testnet.parity.io |

## API Documentation

See `/docs/API.md` for complete API reference.

## Support

For deployment issues:
1. Check deployment logs in `deployments/` directory
2. Verify all environment variables are set
3. Review Hardhat console output for errors
