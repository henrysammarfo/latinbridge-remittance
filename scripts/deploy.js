const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting LatinBridge contract deployment to Polkadot Paseo testnet...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "PAS\n");

  const deployedContracts = {};

  // Deploy UserRegistry
  console.log("Deploying UserRegistry...");
  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy();
  await userRegistry.waitForDeployment();
  const userRegistryAddress = await userRegistry.getAddress();
  deployedContracts.UserRegistry = userRegistryAddress;
  console.log("UserRegistry deployed to:", userRegistryAddress, "\n");

  // Deploy ExchangeRateOracle
  console.log("Deploying ExchangeRateOracle...");
  const ExchangeRateOracle = await hre.ethers.getContractFactory("ExchangeRateOracle");
  const oracle = await ExchangeRateOracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  deployedContracts.ExchangeRateOracle = oracleAddress;
  console.log("ExchangeRateOracle deployed to:", oracleAddress, "\n");

  // Deploy RemittanceVault
  console.log("Deploying RemittanceVault...");
  const RemittanceVault = await hre.ethers.getContractFactory("RemittanceVault");
  const vault = await RemittanceVault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  deployedContracts.RemittanceVault = vaultAddress;
  console.log("RemittanceVault deployed to:", vaultAddress, "\n");

  // Set oracle in vault
  console.log("Setting oracle address in RemittanceVault...");
  const setOracleTx = await vault.setOracle(oracleAddress);
  await setOracleTx.wait();
  console.log("Oracle address set successfully\n");

  // Deploy SavingsPool
  console.log("Deploying SavingsPool...");
  const SavingsPool = await hre.ethers.getContractFactory("SavingsPool");
  const savingsPool = await SavingsPool.deploy();
  await savingsPool.waitForDeployment();
  const savingsPoolAddress = await savingsPool.getAddress();
  deployedContracts.SavingsPool = savingsPoolAddress;
  console.log("SavingsPool deployed to:", savingsPoolAddress, "\n");

  // Deploy MicroloanManager
  console.log("Deploying MicroloanManager...");
  const MicroloanManager = await hre.ethers.getContractFactory("MicroloanManager");
  const loanManager = await MicroloanManager.deploy();
  await loanManager.waitForDeployment();
  const loanManagerAddress = await loanManager.getAddress();
  deployedContracts.MicroloanManager = loanManagerAddress;
  console.log("MicroloanManager deployed to:", loanManagerAddress, "\n");

  // Set user registry in loan manager
  console.log("Setting user registry in MicroloanManager...");
  const setRegistryTx = await loanManager.setUserRegistry(userRegistryAddress);
  await setRegistryTx.wait();
  console.log("User registry set successfully\n");

  // Deploy PaymentNetworks
  console.log("Deploying PaymentNetworks...");
  const PaymentNetworks = await hre.ethers.getContractFactory("PaymentNetworks");
  const paymentNetworks = await PaymentNetworks.deploy();
  await paymentNetworks.waitForDeployment();
  const paymentNetworksAddress = await paymentNetworks.getAddress();
  deployedContracts.PaymentNetworks = paymentNetworksAddress;
  console.log("PaymentNetworks deployed to:", paymentNetworksAddress, "\n");

  // Save deployment info
  const deploymentInfo = {
    network: "Polkadot Paseo Testnet",
    chainId: 420420422,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: deployedContracts,
    blockExplorer: "https://blockscout-passet-hub.parity-testnet.parity.io"
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFilePath = path.join(deploymentsDir, "passetHub.json");
  fs.writeFileSync(deploymentFilePath, JSON.stringify(deploymentInfo, null, 2));

  console.log("=".repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", deploymentInfo.network);
  console.log("Chain ID:", deploymentInfo.chainId);
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("\nDeployed Contracts:");
  for (const [name, address] of Object.entries(deployedContracts)) {
    console.log(`  ${name}: ${address}`);
    console.log(`    View on explorer: ${deploymentInfo.blockExplorer}/address/${address}`);
  }
  console.log("\nDeployment info saved to:", deploymentFilePath);
  console.log("=".repeat(60));

  // Update .env.local with contract addresses
  const envPath = path.join(__dirname, "..", ".env.local");
  let envContent = fs.readFileSync(envPath, "utf8");

  envContent = envContent.replace(/CONTRACT_REMITTANCE_VAULT=.*/,  `CONTRACT_REMITTANCE_VAULT=${vaultAddress}`);
  envContent = envContent.replace(/CONTRACT_USER_REGISTRY=.*/, `CONTRACT_USER_REGISTRY=${userRegistryAddress}`);
  envContent = envContent.replace(/CONTRACT_EXCHANGE_RATE_ORACLE=.*/, `CONTRACT_EXCHANGE_RATE_ORACLE=${oracleAddress}`);
  envContent = envContent.replace(/CONTRACT_SAVINGS_POOL=.*/, `CONTRACT_SAVINGS_POOL=${savingsPoolAddress}`);
  envContent = envContent.replace(/CONTRACT_MICROLOAN_MANAGER=.*/, `CONTRACT_MICROLOAN_MANAGER=${loanManagerAddress}`);
  envContent = envContent.replace(/CONTRACT_PAYMENT_NETWORKS=.*/, `CONTRACT_PAYMENT_NETWORKS=${paymentNetworksAddress}`);

  fs.writeFileSync(envPath, envContent);
  console.log("\n.env.local updated with contract addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
