import { NextRequest, NextResponse } from 'next/server'
import { generateNonce } from '@/lib/auth/jwt'
import { storeNonce } from '@/lib/auth/nonce-storage'

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    // Generate a random nonce
    const nonce = generateNonce()

    // Store nonce with address
    storeNonce(address, nonce)

    return NextResponse.json({ nonce })
  } catch (error) {
    console.error('Nonce generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    )
  }
}
