"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Building2, Wallet } from "lucide-react"
import type { SendMoneyData } from "./send-money-flow"

const paymentMethods = [
  {
    id: "card",
    name: "Debit/Credit Card",
    icon: CreditCard,
    description: "Instant transfer • Visa, Mastercard",
    fee: "Free",
  },
  {
    id: "bank",
    name: "Bank Account",
    icon: Building2,
    description: "ACH transfer • 1-2 business days",
    fee: "Free",
  },
  {
    id: "wallet",
    name: "LatinBridge Wallet",
    icon: Wallet,
    description: "Instant • Use your balance",
    fee: "Free",
  },
]

interface PaymentMethodStepProps {
  data: SendMoneyData
  updateData: (updates: Partial<SendMoneyData>) => void
  onNext: () => void
  onBack: () => void
}

export function PaymentMethodStep({ data, updateData, onNext, onBack }: PaymentMethodStepProps) {
  const [selectedMethod, setSelectedMethod] = useState(data.paymentMethod || "")

  const handleNext = () => {
    updateData({ paymentMethod: selectedMethod })
    onNext()
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
              >
                <RadioGroupItem value={method.id} />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <method.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{method.name}</div>
                  <div className="text-sm text-muted-foreground">{method.description}</div>
                </div>
                <div className="text-sm font-medium text-primary">{method.fee}</div>
              </label>
            ))}
          </div>
        </RadioGroup>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
            Back
          </Button>
          <Button onClick={handleNext} disabled={!selectedMethod} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
