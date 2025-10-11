"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingDown } from "lucide-react"

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "ARS", name: "Argentine Peso", symbol: "$" },
  { code: "COP", name: "Colombian Peso", symbol: "$" },
  { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q" },
]

export function FeeCalculator() {
  const [amount, setAmount] = useState("1000")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("MXN")

  const numAmount = Number.parseFloat(amount) || 0
  const traditionalFee = numAmount * 0.075 // 7.5% average
  const latinBridgeFee = numAmount * 0.005 // 0.5%
  const savings = traditionalFee - latinBridgeFee

  return (
    <section id="calculator" className="py-20 md:py-32 bg-muted/30 border-b">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-balance">
              Calculate Your Savings
            </h2>
            <p className="text-lg text-muted-foreground text-balance leading-relaxed">
              See how much you save compared to traditional remittance services.
            </p>
          </div>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Fee Comparison Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    suppressHydrationWarning
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger id="from">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger id="to">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Card className="bg-destructive/5 border-destructive/20">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Traditional Services</div>
                    <div className="text-2xl font-bold text-destructive mb-2">${traditionalFee.toFixed(2)} fee</div>
                    <div className="text-sm text-muted-foreground">Average 7.5% fee</div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">LatinBridge</div>
                    <div className="text-2xl font-bold text-primary mb-2">${latinBridgeFee.toFixed(2)} fee</div>
                    <div className="text-sm text-muted-foreground">Only 0.5% fee</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-accent/10 border-accent/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-5 w-5 text-accent" />
                        <span className="text-sm font-medium text-muted-foreground">You Save</span>
                      </div>
                      <div className="text-3xl font-bold text-accent">${savings.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Savings Rate</div>
                      <div className="text-2xl font-bold">{((savings / traditionalFee) * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
