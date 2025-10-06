import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Download, Plus, ArrowLeftRight } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    icon: Send,
    label: "Send Money",
    href: "/send",
    variant: "default" as const,
  },
  {
    icon: Download,
    label: "Receive Money",
    href: "/receive",
    variant: "outline" as const,
  },
  {
    icon: Plus,
    label: "Add Money",
    href: "/add-money",
    variant: "outline" as const,
  },
  {
    icon: ArrowLeftRight,
    label: "Exchange",
    href: "/exchange",
    variant: "outline" as const,
  },
]

export function QuickActions() {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              size="lg"
              asChild
              className="h-auto py-4 flex-col gap-2"
            >
              <Link href={action.href}>
                <action.icon className="h-6 w-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
