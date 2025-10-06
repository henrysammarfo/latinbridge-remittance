"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RateAlertModalProps {
  open: boolean
  onClose: () => void
  initialRate?: { from: string; to: string } | null
}

const currencies = ["USD", "MXN", "BRL", "ARS", "COP", "GTQ"]

export function RateAlertModal({ open, onClose, initialRate }: RateAlertModalProps) {
  const [fromCurrency, setFromCurrency] = useState(initialRate?.from || "USD")
  const [toCurrency, setToCurrency] = useState(initialRate?.to || "MXN")
  const [targetRate, setTargetRate] = useState("")
  const [condition, setCondition] = useState("above")

  const handleCreateAlert = () => {
    // Handle alert creation
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Rate Alert</DialogTitle>
          <DialogDescription>Get notified when exchange rates reach your target</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-currency">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="from-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-currency">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="to-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger id="condition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Goes above</SelectItem>
                <SelectItem value="below">Goes below</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-rate">Target Rate</Label>
            <Input
              id="target-rate"
              type="number"
              value={targetRate}
              onChange={(e) => setTargetRate(e.target.value)}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border">
            <div className="text-sm">
              <span className="text-muted-foreground">You'll be notified when </span>
              <span className="font-semibold">
                {fromCurrency}/{toCurrency}
              </span>
              <span className="text-muted-foreground"> {condition === "above" ? "goes above" : "goes below"} </span>
              <span className="font-semibold">{targetRate || "0.00"}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleCreateAlert} disabled={!targetRate} className="flex-1">
              Create Alert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
