"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDownUp, TrendingUp } from "lucide-react"

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "ARS", name: "Argentine Peso", flag: "🇦🇷" },
  { code: "COP", name: "Colombian Peso", flag: "🇨🇴" },
  { code: "CLP", name: "Chilean Peso", flag: "🇨🇱" },
]

const exchangeRates: Record<string, Record<string, number>> = {
  USD: { EUR: 0.92, GBP: 0.79, MXN: 17.5, BRL: 5.1, ARS: 350, COP: 4100, CLP: 900 },
  EUR: { USD: 1.09, GBP: 0.86, MXN: 19.1, BRL: 5.6, ARS: 382, COP: 4475, CLP: 982 },
  GBP: { USD: 1.27, EUR: 1.16, MXN: 22.2, BRL: 6.5, ARS: 445, COP: 5200, CLP: 1143 },
}

export function ExchangeInterface() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("MXN")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    if (value && exchangeRates[fromCurrency]?.[toCurrency]) {
      const rate = exchangeRates[fromCurrency][toCurrency]
      setToAmount((Number.parseFloat(value) * rate).toFixed(2))
    } else {
      setToAmount("")
    }
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Exchange:", { fromCurrency, toCurrency, fromAmount, toAmount })
    // Handle exchange logic
  }

  const currentRate = exchangeRates[fromCurrency]?.[toCurrency] || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exchange Currency</CardTitle>
        <CardDescription>Convert your balance between different currencies</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleExchange} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from-amount">From</Label>
              <div className="flex gap-2">
                <Input
                  id="from-amount"
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="flex-1"
                  min="0"
                  step="0.01"
                  required
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => {
                    setFromCurrency(e.target.value)
                    handleFromAmountChange(fromAmount)
                  }}
                  className="px-4 py-2 border rounded-md bg-background min-w-[120px]"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwapCurrencies}
                className="rounded-full bg-transparent"
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-amount">To</Label>
              <div className="flex gap-2">
                <Input
                  id="to-amount"
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                  className="flex-1 bg-muted"
                />
                <select
                  value={toCurrency}
                  onChange={(e) => {
                    setToCurrency(e.target.value)
                    handleFromAmountChange(fromAmount)
                  }}
                  className="px-4 py-2 border rounded-md bg-background min-w-[120px]"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {currentRate > 0 && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Current Exchange Rate</span>
              </div>
              <div className="text-lg font-semibold">
                1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
              </div>
              <div className="text-xs text-muted-foreground">Rate updates every minute • No hidden fees</div>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={!fromAmount || !toAmount}>
            Exchange Currency
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
