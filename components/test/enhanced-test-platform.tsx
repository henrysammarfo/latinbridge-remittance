'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react'
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi'
import { useUserRegistry } from '@/lib/web3/hooks/useUserRegistry'
import { useRemittance } from '@/lib/web3/hooks/useRemittance'
import { useSavings } from '@/lib/web3/hooks/useSavings'
import { useLoans } from '@/lib/web3/hooks/useLoans'
import { useExchangeRates } from '@/lib/web3/hooks/useExchangeRates'
import { CONTRACT_ADDRESSES, Currency } from '@/lib/web3/hooks/useContracts'
import { polkadotPaseo } from '@/lib/web3/config'
import { toast } from 'sonner'

const BLOCK_EXPLORER = process.env.NEXT_PUBLIC_BLOCK_EXPLORER || 'https://blockscout-passet-hub.parity-testnet.parity.io'

export function EnhancedTestPlatform() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { data: balance } = useBalance({ address })

  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string>('')

  // Test states
  const [testAmount, setTestAmount] = useState('1.0')
  const [testRecipient, setTestRecipient] = useState('')

  const handleConnect = async () => {
    if (!connectors || connectors.length === 0) return
    const injected = connectors.find(c => c.id === 'injected')
    if (injected) {
      await connect({ connector: injected })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const openInExplorer = (hash: string) => {
    window.open(`${BLOCK_EXPLORER}/tx/${hash}`, '_blank')
  }

  const isCorrectNetwork = chain?.id === polkadotPaseo.id

  return (
    <div className="space-y-6">
      {/* Network Status Banner */}
      {isConnected && !isCorrectNetwork && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Wrong network! Please switch to Polkadot Paseo Asset Hub</span>
            <Button
              size="sm"
              onClick={() => switchChain?.({ chainId: polkadotPaseo.id })}
            >
              Switch Network
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Wallet Connection Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connection Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="text-center py-8">
              <Button onClick={handleConnect} size="lg" className="gap-2">
                <Wallet className="h-5 w-5" />
                Connect MetaMask
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Connect your wallet to test all features
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Wallet Address</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                      {address}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(address!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">PAS Balance</Label>
                  <div className="text-lg font-bold mt-1">
                    {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'} PAS
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Network</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={isCorrectNetwork ? "default" : "destructive"}>
                      {chain?.name || 'Unknown'}
                    </Badge>
                    {isCorrectNetwork && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Chain ID</Label>
                  <div className="text-lg font-bold mt-1">{chain?.id || 'N/A'}</div>
                </div>
              </div>
              <Button onClick={() => disconnect()} variant="outline" className="w-full">
                Disconnect Wallet
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Contract Addresses Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Deployed Contracts</span>
            <Badge>Polkadot Paseo Testnet</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(CONTRACT_ADDRESSES).map(([name, address]) => (
              <div key={name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-semibold text-sm capitalize">
                    {name.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <code className="text-xs text-muted-foreground">{address}</code>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`${BLOCK_EXPLORER}/address/${address}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contract Testing Tabs */}
      {isConnected && isCorrectNetwork && (
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="remittance">Remittance</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
            <TabsTrigger value="api">APIs</TabsTrigger>
          </TabsList>

          {/* User Registry Tests */}
          <TabsContent value="user" className="space-y-4">
            <UserRegistryTests />
          </TabsContent>

          {/* Remittance Tests */}
          <TabsContent value="remittance" className="space-y-4">
            <RemittanceTests />
          </TabsContent>

          {/* Savings Tests */}
          <TabsContent value="savings" className="space-y-4">
            <SavingsTests />
          </TabsContent>

          {/* Loans Tests */}
          <TabsContent value="loans" className="space-y-4">
            <LoansTests />
          </TabsContent>

          {/* Exchange Rates Tests */}
          <TabsContent value="rates" className="space-y-4">
            <ExchangeRatesTests />
          </TabsContent>

          {/* API Tests */}
          <TabsContent value="api" className="space-y-4">
            <APITests />
          </TabsContent>
        </Tabs>
      )}

      {/* Transaction Result */}
      {txHash && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm mb-1">Transaction Submitted!</div>
                <code className="text-xs">{txHash}</code>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openInExplorer(txHash)}
              >
                View on Explorer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// User Registry Test Component
function UserRegistryTests() {
  const { profile, isRegistered, creditScore, kycStatus, autoRegister, isLoading } = useUserRegistry()
  const [loading, setLoading] = useState(false)

  const handleAutoRegister = async () => {
    setLoading(true)
    try {
      const hash = await autoRegister()
      toast.success(`Registration transaction sent: ${hash}`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Registry Contract</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <Label className="text-xs text-muted-foreground">Registration Status</Label>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isRegistered ? "default" : "secondary"}>
                {isRegistered ? 'Registered' : 'Not Registered'}
              </Badge>
              {isRegistered && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <Label className="text-xs text-muted-foreground">Credit Score</Label>
            <div className="text-2xl font-bold mt-1">{creditScore}</div>
          </div>
        </div>

        {!isRegistered && (
          <Button onClick={handleAutoRegister} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register on Blockchain
          </Button>
        )}

        {isRegistered && kycStatus && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <Label className="text-xs text-muted-foreground">KYC Level</Label>
            <div className="text-lg font-semibold mt-1">
              Level {kycStatus[1]} - Limit: ${(Number(kycStatus[2]) / 1e18).toFixed(0)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Remittance Test Component
function RemittanceTests() {
  const { useBalanceOf } = useRemittance()
  const usdBalance = useBalanceOf(Currency.USD)
  const mxnBalance = useBalanceOf(Currency.MXN)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remittance Vault Contract</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <Label className="text-xs text-muted-foreground">USD Balance</Label>
            <div className="text-xl font-bold mt-1">
              {usdBalance.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : `$${parseFloat(usdBalance.balance).toFixed(2)}`}
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <Label className="text-xs text-muted-foreground">MXN Balance</Label>
            <div className="text-xl font-bold mt-1">
              {mxnBalance.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : `${parseFloat(mxnBalance.balance).toFixed(2)} MXN`}
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <Label className="text-xs text-muted-foreground">Fee Rate</Label>
            <div className="text-xl font-bold mt-1">0.5%</div>
          </div>
        </div>
        <Alert>
          <AlertDescription>
            Fund your wallet with PAS tokens to test deposits and transfers. Use the faucet: https://faucet.polkadot.io
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

// Savings Test Component
function SavingsTests() {
  const { useBalance, apy } = useSavings()
  const savingsBalance = useBalance(Currency.USD)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Pool Contract</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <Label className="text-xs text-muted-foreground">Savings Balance (USD)</Label>
            <div className="text-2xl font-bold mt-1">
              {savingsBalance.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : `$${parseFloat(savingsBalance.balance).toFixed(2)}`}
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <Label className="text-xs text-muted-foreground">APY from Contract</Label>
            <div className="text-2xl font-bold mt-1 text-green-600">{apy}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Loans Test Component
function LoansTests() {
  const { isEligible, useActiveLoan } = useLoans()
  const { loan } = useActiveLoan()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Microloan Manager Contract</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <Label className="text-xs text-muted-foreground">Loan Eligibility</Label>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={isEligible ? "default" : "secondary"}>
              {isEligible ? 'Eligible' : 'Not Eligible'}
            </Badge>
          </div>
        </div>
        <Alert>
          <AlertDescription>
            Loan eligibility is based on your credit score from the UserRegistry contract.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

// Exchange Rates Test Component
function ExchangeRatesTests() {
  const { useHybridRates } = useExchangeRates()
  const { rates, isLoading, refetch } = useHybridRates()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Exchange Rate Oracle + API</span>
          <Button size="sm" variant="outline" onClick={refetch}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(rates).map(([currency, rate]) => (
              <div key={currency} className="p-3 bg-muted/50 rounded-lg">
                <Label className="text-xs text-muted-foreground">{currency}</Label>
                <div className="text-lg font-bold mt-1">{rate.toFixed(4)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// API Tests Component
function APITests() {
  const { address } = useAccount()
  const [apiStatus, setApiStatus] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  const testAllIntegrations = async () => {
    setTesting(true)
    try {
      // Test Integration Status Endpoint
      const statusRes = await fetch('/api/integrations/status')
      const statusData = await statusRes.json()

      // Test Exchange Rates
      const ratesRes = await fetch('/api/rates/current')
      const ratesData = await ratesRes.json()

      setApiStatus({
        timestamp: new Date().toISOString(),
        integrations: statusData.integrations || {},
        exchangeRates: {
          status: ratesRes.ok ? 'OK' : 'FAILED',
          data: ratesData,
        },
      })
      toast.success('All integration tests completed!')
    } catch (error) {
      console.error('API test error:', error)
      toast.error('Some integration tests failed')
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live API Integration Tests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testAllIntegrations} disabled={testing} className="w-full gap-2">
          {testing && <Loader2 className="h-4 w-4 animate-spin" />}
          Test All Integrations
        </Button>

        {apiStatus && (
          <div className="space-y-3">
            {/* Exchange Rate APIs */}
            {apiStatus.integrations.exchangeRates && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <Label className="font-semibold">Exchange Rate APIs</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">ExchangeRate-API (Primary)</span>
                  <Badge variant={apiStatus.integrations.exchangeRates.primary.status === 'OK' ? "default" : "destructive"}>
                    {apiStatus.integrations.exchangeRates.primary.status} - {apiStatus.integrations.exchangeRates.primary.currencies} currencies
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">FreeCurrencyAPI (Backup)</span>
                  <Badge variant={apiStatus.integrations.exchangeRates.backup.status === 'OK' ? "default" : "destructive"}>
                    {apiStatus.integrations.exchangeRates.backup.status} - {apiStatus.integrations.exchangeRates.backup.currencies} currencies
                  </Badge>
                </div>
              </div>
            )}

            {/* Stripe Status */}
            {apiStatus.integrations.stripe && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <Label className="font-semibold">Stripe Payment Processing</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Configuration</span>
                  <Badge variant={apiStatus.integrations.stripe.configured ? "default" : "secondary"}>
                    {apiStatus.integrations.stripe.configured ? 'Configured' : 'Not Configured'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant={apiStatus.integrations.stripe.ready ? "default" : "secondary"}>
                    {apiStatus.integrations.stripe.ready ? 'Ready' : 'Not Ready'}
                  </Badge>
                </div>
              </div>
            )}

            {/* Didit KYC Status */}
            {apiStatus.integrations.didit && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <Label className="font-semibold">Didit KYC Integration</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Configuration</span>
                  <Badge variant={apiStatus.integrations.didit.configured ? "default" : "secondary"}>
                    {apiStatus.integrations.didit.configured ? 'Configured' : 'Not Configured'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant={apiStatus.integrations.didit.ready ? "default" : "secondary"}>
                    {apiStatus.integrations.didit.ready ? 'Ready' : 'Not Ready'}
                  </Badge>
                </div>
              </div>
            )}

            {/* Smart Contracts Status */}
            {apiStatus.integrations.smartContracts && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <Label className="font-semibold">Smart Contracts (Polkadot Paseo)</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Deployment</span>
                  <Badge variant={apiStatus.integrations.smartContracts.configured ? "default" : "destructive"}>
                    {apiStatus.integrations.smartContracts.configured ? 'All Deployed' : 'Missing'}
                  </Badge>
                </div>
                {apiStatus.integrations.smartContracts.addresses && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(apiStatus.integrations.smartContracts.addresses).map(([name, address]: any) => (
                      <div key={name} className="text-xs">
                        <span className="text-muted-foreground">{name}:</span>{' '}
                        <code className="bg-background/50 px-1 rounded">{address}</code>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Live Exchange Rates */}
            {apiStatus.exchangeRates?.data?.rates && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <Label className="font-semibold mb-2 block">Current Live Rates</Label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(apiStatus.exchangeRates.data.rates).map(([currency, rate]: any) => (
                    <div key={currency} className="text-sm">
                      <span className="font-semibold">{currency}:</span> {rate.toFixed(4)}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Last updated: {new Date(apiStatus.exchangeRates.data.timestamp).toLocaleTimeString()}
                </div>
              </div>
            )}

            {/* Summary */}
            <Alert className="bg-primary/10 border-primary/20">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription>
                <strong>Integration Status: </strong>
                {apiStatus.integrations ? 'All systems operational' : 'Some services unavailable'}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
