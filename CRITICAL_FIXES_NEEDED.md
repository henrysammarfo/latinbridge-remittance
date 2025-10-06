# Critical Fixes Needed Before Demo

## ✅ COMPLETED

1. **Wallet Connection** - Working with multiple wallets
2. **Theme** - Fixed to light mode
3. **getKYCStatus Error** - Fixed, function added to hook
4. **Token Economics Documentation** - Created TOKEN_ECONOMICS.md

---

## 🔴 CRITICAL ISSUES (Must Fix)

### 1. **Layout Shifted to Left**
**Issue:** All content appears shifted to left side of screen
**Fix:** Need to add proper container max-width and centering
**Files:** `app/globals.css`, all page components
**Priority:** HIGH

### 2. **Invalid Address Errors**
**Error:** `Address "1" is invalid`
**Root Cause:** Contract functions receiving number `1` instead of actual wallet addresses
**Fix:** Update all contract hooks to properly handle addresses
**Files:**
- `lib/web3/hooks/useRemittance.ts`
- `lib/web3/hooks/useSavings.ts`
- `lib/web3/hooks/useLoans.ts`
**Priority:** CRITICAL

### 3. **Currency Balances Not Showing**
**Issue:** Dashboard shows $0 but should show balances for 6 currencies
**Fix:** Ensure RemittanceVault.getBalance() is called for all currencies
**Files:** `components/dashboard/wallet-overview.tsx`, `components/dashboard/currency-cards.tsx`
**Priority:** HIGH

### 4. **Mock Data Removal**
**Locations with mock data:**
- Transaction details page - fake timestamps, fake transaction IDs
- Exchange rates - random trend indicators (FIXED)
- Savings calculator - mock APY calculations
- Transaction history - fake transactions

**Files to fix:**
- `components/dashboard/recent-transactions.tsx`
- `app/transactions/[id]/page.tsx`
- `components/savings/savings-calculator.tsx`
**Priority:** HIGH

### 5. **QR Code Issues**
**Issue:** QR code generation not working properly for receive money
**Fix:** Implement proper QR code with wallet address
**File:** `app/receive/page.tsx`
**Library:** Need to use `qrcode` or similar
**Priority:** MEDIUM

---

## 🟡 IMPORTANT FEATURES TO COMPLETE

### 6. **User Onboarding/Profile**
**Issue:** After wallet connection, no profile setup
**Solution:** Add profile creation flow:
- Step 1: Connect wallet → Step 2: Fill name, email, phone → Step 3: Dashboard
- Store profile in UserRegistry contract

**New Files Needed:**
- `app/onboarding/page.tsx` - Profile setup form
- Update login flow to redirect to onboarding if not registered

**Priority:** HIGH

### 7. **Basic KYC (Email + Phone)**
**Issue:** Basic KYC tier not working
**Current:** Only Tier 2 & 3 (ID upload) implemented
**Fix:** Add Basic KYC form:
- Email verification (send code)
- Phone verification (SMS code)
- Submit to backend
- Call `UserRegistry.updateKYCLevel(address, 1, 1000)` on success

**Files:**
- `components/kyc/basic-kyc-form.tsx` (NEW)
- `app/api/kyc/verify-email/route.ts` (NEW)
- `app/api/kyc/verify-phone/route.ts` (NEW)

**Priority:** MEDIUM

### 8. **Transaction Details - Real Data**
**Issue:** Transaction details page shows mock data
**Fix:**
- Fetch transaction from blockchain using tx hash
- Decode transaction data
- Show real sender, recipient, amount, timestamp
- Link to Blockscout explorer

**File:** `app/transactions/[id]/page.tsx`
**Priority:** MEDIUM

### 9. **Add Money Feature**
**Issue:** Needs to show how to get PAS tokens
**Fix:**
- Show faucet link: https://faucet.polkadot.io
- Show deposit instructions
- Allow deposit PAS → convert to USD/MXN/etc
- Stripe integration for buying crypto (optional - can show "Coming Soon")

**File:** `app/add-money/page.tsx`
**Priority:** LOW

### 10. **Exchange Feature**
**Issue:** Currency exchange not fully integrated
**Fix:**
- Fetch rates from ExchangeRateOracle
- Allow user to select from/to currency
- Calculate conversion
- Execute exchange (update balance in RemittanceVault)

**File:** `app/exchange/page.tsx`
**Priority:** MEDIUM

### 11. **Savings Calculator**
**Issue:** Not calculating properly for all currencies
**Fix:**
- Fetch user balance from SavingsPool for selected currency
- Calculate interest based on 5% APY (from contract)
- Show projected earnings

**File:** `components/savings/savings-calculator.tsx`
**Priority:** LOW

---

## 🟢 ENHANCEMENTS (Nice to Have)

### 12. **Test Platform Improvements**
- Show more details about each contract method
- Add transaction history for testing
- Show event logs from contracts

### 13. **Performance Optimization**
**Issue:** Navigation feels slow
**Fix:**
- Implement React.memo for heavy components
- Add loading skeletons
- Optimize contract calls (batch reads)

### 14. **Error Handling**
- Better error messages for failed transactions
- Retry logic for RPC failures
- User-friendly error displays

---

## 📋 TESTING STRATEGY

### For Demo Video:
1. Show wallet connection
2. Show getting PAS from faucet
3. Show deposit to platform
4. Show sending money (real transaction)
5. Show transaction on Blockscout
6. Show savings deposit
7. Show KYC verification (Basic + Tier 2)
8. Show test platform (`/test`)
9. Show exchange rates updating
10. Show all 6 currencies working

### For Judges:
- Provide clear documentation (TOKEN_ECONOMICS.md)
- Ensure `/test` page works flawlessly
- All contract addresses visible
- All API endpoints testable
- Link to deployed contracts on explorer

---

## 🚨 IMMEDIATE ACTION PLAN

### Today (Priority Order):

1. **Fix Layout Centering** (15 min)
   - Add max-width to pages
   - Center content properly

2. **Fix Invalid Address Errors** (30 min)
   - Fix all contract hooks passing "1" instead of address
   - Test all contract interactions

3. **Fix Currency Balances** (20 min)
   - Ensure all 6 currencies show real balances
   - Remove any hardcoded $0

4. **Add User Onboarding** (45 min)
   - Create profile form
   - Connect to UserRegistry.registerUser()
   - Add to login flow

5. **Remove Mock Transaction Data** (30 min)
   - Replace fake transactions with real blockchain queries
   - Show "No transactions yet" if empty

6. **Fix QR Code** (15 min)
   - Install qrcode library
   - Generate proper QR with wallet address

7. **Test Everything** (60 min)
   - Go through entire flow
   - Fix any bugs found
   - Verify on Blockscout

---

## 💾 COMMIT STRATEGY

After each fix:
```bash
git add .
git commit -m "fix: [description]"
git push origin feature/web3-integration
```

---

## 📝 NOTES

- **PAS Token = Base Currency**
- All amounts denominated in USD/MXN/BRL etc but backed by PAS
- Real blockchain transactions viewable on Blockscout
- No simulation - actual smart contracts deployed
- Testnet = Safe for demo, no real money

**Judges should understand:** This is a real Web3 app on testnet, not a mockup. Every action creates a blockchain transaction.
