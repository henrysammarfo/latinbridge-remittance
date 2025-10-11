"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSavings } from "@/lib/web3/hooks/useSavings"
import { Currency } from "@/lib/web3/hooks/useContracts"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface DepositModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function DepositModal({ open, onClose, onSuccess }: DepositModalProps) {
  const { deposit } = useSavings()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    try {
      setIsSubmitting(true)
      
      toast({
        title: "Processing deposit...",
        description: "Please confirm the transaction in your wallet"
      })

      const currencyEnum = getCurrencyEnum(currency)
      await deposit(currencyEnum, amount)

      toast({
        title: "Deposit successful!",
        description: `${amount} ${currency} deposited to savings`
      })

      if (onSuccess) onSuccess()
      setAmount("")
      onClose()

    } catch (error: any) {
      console.error("Deposit error:", error)

      let errorMessage = "Failed to deposit to savings"
      if (error?.message?.includes("User rejected")) {
        errorMessage = "Transaction rejected by user"
      } else if (error?.message?.includes("insufficient")) {
        errorMessage = "Insufficient balance in LatinBridge account"
      }

      toast({
        title: "Deposit failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const projectedInterest = (Number.parseFloat(amount) || 0) * 0.05

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit to Savings</DialogTitle>
          <DialogDescription>Transfer funds from your LatinBridge balance to your savings account to earn 5% APY</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="deposit-amount">Amount</Label>
            <div className="flex gap-2">
              <Input
                id="deposit-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1"
              />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="MXN">MXN</SelectItem>
                  <SelectItem value="BRL">BRL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Deposit Amount</span>
              <span className="font-medium">
                {amount || "0.00"} {currency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Projected Annual Interest</span>
              <span className="font-medium text-primary">
                +{projectedInterest.toFixed(2)} {currency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <span className="font-semibold">APY Rate</span>
              <span className="font-bold text-primary">5.0%</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeposit} 
              disabled={!amount || Number.parseFloat(amount) <= 0 || isSubmitting} 
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Deposit'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
