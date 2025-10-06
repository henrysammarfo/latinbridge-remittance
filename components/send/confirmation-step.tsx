'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Share2, ExternalLink, Copy } from "lucide-react"
import Link from "next/link"
import type { SendMoneyData } from "./send-money-flow"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ConfirmationStepProps {
  data: SendMoneyData
  txHash?: string
}

export function ConfirmationStep({ data, txHash }: ConfirmationStepProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const amount = Number.parseFloat(data.amount) || 0
  const recipientReceives = amount * data.exchangeRate
  const transactionId = txHash?.slice(0, 16) || `LB${Date.now().toString().slice(-8)}`

  const getBlockExplorerUrl = (hash: string) => {
    return `https://blockscout-passet-hub.parity-testnet.parity.io/tx/${hash}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Transaction hash copied to clipboard"
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Transfer Successful!</h2>
        <p className="text-muted-foreground mb-8">Your money is on its way to {data.recipient?.name}</p>

        <div className="space-y-4 mb-8 text-left">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">Transaction Hash</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-xs">{transactionId}...</span>
              {txHash && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(txHash)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {txHash && (
            <div className="flex items-center justify-center">
              <a
                href={getBlockExplorerUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                View on Block Explorer
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">Amount Sent</span>
            <span className="font-medium">
              {amount.toFixed(2)} {data.fromCurrency}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">Recipient Gets</span>
            <span className="font-medium">
              {recipientReceives.toFixed(2)} {data.toCurrency}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">Estimated Arrival</span>
            <span className="font-medium">Within 5 minutes</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1 bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button asChild className="flex-1">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <Link href="/send">Send Again</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
