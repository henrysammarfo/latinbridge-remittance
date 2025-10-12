/**
 * Transaction History Utility
 * Tracks all blockchain transactions in local storage
 */

export interface Transaction {
  id: string
  hash: string
  type: 'deposit' | 'withdraw' | 'send' | 'receive' | 'exchange' | 'savings_deposit' | 'savings_withdraw' | 'loan_apply' | 'loan_repay' | 'loan_approve' | 'loan_reject'
  status: 'pending' | 'success' | 'failed'
  amount: string
  currency: string
  fromCurrency?: string
  toCurrency?: string
  recipient?: string
  sender?: string
  timestamp: number
  blockNumber?: number
  description: string
}

const STORAGE_KEY = 'latinbridge_transactions'

/**
 * Get all transactions for a wallet address
 */
export function getTransactions(address: string): Transaction[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${address.toLowerCase()}`)
    if (!stored) return []

    const transactions = JSON.parse(stored) as Transaction[]
    // Sort by timestamp descending (newest first)
    return transactions.sort((a, b) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error('Error loading transactions:', error)
    return []
  }
}

/**
 * Add a new transaction
 */
export function addTransaction(address: string, transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
  if (typeof window === 'undefined') throw new Error('Cannot add transaction on server')

  const newTransaction: Transaction = {
    ...transaction,
    id: `${transaction.hash}_${Date.now()}`,
    timestamp: Date.now(),
  }

  try {
    const transactions = getTransactions(address)
    transactions.unshift(newTransaction) // Add to beginning

    // Keep only last 100 transactions
    const trimmed = transactions.slice(0, 100)

    localStorage.setItem(
      `${STORAGE_KEY}_${address.toLowerCase()}`,
      JSON.stringify(trimmed)
    )

    // Emit event for real-time updates
    window.dispatchEvent(new CustomEvent('transactionAdded', { detail: newTransaction }))

    return newTransaction
  } catch (error) {
    console.error('Error saving transaction:', error)
    throw error
  }
}

/**
 * Update transaction status
 */
export function updateTransactionStatus(
  address: string,
  hash: string,
  status: 'success' | 'failed',
  blockNumber?: number
): void {
  if (typeof window === 'undefined') return

  try {
    const transactions = getTransactions(address)
    const index = transactions.findIndex(tx => tx.hash === hash)

    if (index !== -1) {
      transactions[index].status = status
      if (blockNumber) {
        transactions[index].blockNumber = blockNumber
      }

      localStorage.setItem(
        `${STORAGE_KEY}_${address.toLowerCase()}`,
        JSON.stringify(transactions)
      )

      // Emit event for real-time updates
      window.dispatchEvent(new CustomEvent('transactionUpdated', { detail: transactions[index] }))
    }
  } catch (error) {
    console.error('Error updating transaction:', error)
  }
}

/**
 * Clear all transactions for an address
 */
export function clearTransactions(address: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(`${STORAGE_KEY}_${address.toLowerCase()}`)
    window.dispatchEvent(new CustomEvent('transactionsCleared'))
  } catch (error) {
    console.error('Error clearing transactions:', error)
  }
}

/**
 * Get transaction by hash
 */
export function getTransactionByHash(address: string, hash: string): Transaction | undefined {
  return getTransactions(address).find(tx => tx.hash === hash)
}

/**
 * Get transactions by type
 */
export function getTransactionsByType(address: string, type: Transaction['type']): Transaction[] {
  return getTransactions(address).filter(tx => tx.type === type)
}

/**
 * Get transaction count
 */
export function getTransactionCount(address: string): number {
  return getTransactions(address).length
}
