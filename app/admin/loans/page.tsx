"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAccount } from "wagmi"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Send, ExternalLink, Copy, AlertCircle, ShieldAlert } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAdmin } from "@/lib/hooks/useAdmin"
import { useRouter } from "next/navigation"

export default function AdminLoansPage() {
  const { address, isConnected } = useAccount()
  const { isAdmin } = useAdmin()
  const { toast } = useToast()
  const router = useRouter()
  const [loans, setLoans] = useState<any[]>([])
  const [fundedLoans, setFundedLoans] = useState<Set<number>>(new Set())

  // Mock data - Replace with actual contract reads
  useEffect(() => {
    // This would fetch from the smart contract
    const mockLoans = [
      {
        loanId: 0,
        borrower: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        amount: "100",
        currency: "USD",
        duration: 30,
        purpose: "Business expansion",
        status: "Pending",
        requestTime: Date.now() - 3600000,
        interestRate: 0,
      }
    ]
    setLoans(mockLoans)

    // Load funded status from localStorage
    const stored = localStorage.getItem('fundedLoans')
    if (stored) {
      setFundedLoans(new Set(JSON.parse(stored)))
    }
  }, [])

  const markAsFunded = (loanId: number) => {
    const newFunded = new Set(fundedLoans)
    newFunded.add(loanId)
    setFundedLoans(newFunded)
    localStorage.setItem('fundedLoans', JSON.stringify([...newFunded]))
    
    toast({
      title: "Loan marked as funded",
      description: "This loan is now tracked as disbursed",
    })
  }

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr)
    toast({
      title: "Address copied",
      description: "Borrower address copied to clipboard",
    })
  }

  const openBlockExplorer = (addr: string) => {
    window.open(`https://blockscout-passet-hub.parity-testnet.parity.io/address/${addr}`, '_blank')
  }

  // Redirect non-admin users
  useEffect(() => {
    if (isConnected && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can access this page",
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
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
            <p className="text-sm text-muted-foreground">
              Please connect your admin wallet to manage loans
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
              Only administrators can access the loan management panel
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
        <h1 className="text-3xl font-bold mb-2">Loan Administration</h1>
        <p className="text-muted-foreground">
          Manage loan applications, approvals, and disbursements
        </p>
      </div>

      {/* Instructions */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">How to Process Loans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <p><strong>Step 1:</strong> Review loan application details below</p>
            <p><strong>Step 2:</strong> Call <code className="bg-background px-2 py-1 rounded">approveLoan(loanId)</code> on the MicroloanManager contract</p>
            <p><strong>Step 3:</strong> Manually send PAS tokens from your wallet to the borrower's address</p>
            <p><strong>Step 4:</strong> Click "Mark as Funded" to track the disbursement</p>
          </div>
          
          <div className="pt-3 border-t">
            <Label className="text-xs text-muted-foreground">Contract Address (for approval)</Label>
            <div className="flex gap-2 mt-1">
              <Input 
                value={process.env.NEXT_PUBLIC_MICROLOAN_MANAGER || "Deploy contract first"}
                readOnly 
                className="font-mono text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`https://blockscout-passet-hub.parity-testnet.parity.io/address/${process.env.NEXT_PUBLIC_MICROLOAN_MANAGER}`, '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Applications */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pending Applications</h2>
        
        {loans.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No loan applications yet</p>
            </CardContent>
          </Card>
        ) : (
          loans.map((loan) => {
            const isFunded = fundedLoans.has(loan.loanId)
            
            return (
              <Card key={loan.loanId} className={isFunded ? "border-green-500/50 bg-green-500/5" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Loan #{loan.loanId}
                        {isFunded && (
                          <Badge className="bg-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Funded
                          </Badge>
                        )}
                        {!isFunded && <Badge variant="secondary">{loan.status}</Badge>}
                      </CardTitle>
                      <CardDescription>
                        Requested {new Date(loan.requestTime).toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Loan Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Amount</Label>
                      <p className="font-semibold">{loan.amount} PAS</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Currency</Label>
                      <p className="font-semibold">{loan.currency}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Duration</Label>
                      <p className="font-semibold">{loan.duration} days</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Purpose</Label>
                      <p className="font-semibold text-sm">{loan.purpose}</p>
                    </div>
                  </div>

                  {/* Borrower Address */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Borrower Address</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        value={loan.borrower}
                        readOnly 
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyAddress(loan.borrower)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openBlockExplorer(loan.borrower)}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isFunded && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => markAsFunded(loan.loanId)}
                        className="flex-1"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Funded (After Sending PAS)
                      </Button>
                    </div>
                  )}

                  {isFunded && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-400">
                        ✓ PAS tokens disbursed. Borrower can now repay to your wallet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Your Repayment Address */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Your Repayment Address</CardTitle>
          <CardDescription>
            Borrowers will send PAS tokens back to this address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              value={address || "Connect wallet"}
              readOnly 
              className="font-mono"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => address && copyAddress(address)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Share this address with borrowers for loan repayments
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
