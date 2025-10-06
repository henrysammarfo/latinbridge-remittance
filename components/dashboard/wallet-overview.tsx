'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRemittance } from "@/lib/web3/hooks/useRemittance"
import { useSavings } from "@/lib/web3/hooks/useSavings"
import { Currency } from "@/lib/web3/hooks/useContracts"
import { useAccount } from "wagmi"

export function WalletOverview() {
  const { isConnected } = useAccount()
  const { useBalanceOf, useTotalBalance } = useRemittance()
  const { useBalance: useSavingsBalance } = useSavings()

  // Get balances for different currencies
  const usdBalance = useBalanceOf(Currency.USD)
  const mxnBalance = useBalanceOf(Currency.MXN)
  const brlBalance = useBalanceOf(Currency.BRL)

  // Get savings balance
  const savingsUSD = useSavingsBalance(Currency.USD)

  if (!isConnected) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Connect your wallet to view balance
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalAvailable = parseFloat(usdBalance.balance) +
                        parseFloat(mxnBalance.balance) / 18.5 + // Convert to USD approx
                        parseFloat(brlBalance.balance) / 5.0

  const totalSavings = parseFloat(savingsUSD.balance)
  const totalBalance = totalAvailable + totalSavings

  const isLoading = usdBalance.isLoading || savingsUSD.isLoading

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Total Balance</CardTitle>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">Loading balances...</span>
              </div>
            ) : (
              <>
                <div className="text-4xl font-bold tracking-tight">
                  ${totalBalance.toFixed(2)}
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">Real-time blockchain data</span>
                </div>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm text-muted-foreground">Available</div>
              <div className="text-lg font-semibold">
                {isLoading ? '...' : `$${totalAvailable.toFixed(2)}`}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">In Savings</div>
              <div className="text-lg font-semibold">
                {isLoading ? '...' : `$${totalSavings.toFixed(2)}`}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="text-lg font-semibold">$0.00</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
