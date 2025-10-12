"use client"


import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAdminCheck } from "@/lib/hooks/useAdminCheck"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { ShieldAlert, Shield, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function AdminPage() {
  const { isConnected } = useAccount()
  const { isAdmin } = useAdminCheck()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect non-admin users
  useEffect(() => {
    if (isConnected && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can access this area",
        variant: "destructive"
      })
      router.push('/dashboard')
    }
  }, [isConnected, isAdmin, router, toast])

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
            <p className="text-sm text-muted-foreground">
              Please connect your admin wallet to access the admin panel
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="p-12 text-center">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-destructive">Access Denied</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Only administrators can access this area
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage platform operations and user requests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan Management */}
        <Link href="/admin/loans">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Loan Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Review loan applications, approve loans, and track disbursements
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Manage Loans <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Platform Reserves */}
        <Link href="/admin/reserves">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Platform Reserves</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage platform reserves for funding loans and savings operations
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Manage Reserves <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Coming Soon - User Management */}
        <Card className="opacity-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">User Management</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View registered users, KYC status, and credit scores
                </p>
                <div className="text-xs text-muted-foreground">
                  Coming Soon
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon - Platform Analytics */}
        <Card className="opacity-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Platform Analytics</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View transaction volume, fees collected, and platform metrics
                </p>
                <div className="text-xs text-muted-foreground">
                  Coming Soon
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon - Contract Management */}
        <Card className="opacity-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Contract Management</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage smart contract settings and configurations
                </p>
                <div className="text-xs text-muted-foreground">
                  Coming Soon
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Admin Information</h3>
          <p className="text-sm text-muted-foreground">
            You are logged in as an administrator. All actions are recorded on-chain.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
