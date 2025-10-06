import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6 text-balance">
            Ready to Start Saving on Remittances?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">
            Join 200M+ Latin Americans who trust LatinBridge for fast, secure, and affordable cross-border payments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/signup">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
              <Link href="/dashboard">View Demo Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
