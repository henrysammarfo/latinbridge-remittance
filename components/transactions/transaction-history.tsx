"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink } from "lucide-react"
import { useAccount } from "wagmi"

export function TransactionHistory() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return null
  }

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
            No transactions yet
          </p>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            When you send money, deposit to savings, or take a loan, your transactions will appear here with blockchain verification.
          </p>
          <a
            href="https://blockscout-passet-hub.parity-testnet.parity.io"
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
