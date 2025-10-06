import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { SavingsInterface } from "@/components/savings/savings-interface"

export default function SavingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Savings Account</h1>
            <p className="text-muted-foreground mt-1">Earn 5% APY on your deposits with DeFi-style returns</p>
          </div>
          <SavingsInterface />
        </div>
      </div>
    </div>
  )
}
