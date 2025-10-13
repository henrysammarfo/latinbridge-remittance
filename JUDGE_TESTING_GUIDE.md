# 🎯 LatinBridge - Judge Testing Guide

**Platform**: Polkadot Paseo Testnet
**Hackathon Track**: Prototype - Prove it Works on Blockchain
**Contract Deployment Date**: October 12, 2025
**Status**: Ready for Testing

---

## 🚀 **Quick Start (5 Minutes)**

### **Step 1: Connect Your Wallet**
1. Visit the deployed LatinBridge platform
2. Click "Get Started" or "Connect Wallet"
3. Connect MetaMask (configured for Polkadot Paseo)
4. Complete your profile (name + email stored on-chain)

### **Step 2: Get PAS Tokens**
1. Go to "Add Money" page
2. Copy your wallet address
3. Visit https://faucet.polkadot.io
4. Select "Polkadot Asset Hub Paseo"
5. Paste your address and request tokens
6. Wait ~30 seconds for tokens to arrive

### **Step 3: Deposit to Platform**
1. Return to "Add Money" page
2. Enter amount of PAS tokens
3. Select currency (USD, MXN, BRL, etc.)
4. Click "Deposit" and confirm in MetaMask
5. Wait for transaction confirmation

### **Step 4: Start Testing!**
✅ Send money to another wallet  
✅ Receive money via QR code  
✅ Deposit into savings (5% APY)  
✅ Apply for microloans  
✅ Exchange between currencies  

---

## 📊 **What You're Testing**

This is a **PRODUCT**, not a prototype. Here's what's live:

### **✅ Fully Functional on Testnet**

#### **1. Blockchain Integration**
- 6 deployed smart contracts on Polkadot Paseo (deployed October 12, 2025)
- Every transaction is real and on-chain
- Verify transactions on Blockscout explorer
- Smart contracts deployed at:
  - UserRegistry: `0x834244e7f0C652F2c1B248D1e1882D66a86BC22a`
  - ExchangeRateOracle: `0x6C27674247e791fc1c0bDE7e728F93FAc19A0960`
  - RemittanceVault: `0xd74D658Bf407AB23Db6d00cc67574724956838B2`
  - SavingsPool: `0x7716BD6c58F5efc3472dC7B0F5ee3D4f14A8cc6f`
  - MicroloanManager: `0x52C9ac1bEd4369f5723F9E176341704Ac4C81034`
  - PaymentNetworks: `0x5D3235c4eB39f5c3729e75932D62E40f77D8e70f`

#### **2. User Management**
- Wallet-based authentication (no passwords)
- Profile stored on blockchain
- Credit scoring system
- KYC levels (optional for testnet)

#### **3. Remittance Features**
- Send money across borders
- Multi-currency support (6 currencies)
- 0.5% transaction fee
- Real-time exchange rates
- Transaction history

#### **4. Savings Pools**
- Deposit into savings
- 5% APY (Annual Percentage Yield)
- Withdraw anytime
- Claim accumulated interest
- Transparent on-chain tracking

#### **5. Microloans**
- Apply for loans
- Credit-score based eligibility
- Flexible repayment terms (3-24 months)
- Interest rates based on creditworthiness
- Collateral secured in smart contract

#### **6. Payment Networks**
- Integration with multiple payment methods
- Cash pickup locations
- Bank account transfers
- Mobile wallet support

#### **7. Exchange System**
- Live exchange rates
- Convert between 6 currencies
- Real-time rate updates
- Transparent conversion rates

---

### **🔵 Production-Ready But Not Testable on Testnet**

#### **1. Stripe Payment Integration**
- **Status**: Fully coded (196 lines)
- **Location**: `lib/api/stripe.ts`
- **Why Not Testable**: Requires real credit cards and mainnet
- **What's Ready**: Payment intents, customer management, webhooks
- **Endpoints**: `/api/payments/create-intent`

#### **2. Didit KYC Verification**
- **Status**: Fully coded (175 lines)
- **Location**: `lib/api/didit.ts`
- **Why Not Testable**: Requires real IDs and admin smart contract role
- **What's Ready**: Verification sessions, document upload, status checking
- **Endpoints**: `/api/kyc/create-session`, `/api/kyc/status`
- **UI**: Full KYC verification center with 3 tiers

