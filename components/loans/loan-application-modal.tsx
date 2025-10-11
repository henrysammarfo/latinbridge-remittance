"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useLoans } from "@/lib/web3/hooks/useLoans"
import { Currency } from "@/lib/web3/hooks/useContracts"
import { useToast } from "@/hooks/use-toast"

interface LoanApplicationModalProps {
  open: boolean
  onClose: () => void
  maxAmount: string
  interestRate: number
  onSuccess?: () => void
}

export function LoanApplicationModal({ open, onClose, maxAmount, interestRate, onSuccess }: LoanApplicationModalProps) {
  const { toast } = useToast()
  const { applyForLoan } = useLoans()

  const [amount, setAmount] = useState("1000")
  const [currency, setCurrency] = useState("USD")
  const [term, setTerm] = useState([12])
  const [purpose, setPurpose] = useState("")
  const [collateral, setCollateral] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const maxLoanAmount = parseFloat(maxAmount || "0")
  const monthlyPayment = (Number.parseFloat(amount) * (1 + interestRate / 100)) / term[0]

  const getCurrencyEnum = (currencyCode: string): Currency => {
    switch (currencyCode) {
      case 'USD': return Currency.USD
      case 'MXN': return Currency.MXN
      case 'BRL': return Currency.BRL
      case 'ARS': return Currency.ARS
      case 'COP': return Currency.COP
      case 'GTQ': return Currency.GTQ
      default: return Currency.USD
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      toast({
        title: "Submitting application...",
        description: "Please confirm the transaction in your wallet"
      })

      const currencyEnum = getCurrencyEnum(currency)
      const termMonths = term[0]
      const durationDays = termMonths * 30 // Convert months to days
      // Note: Collateral is not yet implemented in the smart contract

      await applyForLoan(
        amount,
        currencyEnum,
        durationDays,
        purpose
      )

      toast({
        title: "Loan approved!",
        description: `Your loan of ${amount} ${currency} has been approved and funds are now available`
      })

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }

      // Close modal
      onClose()

      // Reset form
      setAmount("1000")
      setCurrency("USD")
      setTerm([12])
      setPurpose("")
      setCollateral("")

    } catch (error: any) {
      console.error("Loan application error:", error)

      let errorMessage = "Failed to submit loan application"
      if (error?.message?.includes("User rejected")) {
        errorMessage = "Transaction rejected by user"
      } else if (error?.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for collateral"
      } else if (error?.message?.includes("not eligible")) {
        errorMessage = "You are not eligible for this loan amount"
      }

      toast({
        title: "Application failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply for Microloan</DialogTitle>
          <DialogDescription>Complete the application to get funds instantly</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="loan-amount">Loan Amount</Label>
            <div className="flex gap-2">
              <Input
                id="loan-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                className="flex-1"
                disabled={isSubmitting}
              />
              <Select value={currency} onValueChange={setCurrency} disabled={isSubmitting}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="MXN">MXN</SelectItem>
                  <SelectItem value="BRL">BRL</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                  <SelectItem value="COP">COP</SelectItem>
                  <SelectItem value="GTQ">GTQ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-muted-foreground">
              Minimum: $50 • Maximum: ${maxLoanAmount.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Repayment Term: {term[0]} months</Label>
            <Slider
              value={term}
              onValueChange={setTerm}
              min={3}
              max={24}
              step={1}
              className="py-4"
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3 months</span>
              <span>24 months</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collateral">Collateral Amount (Optional)</Label>
            <Input
              id="collateral"
              type="number"
              value={collateral}
              onChange={(e) => setCollateral(e.target.value)}
              placeholder="0"
              disabled={isSubmitting}
            />
            <div className="text-xs text-muted-foreground">
              Providing collateral may improve your loan terms
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Loan Purpose</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="What will you use this loan for?"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Loan Amount</span>
              <span className="font-medium">
                {amount} {currency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Interest Rate (APR)</span>
              <span className="font-medium">{interestRate}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Repayment Term</span>
              <span className="font-medium">{term[0]} months</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Repayment</span>
              <span className="font-medium">
                {(Number.parseFloat(amount) * (1 + interestRate / 100)).toFixed(2)} {currency}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="font-semibold">Monthly Payment</span>
              <span className="text-lg font-bold text-primary">
                {monthlyPayment.toFixed(2)} {currency}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !amount ||
                Number.parseFloat(amount) < 50 ||
                Number.parseFloat(amount) > maxLoanAmount ||
                !purpose ||
                isSubmitting
              }
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
