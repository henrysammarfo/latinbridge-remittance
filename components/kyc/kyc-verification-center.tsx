"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { KYCTierCard } from "./kyc-tier-card"
import { KYCUploadForm } from "./kyc-upload-form"
import { useUserRegistry } from "@/lib/web3/hooks/useUserRegistry"
import { KYCLevel } from "@/lib/web3/hooks/useContracts"
import { useAccount } from "wagmi"
import { useToast } from "@/hooks/use-toast"

type KYCTier = "tier1" | "tier2" | "tier3"
type KYCStatus = "not-started" | "pending" | "verified" | "rejected"

const kycLevelToTier = (level: KYCLevel): KYCTier => {
  switch (level) {
    case KYCLevel.None:
    case KYCLevel.Basic:
      return "tier1"
    case KYCLevel.Enhanced:
      return "tier2"
    case KYCLevel.Premium:
      return "tier3"
    default:
      return "tier1"
  }
}

const tierToKYCLevel = (tier: KYCTier): KYCLevel => {
  switch (tier) {
    case "tier1":
      return KYCLevel.Basic
    case "tier2":
      return KYCLevel.Enhanced
    case "tier3":
      return KYCLevel.Premium
    default:
      return KYCLevel.Basic
  }
}

const getTierName = (tier: KYCTier): string => {
  switch (tier) {
    case "tier1": return "Tier 1 - Basic"
    case "tier2": return "Tier 2 - Standard"
    case "tier3": return "Tier 3 - Premium"
    default: return "Unknown"
  }
}

const getTierLimits = (tier: KYCTier) => {
  switch (tier) {
    case "tier1":
      return { daily: "$1,000", monthly: "$5,000" }
    case "tier2":
      return { daily: "$10,000", monthly: "$50,000" }
    case "tier3":
      return { daily: "$50,000", monthly: "$250,000" }
    default:
      return { daily: "$0", monthly: "$0" }
  }
}

const tiers = [
  {
    id: "tier1" as KYCTier,
    name: "Tier 1 - Basic",
    status: "not-started" as KYCStatus,
    limits: {
      daily: "$1,000",
      monthly: "$5,000",
    },
    requirements: ["Email verification", "Phone verification"],
    features: ["Send money", "Receive money", "Basic wallet"],
  },
  {
    id: "tier2" as KYCTier,
    name: "Tier 2 - Standard",
    status: "not-started" as KYCStatus,
    limits: {
      daily: "$10,000",
      monthly: "$50,000",
    },
    requirements: ["Government ID", "Proof of address", "Selfie verification"],
    features: ["All Tier 1 features", "Savings account", "Higher limits", "Priority support"],
  },
  {
    id: "tier3" as KYCTier,
    name: "Tier 3 - Premium",
    status: "not-started" as KYCStatus,
    limits: {
      daily: "$50,000",
      monthly: "$250,000",
    },
    requirements: ["Enhanced due diligence", "Source of funds", "Video verification"],
    features: ["All Tier 2 features", "Microloans", "Business accounts", "Dedicated manager", "Custom limits"],
  },
]

