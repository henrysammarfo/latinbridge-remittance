'use client'

import { useState, useEffect } from "react"
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
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    MXN: 18.5,
    BRL: 5.0,
    ARS: 350.0,
    COP: 4000.0,
    GTQ: 7.8,
  })

  // Get balances for all 6 currencies
  const usdBalance = useBalanceOf(Currency.USD)
  const mxnBalance = useBalanceOf(Currency.MXN)
  const brlBalance = useBalanceOf(Currency.BRL)
  const arsBalance = useBalanceOf(Currency.ARS)
  const copBalance = useBalanceOf(Currency.COP)
  const gtqBalance = useBalanceOf(Currency.GTQ)

  const balances = {
    USD: usdBalance,
    MXN: mxnBalance,
    BRL: brlBalance,
    ARS: arsBalance,
    COP: copBalance,
    GTQ: gtqBalance,
  }

  // Get savings balance
  const savingsUSD = useSavingsBalance(Currency.USD)

  // Fetch live exchange rates from API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('/api/rates/current')
        const data = await response.json()
        if (data.rates) {
          setExchangeRates(data.rates)
        }
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error)
        // Keep using default rates if API fails
      }
    }

    fetchRates()
    const interval = setInterval(fetchRates, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Listen for balance update events and refetch all balances
  useEffect(() => {
    const handleBalanceUpdate = () => {
      console.log('🔄 Balance update event received - refreshing all balances')
      // Refetch all currency balances
      usdBalance.refetch()
      mxnBalance.refetch()
      brlBalance.refetch()
      arsBalance.refetch()
      copBalance.refetch()
      gtqBalance.refetch()
      // Refetch savings balance
      savingsUSD.refetch()
    }

    window.addEventListener('balanceUpdate', handleBalanceUpdate)
    return () => window.removeEventListener('balanceUpdate', handleBalanceUpdate)
  }, [usdBalance, mxnBalance, brlBalance, arsBalance, copBalance, gtqBalance, savingsUSD])

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
