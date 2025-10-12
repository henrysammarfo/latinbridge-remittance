// Deploy PolkaVM contracts to Polkadot Paseo in dependency order
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
  console.log("  LatinBridge - Ordered Deployment to Polkadot Paseo Asset Hub");
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
    // STEP 1: Deploy UserRegistry (no dependencies)
    console.log("━".repeat(80));
    console.log("[1/5] Deploying UserRegistry");
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

    // STEP 2: Deploy RemittanceVault (no dependencies)
    console.log("━".repeat(80));
    console.log("[2/5] Deploying RemittanceVault");
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

    // STEP 3: Deploy ExchangeRateOracle (no dependencies)
    console.log("━".repeat(80));
    console.log("[3/5] Deploying ExchangeRateOracle");
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

    // Configure RemittanceVault with Oracle
    console.log("⚙️  Configuring RemittanceVault with Oracle address...");
    const setOracleTx = await vault.setOracle(oracleAddress);
    await setOracleTx.wait();
    console.log("✅ RemittanceVault.setOracle() configured\n");

    // STEP 4: Deploy SavingsPool (depends on RemittanceVault)
    console.log("━".repeat(80));
    console.log("[4/5] Deploying SavingsPool");
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

    // Note: SavingsPool doesn't currently have a setter for RemittanceVault
    // This would need to be added to the contract if integration is required

    // STEP 5: Deploy MicroloanManager (depends on RemittanceVault + UserRegistry)
    console.log("━".repeat(80));
    console.log("[5/5] Deploying MicroloanManager");
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

    // Configure MicroloanManager with UserRegistry
    console.log("⚙️  Configuring MicroloanManager with UserRegistry address...");
    const setRegistryTx = await loanManager.setUserRegistry(userRegistryAddress);
    await setRegistryTx.wait();
    console.log("✅ MicroloanManager.setUserRegistry() configured\n");

    // Note: MicroloanManager doesn't currently have a setter for RemittanceVault
    // This would need to be added to the contract if integration is required

    // Save deployment info
    const deploymentsDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentData = {
      network: "Polkadot Paseo Asset Hub",
      chainId: 420420422,
      compiler: "resolc v0.2.0 (PolkaVM)",
      deploymentType: "Ordered Deployment",
      timestamp: new Date().toISOString(),
      deployer: wallet.address,
      contracts: deployedContracts,
      explorer: "https://blockscout-passet-hub.parity-testnet.parity.io",
      notes: "Deployed in dependency order: UserRegistry → RemittanceVault → ExchangeRateOracle → SavingsPool → MicroloanManager"
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    fs.writeFileSync(
      path.join(deploymentsDir, `paseo-ordered-${timestamp}.json`),
      JSON.stringify(deploymentData, null, 2)
    );

    // Update .env.local
    let envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');

    // Remove old contract addresses section
    const addressPattern = /# Deployed Contract Addresses[\s\S]*?(?=\n(?:[A-Z_]+=(?![^\n]*ADDRESS)|$))/;
    envContent = envContent.replace(addressPattern, '');

    const addressLines = [
      '\n# Deployed Contract Addresses (Polkadot Paseo Asset Hub - PolkaVM)',
      `USER_REGISTRY_ADDRESS=${deployedContracts.UserRegistry}`,
      `EXCHANGE_RATE_ORACLE_ADDRESS=${deployedContracts.ExchangeRateOracle}`,
      `REMITTANCE_VAULT_ADDRESS=${deployedContracts.RemittanceVault}`,
      `SAVINGS_POOL_ADDRESS=${deployedContracts.SavingsPool}`,
      `MICROLOAN_MANAGER_ADDRESS=${deployedContracts.MicroloanManager}`,
      `PAYMENT_NETWORKS_ADDRESS=`
    ].join('\n');

    // Trim trailing whitespace and append new addresses
    envContent = envContent.trim();
    fs.writeFileSync(
      path.join(__dirname, '..', '.env.local'),
      envContent + '\n' + addressLines + '\n'
    );

    console.log("\n" + "=".repeat(80));
    console.log("  🎉 ORDERED DEPLOYMENT SUCCESSFUL! 🎉");
    console.log("=".repeat(80));
    console.log("\n📋 Deployed Contracts (in order):");
    console.log("━".repeat(80));
    console.log(`  1. UserRegistry        ${deployedContracts.UserRegistry}`);
    console.log(`  2. RemittanceVault     ${deployedContracts.RemittanceVault}`);
    console.log(`  3. ExchangeRateOracle  ${deployedContracts.ExchangeRateOracle}`);
    console.log(`  4. SavingsPool         ${deployedContracts.SavingsPool}`);
    console.log(`  5. MicroloanManager    ${deployedContracts.MicroloanManager}`);
    console.log("━".repeat(80));
    console.log("\n🔗 Contract Configurations:");
    console.log("  • RemittanceVault.oracle = ExchangeRateOracle ✓");
    console.log("  • MicroloanManager.userRegistry = UserRegistry ✓");
    console.log("\n💾 Deployment data saved to: deployments/paseo-ordered-" + timestamp + ".json");
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
    if (error.stack) {
      console.error("\nStack trace:", error.stack);
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
