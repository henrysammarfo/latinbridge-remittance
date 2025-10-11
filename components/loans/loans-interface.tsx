"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Clock, CheckCircle2, AlertCircle, Loader2, Copy, ExternalLink, Wallet } from "lucide-react"
import { LoanApplicationModal } from "./loan-application-modal"
import { useLoans } from "@/lib/web3/hooks/useLoans"
import { useAccount } from "wagmi"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Admin wallet address for loan repayments
const ADMIN_REPAYMENT_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_WALLET || "0x..."

export function LoansInterface() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { isEligible, useActiveLoan, repayLoan, useInterestRate } = useLoans()

  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [isRepaying, setIsRepaying] = useState(false)

  // Use hooks to fetch loan data from blockchain
  const { loan: activeLoan, isLoading, refetch: refetchLoan } = useActiveLoan()
  const { rate: interestRate } = useInterestRate(0) // Currency.USD

  const handleRepayment = async (loanId: number) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a payment",
        variant: "destructive"
      })
      return
    }

    try {
      setIsRepaying(true)

      toast({
        title: "Processing repayment...",
        description: "Please confirm the transaction in your wallet"
      })

      await repayLoan(activeLoan?.amount || "0")

      toast({
        title: "Payment successful!",
        description: "Your loan payment has been processed"
      })

      // Refresh active loan data
      await refetchLoan()
    } catch (error: any) {
      console.error("Repayment error:", error)

      let errorMessage = "Failed to process payment"
      if (error?.message?.includes("User rejected")) {
        errorMessage = "Transaction rejected by user"
      } else if (error?.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds in wallet"
      }

      toast({
        title: "Payment failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsRepaying(false)
    }
  }

  const handleApplicationSuccess = async () => {
    // Refresh loan data after successful application
    try {
      await refetchLoan()
    } catch (error) {
      console.error("Error refreshing loan data:", error)
    }
  }

  if (!isConnected) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
          <p className="text-sm text-muted-foreground">
            Please connect your wallet to access microloans
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading loan data from blockchain...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <Card className="border-border/50 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardHeader>
            <CardTitle>Your Loan Eligibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Maximum Loan Amount</div>
                  <div className="text-3xl font-bold">
                    $1,000.00
                  </div>
                </div>
                <Badge className={isEligible ? "bg-primary" : "bg-destructive"}>
                  {isEligible ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Eligible
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Not Eligible
                    </>
                  )}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-muted-foreground">Interest Rate</div>
                  <div className="text-lg font-semibold">{interestRate ? Number(interestRate) / 100 : 12}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Loan Terms</div>
                  <div className="text-lg font-semibold">3-24 months</div>
                </div>
              </div>
              <Button
                onClick={() => setShowApplicationModal(true)}
                className="w-full"
                disabled={!isEligible || activeLoan !== null}
              >
                {activeLoan ? "Loan Already Active" : "Apply for Loan"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {activeLoan && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Active Loan</h2>
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      ${parseFloat(activeLoan.amount).toFixed(2)} USD
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      {activeLoan.interestRate}% APR • {activeLoan.term} months
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <Clock className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Remaining Balance</div>
                    <div className="text-lg font-semibold">
                      ${parseFloat(activeLoan.remainingAmount).toFixed(2)} USD
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total to Repay</div>
                    <div className="text-lg font-semibold">
                      ${parseFloat(activeLoan.totalRepayment).toFixed(2)} USD
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Deadline</div>
                    <div className="text-lg font-semibold">
                      {new Date(activeLoan.deadline * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${((parseFloat(activeLoan.amount) - parseFloat(activeLoan.remainingAmount)) / parseFloat(activeLoan.amount)) * 100}%`
                    }}
                  />
                </div>

                {/* Repayment Instructions */}
                <Alert className="bg-blue-500/10 border-blue-500/20">
                  <Wallet className="h-4 w-4 text-blue-500" />
                  <AlertDescription>
                    <p className="font-semibold mb-2 text-blue-700 dark:text-blue-400">
                      How to Repay Your Loan
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Send <strong>{activeLoan.remainingAmount} PAS tokens</strong> to the admin address below:
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Input 
                        value={ADMIN_REPAYMENT_ADDRESS}
                        readOnly 
                        className="font-mono text-xs bg-background"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(ADMIN_REPAYMENT_ADDRESS)
                          toast({ title: "Address copied!", description: "Admin repayment address copied to clipboard" })
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      After sending, your repayment will be tracked on-chain via the smart contract.
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleRepayment(activeLoan.loanId)}
                    disabled={isRepaying}
                  >
                    {isRepaying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Record Repayment On-Chain
                      </>
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-center text-muted-foreground">
                  Click above after sending PAS to record your repayment
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">How Microloans Work</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Apply:</strong> Submit loan application with amount in PAS tokens</li>
                  <li>• <strong>Approval:</strong> Admin reviews and approves your application</li>
                  <li>• <strong>Receive:</strong> PAS tokens sent directly to your wallet</li>
                  <li>• <strong>Repay:</strong> Send PAS + interest back to admin address</li>
                  <li>• <strong>Track:</strong> All transactions recorded on blockchain</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                  <strong>Note:</strong> Loans are disbursed in PAS tokens. Interest rates based on your credit score (5-15% APR).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isEligible && (
        <LoanApplicationModal
          open={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          maxAmount="1000"
          interestRate={interestRate ? Number(interestRate) / 100 : 12}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </>
  )
}
