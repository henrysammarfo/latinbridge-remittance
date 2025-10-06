"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Lock, XCircle } from "lucide-react"

type KYCTier = "tier1" | "tier2" | "tier3"
type KYCStatus = "not-started" | "pending" | "verified" | "rejected"

interface Tier {
  id: KYCTier
  name: string
  status: KYCStatus
  limits: {
    daily: string
    monthly: string
  }
  requirements: string[]
  features: string[]
}

interface KYCTierCardProps {
  tier: Tier
  onStartVerification: (tierId: KYCTier) => void
}

export function KYCTierCard({ tier, onStartVerification }: KYCTierCardProps) {
  const getStatusBadge = () => {
    switch (tier.status) {
      case "verified":
        return (
          <Badge className="bg-primary">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Under Review
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Lock className="mr-1 h-3 w-3" />
            Not Started
          </Badge>
        )
    }
  }

  const getActionButton = () => {
    switch (tier.status) {
      case "verified":
        return (
          <Button disabled variant="outline">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Verified
          </Button>
        )
      case "pending":
        return (
          <Button disabled variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Under Review
          </Button>
        )
      case "rejected":
        return (
          <Button onClick={() => onStartVerification(tier.id)} variant="outline">
            Resubmit Documents
          </Button>
        )
      default:
        return <Button onClick={() => onStartVerification(tier.id)}>Start Verification</Button>
    }
  }

  return (
    <Card className={`border-border/50 ${tier.status === "verified" ? "bg-primary/5 border-primary/20" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{tier.name}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              Daily: {tier.limits.daily} • Monthly: {tier.limits.monthly}
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Requirements</h4>
          <ul className="space-y-1">
            {tier.requirements.map((req, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Features</h4>
          <ul className="space-y-1">
            {tier.features.map((feature, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {getActionButton()}
      </CardContent>
    </Card>
  )
}
