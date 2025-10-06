/**
 * Nonce storage for SIWE authentication
 * In production, use Redis or a database
 */

interface NonceEntry {
  nonce: string
  timestamp: number
}

// In-memory storage (for development)
const nonceStore = new Map<string, NonceEntry>()

// Nonce expiration time (5 minutes)
const NONCE_EXPIRATION = 5 * 60 * 1000

/**
 * Store a nonce for an address
 */
export function storeNonce(address: string, nonce: string): void {
  nonceStore.set(address.toLowerCase(), {
    nonce,
    timestamp: Date.now(),
  })
}

/**
 * Get and validate a nonce for an address
 */
export function getNonce(address: string): string | null {
  const entry = nonceStore.get(address.toLowerCase())

  if (!entry) {
    return null
  }

  // Check if nonce is expired
  if (Date.now() - entry.timestamp > NONCE_EXPIRATION) {
    nonceStore.delete(address.toLowerCase())
    return null
  }

  return entry.nonce
}

/**
 * Delete a nonce after use
 */
export function deleteNonce(address: string): void {
  nonceStore.delete(address.toLowerCase())
}

/**
 * Clean up expired nonces
 */
export function cleanupExpiredNonces(): void {
  const now = Date.now()

  for (const [address, entry] of nonceStore.entries()) {
    if (now - entry.timestamp > NONCE_EXPIRATION) {
      nonceStore.delete(address)
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredNonces, 5 * 60 * 1000)
