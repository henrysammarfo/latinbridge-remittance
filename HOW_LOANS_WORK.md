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
- Upon approval:
  - Interest rate is calculated based on user's credit score
  - Loan status changes to "Active"
  - Due date is set
  - Repayment schedule is created

### 3. Disbursement
- **PAS tokens are transferred directly to the borrower's wallet**
- The loan amount is sent from the MicroloanManager contract
- Borrower receives full loan amount in PAS

### 4. Repayment
- Borrowers repay the loan by sending PAS tokens back to the contract
- Repayment amount = Principal + Interest
- Interest is calculated based on:
  - Credit score (better score = lower interest)
  - Duration (longer term = more interest)
  
### 5. Credit Score Impact
- Successful repayment improves credit score
- Late payments or defaults decrease credit score
- Credit score affects future loan eligibility and interest rates

## For Testnet Demo

Since this is on Paseo testnet:

1. **Get PAS tokens** from the faucet:
   - Visit: https://faucet.polkadot.io/paseo
   - Request testnet PAS tokens
   
2. **Deposit PAS** to your LatinBridge account:
   - Go to "Add Money" page
   - Deposit PAS tokens

3. **Apply for a loan**:
   - Navigate to "Loans" page
   - Fill out loan application
   - Loan will show as "Pending"

4. **Admin Approval Required**:
   - On testnet, the contract owner must approve loans
   - In production, this could be automated based on credit score
   
5. **Receive PAS tokens**:
   - Once approved, PAS tokens are sent to your wallet
   - Use them for remittances, exchanges, or savings

6. **Repay**:
   - Repay the loan amount + interest in PAS tokens

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
