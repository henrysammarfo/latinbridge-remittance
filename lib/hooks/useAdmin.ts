import { useAccount } from 'wagmi'

/**
 * Admin authentication hook
 * Requires NEXT_PUBLIC_ADMIN_WALLET to be set in environment variables
 */
export function useAdmin() {
  const { address, isConnected } = useAccount()

  const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase()

  // Debug logging
  console.log('🔍 Admin Check:', {
    connectedAddress: address?.toLowerCase(),
    adminAddress: ADMIN_ADDRESS,
    isConnected,
    isAdmin: isConnected && ADMIN_ADDRESS && address?.toLowerCase() === ADMIN_ADDRESS,
    envValue: process.env.NEXT_PUBLIC_ADMIN_WALLET
  })

  if (!ADMIN_ADDRESS) {
    console.error('❌ NEXT_PUBLIC_ADMIN_WALLET not configured in environment variables')
    console.error('Please add to .env.local: NEXT_PUBLIC_ADMIN_WALLET=0x2F914bcbAD5bf4967BbB11e4372200b7c7594AEB')
  }

  const isAdmin = isConnected && ADMIN_ADDRESS && address?.toLowerCase() === ADMIN_ADDRESS

  return {
    isAdmin,
    adminAddress: ADMIN_ADDRESS || '',
  }
}
