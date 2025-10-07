'use client'

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESSES, ABIS, KYCLevel } from './useContracts'

export function useUserRegistry() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  // Read user profile
  const { data: profile, isLoading: isLoadingProfile, refetch: refetchProfile } = useReadContract({
    address: CONTRACT_ADDRESSES.userRegistry,
    abi: ABIS.userRegistry,
    functionName: 'getUserProfile',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Read KYC status
  const { data: kycStatus, isLoading: isLoadingKYC, refetch: refetchKYC } = useReadContract({
    address: CONTRACT_ADDRESSES.userRegistry,
    abi: ABIS.userRegistry,
    functionName: 'getKYCStatus',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Read credit score
  const { data: creditScore, refetch: refetchCreditScore } = useReadContract({
    address: CONTRACT_ADDRESSES.userRegistry,
    abi: ABIS.userRegistry,
    functionName: 'getCreditScore',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Check if registered
  const { data: isRegistered, refetch: refetchRegistered } = useReadContract({
    address: CONTRACT_ADDRESSES.userRegistry,
    abi: ABIS.userRegistry,
    functionName: 'isRegistered',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  /**
   * Auto-register user on first interaction
   */
  const autoRegister = async () => {
    if (!address) throw new Error('No wallet connected')

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.userRegistry,
      abi: ABIS.userRegistry,
      functionName: 'autoRegister',
    })

    return hash
  }

  /**
   * Register user with name and email
   */
  const registerUser = async (name: string, email: string) => {
    if (!address) throw new Error('No wallet connected')

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.userRegistry,
      abi: ABIS.userRegistry,
      functionName: 'registerUser',
      args: [address, name, email],
    })

    return hash
  }

  /**
   * Update user profile
   */
  const updateProfile = async (name: string, email: string) => {
    if (!address) throw new Error('No wallet connected')

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.userRegistry,
      abi: ABIS.userRegistry,
      functionName: 'updateProfile',
      args: [name, email],
    })

    return hash
  }

  /**
   * Refetch all user data
   */
  const refetchAll = () => {
    refetchProfile()
    refetchKYC()
    refetchCreditScore()
    refetchRegistered()
  }

  /**
   * Get KYC status as a number (0=None, 1=Basic, 2=Enhanced, 3=Premium)
   */
  const getKYCStatus = async (): Promise<number> => {
    if (!address || !kycStatus) return 0
    // kycStatus is a tuple: [isVerified, level, limit]
    const statusArray = kycStatus as unknown as [boolean, number, bigint]
    const level = statusArray[1]
    return Number(level)
  }

  return {
    // Data
    profile: profile as any,
    kycStatus: kycStatus as any,
    creditScore: creditScore ? Number(creditScore) : 500,
    isRegistered: !!isRegistered,

    // Loading states
    isLoading: isLoadingProfile || isLoadingKYC,

    // Actions
    autoRegister,
    registerUser,
    updateProfile,
    refetchAll,
    getKYCStatus,
  }
}

/**
 * Hook to check transaction limit
 */
export function useTransactionLimit() {
  const { address } = useAccount()

  const { data: limit } = useReadContract({
    address: CONTRACT_ADDRESSES.userRegistry,
    abi: ABIS.userRegistry,
    functionName: 'getTransactionLimit',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return {
    limit: limit ? Number(limit) : 0,
  }
}
