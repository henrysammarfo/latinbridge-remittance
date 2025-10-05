// Standalone deployment script using only ethers.js (no Hardhat plugins required)
const ethers = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Contract artifacts
const contractNames = [
  'UserRegistry',
  'ExchangeRateOracle',
  'RemittanceVault',
  'SavingsPool',
  'MicroloanManager',
  'PaymentNetworks'
];

async function loadArtifact(contractName) {
  const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', `${contractName}.sol`, `${contractName}.json`);
  return JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
}

async function main() {
  console.log("Starting LatinBridge deployment to Polkadot Paseo testnet...\n");

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deploying with account:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Account balance:", ethers.formatEther(balance), "PAS\n");

  const deployedContracts = {};

  try {
    // 1. Deploy UserRegistry
    console.log("[1/6] Deploying UserRegistry...");
    const UserRegistry = await loadArtifact('UserRegistry');
    const userRegistryFactory = new ethers.ContractFactory(UserRegistry.abi, UserRegistry.bytecode, wallet);
    const userRegistry = await userRegistryFactory.deploy();
    await userRegistry.waitForDeployment();
    const userRegistryAddress = await userRegistry.getAddress();
    deployedContracts.UserRegistry = userRegistryAddress;
    console.log("✓ UserRegistry deployed:", userRegistryAddress);
    console.log(`  Explorer: https://blockscout-passet-hub.parity-testnet.parity.io/address/${userRegistryAddress}\n`);

    // 2. Deploy ExchangeRateOracle
    console.log("[2/6] Deploying ExchangeRateOracle...");
    const ExchangeRateOracle = await loadArtifact('ExchangeRateOracle');
    const oracleFactory = new ethers.ContractFactory(ExchangeRateOracle.abi, ExchangeRateOracle.bytecode, wallet);
    const oracle = await oracleFactory.deploy();
    await oracle.waitForDeployment();
    const oracleAddress = await oracle.getAddress();
    deployedContracts.ExchangeRateOracle = oracleAddress;
    console.log("✓ ExchangeRateOracle deployed:", oracleAddress);
    console.log(`  Explorer: https://blockscout-passet-hub.parity-testnet.parity.io/address/${oracleAddress}\n`);

    // 3. Deploy RemittanceVault
    console.log("[3/6] Deploying RemittanceVault...");
    const RemittanceVault = await loadArtifact('RemittanceVault');
    const vaultFactory = new ethers.ContractFactory(RemittanceVault.abi, RemittanceVault.bytecode, wallet);
    const vault = await vaultFactory.deploy();
    await vault.waitForDeployment();
    const vaultAddress = await vault.getAddress();
    deployedContracts.RemittanceVault = vaultAddress;
    console.log("✓ RemittanceVault deployed:", vaultAddress);
    console.log(`  Explorer: https://blockscout-passet-hub.parity-testnet.parity.io/address/${vaultAddress}\n`);

    // Configure RemittanceVault
    console.log("Configuring RemittanceVault oracle...");
    const setOracleTx = await vault.setOracle(oracleAddress);
    await setOracleTx.wait();
    console.log("✓ Oracle configured\n");

    // 4. Deploy SavingsPool
    console.log("[4/6] Deploying SavingsPool...");
    const SavingsPool = await loadArtifact('SavingsPool');
    const savingsFactory = new ethers.ContractFactory(SavingsPool.abi, SavingsPool.bytecode, wallet);
    const savingsPool = await savingsFactory.deploy();
    await savingsPool.waitForDeployment();
    const savingsPoolAddress = await savingsPool.getAddress();
    deployedContracts.SavingsPool = savingsPoolAddress;
    console.log("✓ SavingsPool deployed:", savingsPoolAddress);
    console.log(`  Explorer: https://blockscout-passet-hub.parity-testnet.parity.io/address/${savingsPoolAddress}\n`);

    // 5. Deploy MicroloanManager
    console.log("[5/6] Deploying MicroloanManager...");
    const MicroloanManager = await loadArtifact('MicroloanManager');
    const loanFactory = new ethers.ContractFactory(MicroloanManager.abi, MicroloanManager.bytecode, wallet);
    const loanManager = await loanFactory.deploy();
    await loanManager.waitForDeployment();
    const loanManagerAddress = await loanManager.getAddress();
    deployedContracts.MicroloanManager = loanManagerAddress;
    console.log("✓ MicroloanManager deployed:", loanManagerAddress);
    console.log(`  Explorer: https://blockscout-passet-hub.parity-testnet.parity.io/address/${loanManagerAddress}\n`);

    // Configure MicroloanManager
    console.log("Configuring MicroloanManager registry...");
    const setRegistryTx = await loanManager.setUserRegistry(userRegistryAddress);
    await setRegistryTx.wait();
    console.log("✓ User registry configured\n");

    // 6. Deploy PaymentNetworks
    console.log("[6/6] Deploying PaymentNetworks...");
    const PaymentNetworks = await loadArtifact('PaymentNetworks');
    const paymentFactory = new ethers.ContractFactory(PaymentNetworks.abi, PaymentNetworks.bytecode, wallet);
    const paymentNetworks = await paymentFactory.deploy();
    await paymentNetworks.waitForDeployment();
    const paymentNetworksAddress = await paymentNetworks.getAddress();
    deployedContracts.PaymentNetworks = paymentNetworksAddress;
    console.log("✓ PaymentNetworks deployed:", paymentNetworksAddress);
    console.log(`  Explorer: https://blockscout-passet-hub.parity-testnet.parity.io/address/${paymentNetworksAddress}\n`);

    // Save deployment info
    const deploymentsDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentData = {
      network: "Polkadot Paseo Asset Hub",
      chainId: 420420422,
      timestamp: new Date().toISOString(),
      deployer: wallet.address,
      contracts: deployedContracts
    };

    fs.writeFileSync(
      path.join(deploymentsDir, 'paseo-deployment.json'),
      JSON.stringify(deploymentData, null, 2)
    );

    // Update .env.local
    let envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');

    const addressLines = [
      `\n# Deployed Contract Addresses (Polkadot Paseo Asset Hub)`,
      `USER_REGISTRY_ADDRESS=${deployedContracts.UserRegistry}`,
      `EXCHANGE_RATE_ORACLE_ADDRESS=${deployedContracts.ExchangeRateOracle}`,
      `REMITTANCE_VAULT_ADDRESS=${deployedContracts.RemittanceVault}`,
      `SAVINGS_POOL_ADDRESS=${deployedContracts.SavingsPool}`,
      `MICROLOAN_MANAGER_ADDRESS=${deployedContracts.MicroloanManager}`,
      `PAYMENT_NETWORKS_ADDRESS=${deployedContracts.PaymentNetworks}`
    ].join('\n');

    // Remove old addresses if exist
    envContent = envContent.replace(/\n# Deployed Contract Addresses[\s\S]*?(?=\n[A-Z_]+=[^\n]*|$)/g, '');

    fs.writeFileSync(
      path.join(__dirname, '..', '.env.local'),
      envContent + addressLines
    );

    console.log("\n" + "=".repeat(70));
    console.log("DEPLOYMENT SUCCESSFUL!");
    console.log("=".repeat(70));
    console.log("\nDeployed Contracts:");
    Object.entries(deployedContracts).forEach(([name, address]) => {
      console.log(`  ${name.padEnd(20)} ${address}`);
    });
    console.log("\nDeployment data saved to: deployments/paseo-deployment.json");
    console.log("Environment variables updated in .env.local");
    console.log("\nView all contracts on explorer:");
    console.log("https://blockscout-passet-hub.parity-testnet.parity.io\n");

  } catch (error) {
    console.error("\n❌ DEPLOYMENT FAILED");
    console.error("Error:", error.message);
    if (error.transaction) {
      console.error("Transaction:", error.transaction);
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
