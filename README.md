# LatinBridge - Cross-Border Remittance Platform

Built for LATIN HACK 2025 - Solving the $165 billion Latin America remittance crisis

## Overview

LatinBridge is a blockchain-powered remittance platform that enables fast, low-cost cross-border transfers across Latin America with:

- **Multi-Currency Support**: USD, MXN, BRL, ARS, COP, GTQ
- **Low Fees**: 0.5% transaction fee (vs 6-8% traditional)
- **Instant Transfers**: Blockchain-based settlement
- **DeFi Features**: 5% APY savings, microloans, local payment network integration
- **KYC Compliance**: Didit integration for identity verification

## Technology Stack

### Blockchain
- **Network**: Polkadot Paseo Asset Hub Testnet (EVM-compatible)
- **Chain ID**: 420420422
- **Smart Contracts**: Solidity 0.8.28 (custom implementations, <100KB bytecode)

### Backend
- **Framework**: Next.js 15 with TypeScript
- **Blockchain Library**: ethers.js v6
- **Authentication**: MetaMask wallet-based + JWT
- **APIs**: ExchangeRate-API, Didit KYC, Stripe

### Smart Contracts

1. **RemittanceVault.sol** - Core remittance with multi-currency vault
2. **UserRegistry.sol** - KYC levels (Basic $1K / Enhanced $10K / Premium $50K)
3. **ExchangeRateOracle.sol** - Live rate management with staleness protection
4. **SavingsPool.sol** - 5% APY yield farming
5. **MicroloanManager.sol** - 5-15% interest credit-based lending
6. **PaymentNetworks.sol** - PIX/SPEI/PSE/CoDi/ACH integration

## Quick Start

### Prerequisites
- Node.js 22+ and npm 10+
- MetaMask wallet
- PAS testnet tokens (from Polkadot faucet)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Compile contracts
npx hardhat compile

# Deploy to testnet
npx hardhat run scripts/deploy.js --network passetHub

# Start dev server
npm run dev
```

### Configuration

Create `.env.local` with required keys (see `.env.local.example`)

## Features

### Remittance
- Send money across borders with real-time currency conversion
- Track transaction history on-chain
- 0.5% flat fee structure

### Savings
- Deposit funds to earn 5% APY
- Set savings goals
- Compound interest automatically

### Microloans
- Apply for loans based on credit score
- Interest rates from 5-15%
- Flexible repayment terms (up to 365 days)

### Local Payment Networks
- **Brazil**: PIX integration
- **Mexico**: SPEI and CoDi
- **Colombia**: PSE
- **Guatemala/Central America**: ACH

## API Endpoints

```
POST   /api/auth/connect       - Initialize wallet connection
POST   /api/auth/verify        - Verify signature and get JWT
GET    /api/rates/current      - Get exchange rates
POST   /api/remittance/send    - Send cross-border transfer
GET    /api/remittance/history - Get transaction history
GET    /api/savings            - Get savings account info
POST   /api/loans/apply        - Apply for microloan
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment guide.

## Architecture

```
┌─────────────┐         ┌──────────────────┐
│   Frontend  │────────▶│   Next.js API    │
│   (v0.app)  │         │     Routes       │
└─────────────┘         └──────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
        ┌───────▼─────┐  ┌────▼─────┐  ┌────▼─────┐
        │   Polkadot  │  │  Didit   │  │  Stripe  │
        │   Paseo     │  │   KYC    │  │ Payment  │
        │  Contracts  │  │          │  │          │
        └─────────────┘  └──────────┘  └──────────┘
```

## Smart Contract Addresses

*Will be populated after deployment to testnet*

See `deployments/passetHub.json` for deployed contract addresses.

## Development

```bash
# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

## Security

- Custom reentrancy guards on all state-changing functions
- KYC-based transaction limits
- Rate staleness protection in oracle
- Wallet-based authentication (no passwords)
- AML compliance through Didit integration

## Contributing

This is a hackathon project for LATIN HACK 2025.

## License

ISC