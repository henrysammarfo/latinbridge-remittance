'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle, ExternalLink, Copy } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export type TransactionState = 'idle' | 'signing' | 'pending' | 'success' | 'error'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  state: TransactionState
  txHash?: string
  error?: string
  title?: string
  description?: string
}

export function TransactionModal({
  isOpen,
  onClose,
  state,
  txHash,
  error,
  title = "Transaction",
  description
}: TransactionModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8">
          {state === 'signing' && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Waiting for Signature</h3>
              <p className="text-sm text-muted-foreground text-center">
                Please sign the transaction in your wallet
              </p>
            </>
          )}

          {state === 'pending' && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transaction Pending</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Your transaction is being processed on the blockchain
              </p>
              {txHash && (
                <div className="w-full space-y-2">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <span className="text-xs font-mono truncate flex-1">{txHash}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(txHash)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <a
                    href={getBlockExplorerUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                  >
                    View on Block Explorer
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </>
          )}

          {state === 'success' && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transaction Successful!</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Your transaction has been confirmed on the blockchain
              </p>
              {txHash && (
                <div className="w-full space-y-2">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <span className="text-xs font-mono truncate flex-1">{txHash}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(txHash)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <a
                    href={getBlockExplorerUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                  >
                    View on Block Explorer
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </>
          )}

          {state === 'error' && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transaction Failed</h3>
              <p className="text-sm text-muted-foreground text-center mb-2">
                {error || "An error occurred while processing your transaction"}
              </p>
              <div className="w-full p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-mono break-all">
                {error}
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          {(state === 'success' || state === 'error') && (
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          )}
          {state === 'idle' && (
            <Button variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
