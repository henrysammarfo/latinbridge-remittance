import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { EnhancedTestPlatform } from "@/components/test/enhanced-test-platform"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Test Platform - LatinBridge",
  description: "Smart contract testing interface for LATIN HACK 2025",
  robots: {
    index: false,
    follow: false,
  },
}

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Comprehensive Test Platform</h1>
            <p className="text-muted-foreground mt-1">
              Test all smart contract interactions and live API integrations for LATIN HACK 2025
            </p>
          </div>
          <EnhancedTestPlatform />
        </div>
      </div>
    </div>
  )
}
