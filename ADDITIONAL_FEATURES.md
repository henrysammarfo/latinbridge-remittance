# Additional Features to Implement (Optional)

These features can be added after initial deployment to enhance functionality. All smart contracts already support these features - only API routes need to be created.

## Additional API Routes

### Remittance Routes

#### POST /api/remittance/send
```typescript
// app/api/remittance/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRemittanceVault, getSigner, currencyNameToEnum, parseUnits } from '@/lib/blockchain/contracts';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { recipient, fromCurrency, toCurrency, amount } = await req.json();

  const vault = getRemittanceVault(getSigner());
  const fromCurr = currencyNameToEnum(fromCurrency);
  const toCurr = currencyNameToEnum(toCurrency);

  const tx = await vault.sendRemittance(
    recipient,
    fromCurr,
    toCurr,
    parseUnits(amount.toString(), 18)
  );

  await tx.wait();

  return NextResponse.json({ success: true, txHash: tx.hash });
}
```

#### GET /api/remittance/history
```typescript
// app/api/remittance/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRemittanceVault, getProvider } from '@/lib/blockchain/contracts';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const vault = getRemittanceVault(getProvider());
  const txIds = await vault.getUserTransactions(payload.address);

  const transactions = await Promise.all(
    txIds.map(async (id) => {
      const tx = await vault.getTransaction(id);
      return {
        id: id.toString(),
        sender: tx.sender,
        recipient: tx.recipient,
        fromCurrency: tx.fromCurrency,
        toCurrency: tx.toCurrency,
        amount: tx.amount.toString(),
        fee: tx.fee.toString(),
        timestamp: tx.timestamp.toString(),
      };
    })
  );

  return NextResponse.json({ transactions });
}
```

### User Profile Routes

#### GET /api/user/profile
```typescript
// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserRegistry, getProvider } from '@/lib/blockchain/contracts';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const registry = getUserRegistry(getProvider());
  const profile = await registry.getUserProfile(payload.address);

  return NextResponse.json({
    registered: profile.registered,
    name: profile.name,
    email: profile.email,
    kycLevel: profile.kycLevel,
    verified: profile.verified,
    creditScore: profile.creditScore.toString(),
  });
}
```

### KYC Routes

#### POST /api/kyc/upload
```typescript
// app/api/kyc/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createVerificationSession } from '@/lib/api/didit';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const session = await createVerificationSession(payload.address);

  return NextResponse.json({
    sessionId: session.session_id,
    verificationUrl: session.verification_url,
  });
}
```

#### GET /api/kyc/status
```typescript
// app/api/kyc/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getVerificationStatus } from '@/lib/api/didit';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessionId = req.nextUrl.searchParams.get('sessionId');
  const status = await getVerificationStatus(sessionId);

  return NextResponse.json(status);
}
```

### Savings Routes

#### POST /api/savings/deposit
```typescript
// app/api/savings/deposit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSavingsPool, getSigner, currencyNameToEnum, parseUnits } from '@/lib/blockchain/contracts';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { currency, amount } = await req.json();

  const pool = getSavingsPool(getSigner());
  const curr = currencyNameToEnum(currency);

  const tx = await pool.depositToSavings(curr, parseUnits(amount.toString(), 18));
  await tx.wait();

  return NextResponse.json({ success: true, txHash: tx.hash });
}
```

### Loans Routes

#### POST /api/loans/apply
```typescript
// app/api/loans/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getMicroloanManager, getSigner, currencyNameToEnum, parseUnits } from '@/lib/blockchain/contracts';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { amount, currency, duration, purpose } = await req.json();

  const loanManager = getMicroloanManager(getSigner());
  const curr = currencyNameToEnum(currency);

  const tx = await loanManager.requestLoan(
    parseUnits(amount.toString(), 18),
    curr,
    duration,
    purpose
  );

  const receipt = await tx.wait();
  const loanId = receipt.logs[0].topics[1]; // Extract from event

  return NextResponse.json({ success: true, loanId, txHash: tx.hash });
}
```

## Stripe Payment Integration

### POST /api/payments/create-intent
```typescript
// app/api/payments/create-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyToken } from '@/lib/auth/jwt';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { amount, currency } = await req.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency.toLowerCase(),
    metadata: {
      userAddress: payload.address,
    },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
  });
}
```

## Frontend Integration Example

### MetaMask Connection
```typescript
// Example frontend code for wallet connection
async function connectWallet() {
  if (!window.ethereum) {
    alert('MetaMask not installed');
    return;
  }

  // Request account access
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });

  const address = accounts[0];

  // Get authentication message
  const response = await fetch('/api/auth/connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });

  const { message } = await response.json();

  // Sign message with MetaMask
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [message, address],
  });

  // Verify signature and get JWT
  const verifyResponse = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, signature }),
  });

  const { token } = await verifyResponse.json();

  // Store token for subsequent requests
  localStorage.setItem('authToken', token);
}
```

## Testing Checklist

After deployment, test these flows:

- [ ] Connect wallet with MetaMask
- [ ] Fetch current exchange rates
- [ ] Register user in UserRegistry
- [ ] Deposit funds to vault
- [ ] Send remittance (same currency)
- [ ] Send remittance (different currency)
- [ ] View transaction history
- [ ] Deposit to savings
- [ ] Apply for loan
- [ ] Update exchange rates (admin)
- [ ] Create KYC session

## Performance Optimizations

### Caching Strategy
- Exchange rates cached for 30 seconds
- User profiles cached per session
- Transaction history paginated

### Gas Optimization
- Batch operations where possible
- Use events for historical data instead of storage
- Minimize storage writes

### Error Handling
- Graceful degradation for API failures
- Fallback exchange rates
- Transaction retry logic

## Monitoring & Analytics

### Key Metrics to Track
- Total remittance volume
- Number of active users
- Average transaction fee
- Exchange rate accuracy
- API response times
- Smart contract gas usage

### Logging
```typescript
// Add to each API route
console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, {
  user: payload?.address,
  status: 'success',
});
```

## Next.js Production Build

```bash
# Build for production
npm run build

# Run production server
npm start
```

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# - All variables from .env.local
# - CONTRACT_* addresses after deployment
```

All these features are **optional enhancements**. Your core backend is fully functional and ready for the hackathon!
