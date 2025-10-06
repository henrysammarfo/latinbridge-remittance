/**
 * SIWE signature verification endpoint
 */
import { NextRequest, NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'
import { generateToken } from '@/lib/auth/jwt'
import { getNonce, deleteNonce } from '@/lib/auth/nonce-storage'

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json()

    if (!message || !signature) {
      return NextResponse.json(
        { error: 'Message and signature are required' },
        { status: 400 }
      )
    }

    // Verify SIWE message
    const siweMessage = new SiweMessage(message)

    try {
      // Verify the signature
      const fields = await siweMessage.verify({ signature })

      // Get stored nonce
      const storedNonce = getNonce(fields.data.address)

      if (!storedNonce) {
        return NextResponse.json(
          { error: 'Nonce not found or expired' },
          { status: 401 }
        )
      }

      if (storedNonce !== fields.data.nonce) {
        return NextResponse.json(
          { error: 'Invalid nonce' },
          { status: 401 }
        )
      }

      // Delete used nonce
      deleteNonce(fields.data.address)

      // Check if user is registered on-chain
      // For now, we'll skip this and handle registration on first interaction
      // In a full implementation, you would:
      // 1. Check UserRegistry contract for registration
      // 2. Auto-register if needed (using backend wallet)

      // Generate JWT token
      const token = await generateToken(fields.data.address)

      return NextResponse.json({
        success: true,
        token,
        address: fields.data.address,
      })
    } catch (error) {
      console.error('SIWE verification failed:', error)
      return NextResponse.json(
        { error: 'Signature verification failed' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
