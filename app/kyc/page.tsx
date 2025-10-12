import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { KYCVerificationCenter } from "@/components/kyc/kyc-verification-center"


export default function KYCPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">KYC Verification Center</h1>
            <p className="text-muted-foreground mt-1">Verify your identity to unlock higher transaction limits</p>
          </div>
          <KYCVerificationCenter />
        </div>
      </div>
    </div>
  )
}
