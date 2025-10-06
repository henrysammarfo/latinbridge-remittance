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

  // Get balances for all 6 currencies
  const balances = {
    USD: useBalanceOf(Currency.USD),
    MXN: useBalanceOf(Currency.MXN),
    BRL: useBalanceOf(Currency.BRL),
    ARS: useBalanceOf(Currency.ARS),
    COP: useBalanceOf(Currency.COP),
    GTQ: useBalanceOf(Currency.GTQ),
  }

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

  // Approximate exchange rates for USD conversion
  const exchangeRates = {
    USD: 1,
    MXN: 18.5,
    BRL: 5.0,
    ARS: 350.0,
    COP: 4000.0,
    GTQ: 7.8,
  }

  // Calculate total available in USD
  const totalAvailable = Object.entries(balances).reduce((sum, [code, data]) => {
    const balance = parseFloat(data.balance)
    const rate = exchangeRates[code as keyof typeof exchangeRates]
    return sum + (balance / rate)
  }, 0)

  const totalSavings = parseFloat(savingsUSD.balance)
  const totalBalance = totalAvailable + totalSavings

  const isLoading = Object.values(balances).some(b => b.isLoading) || savingsUSD.isLoading

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
