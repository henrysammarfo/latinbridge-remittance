// Compile Solidity contracts to PolkaVM bytecode using resolc
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const contractsDir = path.join(__dirname, '..', 'contracts');
const artifactsDir = path.join(__dirname, '..', 'artifacts-polkavm');

// Create artifacts directory
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

const contracts = [
  'UserRegistry.sol',
  'ExchangeRateOracle.sol',
  'RemittanceVault.sol',
  'SavingsPool.sol',
  'MicroloanManager.sol',
  'PaymentNetworks.sol'
];

console.log('Compiling contracts to PolkaVM bytecode using resolc...\n');

contracts.forEach((contractFile, index) => {
  console.log(`[${index + 1}/${contracts.length}] Compiling ${contractFile}...`);

  const contractPath = path.join(contractsDir, contractFile);
  const contractName = contractFile.replace('.sol', '');
  const outputDir = path.join(artifactsDir, contractName);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Use npx to run resolc without installing it permanently
    const command = `npx --yes @parity/resolc@0.2.0 ${contractPath} --output-dir ${outputDir} --bin --abi`;

    console.log(`  Running: ${command}`);
    execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });

    console.log(`  ✓ ${contractName} compiled successfully\n`);
  } catch (error) {
    console.error(`  ✗ Failed to compile ${contractName}`);
    console.error(`  Error: ${error.message}\n`);
    process.exit(1);
  }
});

console.log('All contracts compiled successfully to PolkaVM bytecode!');
console.log(`Artifacts saved to: ${artifactsDir}`);
