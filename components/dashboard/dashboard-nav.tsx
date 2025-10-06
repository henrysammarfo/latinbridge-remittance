"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
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
  TestTube,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/send", label: "Send Money", icon: Send },
  { href: "/receive", label: "Receive Money", icon: Download },
  { href: "/kyc", label: "KYC Verification", icon: FileCheck },
  { href: "/savings", label: "Savings", icon: PiggyBank },
  { href: "/loans", label: "Microloans", icon: CreditCard },
  { href: "/transactions", label: "Transactions", icon: History },
  { href: "/networks", label: "Payment Networks", icon: Network },
  { href: "/rates", label: "Exchange Rates", icon: TrendingUp },
  { href: "/test", label: "Test Platform", icon: TestTube },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">LB</span>
          </div>
          <span className="text-xl font-bold">LatinBridge</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.slice(0, 6).map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              size="sm"
              asChild
              className={cn(pathname === item.href && "bg-secondary")}
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex bg-transparent">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container py-4 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
