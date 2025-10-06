'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { CONTRACT_ADDRESSES, ABIS, Currency } from './useContracts'

export function useLoans() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  /**
   * Get active loan for user
   */
  const useActiveLoan = () => {
    const { data: loan, isLoading, refetch } = useReadContract({
      address: CONTRACT_ADDRESSES.microloanManager,
      abi: ABIS.microloanManager,
      functionName: 'getUserLoan',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })

    return {
      loan: loan as any,
      isLoading,
      refetch,
    }
  }

  /**
   * Check loan eligibility
   */
  const { data: isEligible, refetch: refetchEligibility } = useReadContract({
    address: CONTRACT_ADDRESSES.microloanManager,
    abi: ABIS.microloanManager,
    functionName: 'checkEligibility',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  /**
   * Get interest rate based on credit score
   */
  const useInterestRate = (creditScore: number) => {
    const { data: rate } = useReadContract({
      address: CONTRACT_ADDRESSES.microloanManager,
      abi: ABIS.microloanManager,
      functionName: 'calculateInterestRate',
      args: [BigInt(creditScore)],
    })

    return {
      rate: rate ? Number(rate) / 100 : 10, // Convert basis points to percentage
    }
  }

  /**
   * Apply for a loan
   */
  const applyForLoan = async (
    amount: string,
    currency: Currency,
    durationDays: number
  ) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(amount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.microloanManager,
      abi: ABIS.microloanManager,
      functionName: 'applyForLoan',
      args: [amountWei, currency, BigInt(durationDays)],
    })

    return hash
  }

  /**
   * Repay loan
   */
  const repayLoan = async (amount: string) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(amount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.microloanManager,
      abi: ABIS.microloanManager,
      functionName: 'repayLoan',
      args: [amountWei],
      value: amountWei,
    })

    return hash
  }

  /**
   * Calculate total repayment amount
   */
  const calculateRepayment = (
    principal: number,
    interestRate: number,
    durationDays: number
  ): number => {
    const dailyRate = interestRate / 365 / 100
    const interest = principal * dailyRate * durationDays
    return principal + interest
  }

  return {
    // Data
    isEligible: !!isEligible,

    // Hooks
    useActiveLoan,
    useInterestRate,

    // Actions
    applyForLoan,
    repayLoan,

    // Utilities
    calculateRepayment,
    refetchEligibility,
  }
}
