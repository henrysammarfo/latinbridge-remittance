'use client'

import { useAccount } from 'wagmi'
import UserRegistryABI from '@/lib/blockchain/abis/UserRegistry.json'
import ExchangeRateOracleABI from '@/lib/blockchain/abis/ExchangeRateOracle.json'
import RemittanceVaultABI from '@/lib/blockchain/abis/RemittanceVault.json'
import SavingsPoolABI from '@/lib/blockchain/abis/SavingsPool.json'
import MicroloanManagerABI from '@/lib/blockchain/abis/MicroloanManager.json'
import PaymentNetworksABI from '@/lib/blockchain/abis/PaymentNetworks.json'

// Contract addresses from environment
export const CONTRACT_ADDRESSES = {
  userRegistry: process.env.NEXT_PUBLIC_USER_REGISTRY as `0x${string}`,
  exchangeRateOracle: process.env.NEXT_PUBLIC_EXCHANGE_RATE_ORACLE as `0x${string}`,
  remittanceVault: process.env.NEXT_PUBLIC_REMITTANCE_VAULT as `0x${string}`,
  savingsPool: process.env.NEXT_PUBLIC_SAVINGS_POOL as `0x${string}`,
  microloanManager: process.env.NEXT_PUBLIC_MICROLOAN_MANAGER as `0x${string}`,
  paymentNetworks: process.env.NEXT_PUBLIC_PAYMENT_NETWORKS as `0x${string}`,
}

// Export ABIs
export const ABIS = {
  userRegistry: UserRegistryABI,
  exchangeRateOracle: ExchangeRateOracleABI,
  remittanceVault: RemittanceVaultABI,
  savingsPool: SavingsPoolABI,
  microloanManager: MicroloanManagerABI,
  paymentNetworks: PaymentNetworksABI,
}

// Currency enum mapping (matches Solidity enum)
export enum Currency {
  USD = 0,
  MXN = 1,
  BRL = 2,
  ARS = 3,
  COP = 4,
  GTQ = 5,
}

export const CURRENCY_SYMBOLS = {
  [Currency.USD]: 'USD',
  [Currency.MXN]: 'MXN',
  [Currency.BRL]: 'BRL',
  [Currency.ARS]: 'ARS',
  [Currency.COP]: 'COP',
  [Currency.GTQ]: 'GTQ',
}

export const CURRENCY_NAMES = {
  [Currency.USD]: 'US Dollar',
  [Currency.MXN]: 'Mexican Peso',
  [Currency.BRL]: 'Brazilian Real',
  [Currency.ARS]: 'Argentine Peso',
  [Currency.COP]: 'Colombian Peso',
  [Currency.GTQ]: 'Guatemalan Quetzal',
}

// KYC Level enum (matches Solidity enum)
export enum KYCLevel {
  None = 0,
  Basic = 1,
  Enhanced = 2,
  Premium = 3,
}

export const KYC_LIMITS = {
  [KYCLevel.None]: 0,
  [KYCLevel.Basic]: 1000,
  [KYCLevel.Enhanced]: 10000,
  [KYCLevel.Premium]: 50000,
}

/**
 * Hook to get contract configurations
 */
export function useContracts() {
  const { address, isConnected } = useAccount()

  return {
    address,
    isConnected,
    contracts: {
      userRegistry: {
        address: CONTRACT_ADDRESSES.userRegistry,
        abi: ABIS.userRegistry,
      },
      exchangeRateOracle: {
        address: CONTRACT_ADDRESSES.exchangeRateOracle,
        abi: ABIS.exchangeRateOracle,
      },
      remittanceVault: {
        address: CONTRACT_ADDRESSES.remittanceVault,
        abi: ABIS.remittanceVault,
      },
      savingsPool: {
        address: CONTRACT_ADDRESSES.savingsPool,
        abi: ABIS.savingsPool,
      },
      microloanManager: {
        address: CONTRACT_ADDRESSES.microloanManager,
        abi: ABIS.microloanManager,
      },
      paymentNetworks: {
        address: CONTRACT_ADDRESSES.paymentNetworks,
        abi: ABIS.paymentNetworks,
      },
    },
  }
}
