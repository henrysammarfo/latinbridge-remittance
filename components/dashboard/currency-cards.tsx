'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRemittance } from "@/lib/web3/hooks/useRemittance"
import { Currency } from "@/lib/web3/hooks/useContracts"
import { useAccount } from "wagmi"

const currencyConfig = [
  { code: "USD", name: "US Dollar", symbol: "$", enum: Currency.USD },
  { code: "MXN", name: "Mexican Peso", symbol: "$", enum: Currency.MXN },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", enum: Currency.BRL },
  { code: "ARS", name: "Argentine Peso", symbol: "$", enum: Currency.ARS },
  { code: "COP", name: "Colombian Peso", symbol: "$", enum: Currency.COP },
  { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q", enum: Currency.GTQ },
]

export function CurrencyCards() {
  const { isConnected } = useAccount()
  const { useBalanceOf } = useRemittance()

  // Get balances for all currencies
  const balances = {
    USD: useBalanceOf(Currency.USD),
    MXN: useBalanceOf(Currency.MXN),
    BRL: useBalanceOf(Currency.BRL),
    ARS: useBalanceOf(Currency.ARS),
    COP: useBalanceOf(Currency.COP),
    GTQ: useBalanceOf(Currency.GTQ),
  }
  if (!isConnected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Currency Balances</h2>
          <span className="text-sm text-muted-foreground">{currencyConfig.length} currencies</span>
        </div>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Connect your wallet to view currency balances
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAnyLoading = Object.values(balances).some(b => b.isLoading)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Currency Balances</h2>
        <span className="text-sm text-muted-foreground">{currencyConfig.length} currencies</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currencyConfig.map((currency) => {
          const balanceData = balances[currency.code as keyof typeof balances]
          const balance = parseFloat(balanceData.balance)

          return (
            <Card key={currency.code} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">{currency.code}</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">{currency.name}</p>
              </CardHeader>
              <CardContent>
                {balanceData.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold">
                    {currency.symbol}
                    {balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
