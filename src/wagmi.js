// src/wagmi.js
import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

// ================================
// ARC TESTNET CONFIG
// Replace these values with the
// official ARC Testnet information
// ================================

export const arcTestnet = {
  id: 5042002,
  name: "Arc Testnet",
  network: "arc-testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
    },
    public: {
      http: ["https://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
};

// ================================
// WAGMI CONFIG
// ================================

export const config = createConfig({
  chains: [arcTestnet],

  connectors: [
    injected(),

    walletConnect({
      projectId: "ce05547a42469cc7b3e0fe02f8f0015f",
      showQrModal: true,
    }),
  ],

  transports: {
    [arcTestnet.id]: http(),
  },
});