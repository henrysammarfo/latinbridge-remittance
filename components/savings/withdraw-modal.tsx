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
import { useAccount } from "wagmi"
import { addTransaction, updateTransactionStatus } from "@/lib/utils/transactionHistory"

interface WithdrawModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function WithdrawModal({ open, onClose, onSuccess }: WithdrawModalProps) {
  const { withdraw, useBalance } = useSavings()
  const { toast } = useToast()
  const { address } = useAccount()
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

  const currencyEnum = getCurrencyEnum(currency)
  const { balance } = useBalance(currencyEnum)
  const availableBalance = parseFloat(balance || '0')

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    try {
      setIsSubmitting(true)
      
      toast({
        title: "Processing withdrawal...",
        description: "Please confirm the transaction in your wallet"
      })

      const hash = await withdraw(currencyEnum, amount)

      // Add to transaction history
      if (address && hash) {
        addTransaction(address, {
          hash,
          type: 'savings_withdraw',
          status: 'pending',
          amount,
          currency,
          description: `Withdrew ${amount} ${currency} from savings`
        })

        // Update to success after a delay
        setTimeout(() => {
          updateTransactionStatus(address, hash, 'success')
        }, 3000)
      }

      toast({
        title: "Withdrawal successful!",
        description: `${amount} ${currency} withdrawn from savings to your LatinBridge balance`
      })

      // Trigger balance refresh
      window.dispatchEvent(new Event('balanceUpdate'))

      if (onSuccess) onSuccess()
      setAmount("")
      onClose()

    } catch (error: any) {
      console.error("Withdraw error:", error)

      let errorMessage = "Failed to withdraw from savings"
      if (error?.message?.includes("User rejected")) {
        errorMessage = "Transaction rejected by user"
      } else if (error?.message?.includes("insufficient")) {
        errorMessage = "Insufficient balance in savings"
      }

      toast({
        title: "Withdrawal failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw from Savings</DialogTitle>
          <DialogDescription>Transfer funds from your savings account to your wallet</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-3 rounded-lg bg-muted/50 border">
            <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
            <div className="text-xl font-bold">
              ${availableBalance.toFixed(2)} {currency}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Amount</Label>
            <div className="flex gap-2">
              <Input
                id="withdraw-amount"
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
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-primary"
              onClick={() => setAmount(availableBalance.toString())}
            >
              Withdraw all
            </Button>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={!amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > availableBalance || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Withdraw'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
