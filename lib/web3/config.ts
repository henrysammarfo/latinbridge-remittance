/**
 * Wagmi Configuration for Polkadot Paseo Asset Hub
 */
import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { defineChain } from 'viem'

// Define Polkadot Paseo Asset Hub chain
export const polkadotPaseo = defineChain({
  id: 420420422,
  name: 'Polkadot Paseo Asset Hub',
  nativeCurrency: {
    name: 'PAS',
    symbol: 'PAS',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-passet-hub-eth-rpc.polkadot.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout-passet-hub.parity-testnet.parity.io',
    },
  },
  testnet: true,
})

// Create Wagmi configuration
export const wagmiConfig = createConfig({
  chains: [polkadotPaseo],
  connectors: [
    injected({
      target: () => ({
        id: 'metaMask',
        name: 'MetaMask',
        provider: typeof window !== 'undefined' ? window.ethereum : undefined,
      }),
      shimDisconnect: true,
    }),
  ],
  transports: {
    [polkadotPaseo.id]: http(),
  },
  ssr: false, // Disable SSR for wagmi to avoid hydration issues
  multiInjectedProviderDiscovery: false,
})

// Export chain for easy access
export const defaultChain = polkadotPaseo
