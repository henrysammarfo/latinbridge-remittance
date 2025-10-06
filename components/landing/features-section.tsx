import { Card, CardContent } from "@/components/ui/card"
import { Wallet, TrendingUp, CreditCard, Shield, Zap, Globe } from "lucide-react"

const features = [
  {
    icon: Wallet,
    title: "Multi-Currency Wallet",
    description: "Hold USD, MXN, BRL, ARS, COP, and GTQ in one secure wallet. Switch between currencies instantly.",
  },
  {
    icon: TrendingUp,
    title: "5% APY Savings",
    description: "Earn competitive interest on your deposits. DeFi-style returns with traditional banking security.",
  },
  {
    icon: CreditCard,
    title: "Microloans",
    description: "Access quick loans from $50-$5,000 with flexible repayment terms and competitive 5-15% rates.",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "KYC verification, encryption, and regulatory compliance keep your money safe and secure.",
  },
  {
    icon: Zap,
    title: "Instant Transfers",
    description: "Send money in seconds with PIX, SPEI, CoDi, PSE, and ACH network integrations.",
  },
  {
    icon: Globe,
    title: "Blockchain Integration",
    description: "Connect your MetaMask wallet for seamless crypto-to-fiat conversions and DeFi access.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 border-b">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-balance">
            Everything You Need for Cross-Border Finance
          </h2>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            More than just remittances. Build wealth, access credit, and manage your money across borders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
