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

    // Check if loan is actually active
    // If amount is 0 or borrower is zero address, there's no active loan
    const loanData = loan as any
    const hasActiveLoan = loanData &&
                         loanData.amount &&
                         Number(loanData.amount) > 0 &&
                         loanData.borrower &&
                         loanData.borrower !== '0x0000000000000000000000000000000000000000'

    return {
      loan: hasActiveLoan ? loanData : null,
      isLoading,
      refetch,
    }
  }

  /**
   * Get all loans for a user
   */
  const useUserLoans = () => {
    const { data: loanIds, isLoading, refetch } = useReadContract({
      address: CONTRACT_ADDRESSES.microloanManager,
      abi: ABIS.microloanManager,
      functionName: 'getUserLoans',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })

    return {
      loanIds: (loanIds as bigint[]) || [],
      isLoading,
      refetch,
    }
  }

  /**
   * Get loan details by ID (using public loans array)
   */
  const useLoanById = (loanId: bigint | number) => {
    const { data: loan, isLoading, refetch } = useReadContract({
      address: CONTRACT_ADDRESSES.microloanManager,
      abi: ABIS.microloanManager,
      functionName: 'loans',
      args: [BigInt(loanId)],
      query: {
        enabled: true,
      },
    })

    return {
      loan: loan as any,
      isLoading,
      refetch,
    }
  }

  /**
   * Get total loans count
   */
  const useTotalLoans = () => {
    const { data: count, isLoading, refetch } = useReadContract({
      address: CONTRACT_ADDRESSES.microloanManager,
      abi: ABIS.microloanManager,
      functionName: 'getTotalLoans',
      query: {
        enabled: true,
      },
    })

    return {
      count: count ? Number(count) : 0,
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
   * Get interest rate for user
   * FIXED: Contract expects address, not creditScore
   */
  const useInterestRate = () => {
    const { data: rate } = useReadContract({
      address: CONTRACT_ADDRESSES.microloanManager,
      abi: ABIS.microloanManager,
      functionName: 'calculateInterestRate',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
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
   * FIXED: Contract expects (loanId, amount), not just amount
   */
  const repayLoan = async (loanId: number, amount: string) => {
    if (!address) throw new Error('No wallet connected')

    const amountWei = parseUnits(amount, 18)

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.microloanManager,
      abi: ABIS.microloanManager,
      functionName: 'repayLoan',
      args: [BigInt(loanId), amountWei],
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
    useUserLoans,
    useLoanById,
    useTotalLoans,
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
