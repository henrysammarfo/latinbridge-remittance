import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { AddMoneyInterface } from "@/components/add-money/add-money-interface"

export default function AddMoneyPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Add Money</h1>
            <p className="text-muted-foreground mt-1">Fund your wallet to start sending money</p>
          </div>
          <AddMoneyInterface />
        </div>
      </div>
    </div>
  )
}
