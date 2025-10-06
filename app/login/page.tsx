'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Wallet, AlertCircle, Loader2 } from 'lucide-react'
import { useAccount, useConnect } from 'wagmi'
import { useAuth } from '@/lib/web3/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { signIn, isLoading, error, isAuthenticated } = useAuth()

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum?.isMetaMask

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleConnect = async () => {
    try {
      // Connect wallet if not connected
      if (!isConnected) {
        const injectedConnector = connectors.find(c => c.id === 'injected')
        if (injectedConnector) {
          await connect({ connector: injectedConnector })
        }
      }

      // Sign in with SIWE
      const token = await signIn()
      if (token) {
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Connection error:', err)
    }
  }

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
          {!isMetaMaskInstalled && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                MetaMask is not installed. Please install MetaMask to continue.
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

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleConnect}
            className="w-full"
            size="lg"
            disabled={!isMetaMaskInstalled || isLoading || isPending}
          >
            {(isLoading || isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isConnected ? 'Sign Message to Authenticate' : 'Connect MetaMask'}
          </Button>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
            <p className="text-xs">
              Your wallet will be used for secure authentication. No password required!
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
