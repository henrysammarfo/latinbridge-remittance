"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Trash2,
  ArrowRightLeft,
  PiggyBank,
  CreditCard
} from "lucide-react"
import { useAccount } from "wagmi"
import { getTransactions, clearTransactions, type Transaction } from "@/lib/utils/transactionHistory"
import { formatDistanceToNow } from "date-fns"

const BLOCK_EXPLORER = process.env.NEXT_PUBLIC_BLOCK_EXPLORER || 'https://blockscout-passet-hub.parity-testnet.parity.io'

const typeIcons: Record<Transaction['type'], any> = {
  deposit: ArrowDownLeft,
  withdraw: ArrowUpRight,
  send: ArrowUpRight,
  receive: ArrowDownLeft,
  exchange: ArrowRightLeft,
  savings_deposit: PiggyBank,
  savings_withdraw: PiggyBank,
  loan_apply: CreditCard,
  loan_repay: CreditCard,
  loan_approve: CreditCard,
  loan_reject: CreditCard,
}

const typeLabels: Record<Transaction['type'], string> = {
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  send: 'Send',
  receive: 'Receive',
  exchange: 'Exchange',
  savings_deposit: 'Savings Deposit',
  savings_withdraw: 'Savings Withdraw',
  loan_apply: 'Loan Application',
  loan_repay: 'Loan Repayment',
  loan_approve: 'Loan Approved',
  loan_reject: 'Loan Rejected',
}

const typeColors: Record<Transaction['type'], string> = {
  deposit: 'bg-green-500/10 text-green-500 border-green-500/20',
  withdraw: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  send: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  receive: 'bg-green-500/10 text-green-500 border-green-500/20',
  exchange: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  savings_deposit: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  savings_withdraw: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  loan_apply: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  loan_repay: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  loan_approve: 'bg-green-500/10 text-green-500 border-green-500/20',
  loan_reject: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export function TransactionHistory() {
  const { isConnected, address } = useAccount()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadTransactions = () => {
    if (!address) return

    setIsLoading(true)
    try {
      const txs = getTransactions(address)
      setTransactions(txs)
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      loadTransactions()

      // Listen for transaction updates
      const handleTransactionAdded = () => loadTransactions()
      const handleTransactionUpdated = () => loadTransactions()
      const handleTransactionsCleared = () => setTransactions([])

      window.addEventListener('transactionAdded', handleTransactionAdded)
      window.addEventListener('transactionUpdated', handleTransactionUpdated)
      window.addEventListener('transactionsCleared', handleTransactionsCleared)

      return () => {
        window.removeEventListener('transactionAdded', handleTransactionAdded)
        window.removeEventListener('transactionUpdated', handleTransactionUpdated)
        window.removeEventListener('transactionsCleared', handleTransactionsCleared)
      }
    }
  }, [isConnected, address])

  const handleClearHistory = () => {
    if (!address) return

    if (confirm('Are you sure you want to clear all transaction history? This cannot be undone.')) {
      clearTransactions(address)
      setTransactions([])
    }
  }

  if (!isConnected) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2 font-medium">
              Connect Your Wallet
            </p>
            <p className="text-sm text-muted-foreground">
              Connect your wallet to view your transaction history
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadTransactions}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2 font-medium">
              No transactions yet
            </p>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              When you send money, deposit to savings, or take a loan, your transactions will appear here with blockchain verification.
            </p>
            <a
              href={BLOCK_EXPLORER}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              View all transactions on Blockscout
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction History</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadTransactions}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((tx) => {
            const Icon = typeIcons[tx.type]
            const typeColor = typeColors[tx.type]

            return (
              <div
                key={tx.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${typeColor} border`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{typeLabels[tx.type]}</span>
                    <Badge
                      variant={
                        tx.status === 'success'
                          ? 'default'
                          : tx.status === 'pending'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className="text-xs"
                    >
                      {tx.status === 'success' ? '✓ Success' : tx.status === 'pending' ? '⏳ Pending' : '✗ Failed'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-medium">
                    {tx.amount} {tx.currency}
                  </div>
                  {tx.fromCurrency && tx.toCurrency && tx.fromCurrency !== tx.toCurrency && (
                    <div className="text-xs text-muted-foreground">
                      {tx.fromCurrency} → {tx.toCurrency}
                    </div>
                  )}
                </div>

                <a
                  href={`${BLOCK_EXPLORER}/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  title="View on block explorer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t text-center">
          <a
            href={`${BLOCK_EXPLORER}/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            View all blockchain transactions on Blockscout
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
