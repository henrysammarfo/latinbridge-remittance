'use client'

import { useEffect, useState } from 'react'
import { useAccount, useSwitchChain, useChainId } from 'wagmi'
import { polkadotPaseo } from '@/lib/web3/config'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function NetworkSwitch() {
  const { toast } = useToast()
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()
  const [showBanner, setShowBanner] = useState(false)

  const isCorrectNetwork = chainId === polkadotPaseo.id

  useEffect(() => {
    if (isConnected && !isCorrectNetwork) {
      setShowBanner(true)
    } else {
      setShowBanner(false)
    }
  }, [isConnected, isCorrectNetwork])

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: polkadotPaseo.id })
      toast({
        title: "Network switched!",
        description: `Connected to ${polkadotPaseo.name}`
      })
      setShowBanner(false)
    } catch (error: any) {
      console.error('Network switch error:', error)

      let errorMessage = "Failed to switch network"
      if (error?.message?.includes("User rejected")) {
        errorMessage = "Network switch rejected by user"
      }

      toast({
        title: "Network switch failed",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  if (!showBanner) return null

  return (
    <Card className="border-destructive/50 bg-destructive/10 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20 shrink-0">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-destructive mb-1">Wrong Network</h3>
            <p className="text-sm text-muted-foreground">
              Please switch to {polkadotPaseo.name} to use LatinBridge
            </p>
          </div>
          <Button
            onClick={handleSwitchNetwork}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Switching...
              </>
            ) : (
              "Switch Network"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
