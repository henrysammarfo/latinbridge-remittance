"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { QrCode, Link2, Copy, Share2, CheckCircle2 } from "lucide-react"

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "COP", name: "Colombian Peso" },
  { code: "GTQ", name: "Guatemalan Quetzal" },
]

export function ReceiveMoneyInterface() {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [note, setNote] = useState("")
  const [linkGenerated, setLinkGenerated] = useState(false)
  const [copied, setCopied] = useState(false)

  const paymentLink = `https://latinbridge.app/pay/${Date.now().toString(36)}`

  const handleGenerateLink = () => {
    setLinkGenerated(true)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Request Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1"
              />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's this payment for?"
              rows={3}
            />
          </div>

          <Button onClick={handleGenerateLink} className="w-full">
            <Link2 className="mr-2 h-4 w-4" />
            Generate Payment Link
          </Button>
        </CardContent>
      </Card>

      {linkGenerated && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Payment Link Generated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center p-6 bg-white rounded-lg">
              <div className="h-48 w-48 bg-muted flex items-center justify-center rounded-lg border-2 border-dashed">
                <QrCode className="h-24 w-24 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Link</Label>
              <div className="flex gap-2">
                <Input value={paymentLink} readOnly className="flex-1 bg-muted" />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  {copied ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                Download QR
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Link
              </Button>
            </div>

            {amount && (
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="text-sm text-muted-foreground mb-1">Requesting</div>
                <div className="text-2xl font-bold">
                  {Number.parseFloat(amount).toFixed(2)} {currency}
                </div>
                {note && <div className="text-sm text-muted-foreground mt-2">{note}</div>}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
