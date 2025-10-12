import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { WithdrawInterface } from "@/components/withdraw/withdraw-interface"


export default function WithdrawPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Withdraw Funds</h1>
            <p className="text-muted-foreground mt-1">Withdraw your LatinBridge balance back to your wallet</p>
          </div>
          <WithdrawInterface />
        </div>
      </div>
    </div>
  )
}
