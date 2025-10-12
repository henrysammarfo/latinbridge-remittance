# POST-DEPLOYMENT INTEGRATION TESTS

## 🧪 **TEST THESE AFTER REDEPLOYMENT**

Run these tests IN ORDER to verify everything works:

---

## TEST 0: ADMIN SETUP (DO THIS FIRST)

### **Steps:**
1. Connect ADMIN wallet
2. Set exchange rate oracle
3. Update exchange rates for all currencies
4. deposit 100,000 USD to platform reserves

### **Expected Results:**
✅ Oracle address set in RemittanceVault  
✅ Exchange rates updated (check with oracle.getRate())  
✅ Platform reserves show 1,000-5,000 USD (testnet amount)  

---

## TEST 1: DEPOSIT WITH LIVE EXCHANGE RATE
### **Steps:**
1. Connect MetaMask wallet
2. Go to "Send Money" page
3. Click "Add Funds"
4. Deposit 100 PAS for USD
5. Confirm transaction in MetaMask

### **Expected Results:**
✅ Transaction succeeds  
✅ LatinBridge balance shows converted amount (using oracle rate)  
✅ MetaMask PAS balance decreases by 100  
✅ No errors in console  

### **If It Fails:**
- Check contract address in .env.local
- Ensure wallet has PAS tokens
- Check network is correct (Polkadot Paseo)

---

## TEST 2: SEND MONEY (BALANCE DEDUCTION)

### **Steps:**
1. Start with 100 USD in LatinBridge balance
2. Go to "Send Money" page
3. Enter recipient address (40-char EVM address!)
4. Enter amount: 30 USD
5. Click "Send Money"
6. Confirm transaction

### **Expected Results:**
✅ Transaction succeeds  
✅ YOUR balance shows 70 USD (100 - 30) ✅  
✅ Recipient balance increases by 30 USD  
✅ Fee deducted (0.5%)  

### **If Balance Doesn't Decrease:**
❌ Contracts not properly integrated - must redeploy!

---

## TEST 3: SAVINGS DEPOSIT (BALANCE MOVES)

### **Steps:**
1. Start with 70 USD in LatinBridge balance
2. Go to "Savings" page
3. Click "Deposit"
4. Enter amount: 40 USD
5. Confirm transaction

### **Expected Results:**
✅ Transaction succeeds  
✅ LatinBridge balance: 30 USD (70 - 40) ✅  
✅ Savings balance: 40 USD ✅  
✅ Total across both: 70 USD (unchanged)  

### **If LatinBridge Balance Doesn't Decrease:**
❌ SavingsPool not integrated with RemittanceVault - must redeploy!

---

## TEST 4: SAVINGS WITHDRAWAL (BALANCE RETURNS)

### **Steps:**
1. Current: LatinBridge 30 USD, Savings 40 USD
2. Go to "Savings" page  
3. Click "Withdraw"
4. Enter amount: 20 USD
5. Confirm transaction

### **Expected Results:**
✅ Transaction succeeds  
✅ Savings balance: 20 USD (40 - 20) ✅  
✅ LatinBridge balance: 50 USD (30 + 20) ✅  
✅ Total: 70 USD (unchanged)  

### **If Balances Don't Move Correctly:**
❌ SavingsPool integration broken - check contract deployment!

---

## TEST 5: LOAN APPLICATION

### **Steps:**
1. Go to "Loans" page
2. Click "Apply for Loan"
3. Fill in:
   - Amount: 100 USD
   - Duration: 90 days
   - Purpose: "Business expenses"
4. Click "Apply"
5. Confirm transaction

### **Expected Results:**
✅ Transaction succeeds  
✅ Loan appears as "Pending" in UI  
✅ No balance change yet (not approved)  
✅ Admin can see loan in admin panel  

### **If Button Is Disabled:**
- Check eligibility (wallet must be connected)
- Check for existing active loan
- Check console for errors

---

