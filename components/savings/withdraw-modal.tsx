"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WithdrawModalProps {
  open: boolean
  onClose: () => void
}

export function WithdrawModal({ open, onClose }: WithdrawModalProps) {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")

  const availableBalance = 2000.0

  const handleWithdraw = () => {
    // Handle withdraw logic
    onClose()
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
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={!amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > availableBalance}
              className="flex-1"
            >
              Withdraw
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
