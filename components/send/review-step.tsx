"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, DollarSign, CreditCard, ArrowRight } from "lucide-react"
import type { SendMoneyData } from "./send-money-flow"
import { useRemittance } from "@/lib/web3/hooks/useRemittance"
import { Currency } from "@/lib/web3/hooks/useContracts"
import { TransactionModal, TransactionState } from "@/components/shared/TransactionModal"
import { useToast } from "@/hooks/use-toast"
import { useAccount } from "wagmi"

interface ReviewStepProps {
  data: SendMoneyData
  onConfirm: (txHash: string) => void
  onBack: () => void
}

export function ReviewStep({ data, onConfirm, onBack }: ReviewStepProps) {
  const { toast } = useToast()
  const { isConnected } = useAccount()
  const { sendRemittance } = useRemittance()

  const [txState, setTxState] = useState<TransactionState>('idle')
  const [txHash, setTxHash] = useState<string>()
  const [error, setError] = useState<string>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const amount = Number.parseFloat(data.amount) || 0
  const fee = amount * 0.005
  const total = amount + fee
  const recipientReceives = amount * data.exchangeRate

  const paymentMethodName =
    data.paymentMethod === "card"
      ? "Debit/Credit Card"
      : data.paymentMethod === "bank"
        ? "Bank Account"
        : "LatinBridge Wallet"

  // Currency mapping
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

  const handleConfirm = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send money",
        variant: "destructive"
      })
      return
    }

    if (!data.recipient) {
      toast({
        title: "No recipient",
        description: "Please select a recipient",
        variant: "destructive"
      })
      return
    }

    try {
      // Open modal and set signing state
      setIsModalOpen(true)
      setTxState('signing')
      setError(undefined)

      // Get currency enums
      const fromCurrency = getCurrencyEnum(data.fromCurrency)
      const toCurrency = getCurrencyEnum(data.toCurrency)

      // For demo, we'll use the recipient's ID as an address
      // In production, you'd fetch the actual wallet address from your backend
      const recipientAddress = data.recipient.id as `0x${string}`

      // Send the remittance
      const hash = await sendRemittance(
        recipientAddress,
        amount.toString(),
        fromCurrency,
        toCurrency
      )

      // Transaction submitted, now pending
      setTxHash(hash)
      setTxState('pending')

      // Wait for confirmation (you could use waitForTransaction here)
      // For now, we'll just show success after a short delay
      setTimeout(() => {
        setTxState('success')

        // After showing success, close modal and navigate to confirmation
        setTimeout(() => {
          setIsModalOpen(false)
          onConfirm(hash)
        }, 2000)
      }, 3000)

    } catch (err: any) {
      console.error('Transaction error:', err)

      let errorMessage = 'Transaction failed'
      if (err?.message) {
        if (err.message.includes('User rejected')) {
          errorMessage = 'Transaction rejected by user'
        } else if (err.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds in wallet'
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
      setTxState('error')

      toast({
        title: "Transaction failed",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTxState('idle')
    setTxHash(undefined)
    setError(undefined)
  }

  return (
    <>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Review Transfer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">Recipient</div>
                <div className="font-medium">{data.recipient?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {data.recipient?.email} • {data.recipient?.country}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">Amount</div>
                <div className="font-medium">
                  {amount.toFixed(2)} {data.fromCurrency}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>
                    Recipient gets: {recipientReceives.toFixed(2)} {data.toCurrency}
                  </span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">Payment Method</div>
                <div className="font-medium">{paymentMethodName}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Transfer Amount</span>
              <span className="font-medium">
                {amount.toFixed(2)} {data.fromCurrency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fee (0.5%)</span>
              <span className="font-medium">
                {fee.toFixed(2)} {data.fromCurrency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span className="font-medium">
                1 {data.fromCurrency} = {data.exchangeRate} {data.toCurrency}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="font-semibold">Total to Pay</span>
              <span className="text-lg font-bold text-primary">
                {total.toFixed(2)} {data.fromCurrency}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              Back
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
              disabled={!isConnected || txState !== 'idle'}
            >
              {txState !== 'idle' ? 'Processing...' : 'Confirm & Send'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        state={txState}
        txHash={txHash}
        error={error}
        title="Send Remittance"
        description="Sending money via LatinBridge smart contract"
      />
    </>
  )
}
