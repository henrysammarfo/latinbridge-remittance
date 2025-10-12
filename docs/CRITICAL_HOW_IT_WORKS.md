# 🔥 CRITICAL: How LatinBridge Actually Works

## ⚠️ IMPORTANT - Read This First!

**ALL transactions use LatinBridge internal balances, NOT your wallet balance (except initial deposit and final withdrawal).**

---

## 💰 Balance System

### **Two Separate Balances:**

1. **Wallet Balance** (MetaMask)
   - Your PAS tokens in your wallet
   - Visible in MetaMask
   - Used ONLY for:
     - Initial deposit to LatinBridge
     - Final withdrawal from LatinBridge

2. **LatinBridge Balance** (Smart Contract)
   - Your balance stored IN the RemittanceVault contract
   - Visible on LatinBridge dashboard
   - Used for ALL transactions:
     - Sending money
     - Receiving money
     - Currency exchange
     - Savings deposits
     - Loan payments
     - Everything else!

---

## 📊 Complete Transaction Flow

### 1️⃣ **Deposit (Add Money)**

**What Happens:**
```
Your Wallet (10 PAS)
→ Send 10 PAS to RemittanceVault contract
→ Contract stores: Your LatinBridge balance = 10 USD
```

**Smart Contract Function:**
```solidity
depositFunds(Currency.USD, 10 ether)
```

**Result:**
- ✅ Wallet balance: DECREASED by 10 PAS
- ✅ LatinBridge balance: INCREASED by 10 USD
- ✅ You can now use 10 USD for any transaction

**Important:**
- You choose which currency to store (USD, MXN, BRL, etc.)
- 1 PAS = 1 unit of currency (1 PAS deposited as USD = 1 USD in LatinBridge)

---

### 2️⃣ **Send Money (Remittance)**

**What Happens:**
```
Your LatinBridge Balance (50 USD)
→ Send 20 USD to recipient (MXN)
→ Contract converts 20 USD → ~370 MXN (live rate)
→ Recipient's LatinBridge balance += 370 MXN
```

**Smart Contract Function:**
```solidity
sendRemittance(
  recipientAddress,
  Currency.USD,  // Your balance currency
  Currency.MXN,  // Recipient receives in
  20 ether       // Amount in USD
)
```

**Result:**
- ✅ Your LatinBridge USD balance: 50 - 20 = 30 USD
- ✅ Recipient LatinBridge MXN balance: +370 MXN
- ✅ Fee charged: 0.5% (0.10 USD)
- ❌ Your wallet NOT touched!

**Critical:**
- This is LatinBridge user → LatinBridge user
- Both sender and recipient have LatinBridge balances
- Money stays IN the platform (in the contract)
- NOT sent to external wallets

---

### 3️⃣ **Exchange Currency**

**What Happens:**
```
Your LatinBridge Balance (100 USD)
→ Exchange 50 USD to MXN
→ Contract converts 50 USD → ~925 MXN (live rate)
→ Your LatinBridge balances updated
```

**Smart Contract Function:**
```solidity
sendRemittance(
  YOUR_OWN_ADDRESS,  // Send to yourself!
  Currency.USD,
  Currency.MXN,
  50 ether
)
```

**Result:**
- ✅ Your LatinBridge USD balance: 100 - 50 = 50 USD
- ✅ Your LatinBridge MXN balance: +925 MXN
- ✅ You now have BOTH currencies in LatinBridge
- ❌ Your wallet NOT touched!

**How it works:**
- Exchange uses the SAME function as Send
- But recipient = yourself
- Converts from one currency to another
- All within LatinBridge balances

---

### 4️⃣ **Savings (Deposit & Withdraw)**

**Deposit to Savings:**
```
Your LatinBridge Balance (100 USD)
→ Deposit 50 USD to Savings
→ SavingsPool contract stores your deposit
→ Starts earning 5% APY
```

**Smart Contract Function:**
```solidity
savingsPool.deposit(Currency.USD, 50 ether)
```

**Result:**
- ✅ Your LatinBridge USD balance: 100 - 50 = 50 USD
- ✅ Your Savings balance: +50 USD
- ✅ Starts earning 5% APY immediately
- ❌ Your wallet NOT touched!

**Withdraw from Savings:**
```
Your Savings Balance (50 USD + interest)
→ Withdraw 50 USD
→ Returns to LatinBridge balance
```

**Result:**
- ✅ Your Savings balance: 0 USD
- ✅ Your LatinBridge USD balance: +50 USD (+ any earned interest)
- ❌ Your wallet NOT touched!

---

### 5️⃣ **Loans (Apply & Repay)**

**Apply for Loan:**
```
Check eligibility based on credit score
→ Apply for 500 USD loan
→ If approved, loan amount added to LatinBridge balance
```

