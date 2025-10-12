import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ReceiveMoneyInterface } from "@/components/receive/receive-money-interface"


export default function ReceivePage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Receive Money</h1>
            <p className="text-muted-foreground mt-1">Generate payment links and QR codes to receive funds</p>
          </div>
          <ReceiveMoneyInterface />
        </div>
      </div>
    </div>
  )
}
