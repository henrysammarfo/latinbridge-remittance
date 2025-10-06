'use client'

import { Button } from "@/components/ui/button"
import { Bell, Settings, Wallet, LogOut } from "lucide-react"
import { useAccount, useDisconnect } from "wagmi"
import { useAuth } from "@/lib/web3/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { signOut } = useAuth()
  const router = useRouter()

  const handleDisconnect = () => {
    signOut()
    disconnect()
    router.push('/login')
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          {isConnected && address ? (
            <span className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <code className="text-xs bg-muted px-2 py-1 rounded">{formatAddress(address)}</code>
              <Badge variant="outline" className="text-xs">
                Polkadot Paseo
              </Badge>
            </span>
          ) : (
            'Manage your cross-border transactions'
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        {isConnected && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </Button>
        )}
      </div>
    </div>
  )
}
