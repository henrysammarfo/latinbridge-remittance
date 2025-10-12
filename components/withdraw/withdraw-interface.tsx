"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, Info, ArrowDownToLine, Loader2, AlertCircle } from "lucide-react"
import { useAccount } from "wagmi"
import { useState } from "react"
import { useRemittance } from "@/lib/web3/hooks/useRemittance"
import { Currency } from "@/lib/web3/hooks/useContracts"
import { useToast } from "@/hooks/use-toast"
import { TransactionModal, TransactionState } from "@/components/shared/TransactionModal"
import { addTransaction, updateTransactionStatus } from "@/lib/utils/transactionHistory"

export function WithdrawInterface() {
  const { address, isConnected } = useAccount()
  const { withdraw, pasBalance, useBalanceOf } = useRemittance()
  const { toast } = useToast()
  
  // Withdraw form state
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawCurrency, setWithdrawCurrency] = useState<string>("USD")
  const [txState, setTxState] = useState<TransactionState>('idle')
  const [txHash, setTxHash] = useState<string>()
  const [error, setError] = useState<string>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get currency enum
  const getCurrencyEnum = (code: string): Currency => {
    switch (code) {
      case 'USD': return Currency.USD
      case 'MXN': return Currency.MXN
      case 'BRL': return Currency.BRL
      case 'ARS': return Currency.ARS
      case 'COP': return Currency.COP
      case 'GTQ': return Currency.GTQ
      default: return Currency.USD
    }
  }

  const { balance: currencyBalance, refetch } = useBalanceOf(getCurrencyEnum(withdrawCurrency))

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      })
      return
    }

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      })
      return
    }

    if (parseFloat(withdrawAmount) > parseFloat(currencyBalance)) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${parseFloat(currencyBalance).toFixed(2)} ${withdrawCurrency} in LatinBridge`,
        variant: "destructive"
      })
      return
    }

    try {
      setIsModalOpen(true)
      setTxState('signing')
      setError(undefined)

      const hash = await withdraw(getCurrencyEnum(withdrawCurrency), withdrawAmount)

      setTxHash(hash)
      setTxState('pending')

      // Add to transaction history
      if (address) {
        addTransaction(address, {
          hash,
          type: 'withdraw',
          status: 'pending',
          amount: withdrawAmount,
          currency: withdrawCurrency,
          description: `Withdrew ${withdrawAmount} ${withdrawCurrency} to wallet`
        })
      }

      // Wait for transaction to be mined
      setTimeout(async () => {
        setTxState('success')

        // Update transaction status
        if (address) {
          updateTransactionStatus(address, hash, 'success')
        }

        // Refetch balance from blockchain
        await refetch()

        // Trigger a page-wide refresh event
        window.dispatchEvent(new Event('balanceUpdate'))
        
        toast({
          title: "Withdrawal successful!",
          description: `${withdrawAmount} ${withdrawCurrency} withdrawn to your wallet`,
        })

        setTimeout(() => {
          setIsModalOpen(false)
          setWithdrawAmount("")
        }, 1500)
      }, 3000)

    } catch (err: any) {
      console.error('Withdraw error:', err)

      // Update transaction status to failed if hash exists
      if (address && txHash) {
        updateTransactionStatus(address, txHash, 'failed')
      }

      let errorMessage = 'Withdrawal failed'
      if (err?.message) {
        if (err.message.includes('User rejected')) {
          errorMessage = 'Transaction rejected by user'
        } else if (err.message.includes('insufficient')) {
          errorMessage = 'Insufficient balance in LatinBridge account'
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
      setTxState('error')
      
      toast({
        title: "Withdrawal failed",
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
    <div className="space-y-6">
      {/* Withdraw from LatinBridge */}
      <Card className="border-primary/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowDownToLine className="h-5 w-5 text-primary" />
            <CardTitle>Withdraw to Wallet</CardTitle>
          </div>
          <CardDescription>
            Withdraw your LatinBridge balance back to your MetaMask wallet as PAS tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to withdraw funds
              </AlertDescription>
            </Alert>
          ) : parseFloat(currencyBalance) === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You don't have any {withdrawCurrency} balance in LatinBridge to withdraw.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>How Withdrawal Works</AlertTitle>
                <AlertDescription className="text-sm">
                  When you withdraw, your LatinBridge balance is converted to PAS tokens and sent back to your MetaMask wallet.
                  You can then use these tokens anywhere or deposit them again later.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdraw-currency">Currency to Withdraw</Label>
                  <Select value={withdrawCurrency} onValueChange={setWithdrawCurrency}>
                    <SelectTrigger id="withdraw-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="MXN">MXN - Mexican Peso</SelectItem>
                      <SelectItem value="BRL">BRL - Brazilian Real</SelectItem>
                      <SelectItem value="ARS">ARS - Argentine Peso</SelectItem>
                      <SelectItem value="COP">COP - Colombian Peso</SelectItem>
                      <SelectItem value="GTQ">GTQ - Guatemalan Quetzal</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Available balance: {parseFloat(currencyBalance).toFixed(2)} {withdrawCurrency}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdraw-amount">Amount</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    max={currencyBalance}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Available: {parseFloat(currencyBalance).toFixed(2)} {withdrawCurrency}</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => setWithdrawAmount(currencyBalance)}
                    >
                      Withdraw All
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Withdrawal Amount:</span>
                  <span className="font-medium">{withdrawAmount || '0.00'} {withdrawCurrency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">You will receive (PAS):</span>
                  <span className="font-medium">{withdrawAmount || '0.00'} PAS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Destination:</span>
                  <span className="font-medium font-mono text-xs">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || txState !== 'idle'}
              >
                {txState === 'idle' ? (
                  <>
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                    Withdraw {withdrawAmount || '0'} {withdrawCurrency}
                  </>
                ) : (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-base">Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <strong>• What happens when you withdraw:</strong><br/>
            Your LatinBridge balance is converted back to PAS tokens and sent to your connected MetaMask wallet.
          </div>
          <div>
            <strong>• Withdrawal time:</strong><br/>
            Withdrawals are processed instantly on the blockchain, typically taking 3-5 seconds.
          </div>
          <div>
            <strong>• Where to find your funds:</strong><br/>
            After withdrawal, check your MetaMask wallet for the PAS tokens. You can then use them for any purpose.
          </div>
          <div>
            <strong>• Gas fees:</strong><br/>
            You'll need to pay a small gas fee for the blockchain transaction (usually ~$0.01 in PAS).
          </div>
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        state={txState}
        txHash={txHash}
        error={error}
        title="Withdraw Funds"
        description={`Withdrawing ${withdrawAmount} ${withdrawCurrency} to your wallet`}
      />
    </div>
  )
}
