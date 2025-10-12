'use client'

/**
 * Admin authentication hook
 * Requires NEXT_PUBLIC_ADMIN_WALLET to be set in environment variables
 * 
 * NOTE: This is intentionally simplified to avoid SSR issues
 * Returns false by default - admin features only work on admin pages
 */
export function useAdmin() {
  const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase()

  return {
    isAdmin: false, // Always false in nav - check on actual admin pages
    adminAddress: ADMIN_ADDRESS || '',
  }
}
