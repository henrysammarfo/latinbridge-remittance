import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { LoansInterface } from "@/components/loans/loans-interface"

export default function LoansPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Microloans</h1>
            <p className="text-muted-foreground mt-1">Access quick loans from $50-$5,000 with flexible terms</p>
          </div>
          <LoansInterface />
        </div>
      </div>
    </div>
  )
}
