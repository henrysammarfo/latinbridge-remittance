import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { SendMoneyFlow } from "@/components/send/send-money-flow"


export default function SendPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Send Money</h1>
            <p className="text-muted-foreground mt-1">Transfer money across borders with 0.5% fees</p>
          </div>
          <SendMoneyFlow />
        </div>
      </div>
    </div>
  )
}
