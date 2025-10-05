// Deploy PolkaVM-compiled contracts to Polkadot Paseo testnet
const ethers = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function loadPolkaVMArtifact(contractName) {
  const artifactDir = path.join(__dirname, '..', 'artifacts-polkavm', contractName);

  // Read ABI (resolc naming format)
  const abiPath = path.join(artifactDir, `contracts_${contractName}_sol_${contractName}.abi`);
  const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

  // Read PolkaVM bytecode (resolc naming format)
  const polkavmPath = path.join(artifactDir, `contracts_${contractName}_sol_${contractName}.polkavm`);
  const bytecode = '0x' + fs.readFileSync(polkavmPath, 'hex');

  return { abi, bytecode };
}

async function main() {
  console.log("\n" + "=".repeat(80));
  console.log("  LatinBridge Deployment to Polkadot Paseo Asset Hub (PolkaVM)");
  console.log("=".repeat(80) + "\n");

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Network:", process.env.RPC_URL);
  console.log("Chain ID: 420420422 (Polkadot Paseo Asset Hub)");
  console.log("Deployer:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "PAS\n");

  if (parseFloat(ethers.formatEther(balance)) < 0.1) {
    console.error("❌ Insufficient balance! Need at least 0.1 PAS for deployment.");
    console.log("Get test tokens from: https://faucet.polkadot.io/?parachain=1111\n");
    process.exit(1);
  }

  const deployedContracts = {};

  try {
    // 1. Deploy UserRegistry
    console.log("━".repeat(80));
    console.log("[1/6] Deploying UserRegistry");
    console.log("━".repeat(80));
    const UserRegistry = await loadPolkaVMArtifact('UserRegistry');
    console.log("PolkaVM Bytecode size:", (UserRegistry.bytecode.length - 2) / 2, "bytes");

    const userRegistryFactory = new ethers.ContractFactory(UserRegistry.abi, UserRegistry.bytecode, wallet);
    const userRegistry = await userRegistryFactory.deploy();
    console.log("Transaction hash:", userRegistry.deploymentTransaction().hash);
    await userRegistry.waitForDeployment();
    const userRegistryAddress = await userRegistry.getAddress();
    deployedContracts.UserRegistry = userRegistryAddress;
    console.log("✅ UserRegistry deployed:", userRegistryAddress);
    console.log("   Explorer:", `https://blockscout-passet-hub.parity-testnet.parity.io/address/${userRegistryAddress}\n`);

    // 2. Deploy ExchangeRateOracle
    console.log("━".repeat(80));
    console.log("[2/6] Deploying ExchangeRateOracle");
    console.log("━".repeat(80));
    const ExchangeRateOracle = await loadPolkaVMArtifact('ExchangeRateOracle');
    console.log("PolkaVM Bytecode size:", (ExchangeRateOracle.bytecode.length - 2) / 2, "bytes");

    const oracleFactory = new ethers.ContractFactory(ExchangeRateOracle.abi, ExchangeRateOracle.bytecode, wallet);
    const oracle = await oracleFactory.deploy();
    console.log("Transaction hash:", oracle.deploymentTransaction().hash);
    await oracle.waitForDeployment();
    const oracleAddress = await oracle.getAddress();
    deployedContracts.ExchangeRateOracle = oracleAddress;
    console.log("✅ ExchangeRateOracle deployed:", oracleAddress);
    console.log("   Explorer:", `https://blockscout-passet-hub.parity-testnet.parity.io/address/${oracleAddress}\n`);

    // 3. Deploy RemittanceVault
    console.log("━".repeat(80));
    console.log("[3/6] Deploying RemittanceVault");
    console.log("━".repeat(80));
    const RemittanceVault = await loadPolkaVMArtifact('RemittanceVault');
    console.log("PolkaVM Bytecode size:", (RemittanceVault.bytecode.length - 2) / 2, "bytes");

    const vaultFactory = new ethers.ContractFactory(RemittanceVault.abi, RemittanceVault.bytecode, wallet);
    const vault = await vaultFactory.deploy();
    console.log("Transaction hash:", vault.deploymentTransaction().hash);
    await vault.waitForDeployment();
    const vaultAddress = await vault.getAddress();
    deployedContracts.RemittanceVault = vaultAddress;
    console.log("✅ RemittanceVault deployed:", vaultAddress);
    console.log("   Explorer:", `https://blockscout-passet-hub.parity-testnet.parity.io/address/${vaultAddress}\n`);

    // Configure RemittanceVault
    console.log("⚙️  Configuring RemittanceVault oracle...");
    const setOracleTx = await vault.setOracle(oracleAddress);
    await setOracleTx.wait();
    console.log("✅ Oracle configured\n");

    // 4. Deploy SavingsPool
    console.log("━".repeat(80));
    console.log("[4/6] Deploying SavingsPool");
    console.log("━".repeat(80));
    const SavingsPool = await loadPolkaVMArtifact('SavingsPool');
    console.log("PolkaVM Bytecode size:", (SavingsPool.bytecode.length - 2) / 2, "bytes");

    const savingsFactory = new ethers.ContractFactory(SavingsPool.abi, SavingsPool.bytecode, wallet);
    const savingsPool = await savingsFactory.deploy();
    console.log("Transaction hash:", savingsPool.deploymentTransaction().hash);
    await savingsPool.waitForDeployment();
    const savingsPoolAddress = await savingsPool.getAddress();
    deployedContracts.SavingsPool = savingsPoolAddress;
    console.log("✅ SavingsPool deployed:", savingsPoolAddress);
    console.log("   Explorer:", `https://blockscout-passet-hub.parity-testnet.parity.io/address/${savingsPoolAddress}\n`);

    // 5. Deploy MicroloanManager
    console.log("━".repeat(80));
    console.log("[5/6] Deploying MicroloanManager");
    console.log("━".repeat(80));
    const MicroloanManager = await loadPolkaVMArtifact('MicroloanManager');
    console.log("PolkaVM Bytecode size:", (MicroloanManager.bytecode.length - 2) / 2, "bytes");

    const loanFactory = new ethers.ContractFactory(MicroloanManager.abi, MicroloanManager.bytecode, wallet);
    const loanManager = await loanFactory.deploy();
    console.log("Transaction hash:", loanManager.deploymentTransaction().hash);
    await loanManager.waitForDeployment();
    const loanManagerAddress = await loanManager.getAddress();
    deployedContracts.MicroloanManager = loanManagerAddress;
    console.log("✅ MicroloanManager deployed:", loanManagerAddress);
    console.log("   Explorer:", `https://blockscout-passet-hub.parity-testnet.parity.io/address/${loanManagerAddress}\n`);

    // Configure MicroloanManager
    console.log("⚙️  Configuring MicroloanManager registry...");
    const setRegistryTx = await loanManager.setUserRegistry(userRegistryAddress);
    await setRegistryTx.wait();
    console.log("✅ User registry configured\n");

    // 6. Deploy PaymentNetworks
    console.log("━".repeat(80));
    console.log("[6/6] Deploying PaymentNetworks");
    console.log("━".repeat(80));
    const PaymentNetworks = await loadPolkaVMArtifact('PaymentNetworks');
    console.log("PolkaVM Bytecode size:", (PaymentNetworks.bytecode.length - 2) / 2, "bytes");

    const paymentFactory = new ethers.ContractFactory(PaymentNetworks.abi, PaymentNetworks.bytecode, wallet);
    const paymentNetworks = await paymentFactory.deploy();
    console.log("Transaction hash:", paymentNetworks.deploymentTransaction().hash);
    await paymentNetworks.waitForDeployment();
    const paymentNetworksAddress = await paymentNetworks.getAddress();
    deployedContracts.PaymentNetworks = paymentNetworksAddress;
    console.log("✅ PaymentNetworks deployed:", paymentNetworksAddress);
    console.log("   Explorer:", `https://blockscout-passet-hub.parity-testnet.parity.io/address/${paymentNetworksAddress}\n`);

    // Save deployment info
    const deploymentsDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentData = {
      network: "Polkadot Paseo Asset Hub",
      chainId: 420420422,
      compiler: "resolc (PolkaVM)",
      timestamp: new Date().toISOString(),
      deployer: wallet.address,
      contracts: deployedContracts,
      explorer: "https://blockscout-passet-hub.parity-testnet.parity.io"
    };

    fs.writeFileSync(
      path.join(deploymentsDir, 'paseo-polkavm-deployment.json'),
      JSON.stringify(deploymentData, null, 2)
    );

    // Update .env.local
    let envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');

    const addressLines = [
      `\n# Deployed Contract Addresses (Polkadot Paseo Asset Hub - PolkaVM)`,
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

    console.log("\n" + "=".repeat(80));
    console.log("  🎉 DEPLOYMENT SUCCESSFUL! 🎉");
    console.log("=".repeat(80));
    console.log("\n📋 Deployed Contracts:");
    console.log("━".repeat(80));
    Object.entries(deployedContracts).forEach(([name, address]) => {
      console.log(`  ${name.padEnd(22)} ${address}`);
    });
    console.log("━".repeat(80));
    console.log("\n💾 Deployment data saved to: deployments/paseo-polkavm-deployment.json");
    console.log("🔧 Environment variables updated in .env.local");
    console.log("\n🔍 View all contracts on block explorer:");
    console.log("   https://blockscout-passet-hub.parity-testnet.parity.io");
    console.log("\n" + "=".repeat(80) + "\n");

  } catch (error) {
    console.error("\n" + "=".repeat(80));
    console.error("  ❌ DEPLOYMENT FAILED");
    console.error("=".repeat(80));
    console.error("\nError:", error.message);
    if (error.transaction) {
      console.error("Transaction:", error.transaction);
    }
    if (error.receipt) {
      console.error("Receipt:", error.receipt);
    }
    console.error("\n" + "=".repeat(80) + "\n");
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
