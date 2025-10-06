"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { LoanApplicationModal } from "./loan-application-modal"
import { useLoans } from "@/lib/web3/hooks/useLoans"
import { useAccount } from "wagmi"
import { useToast } from "@/hooks/use-toast"

export function LoansInterface() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { checkEligibility, getActiveLoan, repayLoan } = useLoans()

  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [eligibility, setEligibility] = useState({
    isEligible: false,
    maxAmount: "0",
    interestRate: 0
  })
  const [activeLoan, setActiveLoan] = useState<any>(null)
  const [isRepaying, setIsRepaying] = useState(false)

  // Fetch loan data from blockchain
  useEffect(() => {
    const fetchLoanData = async () => {
      if (!isConnected || !address) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)

        // Check eligibility
        const { eligible, maxAmount, interestRate } = await checkEligibility()
        setEligibility({
          isEligible: eligible,
          maxAmount: maxAmount,
          interestRate: interestRate
        })

        // Get active loan if any
        const loan = await getActiveLoan()
        if (loan && loan.isActive) {
          setActiveLoan(loan)
        }
      } catch (error) {
        console.error("Error fetching loan data:", error)
        toast({
          title: "Error loading loan data",
          description: "Could not fetch loan information from blockchain",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoanData()
  }, [isConnected, address])

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

      await repayLoan(loanId)

      toast({
        title: "Payment successful!",
        description: "Your loan payment has been processed"
      })

      // Refresh active loan data
      const loan = await getActiveLoan()
      if (loan && loan.isActive) {
        setActiveLoan(loan)
      } else {
        setActiveLoan(null)
      }
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
      const loan = await getActiveLoan()
      if (loan && loan.isActive) {
        setActiveLoan(loan)
      }
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
                    ${parseFloat(eligibility.maxAmount || "0").toFixed(2)}
                  </div>
                </div>
                <Badge className={eligibility.isEligible ? "bg-primary" : "bg-destructive"}>
                  {eligibility.isEligible ? (
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
                  <div className="text-lg font-semibold">{eligibility.interestRate}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Loan Terms</div>
                  <div className="text-lg font-semibold">3-24 months</div>
                </div>
              </div>
              <Button
                onClick={() => setShowApplicationModal(true)}
                className="w-full"
                disabled={!eligibility.isEligible || activeLoan !== null}
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
                        Make Payment
                      </>
                    )}
                  </Button>
                </div>
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
                  <li>• Borrow based on your KYC level and credit score</li>
                  <li>• Interest rates determined by your creditworthiness</li>
                  <li>• Flexible repayment terms from 3 to 24 months</li>
                  <li>• Collateral secured through smart contract</li>
                  <li>• Funds deposited to your wallet instantly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {eligibility.isEligible && (
        <LoanApplicationModal
          open={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          maxAmount={eligibility.maxAmount}
          interestRate={eligibility.interestRate}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </>
  )
}
