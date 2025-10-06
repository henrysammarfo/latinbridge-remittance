'use client'

import { useState } from 'react'
import { useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { SiweMessage } from 'siwe'
import { polkadotPaseo } from '../config'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  isLoading: boolean
  error: string | null
}

export function useAuth() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { disconnect } = useDisconnect()

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    isLoading: false,
    error: null,
  })

  /**
   * Sign in with Ethereum (SIWE)
   */
  const signIn = async () => {
    if (!address || !isConnected) {
      setAuthState(prev => ({
        ...prev,
        error: 'Wallet not connected',
      }))
      return null
    }

    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }))

    try {
      // 1. Get nonce from backend
      const nonceRes = await fetch('/api/auth/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })

      if (!nonceRes.ok) {
        throw new Error('Failed to get nonce')
      }

      const { nonce } = await nonceRes.json()

      // 2. Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to LatinBridge',
        uri: window.location.origin,
        version: '1',
        chainId: polkadotPaseo.id,
        nonce,
      })

      const preparedMessage = message.prepareMessage()

      // 3. Sign message
      const signature = await signMessageAsync({
        message: preparedMessage,
      })

      // 4. Verify signature and get JWT
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          signature,
        }),
      })

      if (!verifyRes.ok) {
        const error = await verifyRes.json()
        throw new Error(error.message || 'Authentication failed')
      }

      const { token } = await verifyRes.json()

      // 5. Store token in localStorage
      localStorage.setItem('auth_token', token)

      setAuthState({
        isAuthenticated: true,
        token,
        isLoading: false,
        error: null,
      })

      return token
    } catch (error) {
      console.error('Sign in error:', error)
      setAuthState({
        isAuthenticated: false,
        token: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      })
      return null
    }
  }

  /**
   * Sign out
   */
  const signOut = () => {
    localStorage.removeItem('auth_token')
    setAuthState({
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null,
    })
    disconnect()
  }

  /**
   * Check if user has a valid token
   */
  const checkAuth = () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        token,
      }))
      return true
    }
    return false
  }

  return {
    address,
    isConnected,
    isAuthenticated: authState.isAuthenticated,
    token: authState.token,
    isLoading: authState.isLoading,
    error: authState.error,
    signIn,
    signOut,
    checkAuth,
  }
}
