# Testing Checklist - LatinBridge

## Server Status
- Development server running at: http://localhost:3000
- Network: Polkadot Paseo Asset Hub (Chain ID: 420420422)
- All 6 contracts deployed and verified on block explorer

## Pre-Testing Setup
1. MetaMask wallet installed and configured
2. Polkadot Paseo network added to MetaMask
3. Wallet funded with PAS tokens for gas fees
4. Server running: `npm run dev`

## End-to-End Testing Checklist

### 1. Landing Page & Authentication
- [ ] Landing page loads at http://localhost:3000
- [ ] "Get Started" button navigates to login
- [ ] MetaMask connection prompt appears
- [ ] SIWE message signature request shown
- [ ] Successful authentication redirects to dashboard

### 2. Dashboard
- [ ] Dashboard displays wallet address
- [ ] Network badge shows "Polkadot Paseo"
- [ ] Real wallet balances load from RemittanceVault contract
- [ ] All 6 currencies displayed (USD, MXN, BRL, ARS, COP, GTQ)
- [ ] Quick actions buttons functional
- [ ] Network switch banner appears if wrong network detected

### 3. Send Money Flow
- [ ] Navigate to /send page
- [ ] Select recipient from list
- [ ] Enter amount and select currencies
- [ ] Exchange rate fetched from oracle/API
- [ ] Review step shows correct calculations
- [ ] "Confirm & Send" triggers wallet signature request
- [ ] Transaction modal shows: signing > pending > success states
- [ ] Transaction hash displayed with block explorer link
- [ ] Confirmation page shows transaction details
- [ ] Transaction visible on block explorer

### 4. KYC Verification
- [ ] Navigate to /kyc page
- [ ] Current KYC level loaded from UserRegistry contract
- [ ] Three tiers displayed with correct limits
- [ ] Document upload interface functional
- [ ] Submit triggers blockchain transaction
- [ ] KYC level updates on UserRegistry contract
- [ ] New limits reflected immediately

### 5. Savings Account
- [ ] Navigate to /savings page
- [ ] Current savings balance loaded from SavingsPool contract
- [ ] 5% APY displayed correctly
- [ ] Deposit modal opens
- [ ] Deposit transaction executes on blockchain
- [ ] Balance updates after deposit
- [ ] Accrued interest calculation shown
- [ ] Withdraw functionality works
- [ ] Transactions visible on block explorer

### 6. Microloans
- [ ] Navigate to /loans page
- [ ] Eligibility check reads from MicroloanManager contract
- [ ] Max loan amount based on KYC level and credit score
- [ ] Interest rate displayed (5-15% based on credit)
- [ ] Loan application modal opens
- [ ] Application transaction executes on blockchain
- [ ] Active loan displayed after approval
- [ ] Repayment button functional
- [ ] Loan status updates on blockchain

### 7. Exchange Rates
- [ ] Navigate to /rates page
- [ ] Live rates loaded from ExchangeRateOracle contract
- [ ] API fallback works if oracle stale
- [ ] All 8 currency pairs displayed with rates
- [ ] Refresh button updates rates
- [ ] Real-time indicator shows "Live" status
- [ ] Best rates section populated
- [ ] Rate alerts UI functional

### 8. Test Platform (/test)
- [ ] Navigate to /test page
- [ ] Wallet connection test shows address, balance, network
- [ ] All 6 contract addresses displayed with explorer links
- [ ] User Registry tab: register user, get profile, update KYC
- [ ] Remittance tab: check balance, send transaction
- [ ] Savings tab: deposit, withdraw, check interest
- [ ] Loans tab: check eligibility, apply for loan, repay
- [ ] Exchange Rates tab: get rates from oracle and API
- [ ] APIs tab: test ExchangeRate-API endpoints
- [ ] All test actions execute successfully
- [ ] Toast notifications show for all actions

## Contract Interaction Verification

### UserRegistry (0xfba199c705761D98aD1cD98c34C0d544e39c1984)
- [ ] `registerUser()` - Auto-registers new users
- [ ] `getUserProfile()` - Fetches user data
- [ ] `getKYCLevel()` - Returns current tier
- [ ] `updateKYCLevel()` - Updates verification level
- [ ] `getCreditScore()` - Returns creditworthiness

### RemittanceVault (0x24d591Aa216E5466D5381139bc8feC2A91e707DB)
- [ ] `balanceOf()` - Gets wallet balance for currency
- [ ] `sendRemittance()` - Executes cross-border transfer
- [ ] `deposit()` - Adds funds to vault
- [ ] Events emitted and visible on explorer

### SavingsPool (0xfD2CFC86e06c54d1ffe9B503391d91452a8Fd02D)
- [ ] `deposit()` - Adds funds to savings
- [ ] `withdraw()` - Removes funds from savings
- [ ] `getBalance()` - Returns savings balance
- [ ] `getAccruedInterest()` - Calculates interest earned
- [ ] 5% APY calculated correctly

### MicroloanManager (0x2ABa80F8931d52DEE8e6732d213eabe795535660)
- [ ] `checkEligibility()` - Returns max loan and interest rate
- [ ] `applyForLoan()` - Creates new loan
- [ ] `getActiveLoan()` - Fetches current loan details
- [ ] `repayLoan()` - Makes loan payment
- [ ] Collateral handling works

### ExchangeRateOracle (0x8c73284b55cb55EB46Dd42617bA6213037e602e9)
- [ ] `getRate()` - Returns exchange rate for pair
- [ ] `getMultipleRates()` - Fetches multiple pairs
- [ ] Staleness protection works
- [ ] Falls back to API if needed

### PaymentNetworks (0x5D3235c4eB39f5c3729e75932D62E40f77D8e70f)
- [ ] Contract accessible
- [ ] Integration points ready

## API Integration Tests

### ExchangeRate-API
- [ ] GET /v6/{API_KEY}/latest/USD returns all 6 currencies
- [ ] Rates update in real-time
- [ ] 30-second cache working

### Didit KYC (Simulated)
- [ ] Document upload workflow functional
- [ ] Verification status tracking

### Block Explorer
- [ ] Transaction links open correct page
- [ ] Contract addresses link to explorer
- [ ] All transactions verifiable on-chain

## Security Checks
- [ ] .env.local not committed to git
- [ ] .env.example has placeholder values only
- [ ] Private keys not exposed in code
- [ ] API keys not exposed in frontend
- [ ] SIWE nonce prevents replay attacks
- [ ] JWT tokens secure

## Performance Tests
- [ ] Page load times acceptable
- [ ] Blockchain calls respond within 5 seconds
- [ ] No console errors in browser
- [ ] No memory leaks
- [ ] Responsive design works on mobile

## Browser Compatibility
- [ ] Chrome/Edge (MetaMask)
- [ ] Firefox (MetaMask)
- [ ] Brave (built-in wallet)

## Final Verification
- [ ] All contract addresses correct in .env.local
- [ ] RPC endpoint responding
- [ ] Block explorer accessible
- [ ] No broken links
- [ ] All features working end-to-end
- [ ] Ready for LATIN HACK 2025 demo

## Known Issues
- Document any issues found during testing here

## Test Results
- Date tested: _________
- Tester: _________
- Overall status: PASS / FAIL
- Notes:
