'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownLeft, Loader2, ExternalLink } from 'lucide-react'
import { useAccount, usePublicClient } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/lib/web3/hooks/useContracts'
import { formatEther } from 'viem'

interface Transaction {
  hash: string
  type: 'send' | 'receive' | 'deposit' | 'withdraw' | 'loan'
  amount: string
  currency: string
  timestamp: number
  from: string
  to: string
}

export function TransactionHistory() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isConnected || !address || !publicClient) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)

        // In production, you would:
        // 1. Query contract events using publicClient.getLogs()
        // 2. Filter by user address
        // 3. Parse event data
        // 4. Combine events from all contracts

        // For demo, create sample transactions
        // This would be replaced with actual event queries
        const sampleTransactions: Transaction[] = [
          {
            hash: '0x1234...5678',
            type: 'send',
            amount: '100',
            currency: 'USD',
            timestamp: Date.now() - 3600000,
            from: address,
            to: '0xabcd...efgh'
          },
          {
            hash: '0x8765...4321',
            type: 'receive',
            amount: '50',
            currency: 'MXN',
            timestamp: Date.now() - 7200000,
            from: '0xijkl...mnop',
            to: address
          }
        ]

        setTransactions(sampleTransactions)
      } catch (error) {
        console.error('Error fetching transactions:', error)
        setTransactions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [isConnected, address, publicClient])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
      case 'withdraw':
        return <ArrowUpRight className="h-5 w-5 text-destructive" />
      case 'receive':
      case 'deposit':
        return <ArrowDownLeft className="h-5 w-5 text-primary" />
      default:
        return <ArrowUpRight className="h-5 w-5" />
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'send': return 'Sent'
      case 'receive': return 'Received'
      case 'deposit': return 'Deposited'
      case 'withdraw': return 'Withdrawn'
      case 'loan': return 'Loan'
      default: return type
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getBlockExplorerUrl = (hash: string) => {
    return `https://blockscout-passet-hub.parity-testnet.parity.io/tx/${hash}`
  }

  if (!isConnected) {
    return null
  }

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 text-primary mx-auto mb-2 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading transactions...</p>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No transactions yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.hash}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <div className="font-medium">{getTransactionLabel(tx.type)}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    {formatTimestamp(tx.timestamp)}
                    <span>•</span>
                    <a
                      href={getBlockExplorerUrl(tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      {tx.hash}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${tx.type === 'send' || tx.type === 'withdraw' ? 'text-destructive' : 'text-primary'}`}>
                  {tx.type === 'send' || tx.type === 'withdraw' ? '-' : '+'}
                  {tx.amount} {tx.currency}
                </div>
                <Badge variant="secondary" className="mt-1">
                  {tx.currency}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
