"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Bell, RefreshCw, Loader2 } from "lucide-react"
import { RateAlertModal } from "./rate-alert-modal"
import { useExchangeRates } from "@/lib/web3/hooks/useExchangeRates"
import { useToast } from "@/hooks/use-toast"

const currencyPairs = [
  { from: "USD", to: "MXN", name: "Mexican Peso" },
  { from: "USD", to: "BRL", name: "Brazilian Real" },
  { from: "USD", to: "ARS", name: "Argentine Peso" },
  { from: "USD", to: "COP", name: "Colombian Peso" },
  { from: "USD", to: "GTQ", name: "Guatemalan Quetzal" },
  { from: "MXN", to: "BRL", name: "MXN to BRL" },
  { from: "BRL", to: "ARS", name: "BRL to ARS" },
  { from: "MXN", to: "COP", name: "MXN to COP" },
]

export function ExchangeRates() {
  const { toast } = useToast()
  const { useHybridRates } = useExchangeRates()
  const { rates, isLoading, refetch } = useHybridRates()

  const [showAlertModal, setShowAlertModal] = useState(false)
  const [selectedRate, setSelectedRate] = useState<{ from: string; to: string } | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleSetAlert = (from: string, to: string) => {
    setSelectedRate({ from, to })
    setShowAlertModal(true)
  }

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      await refetch()
      toast({
        title: "Rates updated",
        description: "Exchange rates have been refreshed"
      })
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not update exchange rates",
        variant: "destructive"
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Calculate cross rates
  const calculateCrossRate = (from: string, to: string) => {
    if (!rates) return 0

    // If we have direct rate
    const directKey = `${from}_${to}`
    if (rates[directKey]) return rates[directKey]

    // Calculate through USD
    const fromUSD = from === 'USD' ? 1 : (rates[`USD_${from}`] || 0)
    const toUSD = to === 'USD' ? 1 : (rates[`USD_${to}`] || 0)

    if (fromUSD && toUSD) {
      return toUSD / fromUSD
    }

    return 0
  }

  const exchangeRatesData = currencyPairs.map(pair => ({
    ...pair,
    rate: calculateCrossRate(pair.from, pair.to),
    change: Math.random() * 4 - 2, // Mock change percentage
    trend: Math.random() > 0.5 ? "up" : "down",
    lastUpdate: "Live"
  }))

  // Get best rates (highest positive change)
  const bestRates = [...exchangeRatesData]
    .filter(r => r.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 2)

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading exchange rates...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Exchange Rates</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Real-time rates from blockchain oracle + API
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {exchangeRatesData.map((rate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-lg">
                        {rate.from}/{rate.to}
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{rate.rate.toFixed(4)}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div
                        className={`flex items-center gap-1 font-medium ${rate.trend === "up" ? "text-primary" : "text-destructive"}`}
                      >
                        {rate.trend === "up" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span>
                          {rate.change > 0 ? "+" : ""}
                          {rate.change.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        {rate.lastUpdate}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleSetAlert(rate.from, rate.to)}>
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Historical Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Historical rate chart visualization</p>
                <p className="text-xs text-muted-foreground mt-1">Select a currency pair to view trends</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Best Rates Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bestRates.map((rate, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div>
                      <div className="font-semibold">{rate.from}/{rate.to}</div>
                      <div className="text-sm text-muted-foreground">{rate.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{rate.rate.toFixed(4)}</div>
                      <div className="text-xs text-primary">+{rate.change.toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Rate Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-semibold">USD/BRL</div>
                    <div className="text-sm text-muted-foreground">Alert at 5.30</div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-semibold">MXN/COP</div>
                    <div className="text-sm text-muted-foreground">Alert at 225.00</div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => setShowAlertModal(true)}>
                <Bell className="mr-2 h-4 w-4" />
                Create New Alert
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <RateAlertModal
        open={showAlertModal}
        onClose={() => {
          setShowAlertModal(false)
          setSelectedRate(null)
        }}
        initialRate={selectedRate}
      />
    </>
  )
}
