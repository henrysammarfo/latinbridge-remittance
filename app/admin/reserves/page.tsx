"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminCheck } from "@/lib/hooks/useAdminCheck"
import { useRemittance } from "@/lib/web3/hooks/useRemittance"
import { Currency, CURRENCY_SYMBOLS } from "@/lib/web3/hooks/useContracts"
import { useToast } from "@/hooks/use-toast"
import { Loader2, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"

export default function AdminReservesPage() {
  const { isConnected } = useAccount()
  const { isAdmin } = useAdminCheck()
  const router = useRouter()
  const { toast } = useToast()
  const { 
    usePlatformReserve, 
    depositToPlatformReserves, 
    withdrawFromPlatformReserves 
  } = useRemittance()

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.USD)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isDepositLoading, setIsDepositLoading] = useState(false)
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false)

  // Get reserves for all currencies
  const usdReserve = usePlatformReserve(Currency.USD)
  const mxnReserve = usePlatformReserve(Currency.MXN)
  const brlReserve = usePlatformReserve(Currency.BRL)
  const arsReserve = usePlatformReserve(Currency.ARS)
  const copReserve = usePlatformReserve(Currency.COP)
  const gtqReserve = usePlatformReserve(Currency.GTQ)

  // Get selected currency reserve
  const currentReserve = usePlatformReserve(selectedCurrency)

  // Redirect non-admin users
  if (!isConnected || !isAdmin) {
    router.push('/dashboard')
    return null
  }

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive"
      })
      return
    }

    setIsDepositLoading(true)
    try {
      await depositToPlatformReserves(selectedCurrency, depositAmount)
      toast({
        title: "Deposit Successful",
        description: `Deposited ${depositAmount} ${CURRENCY_SYMBOLS[selectedCurrency]} to platform reserves`,
      })
      setDepositAmount("")
      
      // Refetch all reserves
      currentReserve.refetch()
      usdReserve.refetch()
      mxnReserve.refetch()
      brlReserve.refetch()
      arsReserve.refetch()
      copReserve.refetch()
      gtqReserve.refetch()
    } catch (error: any) {
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to deposit to platform reserves",
        variant: "destructive"
      })
    } finally {
      setIsDepositLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdraw amount",
        variant: "destructive"
      })
      return
    }

    setIsWithdrawLoading(true)
    try {
      await withdrawFromPlatformReserves(selectedCurrency, withdrawAmount)
      toast({
        title: "Withdrawal Successful",
        description: `Withdrew ${withdrawAmount} ${CURRENCY_SYMBOLS[selectedCurrency]} from platform reserves`,
      })
      setWithdrawAmount("")
      
      // Refetch all reserves
      currentReserve.refetch()
      usdReserve.refetch()
      mxnReserve.refetch()
      brlReserve.refetch()
      arsReserve.refetch()
      copReserve.refetch()
      gtqReserve.refetch()
    } catch (error: any) {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to withdraw from platform reserves",
        variant: "destructive"
      })
    } finally {
      setIsWithdrawLoading(false)
    }
  }

  const reserves = [
    { currency: Currency.USD, reserve: usdReserve.reserve, symbol: "USD" },
    { currency: Currency.MXN, reserve: mxnReserve.reserve, symbol: "MXN" },
    { currency: Currency.BRL, reserve: brlReserve.reserve, symbol: "BRL" },
    { currency: Currency.ARS, reserve: arsReserve.reserve, symbol: "ARS" },
    { currency: Currency.COP, reserve: copReserve.reserve, symbol: "COP" },
    { currency: Currency.GTQ, reserve: gtqReserve.reserve, symbol: "GTQ" },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Reserves Management</h1>
        <p className="text-muted-foreground">
          Manage platform reserves for funding loans and savings
        </p>
      </div>

      {/* Current Reserves Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reserves.map(({ currency, reserve, symbol }) => (
          <Card key={currency}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {symbol} Reserve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-2xl font-bold">
                  {parseFloat(reserve).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deposit to Reserves */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Deposit to Platform Reserves
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={selectedCurrency.toString()}
                onValueChange={(value) => setSelectedCurrency(parseInt(value) as Currency)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Currency.USD.toString()}>USD</SelectItem>
                  <SelectItem value={Currency.MXN.toString()}>MXN</SelectItem>
                  <SelectItem value={Currency.BRL.toString()}>BRL</SelectItem>
                  <SelectItem value={Currency.ARS.toString()}>ARS</SelectItem>
                  <SelectItem value={Currency.COP.toString()}>COP</SelectItem>
                  <SelectItem value={Currency.GTQ.toString()}>GTQ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Current Reserve:</span>
                <span className="font-medium">
                  {parseFloat(currentReserve.reserve).toFixed(2)} {CURRENCY_SYMBOLS[selectedCurrency]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">After Deposit:</span>
                <span className="font-medium">
                  {(parseFloat(currentReserve.reserve) + parseFloat(depositAmount || "0")).toFixed(2)} {CURRENCY_SYMBOLS[selectedCurrency]}
                </span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleDeposit} 
            disabled={isDepositLoading || !depositAmount}
            className="w-full"
          >
            {isDepositLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deposit to Reserves
          </Button>
        </CardContent>
      </Card>

      {/* Withdraw from Reserves */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            Withdraw from Platform Reserves
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={selectedCurrency.toString()}
                onValueChange={(value) => setSelectedCurrency(parseInt(value) as Currency)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Currency.USD.toString()}>USD</SelectItem>
                  <SelectItem value={Currency.MXN.toString()}>MXN</SelectItem>
                  <SelectItem value={Currency.BRL.toString()}>BRL</SelectItem>
                  <SelectItem value={Currency.ARS.toString()}>ARS</SelectItem>
                  <SelectItem value={Currency.COP.toString()}>COP</SelectItem>
                  <SelectItem value={Currency.GTQ.toString()}>GTQ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Current Reserve:</span>
                <span className="font-medium">
                  {parseFloat(currentReserve.reserve).toFixed(2)} {CURRENCY_SYMBOLS[selectedCurrency]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">After Withdrawal:</span>
                <span className="font-medium">
                  {(parseFloat(currentReserve.reserve) - parseFloat(withdrawAmount || "0")).toFixed(2)} {CURRENCY_SYMBOLS[selectedCurrency]}
                </span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleWithdraw} 
            disabled={isWithdrawLoading || !withdrawAmount}
            variant="destructive"
            className="w-full"
          >
            {isWithdrawLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Withdraw from Reserves
          </Button>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Platform Reserves Information</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Platform reserves are used to fund loans and manage savings operations. Ensure sufficient reserves before approving loans.
          </p>
          <p className="text-sm text-muted-foreground">
            All deposits and withdrawals are recorded on-chain and can be verified on the blockchain.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