## TEST 6: ADMIN LOAN APPROVAL (BALANCE INCREASES)

### **Steps:**
1. Disconnect user wallet
2. Connect ADMIN wallet
3. Go to `/admin/loans`
4. Find pending loan
5. Click "Approve"
6. Enter admin note
7. Confirm transaction

### **Expected Results:**
✅ Transaction succeeds  
✅ Loan status changes to "Active"  
✅ User's LatinBridge balance INCREASES by loan amount ✅  
✅ User can now spend the loan money  

### **If User Balance Doesn't Increase:**
❌ MicroloanManager not integrated with RemittanceVault - must redeploy!

### **If Approval Fails with "Transfer failed":**
❌ Platform reserves have no funds - admin must fund reserves using depositToPlatformReserves!

---

## TEST 7: LOAN REPAYMENT (BALANCE DECREASES)

### **Steps:**
1. User has active loan of 100 USD
2. User has 150 USD in LatinBridge balance
3. Go to "Loans" page
4. Click "Make Payment"
5. Enter amount: 50 USD
6. Confirm transaction

### **Expected Results:**
✅ Transaction succeeds  
✅ LatinBridge balance: 100 USD (150 - 50) ✅  
✅ Loan remaining: ~50 USD + interest ✅  
✅ Loan status still "Active"  

### **If Balance Doesn't Decrease:**
❌ MicroloanManager repayment not integrated - must redeploy!

---

## TEST 8: INTEREST RATE VERIFICATION

### **Steps:**
1. Have 3 test users with different credit scores:
   - User A: Credit score 750 (excellent)
   - User B: Credit score 650 (good)
   - User C: Credit score 550 (fair)
2. Each user applies for a loan
3. Admin approves all loans
4. Check interest rates displayed

### **Expected Results:**
✅ User A: 5% interest rate  
✅ User B: 8% interest rate  
✅ User C: 12% interest rate  
✅ Rates differ based on credit score  

### **If Everyone Gets 10%:**
❌ MicroloanManager not integrated with UserRegistry - must redeploy!

---

## TEST 9: EXCHANGE CURRENCY

### **Steps:**
1. Have 100 USD in LatinBridge balance
2. Go to "Exchange" page
3. Select: From USD to MXN
4. Enter amount: 50 USD
5. Click "Exchange"
6. Confirm transaction

### **Expected Results:**
✅ Transaction succeeds  
✅ USD balance decreases  
✅ MXN balance increases  
✅ Exchange rate applied  

### **Current Limitation:**
⚠️ Exchange rates are 1:1 (oracle not integrated yet)
⚠️ This is a known limitation, not a bug

---

## TEST 10: WITHDRAW TO WALLET

### **Steps:**
1. Have 50 USD in LatinBridge balance
2. Go to "Send Money" page
3. Click "Withdraw to Wallet"
4. Enter amount: 25 USD
5. Confirm transaction

### **Expected Results:**
✅ Transaction succeeds  
✅ LatinBridge balance: 25 USD (50 - 25) ✅  
✅ MetaMask PAS balance increases  
✅ Funds back in your wallet  

---

## TEST 11: ADMIN ACCESS CHECK

### **Steps:**
1. Connect regular (non-admin) wallet
2. Try to access `/admin`
3. Try to access `/admin/loans`

### **Expected Results:**
✅ Access denied message shown  
✅ Redirected to dashboard  
✅ Cannot see admin features  
✅ Admin link not visible in nav  

### **Steps (Admin):**
1. Connect admin wallet
2. Go to `/admin`
3. Check admin link in nav

### **Expected Results:**
✅ Admin panel loads  
✅ Can see loan management  
✅ Admin link visible in nav  
✅ Can approve/reject loans  

---

## TEST 12: BALANCE CONSISTENCY CHECK

### **Final Verification:**

After running ALL tests above, check:

1. **Sum all balances:**
   ```
   LatinBridge balance: X USD
   Savings balance: Y USD
   Loan (if any): -Z USD
   Total: X + Y - Z
   ```

