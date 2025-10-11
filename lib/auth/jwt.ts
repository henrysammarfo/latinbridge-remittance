/**
 * JWT Authentication utilities for wallet-based auth
 */
import { SignJWT, jwtVerify } from 'jose';
import { ethers } from 'ethers';

// Validate JWT_SECRET is configured
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in environment variables');
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRATION = '24h';

export interface JWTPayload {
  address: string;
  iat: number;
  exp: number;
}

/**
 * Generate JWT token for authenticated wallet
 */
export async function generateToken(address: string): Promise<string> {
  const token = await new SignJWT({ address })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Generate authentication message for wallet signing
 */
export function generateAuthMessage(address: string, nonce: string): string {
  return `LatinBridge Authentication\n\nSign this message to authenticate your wallet.\n\nAddress: ${address}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;
}

/**
 * Verify wallet signature
 */
export function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): boolean {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

/**
 * Generate random nonce
 */
export function generateNonce(): string {
  return ethers.hexlify(ethers.randomBytes(32));
}
