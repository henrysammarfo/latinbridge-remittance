# LatinBridge - Cross-Border Remittance Platform

Built for LATIN HACK 2025 - Solving the $165 billion Latin America remittance crisis

## Overview

LatinBridge is a blockchain-powered remittance platform that enables fast, low-cost cross-border transfers across Latin America with:

- **Multi-Currency Support**: USD, MXN, BRL, ARS, COP, GTQ
- **Low Fees**: 0.5% transaction fee (vs 6-8% traditional)
- **Instant Transfers**: Blockchain-based settlement
- **DeFi Features**: 5% APY savings, microloans, local payment network integration
- **KYC Compliance**: Multi-tier verification system

## Technology Stack

### Blockchain
- **Network**: Polkadot Paseo Asset Hub Testnet (EVM-compatible)
- **Chain ID**: 420420422
- **Smart Contracts**: Solidity 0.8.28
- **Deployed Contracts**: 6 core contracts (see DEPLOYMENT_COMPLETE.md)

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Web3 Libraries**: Wagmi v2, Viem v2, ethers.js v6
- **Authentication**: SIWE (Sign-In With Ethereum)
- **UI**: Tailwind CSS + shadcn/ui
- **APIs**: ExchangeRate-API, Didit KYC, Stripe

### Smart Contracts

1. **RemittanceVault** - Multi-currency vault with cross-border transfers
2. **UserRegistry** - KYC levels and user profiles
3. **ExchangeRateOracle** - Real-time exchange rates
4. **SavingsPool** - 5% APY yield farming
5. **MicroloanManager** - Credit-based lending (5-15% interest)
6. **PaymentNetworks** - PIX/SPEI/PSE/CoDi/ACH integration

## Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MetaMask wallet
- PAS testnet tokens

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

### Configuration

Environment variables are already configured in `.env.local` with deployed contract addresses.

## Deployed Contracts (Polkadot Paseo)

| Contract | Address |
|----------|---------|
| UserRegistry | 0xfba199c705761D98aD1cD98c34C0d544e39c1984 |
| ExchangeRateOracle | 0x8c73284b55cb55EB46Dd42617bA6213037e602e9 |
| RemittanceVault | 0x24d591Aa216E5466D5381139bc8feC2A91e707DB |
| SavingsPool | 0xfD2CFC86e06c54d1ffe9B503391d91452a8Fd02D |
| MicroloanManager | 0x2ABa80F8931d52DEE8e6732d213eabe795535660 |
| PaymentNetworks | 0x5D3235c4eB39f5c3729e75932D62E40f77D8e70f |

Block Explorer: https://blockscout-passet-hub.parity-testnet.parity.io

## Features

### Remittance
- Send money across borders with real-time currency conversion
- Transaction tracking on-chain with block explorer integration
- Multi-currency support (6 currencies)
- 0.5% flat fee structure

### Savings
- Deposit funds to earn 5% APY
- Withdraw anytime with accrued interest
- Real-time balance updates from blockchain

### Microloans
- Apply for loans based on KYC level and credit score
- Interest rates from 5-15% based on creditworthiness
- Flexible repayment terms
- Collateral support

### KYC Verification
- **Tier 1 (Basic)**: $1,000 daily / $5,000 monthly limits
- **Tier 2 (Enhanced)**: $10,000 daily / $50,000 monthly limits
- **Tier 3 (Premium)**: $50,000 daily / $250,000 monthly limits

## Testing

Visit `/test` page after starting the development server to test all features:
- Wallet connection
- Contract interactions
- API integrations
- Transaction flows

## Architecture

```
Frontend (Next.js)
       |
       v
  Web3 Provider (Wagmi + Viem)
       |
       v
  Smart Contracts (Polkadot Paseo)
       |
       +-- UserRegistry
       +-- RemittanceVault
       +-- SavingsPool
       +-- MicroloanManager
       +-- ExchangeRateOracle
       +-- PaymentNetworks
```

## Documentation

- **API Status**: See API_FINAL_STATUS.md
- **Deployment**: See DEPLOYMENT_COMPLETE.md
- **Integration**: See INTEGRATION_COMPLETE.md
- **Contract Details**: See FINAL_STATUS.md

## Security

- SIWE authentication (EIP-4361 standard)
- KYC-based transaction limits
- Rate staleness protection in oracle
- Reentrancy guards on all state-changing functions
- Multi-signature wallet support

## Development

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Run tests
npm test
```

## License

ISC
