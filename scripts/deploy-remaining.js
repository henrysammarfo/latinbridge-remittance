// Deploy the remaining PaymentNetworks contract
const ethers = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function loadPolkaVMArtifact(contractName) {
  const artifactDir = path.join(__dirname, '..', 'artifacts-polkavm', contractName);
  const abiPath = path.join(artifactDir, `contracts_${contractName}_sol_${contractName}.abi`);
  const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
  const polkavmPath = path.join(artifactDir, `contracts_${contractName}_sol_${contractName}.polkavm`);
  const bytecode = '0x' + fs.readFileSync(polkavmPath, 'hex');
  return { abi, bytecode };
}

async function main() {
  console.log("\n🚀 Deploying remaining PaymentNetworks contract...\n");

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Network:", process.env.RPC_URL);
  console.log("Deployer:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "PAS\n");

  // Already deployed contracts
  const deployedContracts = {
    UserRegistry: "0xfba199c705761D98aD1cD98c34C0d544e39c1984",
    ExchangeRateOracle: "0x8c73284b55cb55EB46Dd42617bA6213037e602e9",
    RemittanceVault: "0x24d591Aa216E5466D5381139bc8feC2A91e707DB",
    SavingsPool: "0xfD2CFC86e06c54d1ffe9B503391d91452a8Fd02D",
    MicroloanManager: "0x2ABa80F8931d52DEE8e6732d213eabe795535660"
  };

  try {
    // Deploy PaymentNetworks
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

    // Save complete deployment info
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

    envContent = envContent.replace(/\n# Deployed Contract Addresses[\s\S]*?(?=\n[A-Z_]+=[^\n]*|$)/g, '');
    fs.writeFileSync(path.join(__dirname, '..', '.env.local'), envContent + addressLines);

    console.log("\n" + "=".repeat(80));
    console.log("  🎉 ALL 6 CONTRACTS DEPLOYED SUCCESSFULLY! 🎉");
    console.log("=".repeat(80));
    console.log("\n📋 Complete Contract Deployment:");
    console.log("━".repeat(80));
    Object.entries(deployedContracts).forEach(([name, address]) => {
      console.log(`  ${name.padEnd(22)} ${address}`);
    });
    console.log("━".repeat(80));
    console.log("\n💾 Deployment data: deployments/paseo-polkavm-deployment.json");
    console.log("🔧 Environment updated: .env.local");
    console.log("🔍 Block explorer: https://blockscout-passet-hub.parity-testnet.parity.io");
    console.log("\n" + "=".repeat(80) + "\n");

  } catch (error) {
    console.error("\n❌ DEPLOYMENT FAILED");
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
