"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Building2, Wallet } from "lucide-react"
import type { SendMoneyData } from "./send-money-flow"

const paymentMethods = [
  {
    id: "wallet",
    name: "LatinBridge Wallet",
    icon: Wallet,
    description: "Instant • Use your balance",
    fee: "Free",
    recommended: true,
  },
]

// Disabled payment methods (for mainnet)
const comingSoonMethods = [
  {
    id: "card",
    name: "Debit/Credit Card",
    icon: CreditCard,
    description: "Coming on mainnet",
    fee: "N/A",
  },
  {
    id: "bank",
    name: "Bank Account",
    icon: Building2,
    description: "Coming on mainnet",
    fee: "N/A",
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
                className="flex items-center gap-4 p-4 rounded-lg border-2 border-primary bg-primary/5 cursor-pointer"
              >
                <RadioGroupItem value={method.id} checked={method.recommended} />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <method.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {method.name}
                    {method.recommended && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{method.description}</div>
                </div>
                <div className="text-sm font-medium text-primary">{method.fee}</div>
              </label>
            ))}
            
            {comingSoonMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center gap-4 p-4 rounded-lg border opacity-50 cursor-not-allowed"
              >
                <div className="h-4 w-4 rounded-full border-2 border-muted" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/10">
                  <method.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-muted-foreground">{method.name}</div>
                  <div className="text-sm text-muted-foreground">{method.description}</div>
                </div>
                <div className="text-sm text-muted-foreground">{method.fee}</div>
              </div>
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
