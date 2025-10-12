// Verify deployed contracts on Polkadot Paseo Asset Hub
const ethers = require('ethers');
require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log("\n" + "=".repeat(80));
  console.log("  Verifying Deployed Contracts on Polkadot Paseo Asset Hub");
  console.log("=".repeat(80) + "\n");

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const contracts = {
    "UserRegistry": process.env.USER_REGISTRY_ADDRESS,
    "ExchangeRateOracle": process.env.EXCHANGE_RATE_ORACLE_ADDRESS,
    "RemittanceVault": process.env.REMITTANCE_VAULT_ADDRESS,
    "SavingsPool": process.env.SAVINGS_POOL_ADDRESS,
    "MicroloanManager": process.env.MICROLOAN_MANAGER_ADDRESS,
  };

  console.log("Network:", process.env.RPC_URL);
  console.log("Chain ID:", process.env.CHAIN_ID);
  console.log("\n" + "─".repeat(80));

  for (const [name, address] of Object.entries(contracts)) {
    if (!address) {
      console.log(`\n❌ ${name}: No address found`);
      continue;
    }

    try {
      const code = await provider.getCode(address);
      const isDeployed = code !== '0x';

      if (isDeployed) {
        const codeSize = (code.length - 2) / 2; // Remove '0x' and convert to bytes
        console.log(`\n✅ ${name}`);
        console.log(`   Address: ${address}`);
        console.log(`   Bytecode Size: ${codeSize.toLocaleString()} bytes`);
        console.log(`   Explorer: https://blockscout-passet-hub.parity-testnet.parity.io/address/${address}`);
      } else {
        console.log(`\n❌ ${name}: Contract not found at ${address}`);
      }
    } catch (error) {
      console.log(`\n❌ ${name}: Error verifying - ${error.message}`);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("  Verification Complete");
  console.log("=".repeat(80) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
