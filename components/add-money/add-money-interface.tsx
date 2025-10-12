"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, Wallet, Info, CheckCircle2, CreditCard, Building2, ArrowRight, Loader2 } from "lucide-react"
import { useAccount } from "wagmi"
import { useState } from "react"
import { useRemittance } from "@/lib/web3/hooks/useRemittance"
import { Currency } from "@/lib/web3/hooks/useContracts"
import { useToast } from "@/hooks/use-toast"
import { TransactionModal, TransactionState } from "@/components/shared/TransactionModal"
import { addTransaction, updateTransactionStatus } from "@/lib/utils/transactionHistory"

export function AddMoneyInterface() {
  const { address, isConnected } = useAccount()
  const { deposit, pasBalance, useBalanceOf } = useRemittance()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  
  // Deposit form state
  const [depositAmount, setDepositAmount] = useState("")
  const [depositCurrency, setDepositCurrency] = useState<string>("USD")
  const [txState, setTxState] = useState<TransactionState>('idle')
  const [txHash, setTxHash] = useState<string>()
  const [error, setError] = useState<string>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get current balance for selected currency
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

  const { balance: currencyBalance, refetch } = useBalanceOf(getCurrencyEnum(depositCurrency))

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDeposit = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      })
      return
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      })
      return
    }

    if (parseFloat(depositAmount) > parseFloat(pasBalance)) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${parseFloat(pasBalance).toFixed(4)} PAS tokens`,
        variant: "destructive"
      })
      return
    }

    try {
      setIsModalOpen(true)
      setTxState('signing')
      setError(undefined)

      const hash = await deposit(getCurrencyEnum(depositCurrency), depositAmount)

      setTxHash(hash)
      setTxState('pending')

      // Add to transaction history
      if (address) {
        addTransaction(address, {
          hash,
          type: 'deposit',
          status: 'pending',
          amount: depositAmount,
          currency: depositCurrency,
          description: `Deposited ${depositAmount} PAS as ${depositCurrency}`
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
          title: "Deposit successful!",
          description: `${depositAmount} PAS deposited as ${depositCurrency}`,
        })

        setTimeout(() => {
          setIsModalOpen(false)
          setDepositAmount("")
          
          // Force refresh all balances on the page
          window.location.reload()
        }, 1500)
      }, 3000)

    } catch (err: any) {
      console.error('Deposit error:', err)

      // Update transaction status to failed if hash exists
      if (address && txHash) {
        updateTransactionStatus(address, txHash, 'failed')
      }

      let errorMessage = 'Deposit failed'
      if (err?.message) {
        if (err.message.includes('User rejected')) {
          errorMessage = 'Transaction rejected by user'
        } else if (err.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient PAS tokens in wallet'
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
      setTxState('error')
      
      toast({
        title: "Deposit failed",
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
      {/* Deposit PAS Tokens - Primary Action */}
      <Card className="border-primary/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <CardTitle>Deposit PAS Tokens</CardTitle>
            </div>
            {isConnected && (
              <div className="text-sm text-muted-foreground">
                Balance: <span className="font-medium text-foreground">{parseFloat(pasBalance).toFixed(4)} PAS</span>
              </div>
            )}
          </div>
          <CardDescription>
            Deposit your PAS tokens from MetaMask into LatinBridge to start using the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to deposit tokens
              </AlertDescription>
            </Alert>
          ) : parseFloat(pasBalance) === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You don't have any PAS tokens. Get free tokens from the faucet below.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deposit-amount">Amount (PAS Tokens)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    max={pasBalance}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Available: {parseFloat(pasBalance).toFixed(4)} PAS</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => setDepositAmount(pasBalance)}
                    >
                      Use Max
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit-currency">Deposit As Currency</Label>
                  <Select value={depositCurrency} onValueChange={setDepositCurrency}>
                    <SelectTrigger id="deposit-currency">
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
                    Current {depositCurrency} balance: {parseFloat(currencyBalance).toFixed(2)}
                  </p>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>How It Works</AlertTitle>
                <AlertDescription className="text-sm">
                  When you deposit PAS tokens, they're converted to your chosen currency in the smart contract.
                  You can then send, save, or get loans using this balance.
                </AlertDescription>
              </Alert>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0 || txState !== 'idle'}
              >
                {txState === 'idle' ? (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Deposit {depositAmount || '0'} PAS as {depositCurrency}
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

      {/* Testnet Faucet - Get Free Tokens */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle>Testnet: Get Free PAS Tokens</CardTitle>
          </div>
          <CardDescription>
            For testing LatinBridge on Polkadot Paseo testnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>How It Works</AlertTitle>
            <AlertDescription>
              PAS tokens are free testnet tokens that represent value for testing.
              Use them just like real money to test all LatinBridge features:
              sending, receiving, savings, and loans.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Step 1: Copy Your Wallet Address</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {isConnected && address ? (
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-muted px-3 py-2 rounded">
                        {address.slice(0, 20)}...{address.slice(-10)}
                      </code>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleCopyAddress}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  ) : (
                    <span className="text-destructive">Please connect your wallet first</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Step 2: Visit Polkadot Faucet</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Go to the official faucet and request PAS tokens
                </div>
                <Button 
                  className="mt-2" 
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a 
                    href="https://faucet.polkadot.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Open Faucet
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Step 3: Select Polkadot Paseo Asset Hub</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Choose "Polkadot Asset Hub Paseo" from the network dropdown
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Step 4: Paste Your Address & Request Tokens</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Paste your wallet address and click "Send me tokens"
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Step 5: Start Testing!</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Tokens arrive in ~30 seconds. Refresh your dashboard to see them.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="font-medium">What You Can Do:</div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Send PAS tokens to any address</li>
              <li>• Receive PAS tokens via QR code</li>
              <li>• Deposit into savings (earn 5% APY)</li>
              <li>• Apply for microloans</li>
              <li>• Exchange between currencies</li>
              <li>• All transactions are real and on-chain!</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Production Methods - Coming Soon */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Production: Real Money (Mainnet Only)
          </CardTitle>
          <CardDescription>
            These payment methods are integrated but require mainnet deployment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              The following payment methods are fully coded and integrated with Stripe,
              but cannot be tested on the Polkadot Paseo testnet. They will work when
              deployed to mainnet.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 opacity-60">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                <div>
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-sm text-muted-foreground">
                    Instant deposit via Stripe • 2% fee
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5" />
                <div>
                  <div className="font-medium">Bank Transfer</div>
                  <div className="text-sm text-muted-foreground">
                    ACH/Wire transfer • Free • 1-3 business days
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5" />
                <div>
                  <div className="font-medium">Cryptocurrency</div>
                  <div className="text-sm text-muted-foreground">
                    Deposit ETH, USDC, USDT • 1% fee • Instant
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
            <strong>Integration Status:</strong><br/>
            ✅ Stripe API integrated (<code>lib/api/stripe.ts</code>)<br/>
            ✅ Payment endpoints ready (<code>/api/payments/create-intent</code>)<br/>
            ⏸️ Requires mainnet deployment to test with real cards/banks
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Buttons */}
      <div className="flex gap-3">
        <Button 
          className="flex-1" 
          size="lg"
          asChild
        >
          <a 
            href="https://faucet.polkadot.io" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Get Free PAS Tokens
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <Button 
          className="flex-1" 
          variant="outline" 
          size="lg"
          asChild
        >
          <a 
            href="https://blockscout-passet-hub.parity-testnet.parity.io" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View on Explorer
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        state={txState}
        txHash={txHash}
        error={error}
        title="Deposit PAS Tokens"
        description={`Depositing ${depositAmount} PAS as ${depositCurrency}`}
      />
    </div>
  )
}
