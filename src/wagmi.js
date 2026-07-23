// src/wagmi.js
import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";

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
    decimals: 6,
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
// Browser Wallet + Coinbase Wallet connect through Privy's own login flow
// (see WalletModal.jsx). WalletConnect connects via @walletconnect/ethereum-provider
// directly in WalletModal.jsx, bypassing wagmi's connector system entirely —
// @privy-io/wagmi's createConfig silently strips out any manually-declared
// connectors, so a connectors array here would never actually be usable.

export const config = createConfig({
  chains: [arcTestnet],

  transports: {
    [arcTestnet.id]: http(),
  },
});