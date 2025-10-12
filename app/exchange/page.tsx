import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ExchangeInterface } from "@/components/exchange/exchange-interface"


export default function ExchangePage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Exchange Currency</h1>
            <p className="text-muted-foreground mt-1">Convert between currencies at real-time rates</p>
          </div>
          <ExchangeInterface />
        </div>
      </div>
    </div>
  )
}
