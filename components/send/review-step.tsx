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
import { addTransaction, updateTransactionStatus } from "@/lib/utils/transactionHistory"

interface ReviewStepProps {
  data: SendMoneyData
  onConfirm: (txHash: string) => void
  onBack: () => void
}

export function ReviewStep({ data, onConfirm, onBack }: ReviewStepProps) {
  const { toast } = useToast()
  const { isConnected, address } = useAccount()
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

      // Get recipient wallet address
      const recipientAddress = data.recipient.walletAddress as `0x${string}`

      if (!recipientAddress || !recipientAddress.startsWith('0x')) {
        throw new Error('Invalid recipient wallet address')
      }

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

      // Add to transaction history
      if (address) {
        addTransaction(address, {
          hash,
          type: 'send',
          status: 'pending',
          amount: amount.toString(),
          currency: data.fromCurrency,
          fromCurrency: data.fromCurrency,
          toCurrency: data.toCurrency,
          recipient: recipientAddress,
          description: `Sent ${amount.toFixed(2)} ${data.fromCurrency} to ${data.recipient?.name || recipientAddress.slice(0, 10)}`
        })
      }

      // Wait for transaction to be mined
      setTimeout(() => {
        setTxState('success')

        // Update transaction status
        if (address) {
          updateTransactionStatus(address, hash, 'success')
        }
        
        // Trigger balance refresh event
        window.dispatchEvent(new Event('balanceUpdate'))
        
        toast({
          title: "Money sent successfully!",
          description: `${amount.toFixed(2)} ${data.fromCurrency} sent to ${data.recipient?.name}`,
        })

        // After showing success, navigate to confirmation
        setTimeout(() => {
          setIsModalOpen(false)
          onConfirm(hash)
          
          // Force page reload to ensure all balances update
          window.location.href = '/dashboard'
        }, 2000)
      }, 3000)

    } catch (err: any) {
      console.error('Transaction error:', err)

      // Update transaction status to failed if hash exists
      if (address && txHash) {
        updateTransactionStatus(address, txHash, 'failed')
      }

      let errorMessage = 'Transaction failed'
      if (err?.message) {
        if (err.message.includes('User rejected')) {
          errorMessage = 'Transaction rejected by user'
        } else if (err.message.includes('insufficient funds') || err.message.includes('insufficient balance')) {
          errorMessage = 'Insufficient funds in your LatinBridge balance. Please deposit more funds.'
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
                <div className="text-xs text-muted-foreground mt-1">
                  Funds will be deducted from your LatinBridge balance
                </div>
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
              <span className="font-semibold">Total from LatinBridge Balance</span>
              <span className="text-lg font-bold text-primary">
                {total.toFixed(2)} {data.fromCurrency}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
            <p className="text-blue-900 dark:text-blue-100">
              💡 <strong>Note:</strong> This amount will be deducted from your LatinBridge platform balance, not directly from your MetaMask wallet.
              Make sure you have sufficient balance in your LatinBridge account.
            </p>
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
