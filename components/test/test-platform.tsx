"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Send,
  Download,
  FileCheck,
  PiggyBank,
  CreditCard,
  History,
  Network,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    title: "Landing Page",
    description: "Hero section, features, calculator, trust indicators",
    icon: Home,
    href: "/",
    status: "complete",
    testCases: ["Hero display", "Fee calculator", "Trust badges", "CTA buttons"],
  },
  {
    title: "Dashboard",
    description: "Multi-currency wallet, quick actions, recent transactions",
    icon: Home,
    href: "/dashboard",
    status: "complete",
    testCases: ["Wallet overview", "Currency cards", "Quick actions", "Transaction list"],
  },
  {
    title: "Send Money",
    description: "4-step flow: recipient, amount, payment, review",
    icon: Send,
    href: "/send",
    status: "complete",
    testCases: ["Recipient selection", "Amount calculation", "Payment method", "Confirmation"],
  },
  {
    title: "Receive Money",
    description: "Payment links and QR code generation",
    icon: Download,
    href: "/receive",
    status: "complete",
    testCases: ["Link generation", "QR code display", "Amount specification", "Share options"],
  },
  {
    title: "KYC Verification",
    description: "3-tier verification system with document upload",
    icon: FileCheck,
    href: "/kyc",
    status: "complete",
    testCases: ["Tier overview", "Document upload", "Status tracking", "Limit display"],
  },
  {
    title: "Savings Account",
    description: "5% APY with deposit/withdraw functionality",
    icon: PiggyBank,
    href: "/savings",
    status: "complete",
    testCases: ["Balance display", "Interest calculation", "Deposit flow", "Withdraw flow"],
  },
  {
    title: "Microloans",
    description: "$50-$5,000 loans with 5-15% interest",
    icon: CreditCard,
    href: "/loans",
    status: "complete",
    testCases: ["Eligibility check", "Application form", "Active loans", "Payment tracking"],
  },
  {
    title: "Transaction History",
    description: "Filterable list with export functionality",
    icon: History,
    href: "/transactions",
    status: "complete",
    testCases: ["Transaction list", "Filters", "Search", "Export CSV"],
  },
  {
    title: "Payment Networks",
    description: "PIX, SPEI, CoDi, PSE, ACH integration",
    icon: Network,
    href: "/networks",
    status: "complete",
    testCases: ["Network list", "Connection flow", "Status display", "Features"],
  },
  {
    title: "Exchange Rates",
    description: "Live rates with alerts and historical data",
    icon: TrendingUp,
    href: "/rates",
    status: "complete",
    testCases: ["Rate display", "Alert creation", "Historical chart", "Best rates"],
  },
]

const technicalSpecs = [
  { label: "Framework", value: "Next.js 14+ App Router" },
  { label: "Styling", value: "Tailwind CSS v4" },
  { label: "Components", value: "shadcn/ui" },
  { label: "Type Safety", value: "TypeScript" },
  { label: "Currencies", value: "USD, MXN, BRL, ARS, COP, GTQ" },
  { label: "Fee Structure", value: "0.5% per transaction" },
  { label: "Savings APY", value: "5.0%" },
  { label: "Loan Range", value: "$50 - $5,000" },
]

export function TestPlatform() {
  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">LatinBridge Platform Status</h2>
              <p className="text-muted-foreground">All features implemented and ready for testing</p>
            </div>
            <Badge className="bg-primary text-lg px-4 py-2">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              100% Complete
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-primary">10</div>
              <div className="text-sm text-muted-foreground mt-1">Features</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-primary">6</div>
              <div className="text-sm text-muted-foreground mt-1">Currencies</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground mt-1">Networks</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-primary">0.5%</div>
              <div className="text-sm text-muted-foreground mt-1">Fee</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Feature Testing Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <Badge className="bg-primary">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {feature.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {feature.testCases.map((testCase, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {testCase}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={feature.href}>
                      Test Feature
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {technicalSpecs.map((spec, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">{spec.label}</span>
                <span className="font-semibold">{spec.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Testing Instructions for Judges</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">1.</span>
              <span>Start with the landing page to understand the value proposition and fee calculator</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">2.</span>
              <span>Navigate to the dashboard to see the multi-currency wallet interface</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">3.</span>
              <span>Test the send money flow with the 4-step wizard (recipient, amount, payment, review)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">4.</span>
              <span>Generate a payment link in the receive money section</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">5.</span>
              <span>Explore the KYC verification system with 3 tiers and different limits</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">6.</span>
              <span>Check the savings account with 5% APY and deposit/withdraw modals</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">7.</span>
              <span>Apply for a microloan and see the interest calculation</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">8.</span>
              <span>Filter transactions by type, status, and currency</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">9.</span>
              <span>View payment networks (PIX, SPEI, CoDi, PSE, ACH) and connection flow</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">10.</span>
              <span>Check live exchange rates and create rate alerts</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
