import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const currencies = [
  { code: "USD", name: "US Dollar", balance: 5420.5, change: 2.3, positive: true, symbol: "$" },
  { code: "MXN", name: "Mexican Peso", balance: 98234.75, change: -1.2, positive: false, symbol: "$" },
  { code: "BRL", name: "Brazilian Real", balance: 12450.0, change: 3.8, positive: true, symbol: "R$" },
  { code: "ARS", name: "Argentine Peso", balance: 245600.0, change: 1.5, positive: true, symbol: "$" },
  { code: "COP", name: "Colombian Peso", balance: 8234500.0, change: 0.8, positive: true, symbol: "$" },
  { code: "GTQ", name: "Guatemalan Quetzal", balance: 15234.25, change: -0.5, positive: false, symbol: "Q" },
]

export function CurrencyCards() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Currency Balances</h2>
        <span className="text-sm text-muted-foreground">{currencies.length} currencies</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currencies.map((currency) => (
          <Card key={currency.code} className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">{currency.code}</CardTitle>
                <div
                  className={`flex items-center gap-1 text-sm ${currency.positive ? "text-primary" : "text-destructive"}`}
                >
                  {currency.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>
                    {currency.positive ? "+" : ""}
                    {currency.change}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{currency.name}</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currency.symbol}
                {currency.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
