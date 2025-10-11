"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExternalLink, Wallet, Info, CheckCircle2, CreditCard, Building2, ArrowRight } from "lucide-react"
import { useAccount } from "wagmi"
import { useState } from "react"

export function AddMoneyInterface() {
  const { address, isConnected } = useAccount()
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Testnet Method - Primary */}
      <Card className="border-primary/50">
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
    </div>
  )
}
