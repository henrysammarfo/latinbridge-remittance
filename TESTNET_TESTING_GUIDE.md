# 🧪 Testnet Testing Guide - What Works & How

## Overview
This is a **Polkadot Paseo TESTNET** deployment. Only specific payment methods work with testnet tokens.

---

## ✅ What WORKS on Testnet

### 1. **Add Money - Faucet Method (ONLY WORKING METHOD)**

**How to add money to your wallet:**

```
Step 1: Get Free PAS Tokens from Faucet
├─ Go to: https://faucet.polkadot.io
├─ Select: "Paseo Asset Hub"
├─ Enter your wallet address (the one you connected)
├─ Click "Send me PAS"
├─ Wait ~30 seconds
└─ You'll receive 100 PAS tokens (FREE)

Step 2: Check Your Balance
├─ The PAS tokens go directly to your wallet
├─ Refresh the dashboard page
└─ You should see your balance updated
```

**Important Notes:**
- ✅ PAS tokens are **free testnet tokens** (no real value)
- ✅ You can request from faucet **multiple times** (wait 24h between requests)
- ✅ 100 PAS ≈ represents $100 USD in the system for testing
- ❌ You **CANNOT** use credit cards, bank transfers, or real crypto

---

### 2. **Send Money - LatinBridge Wallet Method (WORKS)**

**How to send remittances:**

```
Step 1: Go to /send page
├─ Select recipient (with wallet address)
├─ Enter amount (e.g., 10 USD)
├─ Select currencies (USD → MXN)
└─ Choose payment method: "LatinBridge Wallet"

Step 2: Review transaction
├─ Check recipient, amount, fees
└─ Click "Confirm & Send"

Step 3: Sign transaction in wallet
├─ MetaMask/wallet will popup
├─ Shows gas fee in PAS (~0.0001 PAS)
├─ Click "Confirm"
└─ Wait for blockchain confirmation (~12 seconds)

Step 4: Transaction complete
├─ You'll see transaction hash
├─ Recipient receives funds in their wallet
└─ View on Blockscout for verification
```

**What happens under the hood:**
1. Smart contract `RemittanceVault` is called
2. Deducts PAS from your balance
3. Converts using `ExchangeRateOracle` rates
4. Sends to recipient's wallet address
5. Records transaction on-chain

---

### 3. **Savings - Deposit/Withdraw (WORKS)**

**How to use savings:**

```
Deposit:
├─ Go to /savings page
├─ Click "Deposit"
├─ Enter amount (e.g., 10 PAS as USD)
├─ Confirm transaction
├─ Funds locked in SavingsPool contract
└─ Interest starts accruing at 6.5% APY

Withdraw:
├─ Click "Withdraw"
├─ Enter amount to withdraw
├─ Confirm transaction
└─ Funds + interest returned to your wallet
```

**How interest works:**
- Accrues **per second** (not daily/monthly)
- Formula: `interest = (balance × 6.5% × timeElapsed) / 365 days`
- Example: 100 PAS for 30 days = ~0.53 PAS interest
- View real-time interest on savings page

---

### 4. **Microloans - Request/Repay (WORKS)**

**How to get a loan:**

```
Request Loan:
├─ Go to /loans page
├─ Fill application:
│  ├─ Amount: e.g., 5 USD
│  ├─ Term: 30/60/90 days
│  └─ Purpose: "Testing microloan"
├─ Submit application
├─ Contract checks:
│  ├─ Available liquidity ✓
│  ├─ Your KYC status
│  └─ Collateral if needed
└─ Loan approved instantly (for testing)

Repay Loan:
├─ View active loans on /loans page
├─ Click "Repay"
├─ Contract calculates: Principal + 5% interest
│  Example: 5 USD loan = 5.25 USD to repay
├─ Confirm transaction
└─ Loan marked as repaid
```

**Where loan funds come from:**
1. **Savings deposits** in the contract
2. **Platform reserves** (pre-funded for testing)
3. **Repaid loans** from other users

---

### 5. **Receive Money - QR Code (WORKS)**

**How to receive payments:**

```
Step 1: Generate QR Code
├─ Go to /receive page
├─ Enter amount (optional): e.g., 20 USD
├─ Add note (optional): "Payment for services"
├─ Click "Generate Payment Link"
└─ QR code appears with your wallet address

Step 2: Share QR Code
├─ Download QR code as PNG
├─ Share via messaging apps
└─ Sender scans QR to get your wallet address

Step 3: Receive Payment
├─ Sender sends to your address
├─ Funds appear in your wallet
└─ Check transaction on dashboard
```

---

## ❌ What DOES NOT Work on Testnet

### Payment Methods That Are Coming Soon (Production Only)

| Method | Status | Why Not Available |
|--------|--------|-------------------|
| **Credit/Debit Card** | 🔴 Production Only | Requires Stripe integration with real money |
| **Bank Transfer (ACH)** | 🔴 Production Only | Requires banking API (Plaid/Stripe) |
| **Cryptocurrency Deposit** | 🔴 Production Only | Requires bridging real USDT/USDC to Polkadot |

**For Demo/Testing:**
- ✅ Use **Faucet** → Get free PAS tokens
- ✅ Use **LatinBridge Wallet** → Pay with PAS tokens
- ❌ Don't try card/bank - they won't work

---

