'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet } from "lucide-react"
import Link from "next/link"
import { useAccount } from "wagmi"

export function RecentTransactions() {
  const { isConnected } = useAccount()

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/transactions">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Wallet className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-2">
            {isConnected ? 'No transactions yet' : 'Connect your wallet to view transactions'}
          </p>
          <p className="text-sm text-muted-foreground">
            Start sending money to see your transaction history
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
