"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Plus, Zap, Building2, Globe } from "lucide-react"
import { ConnectNetworkModal } from "./connect-network-modal"

const networks = [
  {
    id: "pix",
    name: "PIX",
    country: "Brazil",
    description: "Instant payments in Brazil",
    icon: "🇧🇷",
    status: "connected",
    features: ["Instant transfers", "24/7 availability", "QR code payments"],
    limits: "Up to R$20,000 per transaction",
  },
  {
    id: "spei",
    name: "SPEI",
    country: "Mexico",
    description: "Electronic payment system in Mexico",
    icon: "🇲🇽",
    status: "connected",
    features: ["Same-day transfers", "Bank-to-bank", "Low fees"],
    limits: "Up to $8,000 MXN per transaction",
  },
  {
    id: "codi",
    name: "CoDi",
    country: "Mexico",
    description: "Digital payment platform by Banco de México",
    icon: "🇲🇽",
    status: "not-connected",
    features: ["QR code payments", "Mobile-first", "No fees"],
    limits: "Up to $8,000 MXN per transaction",
  },
  {
    id: "pse",
    name: "PSE",
    country: "Colombia",
    description: "Online payment system in Colombia",
    icon: "🇨🇴",
    status: "not-connected",
    features: ["Bank transfers", "Secure payments", "Wide acceptance"],
    limits: "Up to $5,000,000 COP per transaction",
  },
  {
    id: "ach",
    name: "ACH",
    country: "United States",
    description: "Automated Clearing House network",
    icon: "🇺🇸",
    status: "connected",
    features: ["Direct deposits", "Bill payments", "Low cost"],
    limits: "Up to $25,000 per transaction",
  },
]

export function PaymentNetworks() {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)
  const [showConnectModal, setShowConnectModal] = useState(false)

  const connectedNetworks = networks.filter((n) => n.status === "connected")
  const availableNetworks = networks.filter((n) => n.status === "not-connected")

  const handleConnect = (networkId: string) => {
    setSelectedNetwork(networkId)
    setShowConnectModal(true)
  }

  return (
    <>
      <div className="space-y-6">
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Connected Networks</h3>
                <p className="text-sm text-muted-foreground">
                  You have {connectedNetworks.length} payment networks connected
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Connected Networks</h2>
          <div className="grid gap-4">
            {connectedNetworks.map((network) => (
              <Card key={network.id} className="border-border/50 border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{network.icon}</div>
                      <div>
                        <CardTitle className="text-xl">{network.name}</CardTitle>
                        <div className="text-sm text-muted-foreground mt-1">{network.description}</div>
                      </div>
                    </div>
                    <Badge className="bg-primary">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Connected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Features</h4>
                    <ul className="space-y-1">
                      {network.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Zap className="h-3.5 w-3.5 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{network.limits}</span>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Disconnect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Networks</h2>
          <div className="grid gap-4">
            {availableNetworks.map((network) => (
              <Card key={network.id} className="border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{network.icon}</div>
                      <div>
                        <CardTitle className="text-xl">{network.name}</CardTitle>
                        <div className="text-sm text-muted-foreground mt-1">{network.description}</div>
                      </div>
                    </div>
                    <Badge variant="outline">Not Connected</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Features</h4>
                    <ul className="space-y-1">
                      {network.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{network.limits}</span>
                  </div>
                  <Button onClick={() => handleConnect(network.id)} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Connect {network.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Why Connect Payment Networks?</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Instant transfers with local payment methods</li>
                  <li>• Lower fees compared to international transfers</li>
                  <li>• Better exchange rates for local currencies</li>
                  <li>• 24/7 availability for most networks</li>
                  <li>• Seamless integration with local banks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConnectNetworkModal
        open={showConnectModal}
        onClose={() => {
          setShowConnectModal(false)
          setSelectedNetwork(null)
        }}
        network={networks.find((n) => n.id === selectedNetwork)}
      />
    </>
  )
}
