"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { QrCode, Link2, Copy, Share2, CheckCircle2, Download } from "lucide-react"
import { useAccount } from "wagmi"
import { QRCodeCanvas } from "qrcode.react"

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "COP", name: "Colombian Peso" },
  { code: "GTQ", name: "Guatemalan Quetzal" },
]

export function ReceiveMoneyInterface() {
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [note, setNote] = useState("")
  const [linkGenerated, setLinkGenerated] = useState(false)
  const [copied, setCopied] = useState(false)

  // Create payment data that includes wallet address
  const paymentData = JSON.stringify({
    address: address || '',
    amount: amount || '0',
    currency,
    note: note || '',
  })

  const handleGenerateLink = () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }
    setLinkGenerated(true)
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `latinbridge-payment-qr-${Date.now()}.png`
      link.href = url
      link.click()
    }
  }

  const handleShare = async () => {
    if (navigator.share && address) {
      try {
        await navigator.share({
          title: 'LatinBridge Payment Request',
          text: `Send ${amount ? `${amount} ${currency}` : 'payment'} via LatinBridge to: ${address}\n\nUse the "Send Money" feature on latinbridge.com and enter this address.`,
        })
      } catch (err) {
        console.error('Share error:', err)
      }
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Request Payment</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Generate a payment request for receiving money through LatinBridge platform
          </p>
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
            <CardTitle>Payment Request Generated</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Share this with the sender to receive money via LatinBridge
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center p-6 bg-white rounded-lg">
              <QRCodeCanvas
                id="qr-code"
                value={paymentData}
                size={192}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="space-y-2">
              <Label>Your LatinBridge ID</Label>
              <div className="flex gap-2">
                <Input
                  value={address || ''}
                  readOnly
                  className="flex-1 bg-muted font-mono text-sm"
                />
                <Button variant="outline" size="icon" onClick={handleCopyAddress}>
                  {copied ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3 mt-2">
                <p className="text-xs text-blue-900 dark:text-blue-200 font-medium mb-1">
                  💡 How to receive money:
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  Share this ID with the sender. They must use <strong>LatinBridge Send Money</strong> feature to send to this address. 
                  The money will appear in your <strong>LatinBridge balance</strong>, not your MetaMask wallet.
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                  They can send in any supported currency (USD, MXN, BRL, etc.) and you'll receive it in your chosen currency.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleDownloadQR}>
                <Download className="mr-2 h-4 w-4" />
                Download QR
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
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
