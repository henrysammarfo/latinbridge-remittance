import { UserPlus, FileCheck, Send, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your account in minutes with just your email and phone number.",
  },
  {
    icon: FileCheck,
    title: "Verify Identity",
    description: "Complete KYC verification to unlock higher transaction limits and features.",
  },
  {
    icon: Send,
    title: "Send Money",
    description: "Choose your recipient, amount, and payment method. Transfers complete in seconds.",
  },
  {
    icon: CheckCircle,
    title: "Track & Manage",
    description: "Monitor all transactions in real-time with full transparency and receipts.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/30 border-b">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-balance">How It Works</h2>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            Start sending money in four simple steps. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="mb-2 text-sm font-semibold text-primary">Step {index + 1}</div>
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-border" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
