"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, TrendingUp, CreditCard, Download, Search, Filter } from "lucide-react"

const allTransactions = [
  {
    id: "TXN001",
    type: "send",
    description: "Sent to Maria Garcia",
    amount: -250.0,
    currency: "USD",
    status: "completed",
    date: "2025-01-15",
    time: "14:32",
    method: "Wallet",
    recipient: "maria@example.com",
  },
  {
    id: "TXN002",
    type: "receive",
    description: "Received from Carlos Rodriguez",
    amount: 500.0,
    currency: "MXN",
    status: "completed",
    date: "2025-01-15",
    time: "10:15",
    method: "PIX",
    recipient: "carlos@example.com",
  },
  {
    id: "TXN003",
    type: "send",
    description: "Sent to Ana Silva",
    amount: -150.0,
    currency: "BRL",
    status: "pending",
    date: "2025-01-14",
    time: "18:45",
    method: "SPEI",
    recipient: "ana@example.com",
  },
  {
    id: "TXN004",
    type: "savings",
    description: "Interest earned",
    amount: 8.22,
    currency: "USD",
    status: "completed",
    date: "2025-01-14",
    time: "00:00",
    method: "Savings",
    recipient: "Savings Account",
  },
  {
    id: "TXN005",
    type: "receive",
    description: "Received from Juan Martinez",
    amount: 320.0,
    currency: "USD",
    status: "completed",
    date: "2025-01-14",
    time: "09:20",
    method: "ACH",
    recipient: "juan@example.com",
  },
  {
    id: "TXN006",
    type: "loan",
    description: "Loan payment",
    amount: -87.92,
    currency: "USD",
    status: "completed",
    date: "2025-01-13",
    time: "16:10",
    method: "Auto-debit",
    recipient: "Loan Account",
  },
  {
    id: "TXN007",
    type: "send",
    description: "Sent to Sofia Lopez",
    amount: -75.5,
    currency: "COP",
    status: "completed",
    date: "2025-01-13",
    time: "12:30",
    method: "CoDi",
    recipient: "sofia@example.com",
  },
  {
    id: "TXN008",
    type: "send",
    description: "Sent to Pedro Gomez",
    amount: -100.0,
    currency: "GTQ",
    status: "failed",
    date: "2025-01-12",
    time: "15:45",
    method: "PSE",
    recipient: "pedro@example.com",
  },
]

export function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currencyFilter, setCurrencyFilter] = useState("all")

  const filteredTransactions = allTransactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.recipient.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || txn.type === typeFilter
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter
    const matchesCurrency = currencyFilter === "all" || txn.currency === currencyFilter

    return matchesSearch && matchesType && matchesStatus && matchesCurrency
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-5 w-5 text-destructive" />
      case "receive":
        return <ArrowDownLeft className="h-5 w-5 text-primary" />
      case "savings":
        return <TrendingUp className="h-5 w-5 text-accent" />
      case "loan":
        return <CreditCard className="h-5 w-5 text-muted-foreground" />
      default:
        return <ArrowUpRight className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-primary">Completed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="send">Send</SelectItem>
                <SelectItem value="receive">Receive</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="loan">Loan</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Currencies</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="MXN">MXN</SelectItem>
                <SelectItem value="BRL">BRL</SelectItem>
                <SelectItem value="ARS">ARS</SelectItem>
                <SelectItem value="COP">COP</SelectItem>
                <SelectItem value="GTQ">GTQ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      txn.type === "send"
                        ? "bg-destructive/10"
                        : txn.type === "receive"
                          ? "bg-primary/10"
                          : txn.type === "savings"
                            ? "bg-accent/10"
                            : "bg-muted"
                    }`}
                  >
                    {getTransactionIcon(txn.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{txn.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {txn.id} • {txn.date} at {txn.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-sm text-muted-foreground">{txn.method}</div>
                  <div className="text-right min-w-[100px]">
                    <div className={`font-semibold ${txn.amount > 0 ? "text-primary" : "text-foreground"}`}>
                      {txn.amount > 0 ? "+" : ""}
                      {txn.amount.toFixed(2)} {txn.currency}
                    </div>
                  </div>
                  <div className="min-w-[100px]">{getStatusBadge(txn.status)}</div>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
