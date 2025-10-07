'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useUserRegistry } from '@/lib/web3/hooks/useUserRegistry'
import { Loader2, User, Mail, Phone, MapPin } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { registerUser, isRegistered, isLoading: isCheckingRegistration } = useUserRegistry()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user is already registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (isConnected && address && !isCheckingRegistration) {
        const registered = await isRegistered()
        if (registered) {
          // Already registered, redirect to dashboard
          router.push('/dashboard')
        }
      }
    }

    checkRegistration()
  }, [isConnected, address, isRegistered, isCheckingRegistration, router])

  // Redirect to login if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/login')
    }
  }, [isConnected, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone || !formData.country) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Register user in UserRegistry contract
      const hash = await registerUser(
        formData.name,
        formData.email,
        formData.phone,
        formData.country
      )

      toast({
        title: 'Profile created!',
        description: `Transaction hash: ${hash.slice(0, 10)}...`,
      })

      // Wait a moment for transaction confirmation
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error: any) {
      console.error('Registration error:', error)

      let errorMessage = 'Failed to create profile'
      if (error?.message) {
        if (error.message.includes('User rejected')) {
          errorMessage = 'Transaction rejected by user'
        } else if (error.message.includes('already registered')) {
          errorMessage = 'This wallet is already registered'
          // Redirect to dashboard after a short delay
          setTimeout(() => router.push('/dashboard'), 2000)
        } else {
          errorMessage = error.message
        }
      }

      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected || isCheckingRegistration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md border-border/50">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Set up your LatinBridge account to start sending money
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="United States"
                  value={formData.country}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Create Profile'
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Your information will be stored on the Polkadot Paseo blockchain
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
