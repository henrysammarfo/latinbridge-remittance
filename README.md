# LatinBridge - Cross-Border Remittance Platform

<div align="center">

**Built for LATIN HACK 2025**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-363636?logo=solidity)](https://soliditylang.org/)

### Solving the $165 Billion Latin America Remittance Crisis

**0.5% Fees** | **Instant Settlement** | **6 Currencies** | **Live on Testnet**

[Live Demo](https://latinbridge-remittance.vercel.app/) | [Video Demo](https://youtu.be/3Z1OSYZSAi4) | [Testing Guide](./JUDGE_TESTING_GUIDE.md)

</div>

---

## Problem & Solution

### The Problem
- **$165B** annual remittances to Latin America
- **6-8%** average fees charged by traditional services
- **2-3 days** settlement time for cross-border transfers
- **50M+** underbanked migrants need better financial access

### Our Solution
LatinBridge is a production-ready blockchain remittance platform built on Polkadot with:

- **Live Blockchain Integration** - 6 deployed smart contracts on Polkadot Paseo testnet
- **Real-Time Exchange Rates** - Live API integration for accurate currency conversion
- **DeFi Features** - 5% APY savings pools and credit-based microloans
- **Multi-Currency Support** - USD, MXN, BRL, ARS, COP, GTQ
- **Payment Networks** - Integration with local payment systems (PIX, SPEI, PSE, etc.)
- **Secure & Compliant** - KYC verification system and wallet-based authentication

---

## Video Demo

(https://youtu.be/3Z1OSYZSAi4)
---

## Quick Start

### Prerequisites
```bash
Node.js 18+
npm or yarn
MetaMask wallet
```

### Installation

```bash
# Clone the repository
git clone https://github.com/henrysammarfo/latinbridge-remittance.git
cd latinbridge-remittance

# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### MetaMask Configuration

Add Polkadot Paseo Asset Hub testnet:

```
Network Name: Polkadot Paseo Asset Hub
RPC URL: https://testnet-passet-hub-eth-rpc.polkadot.io
Chain ID: 420420422
Currency Symbol: PAS
Block Explorer: https://blockscout-passet-hub.parity-testnet.parity.io
```

**Get testnet tokens**: https://faucet.polkadot.io

---

---

## 🆕 Recent Updates (October 2025)

### Latest Deployment - October 12, 2025
- **All 6 smart contracts redeployed** with latest features
- **Platform Reserves System** - Admin can now manage platform funds
- **Enhanced Loan System** - Added `getUserLoan()` function for better loan tracking
- **Complete Transaction History** - Full on-chain transaction tracking with export capabilities
- **Admin Dashboard Improvements** - Better loan management and platform reserves monitoring
- **Withdraw Interface** - New dedicated page for withdrawing funds from LatinBridge to wallet

### Key Features Added
- Live exchange rate integration with dual API fallback
- Real-time transaction tracking with block explorer links
- Complete savings pool with deposit/withdraw functionality
- Credit-based microloan system with on-chain approval
- Multi-currency support across all features
- Admin tools for platform management

### Documentation Updates
- Added comprehensive testing guides
- Updated all contract addresses
- Created demo video and pitch scripts
- Enhanced "How It Works" documentation
- Added loan system detailed explanation

---

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Web3**: Wagmi v2 + Viem v2 + ethers.js v6
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Authentication**: SIWE (EIP-4361)

#### Blockchain
- **Network**: Polkadot Paseo Asset Hub Testnet
- **Smart Contracts**: Solidity 0.8.28
- **Total Contracts**: 6 (all deployed and verified)

#### Integrations
- **Exchange Rates**: ExchangeRate-API + FreeCurrencyAPI (backup)
- **KYC**: Didit (integrated)
- **Payments**: Stripe (integrated)

### Smart Contracts

All contracts deployed on **October 12, 2025**

| Contract | Address |
|----------|---------|
| **UserRegistry** | `0x834244e7f0C652F2c1B248D1e1882D66a86BC22a` |
| **ExchangeRateOracle** | `0x6C27674247e791fc1c0bDE7e728F93FAc19A0960` |
| **RemittanceVault** | `0xd74D658Bf407AB23Db6d00cc67574724956838B2` |
| **SavingsPool** | `0x7716BD6c58F5efc3472dC7B0F5ee3D4f14A8cc6f` |
| **MicroloanManager** | `0x52C9ac1bEd4369f5723F9E176341704Ac4C81034` |
| **PaymentNetworks** | `0x5D3235c4eB39f5c3729e75932D62E40f77D8e70f` |

**Verify on Block Explorer**: [https://blockscout-passet-hub.parity-testnet.parity.io](https://blockscout-passet-hub.parity-testnet.parity.io)

---

## ✨ Features

### 💸 Cross-Border Remittance
- **Multi-Currency**: Support for USD, MXN, BRL, ARS, COP, GTQ
- **Real-Time Rates**: Live exchange rates from ExchangeRate-API
- **Low Fees**: 0.5% transaction fee (92% cheaper than traditional)
- **Instant Settlement**: Blockchain-based transfers
- **Transaction Tracking**: Full on-chain history with block explorer links

### 🏦 DeFi Savings
- **5% APY**: Earn interest on deposits (from SavingsPool smart contract)
- **Flexible**: Deposit and withdraw anytime
- **Real-Time**: Balance updates directly from blockchain
- **Multi-Currency**: Savings in any supported currency
- **Compound Interest**: Daily accrual, monthly payouts

### 💳 Microloans
- **Credit-Based**: Eligibility determined by on-chain credit score
- **Flexible Rates**: 5-15% APR based on creditworthiness
- **Instant Approval**: Smart contract-based decisioning
- **Transparent**: All terms on-chain and immutable
- **Flexible Terms**: 3-24 month repayment options

### 🔐 KYC Verification
- **Tier 1 (Basic)**: $1,000 daily / $5,000 monthly
- **Tier 2 (Enhanced)**: $10,000 daily / $50,000 monthly
- **Tier 3 (Premium)**: $50,000 daily / $250,000 monthly
- **Didit Integration**: Professional identity verification
- **Compliance**: AML/KYC regulatory requirements

### 🌐 Payment Networks
- **PIX** (Brazil) - Instant payments
- **SPEI** (Mexico) - Electronic transfers
- **PSE** (Colombia) - Online payments
- **CoDi** (Mexico) - QR code payments
- **ACH** (USA) - Direct deposits

### 📊 Live Exchange Rates
- **Primary API**: ExchangeRate-API (all 6 currencies)
- **Backup API**: FreeCurrencyAPI (MXN, BRL)
- **Update Frequency**: Every 30 seconds
- **Rate Alerts**: Set target rates for notifications
- **Historical Data**: View rate trends over time

---

## 🧪 Testing

### Comprehensive Test Platform

**Access**: http://localhost:3000/test

#### Features:
1. **Wallet Connection** - Connect MetaMask to Polkadot Paseo
2. **Live Integration Tests** - Test all APIs in real-time
3. **Contract Interactions** - Test all 6 deployed contracts
4. **Transaction Simulation** - Execute and verify transactions
5. **API Status Monitoring** - Real-time integration health checks

#### Test All Integrations:
```bash
# Start server
npm run dev

# Visit test platform
open http://localhost:3000/test

# Or test APIs via curl
curl http://localhost:3000/api/integrations/status
curl http://localhost:3000/api/rates/current
```

### Test Flow
1. **Connect Wallet** → MetaMask opens
2. **Switch Network** → Polkadot Paseo (if needed)
3. **Test Integrations** → Click "Test All Integrations"
4. **View Results** → All systems operational ✅
5. **Execute Transaction** → Test live contract interaction

---

## 📂 Project Structure

```
latinbridge-remittance/
├── app/                      # Next.js app router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── kyc/             # KYC integration
│   │   ├── payments/        # Stripe integration
│   │   ├── rates/           # Exchange rate API
│   │   └── integrations/    # Status endpoint
│   ├── dashboard/           # Dashboard page
│   ├── send/                # Send money flow
│   ├── receive/             # Receive money
│   ├── savings/             # Savings interface
│   ├── loans/               # Microloans
│   ├── kyc/                 # KYC verification
│   ├── test/                # Test platform
│   └── ...
├── components/              # React components
│   ├── auth/               # Auth components
│   ├── dashboard/          # Dashboard components
│   ├── send/               # Send flow components
│   ├── test/               # Testing platform
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utility libraries
│   ├── api/               # API integrations
│   │   ├── exchangeRates.ts
│   │   ├── didit.ts
│   │   └── stripe.ts
│   ├── web3/              # Web3 utilities
│   │   ├── hooks/         # Custom hooks
│   │   └── config.ts      # Chain config
│   └── ...
├── contracts/             # Smart contracts
│   ├── RemittanceVault.sol
│   ├── UserRegistry.sol
│   ├── SavingsPool.sol
│   ├── MicroloanManager.sol
│   ├── ExchangeRateOracle.sol
│   └── PaymentNetworks.sol
├── HACKATHON_SUBMISSION.md
├── JUDGE_TESTING_GUIDE.md
├── HOW_IT_WORKS.md
├── HOW_LOANS_WORK.md
├── LATIN_HACK_SUBMISSION_CHECKLIST.md
├── PITCH_SCRIPT.md
├── DEMO_VIDEO_SCRIPT.md
└── ...
```

---

## 📚 Documentation

### For Judges & Hackathon
- **[Submission Checklist](./LATIN_HACK_SUBMISSION_CHECKLIST.md)** - Complete requirements verification
- **[Hackathon Submission](./HACKATHON_SUBMISSION.md)** - Full project submission document
- **[Judge Testing Guide](./JUDGE_TESTING_GUIDE.md)** - Step-by-step testing instructions
- **[Pitch Script](./PITCH_SCRIPT.md)** - Presentation guide
- **[Demo Video Script](./DEMO_VIDEO_SCRIPT.md)** - Video recording guide

### Technical Documentation
- **[How It Works](./HOW_IT_WORKS.md)** - Complete system architecture explanation
- **[How Loans Work](./HOW_LOANS_WORK.md)** - Microloan system deep dive

### API Documentation

#### Exchange Rates
```bash
GET /api/rates/current
# Returns live rates for all 6 currencies
```

#### Integration Status
```bash
GET /api/integrations/status
# Returns health check for all integrations
```

#### KYC
```bash
POST /api/kyc/create-session
# Create Didit verification session

GET /api/kyc/status?sessionId=xxx
# Check verification status
```

#### Payments
```bash
POST /api/payments/create-intent
# Create Stripe payment intent for fiat on-ramp
```

---

## 🔒 Security

### Authentication
- ✅ **SIWE** - Sign-In With Ethereum (EIP-4361)
- ✅ **JWT Tokens** - 24-hour expiration
- ✅ **Nonce Protection** - Replay attack prevention

### Smart Contracts
- ✅ **Reentrancy Guards** - Custom implementation
- ✅ **Access Control** - Role-based permissions
- ✅ **Rate Staleness** - Oracle protection
- ✅ **Transaction Limits** - KYC-based enforcement

### APIs
- ✅ **HTTPS Only** - In production
- ✅ **API Key Rotation** - Environment variables
- ✅ **Webhook Verification** - HMAC signatures
- ✅ **Error Handling** - No data leaks

---

## 🚀 Deployment

### Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
# Optimized production build
```

### Environment Variables
Copy `.env.example` to `.env.local` and configure:
```env
# Blockchain - See deployed contract addresses in Architecture section
NEXT_PUBLIC_USER_REGISTRY=<contract_address>
NEXT_PUBLIC_REMITTANCE_VAULT=<contract_address>
# See all contract addresses in the Smart Contracts table above

# APIs - Get your own API keys from:
# - ExchangeRate-API: https://www.exchangerate-api.com
# - Didit: https://didit.me  
# - Stripe: https://stripe.com
EXCHANGE_RATE_API_KEY=<your_key>
DIDIT_API_KEY=<your_key>
STRIPE_SECRET_KEY=<your_key>

# Network
NEXT_PUBLIC_RPC_URL=https://testnet-passet-hub-eth-rpc.polkadot.io
NEXT_PUBLIC_CHAIN_ID=420420422
```

---

## 🤝 Contributing

This is a hackathon project for LATIN HACK 2025. For production deployment:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📊 Project Stats

- **Smart Contracts**: 6 (1,781 lines of Solidity)
- **Frontend**: TypeScript/React (Next.js 15)
- **API Integrations**: 4 (ExchangeRate-API, FreeCurrencyAPI, Didit, Stripe)
- **Features**: 10 complete features
- **Test Coverage**: Comprehensive test platform
- **Mock Data**: 0% (100% live)

---

## Built for LATIN HACK 2025

**Hackathon Track:** Prototype - Prove it Works on Blockchain

📋 **[View Complete Submission Checklist](./LATIN_HACK_SUBMISSION_CHECKLIST.md)** - Verify all requirements are met

### Key Highlights

1. **Complete Implementation**
   - 6 deployed smart contracts on Polkadot Paseo testnet
   - Live API integrations for exchange rates, KYC, and payments
   - Real-time blockchain transactions

2. **Production Quality**
   - TypeScript throughout for type safety
   - Modern UI/UX with Next.js 15 and Tailwind CSS
   - Comprehensive testing platform
   - Full documentation for judges and developers

3. **Real-World Impact**
   - Addresses $165B Latin America remittance market
   - 0.5% fees vs 6-8% traditional services (92% reduction)
   - Instant settlement vs 2-3 day traditional transfers
   - Targets 50M+ underbanked migrants

4. **Innovation**
   - Multi-currency DeFi features (savings & loans)
   - On-chain credit scoring system
   - Local payment network integration
   - Blockchain-based KYC compliance

---

## 📞 Support

### Resources
- **Faucet**: https://faucet.polkadot.io
- **Block Explorer**: https://blockscout-passet-hub.parity-testnet.parity.io
- **ExchangeRate-API**: https://www.exchangerate-api.com
- **Didit KYC**: https://didit.me

### Contact
- **GitHub**: https://github.com/henrysammarfo/latinbridge-remittance
- **Issues**: https://github.com/henrysammarfo/latinbridge-remittance/issues

---

## 📄 License

MIT License - see LICENSE file for details

---

<div align="center">

**Built for LATIN HACK 2025**

Solving the $165B remittance crisis with blockchain technology

MIT License | 2025

</div>
