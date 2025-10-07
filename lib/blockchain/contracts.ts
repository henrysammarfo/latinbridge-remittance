/**
 * Contract interaction utilities
 */
import { ethers } from 'ethers';
import RemittanceVaultABI from './abis/RemittanceVault.json';
import UserRegistryABI from './abis/UserRegistry.json';
import ExchangeRateOracleABI from './abis/ExchangeRateOracle.json';
import SavingsPoolABI from './abis/SavingsPool.json';
import MicroloanManagerABI from './abis/MicroloanManager.json';
import PaymentNetworksABI from './abis/PaymentNetworks.json';

// Contract addresses from environment
export const CONTRACT_ADDRESSES = {
  RemittanceVault: process.env.CONTRACT_REMITTANCE_VAULT || '',
  UserRegistry: process.env.CONTRACT_USER_REGISTRY || '',
  ExchangeRateOracle: process.env.CONTRACT_EXCHANGE_RATE_ORACLE || '',
  SavingsPool: process.env.CONTRACT_SAVINGS_POOL || '',
  MicroloanManager: process.env.CONTRACT_MICROLOAN_MANAGER || '',
  PaymentNetworks: process.env.CONTRACT_PAYMENT_NETWORKS || '',
};

// Get provider
export function getProvider(): ethers.JsonRpcProvider {
  const rpcUrl = process.env.RPC_URL || 'https://testnet-passet-hub-eth-rpc.polkadot.io';
  return new ethers.JsonRpcProvider(rpcUrl);
}

// Get signer from private key (backend only)
export function getSigner(): ethers.Wallet {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Private key not configured');
  }
  const provider = getProvider();
  return new ethers.Wallet(privateKey, provider);
}

// Get contract instances
export function getRemittanceVault(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const addressOrSigner = signerOrProvider || getProvider();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.RemittanceVault,
    RemittanceVaultABI,
    addressOrSigner
  );
}

export function getUserRegistry(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const addressOrSigner = signerOrProvider || getProvider();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.UserRegistry,
    UserRegistryABI,
    addressOrSigner
  );
}

export function getExchangeRateOracle(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const addressOrSigner = signerOrProvider || getProvider();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.ExchangeRateOracle,
    ExchangeRateOracleABI,
    addressOrSigner
  );
}

export function getSavingsPool(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const addressOrSigner = signerOrProvider || getProvider();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.SavingsPool,
    SavingsPoolABI,
    addressOrSigner
  );
}

export function getMicroloanManager(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const addressOrSigner = signerOrProvider || getProvider();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.MicroloanManager,
    MicroloanManagerABI,
    addressOrSigner
  );
}

export function getPaymentNetworks(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const addressOrSigner = signerOrProvider || getProvider();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.PaymentNetworks,
    PaymentNetworksABI,
    addressOrSigner
  );
}

// Currency enum mapping
export enum Currency {
  USD = 0,
  MXN = 1,
  BRL = 2,
  ARS = 3,
  COP = 4,
  GTQ = 5,
}

export function currencyNameToEnum(name: string): Currency {
  const mapping: Record<string, Currency> = {
    USD: Currency.USD,
    MXN: Currency.MXN,
    BRL: Currency.BRL,
    ARS: Currency.ARS,
    COP: Currency.COP,
    GTQ: Currency.GTQ,
  };
  return mapping[name.toUpperCase()] ?? Currency.USD;
}

export function currencyEnumToName(value: number): string {
  const mapping: Record<number, string> = {
    [Currency.USD]: 'USD',
    [Currency.MXN]: 'MXN',
    [Currency.BRL]: 'BRL',
    [Currency.ARS]: 'ARS',
    [Currency.COP]: 'COP',
    [Currency.GTQ]: 'GTQ',
  };
  return mapping[value] || 'USD';
}

// Utility functions
export function parseUnits(value: string, decimals: number = 18): bigint {
  return ethers.parseUnits(value, decimals);
}

export function formatUnits(value: bigint, decimals: number = 18): string {
  return ethers.formatUnits(value, decimals);
}

export function isAddress(address: string): boolean {
  return ethers.isAddress(address);
}