export function KYCVerificationCenter() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { getKYCStatus } = useUserRegistry()

  const [selectedTier, setSelectedTier] = useState<KYCTier | null>(null)
  const [currentTiers, setCurrentTiers] = useState(tiers)
  const [isLoading, setIsLoading] = useState(true)
  const [currentKYCLevel, setCurrentKYCLevel] = useState<KYCLevel>(KYCLevel.None)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch KYC status from blockchain
  useEffect(() => {
    const fetchKYCStatus = async () => {
      if (!isConnected || !address) {
        setIsLoading(false)
        return
      }

      try {
        const level = await getKYCStatus()
        setCurrentKYCLevel(level)

        // Update tier statuses based on blockchain data
        const updatedTiers = tiers.map(tier => {
          const tierLevel = tierToKYCLevel(tier.id)
          if (tierLevel <= level) {
            return { ...tier, status: "verified" as KYCStatus }
          }
          return tier
        })
        setCurrentTiers(updatedTiers)
      } catch (error) {
        console.error("Error fetching KYC status:", error)
        toast({
          title: "Error fetching KYC status",
          description: "Could not load KYC data from blockchain",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchKYCStatus()
  }, [isConnected, address])

  const handleStartVerification = (tierId: KYCTier) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to verify your identity",
        variant: "destructive"
      })
      return
    }
    setSelectedTier(tierId)
  }

  const handleSubmitDocuments = async (files: Record<string, File>) => {
    if (!selectedTier) return

    setIsSubmitting(true)

    try {
      // In production, you would:
      // 1. Upload files to IPFS/storage
      // 2. Call Didit API for verification
      // 3. Wait for verification result
      // 4. Update blockchain with new KYC level

      // For now, we'll simulate the Didit API call
      // and update the blockchain directly

      toast({
        title: "Uploading documents...",
        description: "Your documents are being uploaded to secure storage"
      })

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Verifying with Didit...",
        description: "Your identity is being verified"
      })

      // Simulate Didit verification
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update KYC level on blockchain
      const newLevel = tierToKYCLevel(selectedTier)
      // TODO: Implement updateKYCLevel in useUserRegistry hook
      // For testnet: KYC verification requires admin/oracle role on smart contract
      // await updateKYCLevel(newLevel)

      toast({
        title: "KYC Simulation Complete",
        description: `KYC verification simulated for ${getTierName(selectedTier)}. On mainnet, this will update your on-chain KYC status.`,
      })

      // Update local state
      setCurrentKYCLevel(newLevel)
      const updatedTiers = currentTiers.map(tier => {
        if (tier.id === selectedTier) {
          return { ...tier, status: "verified" as KYCStatus }
        }
        return tier
      })
      setCurrentTiers(updatedTiers)
      setSelectedTier(null)

    } catch (error: any) {
      console.error("KYC submission error:", error)

      let errorMessage = "Failed to submit KYC documents"
      if (error?.message?.includes("User rejected")) {
        errorMessage = "Transaction rejected by user"
      }

      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive"
      })

      // Set tier to pending instead of verified
      const updatedTiers = currentTiers.map(tier => {
        if (tier.id === selectedTier) {
          return { ...tier, status: "pending" as KYCStatus }
        }
        return tier
      })
      setCurrentTiers(updatedTiers)
      setSelectedTier(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
          <p className="text-sm text-muted-foreground">
            Please connect your wallet to access KYC verification
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading KYC status from blockchain...</p>
        </CardContent>
      </Card>
    )
  }

  if (selectedTier) {
    const tier = currentTiers.find((t) => t.id === selectedTier)
    return (
      <div>
        <Button variant="ghost" onClick={() => setSelectedTier(null)} className="mb-6">
          ← Back to Overview
        </Button>
        <KYCUploadForm
          tier={tier!}
          onSubmit={handleSubmitDocuments}
          onCancel={() => setSelectedTier(null)}
          isSubmitting={isSubmitting}
        />
      </div>
    )
  }

  const currentTier = kycLevelToTier(currentKYCLevel)
  const currentLimits = getTierLimits(currentTier)
  const currentTierName = getTierName(currentTier)

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Current Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold mb-1">{currentTierName}</div>
              <div className="text-sm text-muted-foreground">
                Daily limit: {currentLimits.daily} • Monthly limit: {currentLimits.monthly}
              </div>
            </div>
            <Badge className="bg-primary">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {currentKYCLevel === KYCLevel.None ? "Not Verified" : "Verified"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upgrade Your Verification</h2>
        <div className="grid gap-6">
          {currentTiers.map((tier) => (
            <KYCTierCard key={tier.id} tier={tier} onStartVerification={handleStartVerification} />
          ))}
        </div>
      </div>

      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Why Verify Your Identity?</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Unlock higher transaction limits</li>
                <li>• Access premium features like savings and loans</li>
                <li>• Enhanced security and fraud protection</li>
                <li>• Comply with international regulations</li>
                <li>• Priority customer support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
