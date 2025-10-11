"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Info, Loader2 } from "lucide-react"
import { DepositModal } from "./deposit-modal"
import { WithdrawModal } from "./withdraw-modal"
import { Badge } from "@/components/ui/badge"
import { useSavings } from "@/lib/web3/hooks/useSavings"
import { Currency } from "@/lib/web3/hooks/useContracts"
import { useAccount } from "wagmi"

// Savings history will be populated from blockchain events (Deposit, Withdrawal, YieldClaimed)
// Currently empty - will show transactions once user performs deposit/withdrawal actions
const savingsHistory: any[] = []

export function SavingsInterface() {
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  const { isConnected } = useAccount()
  const { useBalance, useAccruedInterest, apy } = useSavings()

  // Get USD savings balance
  const { balance, isLoading } = useBalance(Currency.USD)
  const { interest } = useAccruedInterest(Currency.USD)

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Connect your wallet to view savings
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalBalance = parseFloat(balance)
  const interestEarned = parseFloat(interest)
  const projectedAnnual = totalBalance * (apy / 100)

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Savings Balance</span>
                <Badge className="bg-primary">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {apy}% APY
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-4xl font-bold mb-2">${totalBalance.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">
                    Total interest earned: ${interestEarned.toFixed(2)}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Projected Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Monthly</span>
                  <span className="font-semibold">${(projectedAnnual / 12).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Yearly</span>
                  <span className="font-semibold">${projectedAnnual.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm font-medium">APY Rate</span>
                  <span className="text-lg font-bold text-primary">{apy}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" onClick={() => setShowDepositModal(true)}>
                <ArrowDownLeft className="mr-2 h-4 w-4" />
                Deposit
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowWithdrawModal(true)}>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">How Savings Works</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Earn {apy}% APY on all deposits (from smart contract)</li>
                  <li>• Interest compounds daily and is paid monthly</li>
                  <li>• No minimum balance or lock-in period</li>
                  <li>• Withdraw anytime without penalties</li>
                  <li>• Secured by blockchain smart contracts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {savingsHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No savings activity yet</p>
                <p className="text-sm mt-2">Make a deposit to start earning interest</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savingsHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          item.type === "withdraw"
                            ? "bg-destructive/10"
                            : item.type === "interest"
                              ? "bg-accent/10"
                              : "bg-primary/10"
                        }`}
                      >
                        {item.type === "withdraw" ? (
                          <ArrowUpRight className="h-5 w-5 text-destructive" />
                        ) : item.type === "interest" ? (
                          <TrendingUp className="h-5 w-5 text-accent" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{item.type}</div>
                        <div className="text-sm text-muted-foreground">{item.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${item.type === "withdraw" ? "text-destructive" : "text-primary"}`}>
                        {item.amount > 0 ? "+" : ""}${Math.abs(item.amount).toFixed(2)}
                      </div>
                      {item.interest > 0 && <div className="text-xs text-muted-foreground">Interest earned</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DepositModal open={showDepositModal} onClose={() => setShowDepositModal(false)} />
      <WithdrawModal open={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
    </>
  )
}
