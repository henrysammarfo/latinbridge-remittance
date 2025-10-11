"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function SignupForm() {
  const router = useRouter()

  const handleGetStarted = () => {
    // Redirect to login page where user connects their wallet
    router.push("/login")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Get Started with LatinBridge</CardTitle>
        <CardDescription className="text-base">
          Connect your Web3 wallet to create your account. No passwords needed - just your wallet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs mt-0.5">1</div>
            <div>
              <div className="font-semibold">Connect Your Wallet</div>
              <div className="text-muted-foreground">MetaMask, Coinbase Wallet, or any Web3 wallet</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs mt-0.5">2</div>
            <div>
              <div className="font-semibold">Complete Your Profile</div>
              <div className="text-muted-foreground">Add your name and email (stored on blockchain)</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs mt-0.5">3</div>
            <div>
              <div className="font-semibold">Start Sending Money</div>
              <div className="text-muted-foreground">Cross-border transfers with just 0.5% fees</div>
            </div>
          </div>
        </div>

        <Button onClick={handleGetStarted} className="w-full" size="lg">
          <Wallet className="mr-2 h-5 w-5" />
          Connect Wallet to Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in with wallet
          </Link>
        </div>

        <div className="border-t pt-4">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="font-semibold mb-2">Why Web3 Wallet?</div>
            <div>• No passwords to remember or manage</div>
            <div>• Complete control of your funds</div>
            <div>• Cryptographic security</div>
            <div>• Direct on-chain transactions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
