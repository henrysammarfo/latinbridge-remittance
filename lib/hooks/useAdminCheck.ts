'use client'

import { useAccount } from 'wagmi'

/**
 * Admin authentication hook for PAGES ONLY (not nav)
 * Use this in admin pages to check if user is admin
 * DO NOT use in DashboardNav or other SSR components
 */
export function useAdminCheck() {
  const { address, isConnected } = useAccount()
  const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase()

  const isAdmin = isConnected && ADMIN_ADDRESS && address?.toLowerCase() === ADMIN_ADDRESS

  return {
    isAdmin: !!isAdmin,
    adminAddress: ADMIN_ADDRESS || '',
  }
}
