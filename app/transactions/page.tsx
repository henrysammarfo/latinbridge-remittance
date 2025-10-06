import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { TransactionHistory } from "@/components/transactions/transaction-history"

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
            <p className="text-muted-foreground mt-1">View and manage all your transactions</p>
          </div>
          <TransactionHistory />
        </div>
      </div>
    </div>
  )
}
