import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { PrivyProvider } from "@privy-io/react-auth";


/* Wagmi + React Query (Web3 core layer) */
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/* ARC Testnet Wagmi Config */
import { config } from "./wagmi";

/* Create React Query client */
const queryClient = new QueryClient();

/**
 * SMARFARCPAY MAIN ENTRY
 * ARC TESTNET WEB3 WALLET APP
 */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Web3 Provider (Wagmi) */}
   <PrivyProvider
  appId="cmr1yb4s400lw0cl4tb4yyebl"
  config={{
    loginMethods: ["email", "google", "wallet"],

    appearance: {
      theme: "dark",
      accentColor: "#2563eb",
    },

    embeddedWallets: {
      createOnLogin: "users-without-wallets",
    },
  }}
>
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </WagmiProvider>
</PrivyProvider>
  </React.StrictMode>
);