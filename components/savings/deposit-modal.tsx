"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DepositModalProps {
  open: boolean
  onClose: () => void
}

export function DepositModal({ open, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")

  const handleDeposit = () => {
    // Handle deposit logic
    onClose()
  }

  const projectedInterest = (Number.parseFloat(amount) || 0) * 0.05

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit to Savings</DialogTitle>
          <DialogDescription>Transfer funds from your wallet to your savings account</DialogDescription>
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
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleDeposit} disabled={!amount || Number.parseFloat(amount) <= 0} className="flex-1">
              Deposit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
