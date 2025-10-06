"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Info } from "lucide-react"
import type { SendMoneyData } from "./send-money-flow"

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "ARS", name: "Argentine Peso", symbol: "$" },
  { code: "COP", name: "Colombian Peso", symbol: "$" },
  { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q" },
]

interface AmountStepProps {
  data: SendMoneyData
  updateData: (updates: Partial<SendMoneyData>) => void
  onNext: () => void
  onBack: () => void
}

export function AmountStep({ data, updateData, onNext, onBack }: AmountStepProps) {
  const amount = Number.parseFloat(data.amount) || 0
  const fee = amount * 0.005
  const total = amount + fee
  const recipientReceives = amount * data.exchangeRate

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Enter Amount</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">You Send</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                value={data.amount}
                onChange={(e) => updateData({ amount: e.target.value })}
                placeholder="0.00"
                className="flex-1"
              />
              <Select value={data.fromCurrency} onValueChange={(value) => updateData({ fromCurrency: value })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient-amount">Recipient Gets</Label>
            <div className="flex gap-2">
              <Input
                id="recipient-amount"
                type="number"
                value={recipientReceives.toFixed(2)}
                readOnly
                className="flex-1 bg-muted"
              />
              <Select value={data.toCurrency} onValueChange={(value) => updateData({ toCurrency: value })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              1 {data.fromCurrency} = {data.exchangeRate} {data.toCurrency}
            </span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-3 p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Transfer Amount</span>
            <span className="font-medium">
              {amount.toFixed(2)} {data.fromCurrency}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Fee (0.5%)</span>
              <Info className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="font-medium">
              {fee.toFixed(2)} {data.fromCurrency}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="font-semibold">Total to Pay</span>
            <span className="text-lg font-bold">
              {total.toFixed(2)} {data.fromCurrency}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
            Back
          </Button>
          <Button onClick={onNext} disabled={!data.amount || amount <= 0} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
