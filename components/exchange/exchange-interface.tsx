"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowDownUp, TrendingUp, Loader2, Info } from "lucide-react"
import { useAccount } from "wagmi"
import { useToast } from "@/hooks/use-toast"

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "ARS", name: "Argentine Peso", flag: "🇦🇷" },
  { code: "COP", name: "Colombian Peso", flag: "🇨🇴" },
  { code: "GTQ", name: "Guatemalan Quetzal", flag: "🇬🇹" },
]

export function ExchangeInterface() {
  const { isConnected } = useAccount()
  const { toast } = useToast()
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("MXN")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})
  const [isLoadingRates, setIsLoadingRates] = useState(false)

  // Fetch real exchange rates from API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setIsLoadingRates(true)
        const response = await fetch('/api/rates/current')
        const data = await response.json()

        if (data.rates) {
          setExchangeRates(data.rates)
        }
      } catch (error) {
        console.error('Error fetching rates:', error)
      } finally {
        setIsLoadingRates(false)
      }
    }

    fetchRates()
    const interval = setInterval(fetchRates, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    if (value && exchangeRates[toCurrency] && exchangeRates[fromCurrency]) {
      const fromRate = exchangeRates[fromCurrency]
      const toRate = exchangeRates[toCurrency]
      const exchangeRate = toRate / fromRate
      setToAmount((parseFloat(value) * exchangeRate).toFixed(2))
    } else {
      setToAmount("")
    }
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleExchange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to exchange currency",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Exchange feature",
      description: "Currency exchange will execute on the RemittanceVault contract",
    })
  }

  const currentRate = exchangeRates[toCurrency] && exchangeRates[fromCurrency]
    ? exchangeRates[toCurrency] / exchangeRates[fromCurrency]
    : 0

  return (
    <div className="space-y-6">
      <Alert className="bg-primary/10 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-primary">
          <strong>Live Rates:</strong> Exchange rates are fetched from ExchangeRate-API and updated every minute.
        </AlertDescription>
      </Alert>

      <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Exchange Currency</CardTitle>
        <CardDescription>Convert your balance between different currencies at live market rates</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleExchange} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from-amount">From</Label>
              <div className="flex gap-2">
                <Input
                  id="from-amount"
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="flex-1"
                  min="0"
                  step="0.01"
                  required
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => {
                    setFromCurrency(e.target.value)
                    handleFromAmountChange(fromAmount)
                  }}
                  className="px-4 py-2 border rounded-md bg-background min-w-[120px]"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwapCurrencies}
                className="rounded-full bg-transparent"
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-amount">To</Label>
              <div className="flex gap-2">
                <Input
                  id="to-amount"
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                  className="flex-1 bg-muted"
                />
                <select
                  value={toCurrency}
                  onChange={(e) => {
                    setToCurrency(e.target.value)
                    handleFromAmountChange(fromAmount)
                  }}
                  className="px-4 py-2 border rounded-md bg-background min-w-[120px]"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoadingRates ? (
            <div className="rounded-lg bg-muted p-4 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading exchange rates...</span>
            </div>
          ) : currentRate > 0 ? (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Current Exchange Rate (Live from API)</span>
              </div>
              <div className="text-lg font-semibold">
                1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
              </div>
              <div className="text-xs text-muted-foreground">
                Rate updates every minute • Source: ExchangeRate-API
              </div>
            </div>
          ) : null}

          <Button type="submit" className="w-full" size="lg" disabled={!isConnected || !fromAmount}>
            {isConnected ? 'Exchange Currency' : 'Connect Wallet to Exchange'}
          </Button>

          {!isConnected && (
            <p className="text-xs text-center text-muted-foreground">
              Connect your wallet to execute currency exchanges
            </p>
          )}
        </form>
      </CardContent>
    </Card>
    </div>
  )
}
