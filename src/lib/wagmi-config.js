import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { arcTestnet } from './chains'

export const wagmiConfig = createConfig({
  chains: [arcTestnet],
  connectors: [injected()], // MetaMask / any injected EVM wallet
  transports: {
    [arcTestnet.id]: http(),
  },
})