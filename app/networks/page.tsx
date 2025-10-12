import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { PaymentNetworks } from "@/components/networks/payment-networks"


export default function NetworksPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Payment Networks</h1>
            <p className="text-muted-foreground mt-1">Connect local payment methods for instant transfers</p>
          </div>
          <PaymentNetworks />
        </div>
      </div>
    </div>
  )
}