2. **Verify against deposits:**
   ```
   Total deposited: A PAS
   Total withdrawn: B PAS
   Total sent: C USD
   Total received: D USD
   
   Current total should equal:
   A - B - C + D (accounting for fees)
   ```

3. **Check for phantom money:**
   ```
   ❌ If total > deposits: Phantom money! Contracts broken!
   ✅ If total = deposits (minus fees): Correct!
   ```

---

## 🚨 **CRITICAL FAILURES**

If ANY of these fail, the system is NOT working:

### **MUST PASS:**
- [ ] Test 2: Balance decreases when sending money
- [ ] Test 3: Balance moves from LatinBridge to Savings
- [ ] Test 4: Balance returns from Savings to LatinBridge
- [ ] Test 6: Balance increases when loan approved
- [ ] Test 7: Balance decreases when loan repaid
- [ ] Test 12: Total balance consistent (no phantom money)

**If these fail → Contracts not integrated → MUST REDEPLOY!**

---

## 📊 **TEST RESULTS TEMPLATE**

Copy this and fill it out:

```
POST-DEPLOYMENT TEST RESULTS
Date: ___________
Tester: ___________

✅ = Pass | ❌ = Fail | ⚠️ = Partial

[ ] Test 1: Basic Deposit
[ ] Test 2: Send Money (balance deducts)
[ ] Test 3: Savings Deposit (balance moves)
[ ] Test 4: Savings Withdrawal (balance returns)
[ ] Test 5: Loan Application
[ ] Test 6: Admin Approval (balance increases)
[ ] Test 7: Loan Repayment (balance decreases)
[ ] Test 8: Interest Rate Verification
[ ] Test 9: Exchange Currency
[ ] Test 10: Withdraw to Wallet
[ ] Test 11: Admin Access Control
[ ] Test 12: Balance Consistency

CRITICAL CHECKS:
[ ] Balances deduct when spending
[ ] Balances move between systems
[ ] No phantom money appearing
[ ] Admin features functional
[ ] Credit scores affect rates

OVERALL STATUS: ___________

NOTES:
________________________________
________________________________
________________________________
```

---

## 🔧 **TROUBLESHOOTING**

### **Issue: Transaction fails immediately**
- Check gas fees (need PAS for gas)
- Check contract addresses in .env.local
- Check network (Polkadot Paseo Asset Hub)

### **Issue: Balance doesn't change**
- **ROOT CAUSE:** Contracts not integrated
- **FIX:** Must redeploy contracts with integrations

### **Issue: "Insufficient balance" but I have money**
- Check you're looking at LatinBridge balance, not MetaMask balance
- Deposit to LatinBridge first before using features

### **Issue: Admin panel not accessible**
- Check NEXT_PUBLIC_ADMIN_WALLET in .env.local
- Must be 40-character EVM address
- Must match connected wallet exactly

### **Issue: Interest rate always 10%**
- MicroloanManager not connected to UserRegistry
- Redeploy MicroloanManager with UserRegistry address
- Set credit scores for test users

---

## ✅ **DEPLOYMENT SUCCESS CRITERIA**

System is fully functional when ALL of these are true:

1. ✅ Deposits work and show in balance
2. ✅ Sends DEDUCT from sender balance
3. ✅ Sends ADD TO recipient balance  
4. ✅ Savings deposits DEDUCT from LatinBridge
5. ✅ Savings withdrawals ADD BACK to LatinBridge
6. ✅ Loan approvals INCREASE borrower balance
7. ✅ Loan repayments DECREASE borrower balance
8. ✅ Interest rates vary by credit score (5%-15%)
9. ✅ Admin can approve/reject loans
10. ✅ Balances always consistent (no phantom money)
11. ✅ Admin access controlled properly
12. ✅ All transactions recorded on-chain

**If even ONE fails, investigate and fix before going live!**
