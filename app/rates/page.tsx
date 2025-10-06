import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ExchangeRates } from "@/components/rates/exchange-rates"

export default function RatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Exchange Rates</h1>
            <p className="text-muted-foreground mt-1">Live exchange rates and historical data</p>
          </div>
          <ExchangeRates />
        </div>
      </div>
    </div>
  )
}
