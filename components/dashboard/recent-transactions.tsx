import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const transactions = [
  {
    id: "1",
    type: "send",
    recipient: "Maria Garcia",
    amount: -250.0,
    currency: "USD",
    status: "completed",
    date: "2025-01-15",
    time: "14:32",
  },
  {
    id: "2",
    type: "receive",
    recipient: "Carlos Rodriguez",
    amount: 500.0,
    currency: "MXN",
    status: "completed",
    date: "2025-01-15",
    time: "10:15",
  },
  {
    id: "3",
    type: "send",
    recipient: "Ana Silva",
    amount: -150.0,
    currency: "BRL",
    status: "pending",
    date: "2025-01-14",
    time: "18:45",
  },
  {
    id: "4",
    type: "receive",
    recipient: "Juan Martinez",
    amount: 320.0,
    currency: "USD",
    status: "completed",
    date: "2025-01-14",
    time: "09:20",
  },
  {
    id: "5",
    type: "send",
    recipient: "Sofia Lopez",
    amount: -75.5,
    currency: "COP",
    status: "completed",
    date: "2025-01-13",
    time: "16:10",
  },
]

export function RecentTransactions() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/transactions">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    transaction.type === "send" ? "bg-destructive/10" : "bg-primary/10"
                  }`}
                >
                  {transaction.type === "send" ? (
                    <ArrowUpRight className="h-5 w-5 text-destructive" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.recipient}</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.date} at {transaction.time}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`font-semibold ${transaction.amount > 0 ? "text-primary" : "text-foreground"}`}>
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount.toFixed(2)} {transaction.currency}
                  </div>
                  <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
