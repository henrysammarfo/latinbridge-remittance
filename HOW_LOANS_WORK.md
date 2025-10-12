# How Microloans Work on LatinBridge

## Currency Used
**All loans are denominated and disbursed in PAS tokens** (Polkadot Paseo Asset Hub testnet native currency).

## Loan Process

### 1. Application
- Users can apply for a loan by specifying:
  - **Amount**: How many PAS tokens to borrow
  - **Currency**: For accounting (USD, MXN, BRL, etc.) 
  - **Duration**: Loan term in days
  - **Purpose**: Description of what the loan is for

### 2. Approval (Admin Only)
- Loans must be approved by the contract owner
- **You (admin) call `approveLoan(loanId)` on the contract**
- Upon approval:
  - Interest rate is calculated based on user's credit score
  - Loan status changes to "Active"
  - Due date is set
  - Repayment schedule is created
  - **Loan is recorded on-chain**

### 3. Disbursement (Manual)
- **After approving on-chain, YOU manually send PAS tokens from your wallet**
- Open MetaMask and send the loan amount to the borrower's address
- Borrower receives full loan amount in PAS
- **Your wallet = The loan fund source**
- Mark the loan as "Funded" in the admin panel to track it

### 4. Repayment (Manual + On-Chain)
- Borrowers are shown YOUR wallet address for repayments
- They send PAS tokens (Principal + Interest) directly to your wallet
- After receiving payment, they call `repayLoan(loanId, amount)` on the contract
- This records the repayment on-chain
- **You receive PAS directly to your wallet**
- Contract tracks the repayment status
  
### 5. Credit Score Impact
- Successful repayment improves credit score
- Late payments or defaults decrease credit score
- Credit score affects future loan eligibility and interest rates

## For Testnet Demo

### For Borrowers:

1. **Get PAS tokens** from the faucet:
   - Visit: https://faucet.polkadot.io/paseo
   - Request testnet PAS tokens
   
2. **Apply for a loan**:
   - Navigate to "Loans" page
   - Fill out loan application
   - Loan will show as "Pending"

3. **Wait for approval**:
   - Admin reviews and approves on-chain
   - Admin sends PAS directly to your wallet
   
4. **Receive PAS tokens**:
   - Check your wallet for the loan amount
   - Use PAS for remittances, exchanges, or savings

5. **Repay**:
   - Send loan amount + interest in PAS to admin address (shown in UI)
   - Call `repayLoan()` on the contract to record repayment
   - This updates your credit score

### For Admin (You):

1. **Access admin panel**:
   - Go to `/admin/loans` to see applications
   
2. **Review and approve**:
   - See borrower details and loan amount
   - Call `approveLoan(loanId)` on MicroloanManager contract
   - Link provided in admin panel

3. **Send PAS tokens**:
   - Copy borrower's address from admin panel
   - Send loan amount from your MetaMask
   - Click "Mark as Funded" to track it

4. **Receive repayments**:
   - Borrowers send PAS back to your address
   - Track via your wallet balance
   - On-chain contract records the repayment status

## Smart Contract Functions

- `applyForLoan(amount, currency, duration, purpose)` - Submit loan application
- `approveLoan(loanId)` - Owner approves a loan (triggers disbursement)
- `repayLoan(loanId, amount)` - Borrower repays loan
- `calculateInterestRate(borrower)` - Get interest rate based on credit score
- `getUserLoan(user)` - Get user's active loan details

## Interest Rates

Interest is calculated in basis points (1 basis point = 0.01%):
- **Excellent credit** (800+): ~5% APR
- **Good credit** (700-799): ~8% APR  
- **Fair credit** (600-699): ~12% APR
- **Poor credit** (<600): ~15% APR

Formula: `Interest = (Principal × Rate × Days) / (10000 × 365)`
