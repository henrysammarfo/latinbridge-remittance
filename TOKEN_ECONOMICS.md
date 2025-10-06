# LatinBridge Token Economics & Testing Guide

## Token Used: PAS (Polkadot Asset Hub Native Token)

**Network:** Polkadot Paseo Asset Hub Testnet
**Chain ID:** 420420422
**Native Currency:** PAS
**Decimals:** 18

---

## How the System Works

### 1. **Base Currency: PAS Tokens**
All transactions on LatinBridge use **PAS tokens** as the underlying blockchain currency. When users interact with the platform:

- Users deposit **PAS tokens** to the RemittanceVault contract
- The contract tracks balances in different FIAT currencies (USD, MXN, BRL, ARS, COP, GTQ)
- Exchange rates convert between currencies
- Withdrawals return PAS tokens

### 2. **Multi-Currency System**

```
User deposits 100 PAS → Credited as $100 USD (or equivalent in other currency)
                      → Can convert to 1,850 MXN
                      → Can convert to 533 BRL
                      → etc.
```

**Key Point:** PAS tokens represent VALUE. The smart contracts track FIAT currency denominations, but the actual on-chain asset is PAS.

---

## Testing Strategy for Judges

### Getting Test Tokens

**Faucet:** https://faucet.polkadot.io
- Request PAS tokens (free)
- Use for testing remittances, savings, loans

### Test Scenarios

#### **Scenario 1: Send Money (Remittance)**
1. User A has 10 PAS tokens
2. Deposit 10 PAS to RemittanceVault → Get $10 USD credit
3. Send $5 USD to User B (address 0x...)
4. System:
   - Deducts $5 from User A
   - Applies 0.5% fee ($0.025)
   - Credits $4.975 to User B
   - Transaction recorded on blockchain

**Blockchain Verification:**
- Check transaction on Blockscout explorer
- See `sendRemittance` function call
- See `RemittanceSent` event emitted

#### **Scenario 2: Savings Account (5% APY)**
1. User has $100 USD balance in RemittanceVault
2. Move $50 to SavingsPool contract
3. System:
   - Deposits 50 PAS-equivalent to SavingsPool
   - Records $50 USD at 5% APY
   - Interest calculated on-chain based on time
4. After 1 year → Balance shows $52.50

**Blockchain Verification:**
- Check `SavingsPool.getBalance(address, currency)`
- See deposit transaction
- See interest accrued

#### **Scenario 3: Microloans**
1. User with credit score > 600 (from UserRegistry)
2. Apply for $20 loan
3. System:
   - Checks eligibility via `MicroloanManager.checkEligibility()`
   - Approves loan (test: auto-approve)
   - Transfers 20 PAS-equivalent to user's vault
4. Repayment: User returns PAS + interest

**Blockchain Verification:**
- Check `LoanIssued` event
- See loan balance in contract
- Track repayments

#### **Scenario 4: Currency Exchange**
1. User has $100 USD
2. Wants to exchange to MXN
3. System:
   - Fetches exchange rate from ExchangeRateOracle
   - Converts: $100 × 18.42 = 1,842 MXN
   - Updates user balance in RemittanceVault
   - Same PAS tokens, different currency denomination

**Blockchain Verification:**
- Check `ExchangeRateOracle.getRate(USD, MXN)`
- See balance change in RemittanceVault

---

## What Judges Will See

### On Blockchain Explorer
- **Contract Calls:** All function calls to 6 smart contracts
- **Events:** RemittanceSent, Deposit, Withdraw, LoanIssued, etc.
- **Transactions:** Every action creates a verifiable transaction
- **Balances:** Query any wallet's balance in any currency

### In Application
- **Real-time balance updates** from blockchain
- **Live exchange rates** from ExchangeRate-API
- **Transaction history** from contract events
- **No mock data** - everything fetched from chain

---

## For Demo Video

### Show These Features:

1. **Wallet Connection**
   - Connect MetaMask to Polkadot Paseo
   - Show address connected

2. **Get Test Tokens**
   - Visit faucet.polkadot.io
   - Request PAS tokens
   - Show balance in wallet

3. **Deposit to Platform**
   - Deposit PAS to RemittanceVault
   - Show transaction on Blockscout
   - Show balance update in dashboard

4. **Send Remittance**
   - Send $10 USD to another address
   - Show 0.5% fee calculation
   - Confirm transaction
   - Show on Blockscout
   - Show recipient receives funds

5. **Savings Account**
   - Move $20 to savings
   - Show 5% APY displayed
   - Show balance in savings contract

6. **KYC Verification**
   - Basic Tier: Email + Phone (working)
   - Tier 2: ID upload (Didit API integration)
   - Show transaction limits increase

7. **Exchange Rates**
   - Show live rates from API
   - Test currency conversion
   - Show rate updates

8. **Test Platform** (`/test`)
   - Show contract addresses
   - Test each contract method
   - Verify API responses
   - Show all 6 currencies

---

## Important Notes for Judges

### This is NOT a Simulation
- ✅ Real smart contracts on Polkadot testnet
- ✅ Real blockchain transactions (viewable on explorer)
- ✅ Real API integrations (ExchangeRate-API, Didit KYC, Stripe)
- ✅ Real Web3 wallet authentication

### This IS Testnet
- Uses PAS testnet tokens (no real value)
- Free tokens from faucet
- Safe for testing/demo
- Fully functional blockchain system

### Token Flow
```
Faucet → User Wallet (PAS)
         ↓
RemittanceVault Contract (deposits)
         ↓
Denominated in USD/MXN/BRL/etc (tracked in contract)
         ↓
Can transfer, save, borrow, exchange
         ↓
Withdraw back to wallet (PAS)
```

---

## Summary for Video Script

"LatinBridge uses PAS tokens from Polkadot Paseo Asset Hub as the underlying blockchain currency. When users deposit PAS, our smart contracts track balances in six Latin American currencies using live exchange rates from ExchangeRate-API.

All transactions are real - you can view them on Blockscout explorer. The 0.5% fee is automatic, savings earn 5% APY calculated on-chain, and microloans are issued based on credit scores stored in our UserRegistry contract.

For testing, anyone can get free PAS tokens from the Polkadot faucet and try the full platform. Every action is recorded on the blockchain - no mock data, just real Web3 transactions."

---

## Quick Test Checklist

- [ ] Get PAS from faucet
- [ ] Connect wallet to app
- [ ] Deposit PAS to vault
- [ ] Check balance shows in USD/MXN/BRL etc
- [ ] Send remittance to another address
- [ ] Verify transaction on Blockscout
- [ ] Move funds to savings
- [ ] Check savings balance and APY
- [ ] Apply for microloan (if eligible)
- [ ] Test currency exchange
- [ ] Verify all contract calls on explorer

---

**For Judges:** Visit `/test` page to see all contract addresses, test each function, and verify API integrations work correctly.
