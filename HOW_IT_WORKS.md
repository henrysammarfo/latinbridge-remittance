# How LatinBridge Works - Complete Flow Explanation

## 🏦 The LatinBridge Balance System

LatinBridge uses a **vault-based system** where your money is held in the RemittanceVault smart contract, NOT directly in your MetaMask wallet. Think of it like a bank account vs cash in your pocket.

---

## 💰 Money Flow: Step by Step

### 1. **Adding Money (Deposit PAS)**

**What happens:**
- You have PAS tokens in your MetaMask wallet
- You deposit them to LatinBridge via "Add Money" page
- PAS goes FROM your wallet TO the RemittanceVault contract
- Your **LatinBridge balance** increases

**Contract:** `RemittanceVault.deposit()`  
**Result:** Money is now "in LatinBridge" and can be used for:
- Sending to others
- Converting currencies
- Depositing to savings
- As loan collateral

---

### 2. **Sending Money**

**Scenario:** You want to send 100 USD to someone in Mexico who wants MXN

**What happens:**
- You use "Send Money" feature
- Enter their **LatinBridge ID** (wallet address)
- Choose: From USD → To MXN
- Enter amount: 100 USD
- Platform converts at live rate (100 USD → ~1,850 MXN)
- Money goes to THEIR **LatinBridge balance** as MXN

**Contract:** `RemittanceVault.sendRemittance(recipient, fromCurrency, toCurrency, amount)`

**Key Point:** 
✅ Money goes to their **LatinBridge balance**  
❌ NOT to their MetaMask wallet

**Why?** So they can:
- Use it immediately on the platform
- Convert to another currency
- Save it
- Withdraw when ready

---

### 3. **Receiving Money**

**When someone sends you money:**
- They use Send Money feature
- Enter your LatinBridge ID
- Choose what currency to send (USD, MXN, BRL, etc.)
- You receive it in your **LatinBridge balance**
- You can withdraw to MetaMask anytime

**How to give them your address:**
- Go to "Receive Money" page
- Click "Generate Payment Link"
- Share your **LatinBridge ID** (your wallet address)
- They MUST use LatinBridge Send Money feature
- Direct MetaMask transfers DON'T appear in LatinBridge

**Important:**
- If someone sends PAS directly to your MetaMask (not through LatinBridge), it goes to your wallet
- This is NOT tracked by LatinBridge
- To use it on LatinBridge, you'd need to deposit it first

---

### 4. **Currency Conversion (Exchange)**

**How multi-currency works:**

All money in LatinBridge is stored as **PAS tokens** but tracked by currency:
- 100 USD = X PAS
- 1850 MXN = X PAS  
- 500 BRL = X PAS

**When someone sends MXN to someone who wants BRL:**
1. Platform calculates exchange rate
2. Deducts MXN from sender's balance
3. Adds BRL to receiver's balance
4. All stored as PAS tokens on the contract
5. Internal accounting tracks which currency

**Smart Contract Design:**
```solidity
mapping(address => mapping(Currency => uint256)) public balances;
```
- Each user has balances in multiple currencies
- All backed by PAS tokens
- Platform handles conversion

---

### 5. **Savings**

**Flow:**
- You have money in your **LatinBridge balance** (already deposited PAS)
- Go to Savings page
- Click "Deposit to Savings"
- Choose currency and amount
- Money moves FROM your LatinBridge balance TO SavingsPool contract
- Earns 5% APY

**Contract:** `SavingsPool.depositToSavings(currency, amount)`

**Key Point:**
- You can't deposit directly from MetaMask to Savings
- Must first deposit to LatinBridge, THEN move to Savings
- This is TWO separate transactions

**Earnings:**
- APY is calculated by the smart contract
- Earnings are in the SAME currency you deposited
- If you deposit 100 USD, you earn USD
- If you deposit 1000 MXN, you earn MXN
- All stored as PAS tokens with currency tracking

---

### 6. **Loans**

**Flow:**
- Apply for loan (specify amount, currency, duration)
- Admin approves on-chain
- Admin manually sends PAS to your MetaMask wallet
- You deposit to LatinBridge to use it
- When repaying: send PAS to admin address
- Call `repayLoan()` to record it on-chain

**See:** `HOW_LOANS_WORK.md` for full details

---

## 📊 Your Balances

**You have THREE types of balances:**

1. **MetaMask Wallet Balance:**
   - Raw PAS tokens
   - NOT visible on LatinBridge
   - Use "Add Money" to bring into platform

2. **LatinBridge Balance** (Vault):
   - Money you've deposited to the platform
   - Shown on Dashboard
   - Can be USD, MXN, BRL, etc.
   - Use for sending, receiving, converting

3. **Savings Balance:**
   - Money you've moved from LatinBridge balance to Savings
   - Earns 5% APY
   - Must withdraw to LatinBridge balance first, then to MetaMask

---

## 🔄 Complete Money Cycle Example

**Starting:** You have 50 PAS in MetaMask

**Step 1: Deposit to LatinBridge**
- MetaMask: 0 PAS
- LatinBridge: 50 USD equivalent

**Step 2: Send 20 USD to friend in Mexico as MXN**
- Your LatinBridge: 30 USD
- Their LatinBridge: 370 MXN (~20 USD)

**Step 3: Move 10 USD to Savings**
- Your LatinBridge: 20 USD
- Your Savings: 10 USD (earning 5% APY)

**Step 4: Receive 50 BRL from someone**
- Your LatinBridge: 20 USD + 50 BRL

**Step 5: Withdraw 50 BRL back to MetaMask**
- Your LatinBridge: 20 USD
- Your MetaMask: ~10 PAS equivalent

---

## ❓ Common Confusion

### "I sent PAS to someone's address but they didn't receive it in LatinBridge"

**Answer:** Direct MetaMask transfers DON'T go through LatinBridge. The sender must:
1. First deposit their PAS to LatinBridge
2. Then use "Send Money" feature
3. Enter the recipient's LatinBridge ID

### "How do they receive MXN if it's crypto?"

**Answer:** Everything is PAS tokens, but LatinBridge tracks it as MXN:
- Platform shows "1850 MXN" 
- Behind the scenes: X PAS tokens
- They can withdraw as PAS to their MetaMask
- Or keep as MXN in LatinBridge

### "What PAS is added to savings as earnings?"

**Answer:** The SavingsPool contract calculates yield based on:
- Your principal amount
- Time deposited
- APY rate (5%)
- Currency you deposited in

If you deposit 100 USD, your earnings are calculated in USD value, but stored as PAS tokens.

---

## 🔒 Smart Contract Architecture

```
User MetaMask Wallet
       ↓ deposit()
RemittanceVault (LatinBridge Balance)
   ├─→ sendRemittance() → Other users
   ├─→ withdraw() → Back to MetaMask
   └─→ depositToSavings() → SavingsPool
              ↓
       SavingsPool (Savings Balance)
              ↓ withdraw()
       RemittanceVault
              ↓ withdraw()
       User MetaMask Wallet
```

---

## ✅ Summary

**Key Principles:**
1. LatinBridge is a **vault system**, not direct wallet-to-wallet
2. Money goes to **LatinBridge balances**, not MetaMask
3. Users must use **Send Money feature** for platform transfers
4. Direct MetaMask transfers are NOT tracked by LatinBridge
5. All currencies are PAS tokens with **internal accounting**
6. Withdrawals move money from platform back to MetaMask

**This design allows:**
- ✅ Currency conversion
- ✅ Lower fees (internal transfers)
- ✅ Savings with interest
- ✅ Loan management
- ✅ Transaction history
- ✅ Regulatory compliance
