import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

import { PrivyProvider } from "@privy-io/react-auth";

import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


import { config, arcTestnet } from "./wagmi";




const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
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
    showWalletUIs: true,
  },
  defaultChain: arcTestnet,
  supportedChains: [arcTestnet],
}}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <App />
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  </React.StrictMode>
);