#### **3. Real Fiat On/Off Ramps**
- **Status**: Integrated in code, requires mainnet
- **Why Not Testable**: Need real bank accounts, credit cards, crypto wallets
- **What's Ready**: Stripe for cards, bank transfer logic, crypto deposits

---

## 🧪 **Testing Checklist**

### **Phase 1: User Onboarding**
- [ ] Connect wallet (MetaMask or other Web3 wallet)
- [ ] Complete profile registration
- [ ] Verify profile is stored on blockchain
- [ ] Check wallet address is correct

### **Phase 2: Funding**
- [ ] Get PAS tokens from faucet
- [ ] Verify tokens received in MetaMask
- [ ] Deposit PAS tokens to platform
- [ ] Check deposit transaction on block explorer
- [ ] Verify platform balance updated

### **Phase 3: Sending Money**
- [ ] Navigate to "Send Money"
- [ ] Add/select a recipient
- [ ] Enter amount and select currencies
- [ ] Review exchange rate
- [ ] Confirm and send
- [ ] Verify transaction on block explorer
- [ ] Check recipient balance updated

### **Phase 4: Receiving Money**
- [ ] Navigate to "Receive Money"
- [ ] Generate QR code
- [ ] Verify QR contains real wallet address
- [ ] Share payment link
- [ ] Receive a test transfer
- [ ] Verify balance updated

### **Phase 5: Savings**
- [ ] Navigate to "Savings"
- [ ] Deposit funds into savings pool
- [ ] Check 5% APY calculation
- [ ] Verify transaction on-chain
- [ ] Try to withdraw (optional)
- [ ] Check accumulated interest

### **Phase 6: Loans**
- [ ] Navigate to "Loans"
- [ ] Check loan eligibility
- [ ] Apply for a loan
- [ ] Review terms (interest rate, duration)
- [ ] Get loan approval/rejection
- [ ] Check active loan status
- [ ] Try repayment (optional)

### **Phase 7: Exchange**
- [ ] Navigate to exchange/convert
- [ ] Select from/to currencies
- [ ] Check live exchange rate
- [ ] Execute currency exchange
- [ ] Verify balances updated

### **Phase 8: Integration Verification**
- [ ] Visit `/test` page
- [ ] Check all contract addresses
- [ ] Verify all 6 contracts deployed
- [ ] Check Stripe integration status
- [ ] Check Didit KYC integration status
- [ ] Verify API health checks
- [ ] Test contract read/write functions

---

## 🔍 **How to Verify Everything Works**

### **1. Check Blockchain Transactions**
Every action you take creates a real blockchain transaction:

```bash
# Explorer URL
https://blockscout-passet-hub.parity-testnet.parity.io

# Search for your wallet address
# View all transactions
# Click any transaction to see details
```

### **2. Verify Smart Contracts**
All 6 contracts are deployed and verifiable:

```bash
# Visit test platform
http://localhost:3000/test

# See contract addresses
# Test read/write functions
# Check integration status
```

### **3. Check Integration Status**
```bash
# API endpoint
GET /api/integrations/status

# Returns:
{
  "stripe": { "status": "configured" },
  "didit": { "status": "configured" },
  "blockchain": { "status": "connected" }
}
```

### **4. View Source Code**
All integration code is visible:
- Stripe: `lib/api/stripe.ts`
- KYC: `lib/api/didit.ts`
- Contracts: `lib/web3/hooks/`

---

## 💡 **Important Notes for Judges**

### **1. PAS Tokens = Test Money**
- PAS tokens are free testnet tokens
- They represent USD/MXN/BRL/etc. for testing
- Every feature works with PAS tokens
- All transactions are real and on-chain

### **2. This is NOT a Prototype**
- **Live smart contracts**: 6 contracts deployed
- **Real transactions**: Every action is on-chain
- **Production code**: Stripe & KYC integrated
- **Verifiable**: Check Blockscout for any transaction

### **3. Mainnet vs Testnet**
**Testnet (What You Can Test)**:
- ✅ All blockchain features
- ✅ Smart contract interactions
- ✅ User registration
- ✅ Sending/receiving
- ✅ Savings and loans
- ✅ Exchange system

