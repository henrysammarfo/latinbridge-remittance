'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Wallet, AlertCircle, Loader2 } from 'lucide-react'
import { useAccount, useConnect } from 'wagmi'
import { useUserRegistry } from '@/lib/web3/hooks/useUserRegistry'

export default function LoginPage() {
  const router = useRouter()
  const { isConnected, address } = useAccount()
  const { connect, connectors, isPending, error: connectError } = useConnect()
  const { isRegistered } = useUserRegistry()
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(false)

  // Check registration status and redirect accordingly
  useEffect(() => {
    const checkAndRedirect = async () => {
      if (isConnected && address) {
        try {
          setIsCheckingRegistration(true)

          if (isRegistered) {
            // User is registered, go to dashboard
            router.push('/dashboard')
          } else {
            // User is not registered, go to onboarding
            router.push('/onboarding')
          }
        } catch (error) {
          console.error('Error checking registration:', error)
          // On error, default to onboarding
          router.push('/onboarding')
        } finally {
          setIsCheckingRegistration(false)
        }
      }
    }

    checkAndRedirect()
  }, [isConnected, address, router, isRegistered])

  const handleConnect = async () => {
    try {
      const injectedConnector = connectors.find(c => c.id === 'injected')
      if (injectedConnector) {
        await connect({ connector: injectedConnector })
      }
    } catch (err) {
      console.error('Connection error:', err)
    }
  }

  // Check if any injected wallet is available
  const hasWallet = typeof window !== 'undefined' && window.ethereum

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Sign In to LatinBridge</CardTitle>
          <CardDescription>
            Connect your Web3 wallet to access the remittance platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasWallet && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No wallet detected. Please install MetaMask, Coinbase Wallet, or another Web3 wallet.
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline ml-1"
                >
                  Download MetaMask
                </a>
              </AlertDescription>
            </Alert>
          )}

          {connectError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{connectError.message}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleConnect}
            className="w-full"
            size="lg"
            disabled={!hasWallet || isPending || isConnected || isCheckingRegistration}
          >
            {(isPending || isCheckingRegistration) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isCheckingRegistration ? 'Checking registration...' : isConnected ? 'Connected - Redirecting...' : 'Connect Wallet'}
          </Button>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
            <p className="text-xs">
              Supports MetaMask, Coinbase Wallet, Trust Wallet, Brave Wallet, and more!
            </p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-2">Why Web3 Wallet?</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• No passwords to remember</li>
              <li>• Complete control of your funds</li>
              <li>• Cryptographic security</li>
              <li>• Transparent on-chain transactions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
