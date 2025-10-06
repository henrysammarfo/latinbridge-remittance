import { Button } from "@/components/ui/button"
import { Shield, Zap, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="container py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Trusted by 200M+ Latin Americans</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl text-balance">
            Send Money Across Latin America <span className="text-primary">Without the Fees</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl text-balance max-w-2xl mx-auto leading-relaxed">
            Traditional remittance services charge 5-20% in fees. LatinBridge charges just 0.5%. Save thousands on every
            transfer with instant, secure cross-border payments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/signup" className="flex items-center gap-2">
                Start Sending Money
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
              <Link href="#calculator">Calculate Savings</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border">
              <Zap className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">0.5%</div>
              <div className="text-sm text-muted-foreground">Transaction Fee</div>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border">
              <Globe className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">6</div>
              <div className="text-sm text-muted-foreground">Currencies Supported</div>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border">
              <Shield className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">$165B</div>
              <div className="text-sm text-muted-foreground">Market Size</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
    </section>
  )
}