## 🔄 Complete Testing Flow (Recommended)

### Flow 1: Full Platform Test (30 minutes)

```
1. Get PAS Tokens (5 min)
   └─ Faucet → 100 PAS to your wallet

2. Complete Onboarding (2 min)
   ├─ Connect wallet at /login
   ├─ Fill profile form at /onboarding
   └─ Submit to UserRegistry contract

3. Test Savings (5 min)
   ├─ Deposit 20 PAS to savings
   ├─ Wait 1-2 minutes
   ├─ See interest accruing
   └─ Withdraw 5 PAS + interest

4. Test Microloan (5 min)
   ├─ Request 5 USD loan
   ├─ Receive funds instantly
   ├─ View on /loans page
   └─ Repay with interest

5. Test Remittance (5 min)
   ├─ Send 10 USD to a recipient
   ├─ Use "LatinBridge Wallet" method
   ├─ Confirm transaction
   └─ Check recipient's balance

6. Test Receive (3 min)
   ├─ Generate QR code with your address
   ├─ Download QR
   └─ Share for receiving payments

7. Verify on Blockchain (5 min)
   ├─ Copy transaction hashes
   ├─ Paste into Blockscout
   └─ View on-chain confirmation
```

---

## 🎬 Demo Video Script

### Opening (Show faucet)
> "This is a testnet demo, so I'll get free PAS tokens from the Polkadot faucet. This represents real money on mainnet, but for testing it's free."

### Onboarding
> "After connecting my wallet, I'm prompted to create a profile. This data is stored on the blockchain in the UserRegistry smart contract—not in a traditional database."

### Dashboard
> "You can see my balance here—these are real PAS tokens from the testnet. All balances are fetched directly from smart contracts using Web3 hooks."

### Sending Money
> "When I send money, I select 'LatinBridge Wallet' because we're on testnet. On mainnet, users could add money via card or bank, but for testing, we use the faucet tokens."

### Transaction Confirmation
> "Here's my transaction hash. Let me show you on Blockscout—the Polkadot Paseo block explorer. You can see the actual smart contract call, gas paid, and confirmation."

### Savings
> "The 6.5% APY comes from the smart contract. I can verify this by calling the `apy()` function—it returns 650, representing 6.5%. Interest accrues per second based on blockchain timestamps."

### Loans
> "The loan funds come from the savings pool. When users deposit, 80% becomes available for loans. When I repay with 5% interest, that interest pays the 6.5% APY to savers."

---

## 🔧 For Judges: Verification Steps

### 1. Verify It's Real Blockchain
```bash
# Check transaction on Blockscout
https://blockscout-passet-hub.parity-testnet.parity.io/tx/{TRANSACTION_HASH}

# Look for:
✓ Block number (confirms inclusion in blockchain)
✓ Gas used (proves real computation)
✓ Contract interaction (shows smart contract called)
✓ Timestamp (blockchain time, not server time)
```

### 2. Verify Smart Contract Data
```javascript
// In browser console or Web3 explorer:
// Read APY from contract
const apy = await savingsContract.apy()
console.log(apy) // Returns: 650 (6.5%)

// Read user balance
const balance = await vaultContract.balanceOf(userAddress, Currency.USD)
console.log(balance) // Returns actual balance from blockchain
```

### 3. Verify No Mock Data
```bash
# Check for hardcoded data in key files:
grep -r "mock\|fake\|sample" components/dashboard/
# Should find: No mock transaction data
# All data fetched from blockchain hooks
```

---

## 📊 Expected Testnet Behavior

| Feature | Expected Result |
|---------|----------------|
| Initial Balance | 0.00 (until you use faucet) |
| After Faucet | 100 PAS (~$100 for testing) |
| Send Transaction Gas | ~0.0001 PAS (~$0.0001) |
| Savings Interest (1 day) | ~0.018 PAS per 1 PAS deposited |
| Loan Approval Time | Instant (no human review on testnet) |
| Transaction Confirmation | ~12 seconds (Polkadot block time) |

---

## 🚨 Troubleshooting

### "Insufficient funds" error
- ✅ Get PAS from faucet
- ✅ Wait 30 seconds after faucet request
- ✅ Refresh page to see updated balance

### "Transaction failed" error
- ✅ Check you have PAS for gas fees
- ✅ Ensure you selected "LatinBridge Wallet" method
- ✅ Try again with lower amount

### "Not registered" error
- ✅ Complete onboarding at /onboarding
- ✅ Wait for registration transaction to confirm
- ✅ Refresh and try again

### Balance shows $0.00
- ✅ Get PAS from faucet first
- ✅ Refresh page after receiving PAS
- ✅ Check wallet is connected

---

## 💡 Summary

**What to tell judges:**

✅ "This is a **testnet** deployment using **free PAS tokens** from a faucet"
✅ "All transactions are **real blockchain transactions** verified on Blockscout"
✅ "Smart contracts handle **savings interest, loans, and remittances**"
✅ "On **mainnet**, users would add money via card/bank/crypto"
✅ "For **testing**, we use the faucet + LatinBridge Wallet payment method"

**Not a simulation:**
- ❌ No fake balances
- ❌ No mock transactions
- ❌ No simulated interest
- ✅ All data from smart contracts
- ✅ All transactions on-chain
- ✅ All verified on block explorer
