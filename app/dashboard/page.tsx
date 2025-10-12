import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { WalletOverview } from "@/components/dashboard/wallet-overview"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { CurrencyCards } from "@/components/dashboard/currency-cards"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { NetworkSwitch } from "@/components/shared/NetworkSwitch"


export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <NetworkSwitch />
        <DashboardHeader />
        <div className="grid gap-6 mt-6">
          <WalletOverview />
          <QuickActions />
          <CurrencyCards />
          <RecentTransactions />
        </div>
      </div>
    </div>
  )
}
