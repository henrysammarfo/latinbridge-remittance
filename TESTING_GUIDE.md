# LatinBridge Contract Testing Guide

## 🔧 Setup MetaMask for Polkadot Paseo

### Add Polkadot Paseo Network to MetaMask

1. Open MetaMask
2. Click on the network dropdown (top left)
3. Click "Add Network" → "Add a network manually"
4. Enter the following details:

```
Network Name: Polkadot Paseo Asset Hub
RPC URL: https://testnet-passet-hub-eth-rpc.polkadot.io
Chain ID: 420420422
Currency Symbol: PAS
Block Explorer: https://blockscout-passet-hub.parity-testnet.parity.io
```

5. Click "Save"
6. Switch to the "Polkadot Paseo Asset Hub" network

### Get Test PAS Tokens

1. Visit: https://faucet.polkadot.io/?parachain=1111
2. Enter your wallet address
3. Request test PAS tokens
4. Wait for tokens to arrive (check your MetaMask balance)

---

## 🧪 Testing Contracts on Block Explorer

### Method 1: Using Block Explorer UI (If Available)

Some block explorers allow direct contract interaction:

1. Go to: https://blockscout-passet-hub.parity-testnet.parity.io/address/[CONTRACT_ADDRESS]
2. Look for "Contract" tab or "Read Contract" / "Write Contract" tabs
3. Connect your wallet
4. Call contract functions directly

**Note**: If the explorer doesn't have a contract interaction UI, use Method 2.

### Method 2: Using JavaScript Console in Browser

Open browser console (F12) on the block explorer page and run:

```javascript
// Connect to your wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Your contract address and ABI (example for UserRegistry)
const contractAddress = "0xfba199c705761D98aD1cD98c34C0d544e39c1984";

// Minimal ABI for testing (add functions you want to call)
const abi = [
  "function registerUser() external",
  "function getUserProfile(address user) external view returns (tuple)",
  "function isRegistered(address user) external view returns (bool)"
];

// Create contract instance
const contract = new ethers.Contract(contractAddress, abi, signer);

// Call a read function (free, no gas)
const isRegistered = await contract.isRegistered(await signer.getAddress());
console.log("Is Registered:", isRegistered);

// Call a write function (costs gas)
const tx = await contract.registerUser();
await tx.wait();
console.log("Registered! Transaction:", tx.hash);
```

---

## 📋 Contract Testing Scenarios

### 1. Test UserRegistry

**Contract**: `0xfba199c705761D98aD1cD98c34C0d544e39c1984`

**Read Functions (No Gas):**
```javascript
// Check if user is registered
await userRegistry.isRegistered("0xYourAddress");

// Get user profile
await userRegistry.getUserProfile("0xYourAddress");

// Check if verified
await userRegistry.isVerified("0xYourAddress");

// Get credit score
await userRegistry.getCreditScore("0xYourAddress");
```

**Write Functions (Costs Gas):**
```javascript
// Register as a new user
await userRegistry.registerUser();

// Update profile (after registration)
await userRegistry.updateProfile("John Doe", "john@example.com");
```

### 2. Test ExchangeRateOracle

**Contract**: `0x8c73284b55cb55EB46Dd42617bA6213037e602e9`

**Read Functions:**
```javascript
// Get current rate for a currency (0=USD, 1=MXN, 2=BRL, 3=ARS, 4=COP, 5=GTQ)
await oracle.getRate(1); // MXN rate

// Calculate conversion
await oracle.calculateConversion(0, 1, ethers.parseEther("100")); // 100 USD to MXN
```

**Write Functions (Only owner/rate updater):**
```javascript
// Update rate (only if you're the owner)
await oracle.updateRate(1, rateValue, timestamp);
```

### 3. Test RemittanceVault

**Contract**: `0x24d591Aa216E5466D5381139bc8feC2A91e707DB`

**Read Functions:**
```javascript
// Get balance in a currency
await vault.getBalance("0xYourAddress", 0); // USD balance

// Check if paused
await vault.paused();
```

**Write Functions:**
```javascript
// Deposit funds (send PAS with the transaction)
await vault.depositFunds(0, ethers.parseEther("10"), {
  value: ethers.parseEther("10")
});

// Send remittance
await vault.sendRemittance(
  "0xRecipientAddress",
  0, // from USD
  1, // to MXN
  ethers.parseEther("100")
);
```

### 4. Test SavingsPool

**Contract**: `0xfD2CFC86e06c54d1ffe9B503391d91452a8Fd02D`

