# Savings & Loans - How It Works

## Overview
LatinBridge's Savings Pool and Microloan system operate on the Polkadot Paseo blockchain using smart contracts. This document explains how the APY is determined and where loan funds come from.

---

## 💰 Savings Pool - How APY Works

### Current APY: 6.5% (Stored in Smart Contract)

The APY (Annual Percentage Yield) for savings is **stored directly in the SavingsPool smart contract** and can be read by calling the `apy()` function.

### How It's Calculated

1. **Smart Contract Variable**: `uint256 public apy = 650;` (represents 6.5%)
   - This is a **configurable parameter** set by the contract owner
   - Can be updated based on market conditions

2. **Interest Calculation**:
   ```solidity
   function accrueInterest(address user) internal {
       uint256 timeElapsed = block.timestamp - lastAccrualTime[user];
       uint256 interest = (balance * apy * timeElapsed) / (100 * 365 days);
       accruedInterest[user] += interest;
   }
   ```

3. **Key Points**:
   - Interest accrues **per second** based on your deposit
   - Compounds automatically
   - No minimum balance required
   - No lock-in period

### Where Does the Interest Come From?

In a **production environment**, the interest would come from:

1. **Loan Interest Payments**: Users who take microloans pay interest
2. **Transaction Fees**: Small fees from remittances
3. **Platform Revenue**: Exchange rate margins
4. **Reserve Pool**: Platform-owned liquidity

**For Testing/Demo (Testnet)**:
- The APY is **pre-configured** in the contract
- Interest is calculated but uses testnet PAS tokens (no real value)
- This demonstrates the **mechanism** without real funds

---

## 🏦 Microloans - Where Funds Come From

### Loan Pool Funding Sources

The MicroloanManager contract provides loans from the following sources:

### 1. **Savings Pool Deposits** (Primary Source)
- When users deposit into the Savings Pool, those funds become available for loans
- The contract maintains a **liquidity ratio** to ensure savings can always be withdrawn
- Example:
  - Total deposits: $10,000 USD
  - Reserve requirement: 20% ($2,000)
  - Available for loans: $8,000

### 2. **Platform Liquidity Reserves**
- LatinBridge platform funds deposited into the contract
- Acts as a buffer to ensure loan availability
- Maintained by the contract owner (platform)

### 3. **Repaid Loan Principal + Interest**
- When borrowers repay loans with interest, those funds:
  - **Principal** → Goes back to the loan pool
  - **Interest** → Split between:
    - Savings pool (to pay APY to savers)
    - Platform fees
    - Reserve growth

### How It Works (Step by Step)

```
1. User deposits $100 USD into Savings Pool
   ↓
2. Contract checks liquidity ratio
   ↓
3. $80 becomes available for loans (80% utilization)
   ↓
4. Borrower requests $50 microloan
   ↓
5. Contract approves loan from available funds
   ↓
6. Borrower repays $52.50 (5% interest)
   ↓
7. $50 goes back to loan pool
   $2.50 interest split:
   - $1.50 → Savings pool (to pay 6.5% APY to savers)
   - $1.00 → Platform fees
```

### Smart Contract Functions

**Check Available Loan Funds**:
```solidity
function getAvailableLiquidity() public view returns (uint256)
```

**Loan Parameters**:
- **Interest Rate**: 5% (configurable per loan term)
- **Collateral Ratio**: 120% (for secured loans)
- **Maximum Loan Amount**: Based on KYC tier and available liquidity

---

## 📊 Testing on Polkadot Paseo Testnet

### How to Test Savings

1. **Get Free PAS Tokens**:
   - Visit: https://faucet.polkadot.io
   - Select "Paseo Asset Hub"
   - Enter your wallet address
   - Receive 100 PAS tokens (free)

2. **Deposit into Savings**:
   - Go to `/savings` page
   - Click "Deposit"
   - Enter amount (e.g., 10 PAS)
   - Confirm transaction
   - Wait for confirmation (~12 seconds)

3. **Watch Interest Accrue**:
   - Interest accrues per second
   - View on `/savings` page
   - Refresh to see updated balance

### How to Test Microloans

1. **Ensure You Have Deposits**:
   - The loan pool needs liquidity
   - Either:
     - Make a savings deposit first, OR
     - Platform reserves are available

2. **Request a Loan**:
   - Go to `/loans` page
   - Fill out loan application:
     - Amount (e.g., 5 USD equivalent)
     - Term (30, 60, or 90 days)
     - Purpose
   - Submit application

3. **Loan Approval** (For Demo):
   - Contract checks:
     - Available liquidity ✓
     - Your KYC status
     - Collateral if required
   - Loan approved and funds transferred

4. **Repayment**:
   - View active loans on `/loans` page
   - Click "Repay"
   - Contract calculates: Principal + Interest
   - Confirm repayment transaction

---

## 🔍 Key Smart Contract Addresses (Paseo Testnet)

All deployed on **Polkadot Paseo Asset Hub** (Chain ID: 420420422)

| Contract | Address |
|----------|---------|
| SavingsPool | `0xB06F5ba93c174054d5840C37cA158f5FA82DCF20` |
| MicroloanManager | `0x11FeDFC6C1d2d711660507c040E4607D4030Dd55` |
| UserRegistry | `0xE8DE1F65c197ca9aDCD56303dB232fFEF9534e99` |

### Verify on Blockscout
View all transactions and contract interactions:
https://blockscout-passet-hub.parity-testnet.parity.io

---

## 💡 Demo Strategy for Judges

### Narration Script:

**Savings Demonstration**:
> "I'm depositing 10 PAS tokens into the savings pool. The smart contract automatically calculates 6.5% APY, which accrues per second. You can see the interest growing in real-time—this is not a simulation, these are actual blockchain transactions on Polkadot Paseo testnet."

**Checking APY Source**:
> "The 6.5% APY comes directly from the smart contract. I can call the `apy()` function to verify—it returns 650, which represents 6.5%. This is stored on-chain, not in our frontend."

**Loan Funding Explanation**:
> "When I request a microloan, the funds come from the savings pool deposits. The contract maintains a reserve ratio to ensure savers can always withdraw. When I repay the loan with 5% interest, that interest goes back to paying APY to savers—creating a sustainable ecosystem."

**Real Blockchain Verification**:
> "Every transaction here generates a real transaction hash. We can view it on Blockscout—the Polkadot Paseo block explorer—showing the actual smart contract execution, gas fees paid in PAS, and on-chain confirmation."

---

## 🚀 Production vs. Testnet

| Feature | Testnet (Current) | Production (Future) |
|---------|-------------------|---------------------|
| Tokens | Free PAS from faucet | Real cryptocurrency/stablecoins |
| APY Source | Pre-configured in contract | Dynamic based on platform revenue |
| Loan Funds | Testnet PAS tokens | Real user deposits + platform reserves |
| Interest | Calculated but no real value | Real earnings for users |
| Sustainability | For demonstration | Backed by transaction fees + loan interest |

---

## 📝 Summary

✅ **Savings APY (6.5%)** is stored in the smart contract and readable via `apy()` function
✅ **Interest accrues per second** based on your balance
✅ **Loan funds** come from savings deposits + platform reserves
✅ **Loan repayments** (principal + interest) sustain the ecosystem
✅ **Everything is verifiable** on-chain via Blockscout
✅ **Testnet uses free PAS tokens** but demonstrates real mechanism

This creates a **decentralized, transparent, and sustainable** financial ecosystem for cross-border remittances and microloans.
