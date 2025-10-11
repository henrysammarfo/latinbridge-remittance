import { useAccount } from 'wagmi'

// Admin wallet address
const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase() || '0x2f914bcbad5bf4967bbb11e4372200b7c7594aeb'

export function useAdmin() {
  const { address, isConnected } = useAccount()

  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS

  return {
    isAdmin,
    adminAddress: ADMIN_ADDRESS,
  }
}