**Read Functions:**
```javascript
// Get savings balance
await savingsPool.getSavingsBalance("0xYourAddress", 0); // USD

// Calculate current yield
await savingsPool.calculateYield("0xYourAddress", 0);
```

**Write Functions:**
```javascript
// Deposit to savings
await savingsPool.depositToSavings(0, ethers.parseEther("100"));

// Claim yield
await savingsPool.claimYield(0);
```

### 5. Test MicroloanManager

**Contract**: `0x2ABa80F8931d52DEE8e6732d213eabe795535660`

**Read Functions:**
```javascript
// Get user loans
await loanManager.getUserLoans("0xYourAddress");

// Calculate interest rate for user
await loanManager.calculateInterestRate("0xYourAddress");
```

**Write Functions:**
```javascript
// Request a loan (must be registered user)
await loanManager.requestLoan(
  ethers.parseEther("1000"), // amount
  0, // currency (USD)
  30, // duration in days
  "Business expansion"
);
```

### 6. Test PaymentNetworks

**Contract**: `0x5D3235c4eB39f5c3729e75932D62E40f77D8e70f`

**Read Functions:**
```javascript
// Get network fees
await paymentNetworks.getNetworkFees(0, ethers.parseEther("100")); // PIX fees
```

**Write Functions:**
```javascript
// Integrate PIX payment
await paymentNetworks.integratePIX(
  "recipient@bank.com",
  ethers.parseEther("100")
);
```

---

## 🧪 Testing with Remix IDE

For more advanced testing, you can use Remix IDE:

1. Go to: https://remix.ethereum.org
2. Create a new file with your contract's interface
3. In "Deploy & Run Transactions":
   - Environment: "Injected Provider - MetaMask"
   - Make sure MetaMask is on Polkadot Paseo network
   - Under "At Address", paste your contract address
   - Click "At Address"
4. All contract functions will appear in the UI
5. Call functions directly from Remix

---

## 📊 Monitoring & Debugging

### View Transaction History

1. Go to your wallet address on explorer:
   ```
   https://blockscout-passet-hub.parity-testnet.parity.io/address/[YOUR_WALLET]
   ```

2. See all your transactions and their status

### View Contract Events

1. Go to contract page
2. Click "Logs" or "Events" tab
3. See all emitted events from contract interactions

### Check Transaction Details

If a transaction fails:
1. Click on the transaction hash
2. View error messages in "Logs" or "Internal Transactions"
3. Debug based on revert reasons

---

## 🔑 Important Notes

### Gas Fees
- All write operations cost gas (paid in PAS tokens)
- Read operations are free
- Make sure you have enough PAS in your wallet

### Contract Interactions
- You must register in UserRegistry before using MicroloanManager
- RemittanceVault requires deposits before sending remittances
- Check your KYC level for transaction limits

### Currency Enum Values
```
0 = USD
1 = MXN
2 = BRL
3 = ARS
4 = COP
5 = GTQ
```

### Network Enum Values
```
0 = PIX (Brazil)
1 = SPEI (Mexico)
2 = CODI (Mexico QR)
3 = PSE (Colombia)
4 = ACH (Guatemala)
```

---

## 🚀 Quick Start Test Sequence

Try this sequence to test basic functionality:

```javascript
// 1. Register as a user
await userRegistry.registerUser();

// 2. Check registration
await userRegistry.isRegistered(yourAddress);

// 3. Deposit to vault
await vault.depositFunds(0, ethers.parseEther("10"), {
  value: ethers.parseEther("10")
});

// 4. Check balance
await vault.getBalance(yourAddress, 0);

// 5. Get exchange rate
await oracle.getRate(1); // MXN

// Success! All contracts are working!
```

---

## 🆘 Troubleshooting

### "Insufficient PAS balance"
- Get more test tokens from: https://faucet.polkadot.io/?parachain=1111

### "Transaction Failed"
- Check you have enough PAS for gas
- Ensure you're calling the right function with correct parameters
- Read the error message in the transaction logs

### "Not registered"
- Call `registerUser()` on UserRegistry first
- Wait for transaction to confirm before proceeding

### "Wrong network"
- Make sure MetaMask is on "Polkadot Paseo Asset Hub"
- Chain ID should be 420420422

---

## 📞 Support

For issues or questions:
- Check transaction on: https://blockscout-passet-hub.parity-testnet.parity.io
- Review contract code in `contracts/` directory
- Check deployment addresses in `DEPLOYMENT_COMPLETE.md`

**All contracts are live and ready to test! Happy testing! 🚀**
