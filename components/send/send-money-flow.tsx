"use client"

import { useState } from "react"
import { RecipientStep } from "./recipient-step"
import { AmountStep } from "./amount-step"
import { PaymentMethodStep } from "./payment-method-step"
import { ReviewStep } from "./review-step"
import { ConfirmationStep } from "./confirmation-step"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

type Step = "recipient" | "amount" | "payment" | "review" | "confirmation"

export interface SendMoneyData {
  recipient: {
    id: string
    name: string
    email: string
    phone: string
    country: string
    walletAddress: string
  } | null
  amount: string
  fromCurrency: string
  toCurrency: string
  paymentMethod: string
  exchangeRate: number
}

const steps: { id: Step; label: string }[] = [
  { id: "recipient", label: "Recipient" },
  { id: "amount", label: "Amount" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
]

export function SendMoneyFlow() {
  const [currentStep, setCurrentStep] = useState<Step>("recipient")
  const [txHash, setTxHash] = useState<string>()
  const [data, setData] = useState<SendMoneyData>({
    recipient: null,
    amount: "",
    fromCurrency: "USD",
    toCurrency: "MXN",
    paymentMethod: "",
    exchangeRate: 18.5,
  })

  const updateData = (updates: Partial<SendMoneyData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const getCurrentStepIndex = () => steps.findIndex((s) => s.id === currentStep)

  const handleConfirm = (hash: string) => {
    setTxHash(hash)
    setCurrentStep("confirmation")
  }

  if (currentStep === "confirmation") {
    return <ConfirmationStep data={data} txHash={txHash} />
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < getCurrentStepIndex()
              const isCurrent = step.id === currentStep

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : isCurrent
                            ? "border-primary text-primary"
                            : "border-border text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span>{index + 1}</span>}
                    </div>
                    <div
                      className={`mt-2 text-sm font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 -mt-8 ${isCompleted ? "bg-primary" : "bg-border"} transition-colors`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {currentStep === "recipient" && (
        <RecipientStep data={data} updateData={updateData} onNext={() => setCurrentStep("amount")} />
      )}
      {currentStep === "amount" && (
        <AmountStep
          data={data}
          updateData={updateData}
          onNext={() => setCurrentStep("payment")}
          onBack={() => setCurrentStep("recipient")}
        />
      )}
      {currentStep === "payment" && (
        <PaymentMethodStep
          data={data}
          updateData={updateData}
          onNext={() => setCurrentStep("review")}
          onBack={() => setCurrentStep("amount")}
        />
      )}
      {currentStep === "review" && (
        <ReviewStep
          data={data}
          onConfirm={handleConfirm}
          onBack={() => setCurrentStep("payment")}
        />
      )}
    </div>
  )
}
