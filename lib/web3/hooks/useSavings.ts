'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { CONTRACT_ADDRESSES, ABIS, Currency } from './useContracts'

export function useSavings() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  /**
   * Get savings balance for a currency
   */
  const useBalance = (currency: Currency) => {
    const { data: balance, isLoading, refetch } = useReadContract({
      address: CONTRACT_ADDRESSES.savingsPool,
      abi: ABIS.savingsPool,
      functionName: 'getSavingsBalance',
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
   * Get accrued interest
   */
  const useAccruedInterest = (currency: Currency) => {
    const { data: interest, refetch } = useReadContract({
      address: CONTRACT_ADDRESSES.savingsPool,
      abi: ABIS.savingsPool,
      functionName: 'getAccruedInterest',
      args: address ? [address, currency] : undefined,
      query: {
        enabled: !!address,
      },
    })

    return {
      interest: interest ? formatUnits(interest as bigint, 18) : '0',
      interestRaw: interest as bigint,
      refetch,
    }
  }

  /**
   * Get APY (Annual Percentage Yield)
   */
  const { data: apy } = useReadContract({
    address: CONTRACT_ADDRESSES.savingsPool,
    abi: ABIS.savingsPool,
    functionName: 'APY',
    query: {
      enabled: true,
    },
  })

  /**
   * Deposit to savings
   */
  const deposit = async (currency: Currency, amount: string) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(amount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.savingsPool,
      abi: ABIS.savingsPool,
      functionName: 'depositToSavings',
      args: [currency, amountWei],
    })

    return hash
  }

  /**
   * Withdraw from savings
   */
  const withdraw = async (currency: Currency, amount: string) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(amount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.savingsPool,
      abi: ABIS.savingsPool,
      functionName: 'withdraw',
      args: [currency, amountWei],
    })

    return hash
  }

  /**
   * Claim accrued yield
   */
  const claimYield = async (currency: Currency) => {
    if (!address) throw new Error('No wallet connected')

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.savingsPool,
      abi: ABIS.savingsPool,
      functionName: 'claimYield',
      args: [currency],
    })

    return hash
  }

  /**
   * Set savings goal
   */
  const setSavingsGoal = async (currency: Currency, goalAmount: string, deadline: number) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(goalAmount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.savingsPool,
      abi: ABIS.savingsPool,
      functionName: 'setSavingsGoal',
      args: [currency, amountWei, BigInt(deadline)],
    })

    return hash
  }

  return {
    // Current APY (e.g., 500 = 5%)
    apy: apy ? Number(apy) / 100 : 5.0,

    // Hooks
    useBalance,
    useAccruedInterest,

    // Actions
    deposit,
    withdraw,
    claimYield,
    setSavingsGoal,
  }
}
