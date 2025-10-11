import { useAccount } from 'wagmi'

/**
 * Admin authentication hook
 * Requires NEXT_PUBLIC_ADMIN_WALLET to be set in environment variables
 */
export function useAdmin() {
  const { address, isConnected } = useAccount()

  const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase()

  if (!ADMIN_ADDRESS) {
    console.error('NEXT_PUBLIC_ADMIN_WALLET not configured in environment variables')
  }

  const isAdmin = isConnected && ADMIN_ADDRESS && address?.toLowerCase() === ADMIN_ADDRESS

  return {
    isAdmin,
    adminAddress: ADMIN_ADDRESS || '',
  }
}
