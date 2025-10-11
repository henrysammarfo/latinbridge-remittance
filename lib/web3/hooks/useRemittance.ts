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
   */
  const withdraw = async (currency: Currency, amount: string) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(amount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.remittanceVault,
      abi: ABIS.remittanceVault,
      functionName: 'withdraw',
      args: [currency, amountWei],
    })

    return hash
  }

  /**
   * Send remittance
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
      args: [recipient, amountWei, fromCurrency, toCurrency],
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
  }
}
