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
   * NOTE: For testnet, we allow all users to be eligible
   * In production, this would check KYC status and credit score
   */
  const isEligible = !!address // All connected users are eligible on testnet
  
  const refetchEligibility = () => {
    // No-op for testnet
  }

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
    durationDays: number,
    purpose?: string
  ) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(amount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.microloanManager,
      abi: ABIS.microloanManager,
      functionName: 'requestLoan',
      args: [amountWei, currency, BigInt(durationDays), purpose || 'Personal loan'],
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

  /**
   * Admin: Approve a loan
   */
  const approveLoan = async (loanId: number) => {
    if (!address) throw new Error('No wallet connected')

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.microloanManager,
      abi: ABIS.microloanManager,
      functionName: 'approveLoan',
      args: [BigInt(loanId)],
    })

    return hash
  }

  /**
   * Admin: Reject a loan
   */
  const rejectLoan = async (loanId: number, reason: string) => {
    if (!address) throw new Error('No wallet connected')

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.microloanManager,
      abi: ABIS.microloanManager,
      functionName: 'rejectLoan',
      args: [BigInt(loanId), reason],
    })

    return hash
  }

  return {
    // Data
    isEligible,

    // Hooks
    useActiveLoan,
    useInterestRate,

    // Actions
    applyForLoan,
    repayLoan,
    approveLoan,
    rejectLoan,

    // Utilities
    calculateRepayment,
    refetchEligibility,
  }
}
