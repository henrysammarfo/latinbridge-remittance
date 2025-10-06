"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2 } from "lucide-react"

interface Network {
  id: string
  name: string
  country: string
  description: string
  icon: string
}

interface ConnectNetworkModalProps {
  open: boolean
  onClose: () => void
  network?: Network
}

export function ConnectNetworkModal({ open, onClose, network }: ConnectNetworkModalProps) {
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [bankName, setBankName] = useState("")

  const handleConnect = () => {
    // Handle network connection
    onClose()
  }

  if (!network) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect {network.name}</DialogTitle>
          <DialogDescription>Enter your account details to connect {network.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border">
            <div className="text-3xl">{network.icon}</div>
            <div>
              <div className="font-semibold">{network.name}</div>
              <div className="text-sm text-muted-foreground">{network.country}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input
              id="bank-name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter your bank name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-name">Account Holder Name</Label>
            <Input
              id="account-name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Enter account holder name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-number">Account Number</Label>
            <Input
              id="account-number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
            />
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="text-muted-foreground">
                Your account information is encrypted and securely stored. We never share your data with third parties.
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={!accountNumber || !accountName || !bankName} className="flex-1">
              Connect Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
