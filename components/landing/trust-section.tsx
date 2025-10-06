import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, FileCheck, Award } from "lucide-react"

const trustIndicators = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "256-bit encryption and secure data storage",
  },
  {
    icon: Lock,
    title: "Regulatory Compliant",
    description: "Licensed and regulated in all operating countries",
  },
  {
    icon: FileCheck,
    title: "KYC Verified",
    description: "Multi-tier verification for enhanced security",
  },
  {
    icon: Award,
    title: "Trusted Platform",
    description: "Serving 200M+ users across Latin America",
  },
]

export function TrustSection() {
  return (
    <section className="py-20 md:py-32 border-b">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-balance">
            Your Money, Secured
          </h2>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            We take security seriously. Your funds are protected with industry-leading security measures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustIndicators.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index} className="border-border/50 bg-card">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
