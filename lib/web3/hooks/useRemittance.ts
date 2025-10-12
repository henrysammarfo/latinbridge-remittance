'use client'

import { useAccount, useReadContract, useWriteContract, useBalance } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { CONTRACT_ADDRESSES, ABIS, Currency } from './useContracts'

export function useRemittance() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  // Get PAS balance (native token)
  const { data: pasBalance } = useBalance({
    address,
  })

  /**
   * Get balance for a specific currency
   */
  const useBalanceOf = (currency: Currency) => {
    const { data: balance, isLoading, refetch } = useReadContract({
      address: CONTRACT_ADDRESSES.remittanceVault,
      abi: ABIS.remittanceVault,
      functionName: 'getBalance',
      args: address ? [address, currency] : undefined,
      query: {
        enabled: !!address,
      },
    })

    return {
      balance: balance ? formatUnits(balance as bigint, 18) : '0',
      balanceRaw: balance as bigint,
      isLoading,
      refetch,
    }
  }

  /**
   * Deposit funds
   */
  const deposit = async (currency: Currency, amount: string) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(amount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.remittanceVault,
      abi: ABIS.remittanceVault,
      functionName: 'depositFunds',
      args: [currency, amountWei],
      value: amountWei, // Send PAS tokens
    })

    return hash
  }

  /**
   * Withdraw funds
   * FIXED: Contract function is withdrawFunds, not withdraw
   */
  const withdraw = async (currency: Currency, amount: string) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(amount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.remittanceVault,
      abi: ABIS.remittanceVault,
      functionName: 'withdrawFunds',
      args: [currency, amountWei],
    })

    return hash
  }

  /**
   * Send remittance
   * Contract expects: (address recipient, Currency fromCurrency, Currency toCurrency, uint256 amount)
   */
  const sendRemittance = async (
    recipient: `0x${string}`,
    amount: string,
    fromCurrency: Currency,
    toCurrency: Currency
  ) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(amount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.remittanceVault,
      abi: ABIS.remittanceVault,
      functionName: 'sendRemittance',
      args: [recipient, fromCurrency, toCurrency, amountWei], // Fixed parameter order!
    })

    return hash
  }

  /**
   * Get total balance across all currencies (in USD equivalent)
   */
  const useTotalBalance = () => {
    // For simplicity, we'll just return USD balance
    // In production, you'd convert all currencies to USD
    const { balance } = useBalanceOf(Currency.USD)
    return balance
  }

  /**
   * ADMIN: Get platform reserve balance for a currency
   */
  const usePlatformReserve = (currency: Currency) => {
    const { data: reserve, isLoading, refetch } = useReadContract({
      address: CONTRACT_ADDRESSES.remittanceVault,
      abi: ABIS.remittanceVault,
      functionName: 'getPlatformReserve',
      args: [currency],
      query: {
        enabled: true,
      },
    })

    return {
      reserve: reserve ? formatUnits(reserve as bigint, 18) : '0',
      reserveRaw: reserve as bigint,
      isLoading,
      refetch,
    }
  }

  /**
   * ADMIN: Deposit to platform reserves
   */
  const depositToPlatformReserves = async (currency: Currency, amount: string) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(amount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.remittanceVault,
      abi: ABIS.remittanceVault,
      functionName: 'depositToPlatformReserves',
      args: [currency, amountWei],
      value: amountWei, // Send PAS tokens
    })

    return hash
  }

  /**
   * ADMIN: Withdraw from platform reserves
   */
  const withdrawFromPlatformReserves = async (currency: Currency, amount: string) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(amount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.remittanceVault,
      abi: ABIS.remittanceVault,
      functionName: 'withdrawFromPlatformReserves',
      args: [currency, amountWei],
    })

    return hash
  }

  return {
    // PAS native balance
    pasBalance: pasBalance ? formatUnits(pasBalance.value, 18) : '0',

    // Actions
    deposit,
    withdraw,
    sendRemittance,

    // Helpers
    useBalanceOf,
    useTotalBalance,

    // Admin: Platform Reserves
    usePlatformReserve,
    depositToPlatformReserves,
    withdrawFromPlatformReserves,
  }
}
