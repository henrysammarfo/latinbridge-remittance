# Vercel Deployment Guide

## Prerequisites
- GitHub repository pushed to remote
- Vercel account (sign up at https://vercel.com)
- Environment variables ready

---

## Step 1: Prepare Environment Variables

Create `.env.local` file (already in `.gitignore`):

```bash
# Blockchain
NEXT_PUBLIC_CHAIN_ID=420420422
NEXT_PUBLIC_RPC_URL=https://testnet-passet-hub-eth-rpc.polkadot.io
NEXT_PUBLIC_BLOCK_EXPLORER=https://blockscout-passet-hub.parity-testnet.parity.io

# Smart Contracts (Polkadot Paseo Testnet)
NEXT_PUBLIC_USER_REGISTRY=0xfba199c705761D98aD1cD98c34C0d544e39c1984
NEXT_PUBLIC_EXCHANGE_RATE_ORACLE=0x8c73284b55cb55EB46Dd42617bA6213037e602e9
NEXT_PUBLIC_REMITTANCE_VAULT=0x24d591Aa216E5466D5381139bc8feC2A91e707DB
NEXT_PUBLIC_SAVINGS_POOL=0xfD2CFC86e06c54d1ffe9B503391d91452a8Fd02D
NEXT_PUBLIC_MICROLOAN_MANAGER=0x2ABa80F8931d52DEE8e6732d213eabe795535660
NEXT_PUBLIC_PAYMENT_NETWORKS=0x5D3235c4eB39f5c3729e75932D62E40f77D8e70f

# APIs
EXCHANGERATE_API_KEY=your_exchangerate_api_key_here
DIDIT_API_KEY=your_didit_api_key_here
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

---

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com/new
   - Click "Import Project"

2. **Connect GitHub**
   - Select "Import Git Repository"
   - Choose `henrysammarfo/latinbridge-remittance`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build` (leave default)
   - **Output Directory:** `.next` (leave default)
   - **Install Command:** `npm install --legacy-peer-deps`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add each variable from `.env.local` above
   - Click "Add" for each one

   **IMPORTANT:** Add these variables:
   ```
   NEXT_PUBLIC_CHAIN_ID=420420422
   NEXT_PUBLIC_RPC_URL=https://testnet-passet-hub-eth-rpc.polkadot.io
   NEXT_PUBLIC_BLOCK_EXPLORER=https://blockscout-passet-hub.parity-testnet.parity.io
   NEXT_PUBLIC_USER_REGISTRY=0xfba199c705761D98aD1cD98c34C0d544e39c1984
   NEXT_PUBLIC_EXCHANGE_RATE_ORACLE=0x8c73284b55cb55EB46Dd42617bA6213037e602e9
   NEXT_PUBLIC_REMITTANCE_VAULT=0x24d591Aa216E5466D5381139bc8feC2A91e707DB
   NEXT_PUBLIC_SAVINGS_POOL=0xfD2CFC86e06c54d1ffe9B503391d91452a8Fd02D
   NEXT_PUBLIC_MICROLOAN_MANAGER=0x2ABa80F8931d52DEE8e6732d213eabe795535660
   NEXT_PUBLIC_PAYMENT_NETWORKS=0x5D3235c4eB39f5c3729e75932D62E40f77D8e70f
   EXCHANGE_RATE_API_KEY=0eafc98275744c50fadabce2
   EXCHANGE_RATE_API_URL=https://v6.exchangerate-api.com/v6
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 3-5 minutes for build
   - Once complete, visit your live site!

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd c:\Users\jessi\Desktop\latinbridge-remittance
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: latinbridge-remittance
# - Which scope: your-account
# - Link to existing project: No
# - What's your project path: ./

# Add environment variables
vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 420420422
# Repeat for all variables...

# Deploy to production
vercel --prod
```

---

## Step 3: Verify Deployment

1. **Check Build Logs**
   - In Vercel dashboard, click on deployment
   - View "Building" logs
   - Ensure no errors

2. **Test Live Site**
   - Visit the deployed URL (e.g., `latinbridge-remittance.vercel.app`)
   - Connect wallet
   - Check all features:
     - ✅ Wallet connection
     - ✅ Onboarding
     - ✅ Dashboard balances
     - ✅ Send money
     - ✅ Savings
     - ✅ Loans
     - ✅ Exchange rates loading

3. **Test Blockchain Connection**
   - Open browser console (F12)
   - Check for RPC connection
   - Verify contract addresses correct
   - Test a transaction (faucet → deposit)

---

## Step 4: Custom Domain (Optional)

1. **Add Domain**
   - Go to Vercel dashboard → Your project → Settings → Domains
   - Click "Add"
   - Enter domain: `latinbridge.app` or `app.latinbridge.com`
   - Follow DNS configuration instructions

2. **Update DNS**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or A record to Vercel IP
   - Wait for propagation (~10 minutes)

3. **SSL Certificate**
   - Vercel auto-provisions SSL (free)
   - HTTPS automatically enabled

---

## Troubleshooting

### Build Fails

**Error:** `Module not found`
```bash
# Solution: Check package.json dependencies
npm install --legacy-peer-deps
git add package-lock.json
git commit -m "fix: update dependencies"
git push
```

**Error:** `EBADPLATFORM` (fs-xattr on Windows)
```bash
# Solution: Add to vercel.json
{
  "installCommand": "npm install --legacy-peer-deps --ignore-scripts"
}
```

### Environment Variables Not Working

```bash
# Ensure variables start with NEXT_PUBLIC_ for client-side access
# Server-side variables don't need prefix

# Re-deploy after adding variables
vercel --prod
```

### Wallet Connection Issues

```bash
# Check RPC URL is accessible
curl https://rpc.passe-asset-hub.parity.io

# Verify contract addresses in env variables match deployed contracts
```

### API Rate Limiting

```bash
# ExchangeRate-API free tier: 1,500 requests/month
# Upgrade if needed at https://exchangerate-api.com/pricing
```

---

## Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] Wallet connects successfully
- [ ] Contract addresses correct
- [ ] Exchange rates fetch successfully
- [ ] Can complete onboarding
- [ ] Can view balances from blockchain
- [ ] Can send test transaction
- [ ] Can deposit to savings
- [ ] Can request microloan
- [ ] QR code generates with wallet address
- [ ] All Blockscout links work
- [ ] Mobile responsive

---

## Monitoring

### Vercel Analytics (Free)
- Automatically enabled
- View at: Dashboard → Your Project → Analytics
- Shows: Page views, performance, errors

### Sentry (Optional - Error Tracking)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

## Continuous Deployment

Vercel auto-deploys on git push:

```bash
# Make changes
git add .
git commit -m "feat: new feature"
git push

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Deploys to production
# 4. Updates live site
```

Preview deployments for PRs:
- Every pull request gets a unique preview URL
- Test before merging to main

---

## Performance Optimization

### Already Configured
- ✅ Next.js Image Optimization
- ✅ Static Generation where possible
- ✅ API routes cached
- ✅ Automatic code splitting

### Additional Tweaks
```javascript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    domains: ['blockscout-passet-hub.parity-testnet.parity.io'],
  },
}
```

---

## Security

### Environment Variables
- ✅ Never commit `.env.local`
- ✅ Use Vercel environment variables
- ✅ No private keys in code

### API Keys
- ✅ Server-side API calls via Next.js API routes
- ✅ Rate limiting on API routes
- ✅ CORS configured

---

## Support

**Vercel Docs:** https://vercel.com/docs
**Next.js Docs:** https://nextjs.org/docs
**Discord:** Vercel Discord for deployment help
