"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Building2, Wallet, ArrowRight } from "lucide-react"

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Instant deposit with 2% fee",
    fee: "2%",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Building2,
    description: "Free, arrives in 1-3 business days",
    fee: "Free",
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: Wallet,
    description: "Instant deposit with 1% fee",
    fee: "1%",
  },
]

export function AddMoneyInterface() {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [paymentMethod, setPaymentMethod] = useState("card")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Add money:", { amount, currency, paymentMethod })
    // Handle add money logic
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Money to Wallet</CardTitle>
        <CardDescription>Choose your payment method and amount</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
                min="1"
                step="0.01"
                required
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <method.icon className="h-5 w-5 mt-0.5 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </div>
                      <div className="text-sm font-medium text-primary">{method.fee}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {amount && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">
                  {currency} {amount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee</span>
                <span className="font-medium">
                  {paymentMethod === "bank"
                    ? "Free"
                    : `${currency} ${(Number.parseFloat(amount) * (paymentMethod === "card" ? 0.02 : 0.01)).toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  {currency}{" "}
                  {paymentMethod === "bank"
                    ? amount
                    : (Number.parseFloat(amount) * (paymentMethod === "card" ? 1.02 : 1.01)).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            Continue to Payment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