**Smart Contract Function:**
```solidity
microloanManager.requestLoan(
  500 ether,
  Currency.USD,
  360 days  // Duration
)
```

**Result:**
- ✅ Your LatinBridge USD balance: +500 USD
- ✅ Loan recorded on-chain
- ✅ You can use the 500 USD immediately
- ❌ Your wallet NOT touched!

**Repay Loan:**
```
Your LatinBridge Balance (500 USD)
→ Repay loan amount
→ Loan marked as paid
```

**Result:**
- ✅ Your LatinBridge USD balance: -500 USD
- ✅ Loan status: PAID
- ❌ Your wallet NOT touched!

---

### 6️⃣ **Withdraw (Back to Wallet)**

**What Happens:**
```
Your LatinBridge Balance (100 USD)
→ Withdraw 50 USD
→ Contract sends 50 PAS to your wallet
```

**Smart Contract Function:**
```solidity
withdrawFunds(Currency.USD, 50 ether)
```

**Result:**
- ✅ Your LatinBridge USD balance: 100 - 50 = 50 USD
- ✅ Your wallet PAS balance: +50 PAS
- ✅ Money moved FROM contract TO wallet

---

## 🔄 Full User Journey Example

### Starting Balance:
- Wallet: 100 PAS
- LatinBridge: 0 USD

### Step 1: Deposit
```
Action: Deposit 100 PAS as USD
Result:
- Wallet: 0 PAS
- LatinBridge: 100 USD
```

### Step 2: Send Money
```
Action: Send 30 USD to friend (as MXN)
Result:
- Wallet: 0 PAS (unchanged!)
- LatinBridge: 70 USD
- Friend LatinBridge: +555 MXN
```

### Step 3: Exchange
```
Action: Exchange 20 USD to BRL
Result:
- Wallet: 0 PAS (unchanged!)
- LatinBridge: 50 USD, 100 BRL
```

### Step 4: Savings
```
Action: Deposit 30 USD to savings
Result:
- Wallet: 0 PAS (unchanged!)
- LatinBridge: 20 USD, 100 BRL
- Savings: 30 USD (earning 5% APY)
```

### Step 5: Withdraw
```
Action: Withdraw 20 USD to wallet
Result:
- Wallet: 20 PAS ✅
- LatinBridge: 0 USD, 100 BRL
- Savings: 30 USD
```

---

## 🎯 Key Points

### ✅ **What Uses LatinBridge Balance:**
1. Sending money
2. Receiving money
3. Exchanging currencies
4. Depositing to savings
5. Withdrawing from savings
6. Taking loans
7. Repaying loans
8. ALL fees and charges

### ❌ **What Uses Wallet Balance:**
1. Initial deposit to LatinBridge
2. Final withdrawal from LatinBridge
3. **That's it!**

---

## 💡 Why This Design?

### **Benefits:**
1. **Faster Transactions** - No wallet confirmations for every action
2. **Lower Gas Fees** - Transactions happen within the contract
3. **Better UX** - No MetaMask popup for every transaction
4. **Security** - Funds in audited smart contract
5. **Multi-Currency** - Hold multiple currencies simultaneously

### **How Users Access Their Money:**
1. Use it within LatinBridge (send, exchange, save)
2. Withdraw to wallet anytime

---

## 🔐 Security

**Your money is safe because:**
- Smart contract is audited
- You can withdraw anytime
- All transactions are on-chain
- No one can access your balance except you
- Contract has been tested extensively

---

## 📱 Transaction History

**ALL transactions are tracked:**
- Deposits
- Sends
- Receives
- Exchanges
- Savings deposits/withdrawals
- Loan applications/repayments
- Withdrawals

**Where to see:**
- Dashboard → Recent Transactions
- View on Blockscout (block explorer)
- Local storage (transaction history page)

---

## 🚨 Common Mistakes to Avoid

❌ **Don't expect your wallet balance to change** when you:
- Send money
- Exchange currency
- Deposit to savings
- Take a loan

✅ **Your LatinBridge balance changes** for all the above!

❌ **Don't try to send money to someone's wallet address** - they won't get it in LatinBridge!

✅ **Send to their LatinBridge account** (their wallet address, but it goes to their LatinBridge balance)

---

## 📊 Balance Check

**Always check TWO places:**

1. **MetaMask** - Your wallet PAS balance
2. **LatinBridge Dashboard** - Your LatinBridge multi-currency balances

---

## ✨ Summary

**Think of LatinBridge like a bank:**
- You deposit money into the bank (LatinBridge)
- You use that money for transactions
- Your wallet is like your external bank account
- LatinBridge balance is like your checking account

**All activity happens INSIDE the bank (LatinBridge contract), not in your wallet!**

---

**Last Updated**: October 12, 2025
**Status**: ✅ Production Ready
**Network**: Polkadot Paseo Asset Hub Testnet
