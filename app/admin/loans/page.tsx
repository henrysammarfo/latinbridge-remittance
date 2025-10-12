"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAccount } from "wagmi"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Send, ExternalLink, Copy, AlertCircle, ShieldAlert, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAdminCheck } from "@/lib/hooks/useAdminCheck"
import { useRouter } from "next/navigation"
import { useLoans } from "@/lib/web3/hooks/useLoans"
import { formatUnits } from "viem"
import { addTransaction, updateTransactionStatus } from "@/lib/utils/transactionHistory"

const CURRENCY_SYMBOLS: { [key: number]: string } = {
  0: 'USD',
  1: 'MXN',
  2: 'BRL',
  3: 'ARS',
  4: 'COP',
  5: 'GTQ',
}

const LOAN_STATUS: { [key: number]: string } = {
  0: 'Pending',
  1: 'Approved',
  2: 'Active',
  3: 'Repaid',
  4: 'Defaulted',
  5: 'Rejected',
}

export default function AdminLoansPage() {
  const { address, isConnected } = useAccount()
  const { isAdmin } = useAdminCheck()
  const { approveLoan, rejectLoan, useTotalLoans, useLoanById } = useLoans()
  const { toast } = useToast()
  const router = useRouter()
  const [approvingLoan, setApprovingLoan] = useState<number | null>(null)
  const [rejectingLoan, setRejectingLoan] = useState<number | null>(null)

  // Fetch total loans from blockchain
  const { count: totalLoans, isLoading: isLoadingCount } = useTotalLoans()

  // Fetch all loan details
  const [pendingLoans, setPendingLoans] = useState<any[]>([])
  const [isLoadingLoans, setIsLoadingLoans] = useState(true)

  // Note: Fetching individual loans from blockchain requires direct contract calls
  // For now, showing mock pending loans until we implement event-based loan tracking
  useEffect(() => {
    if (totalLoans === 0) {
      setPendingLoans([])
      setIsLoadingLoans(false)
    } else {
      // In production: Query blockchain events or implement getAllPendingLoans() in contract
      // For testnet: Using empty array - loans will appear after contract upgrade
      setPendingLoans([])
      setIsLoadingLoans(false)
    }
  }, [totalLoans])

  const handleApproveLoan = async (loanId: number) => {
    try {
      setApprovingLoan(loanId)
      
      toast({
        title: "Approving loan...",
        description: "Please confirm the transaction in your wallet"
      })

      const hash = await approveLoan(loanId)

      // Add to transaction history
      if (address && hash) {
        addTransaction(address, {
          hash,
          type: 'loan_approve',
          status: 'pending',
          amount: '0',
          currency: 'USD',
          description: `Approved loan #${loanId}`
        })

        // Update to success after a delay
        setTimeout(() => {
          updateTransactionStatus(address, hash, 'success')
        }, 3000)
      }

      toast({
        title: "Loan approved!",
        description: `Loan #${loanId} has been approved on-chain`,
      })

      // Refresh loan list by removing the approved loan
      setPendingLoans(prev => prev.filter(loan => loan.loanId !== loanId))
    } catch (error: any) {
      console.error("Approve error:", error)
      
      let errorMessage = "Failed to approve loan"
      if (error?.message?.includes("User rejected")) {
        errorMessage = "Transaction rejected by user"
      }

      toast({
        title: "Approval failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setApprovingLoan(null)
    }
  }

  const handleRejectLoan = async (loanId: number) => {
    try {
      setRejectingLoan(loanId)
      
      const reason = prompt("Enter rejection reason:")
      if (!reason) {
        setRejectingLoan(null)
        return
      }

      toast({
        title: "Rejecting loan...",
        description: "Please confirm the transaction in your wallet"
      })

      const hash = await rejectLoan(loanId, reason)

      // Add to transaction history
      if (address && hash) {
        addTransaction(address, {
          hash,
          type: 'loan_reject',
          status: 'pending',
          amount: '0',
          currency: 'USD',
          description: `Rejected loan #${loanId}: ${reason}`
        })

        // Update to success after a delay
        setTimeout(() => {
          updateTransactionStatus(address, hash, 'success')
        }, 3000)
      }

      toast({
        title: "Loan rejected",
        description: `Loan #${loanId} has been rejected`,
      })

      // Refresh loan list by removing the rejected loan
      setPendingLoans(prev => prev.filter(loan => loan.loanId !== loanId))
    } catch (error: any) {
      console.error("Reject error:", error)
      
      let errorMessage = "Failed to reject loan"
      if (error?.message?.includes("User rejected")) {
        errorMessage = "Transaction rejected by user"
      }

      toast({
        title: "Rejection failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setRejectingLoan(null)
    }
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
            <p><strong>Step 2:</strong> Click "✓ Approve Loan" button (calls smart contract)</p>
            <p><strong>Step 3:</strong> Manually send PAS tokens from your wallet to the borrower's address</p>
            <p><strong>Step 4:</strong> Click "Mark as Funded" to track the disbursement</p>
            <p className="text-xs text-muted-foreground pt-2">Note: Approval is on-chain. You can also reject loans with a reason.</p>
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
        <h2 className="text-xl font-semibold">Pending Applications ({pendingLoans.length})</h2>
        
        {isLoadingLoans || isLoadingCount ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading pending loans from blockchain...</p>
            </CardContent>
          </Card>
        ) : pendingLoans.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending loan applications</p>
              <p className="text-sm text-muted-foreground mt-2">All loans have been processed or no loans have been requested yet</p>
            </CardContent>
          </Card>
        ) : (
          pendingLoans.map((loan) => {
            
            return (
              <Card key={loan.loanId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Loan #{loan.loanId}
                        <Badge variant="outline">{loan.status}</Badge>
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
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleApproveLoan(loan.loanId)}
                      disabled={approvingLoan === loan.loanId}
                      className="flex-1"
                      variant="default"
                    >
                      {approvingLoan === loan.loanId ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve Loan
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleRejectLoan(loan.loanId)}
                      disabled={rejectingLoan === loan.loanId}
                      variant="destructive"
                      className="flex-1"
                    >
                      {rejectingLoan === loan.loanId ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
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