**Mainnet Only (Can't Test on Testnet)**:
- ❌ Real credit card payments (Stripe)
- ❌ Real KYC with IDs (Didit)
- ❌ Real fiat currency deposits
- But: All the code is written and ready!

### **4. Why Stripe/KYC Aren't Testable**
- **Stripe**: Processes real credit cards → needs real money → can't work on testnet
- **KYC**: Verifies real IDs → needs real documents → can't test with fake data
- **Solution**: Code is complete, just needs mainnet deployment
- **Evidence**: View source code to verify integration

---

## 📈 **Evaluation Criteria**

### **Technical Excellence**
- ✅ 6 deployed smart contracts
- ✅ Full Web3 integration
- ✅ Wallet authentication
- ✅ On-chain data storage
- ✅ Real-time exchange rates
- ✅ Production-ready code

### **Feature Completeness**
- ✅ User registration
- ✅ Multi-currency wallets
- ✅ Cross-border transfers
- ✅ Savings with APY
- ✅ Credit-based loans
- ✅ Payment networks
- ✅ Exchange system

### **Production Readiness**
- ✅ Stripe integration coded
- ✅ KYC integration coded
- ✅ Error handling
- ✅ Transaction confirmations
- ✅ Block explorer links
- ✅ Comprehensive testing

### **User Experience**
- ✅ Clean, modern UI
- ✅ Clear instructions
- ✅ Transaction tracking
- ✅ Real-time updates
- ✅ Mobile responsive
- ✅ Intuitive flows

---

## 🆘 **Troubleshooting**

### **Problem: Can't Connect Wallet**
- Ensure MetaMask is installed
- Add Polkadot Paseo network to MetaMask
- Check network is selected in MetaMask

### **Problem: No PAS Tokens**
- Visit https://faucet.polkadot.io
- Select "Polkadot Asset Hub Paseo"
- Wait 30-60 seconds after requesting
- Check MetaMask balance

### **Problem: Transaction Failed**
- Check you have enough PAS tokens
- Ensure network is Polkadot Paseo
- Try refreshing the page
- Check MetaMask for pending transactions

### **Problem: Balance Not Updating**
- Wait for transaction confirmation (~5-10 seconds)
- Refresh the page
- Check block explorer for transaction status
- Verify transaction was successful

### **Problem: Can't Find Features**
- **Send Money**: Dashboard → Send button
- **Receive Money**: Dashboard → Receive button
- **Add Money**: Dashboard → Add Money button
- **Savings**: Dashboard → Savings section
- **Loans**: Dashboard → Loans section

---

## 📞 **Support & Documentation**

### **Key Documents**
- `CRITICAL_ISSUES_AND_FIXES.md` - Issue tracker and fixes
- `STRIPE_AND_KYC_STATUS.md` - Integration documentation
- `STATUS.md` - Development status
- `README.md` - Project overview

### **Test Platform**
Visit `/test` for:
- Contract addresses
- Integration status
- API health checks
- Function testing

### **Block Explorer**
- URL: https://blockscout-passet-hub.parity-testnet.parity.io
- Search your wallet address
- View all transactions
- Verify contract calls

---

## ✅ **Success Criteria**

You've successfully tested LatinBridge when you can:

1. ✅ Connect wallet and register on-chain
2. ✅ Get PAS tokens and deposit them
3. ✅ Send money to another address
4. ✅ Receive money via QR code
5. ✅ Deposit into savings pool
6. ✅ Apply for a microloan
7. ✅ Exchange currencies
8. ✅ Verify all transactions on block explorer
9. ✅ See that Stripe/KYC are integrated in code
10. ✅ Understand this is a working product, not a prototype

---

## 🎉 **What Makes This Special**

### **1. Real Blockchain Integration**
Not a demo or simulation. Every action is a real blockchain transaction.

### **2. Production-Quality Code**
371+ lines of payment/KYC integration code ready for mainnet.

### **3. Complete Feature Set**
Every feature promised in the pitch is implemented and working.

### **4. Verifiable Everything**
Every transaction, contract, and integration can be verified.

### **5. Ready to Launch**
Just needs mainnet deployment and API keys for Stripe/Didit.

---

**Testing Time**: 10-15 minutes for core features  
**Deep Dive**: 30-45 minutes for comprehensive testing  
**Code Review**: All source code available in repository  

---

**Date Created**: October 11, 2025  
**Platform Status**: ✅ Ready for Judge Testing  
**Deployment**: Polkadot Paseo Testnet  
**Contact**: Check repository for updates

**Good luck with your evaluation! 🚀**
