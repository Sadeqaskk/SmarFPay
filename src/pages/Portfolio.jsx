import "./Portfolio.css";

import {
  Wallet,
  Coins,
  Globe,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
} from "lucide-react";

import { useAccount, useBalance } from "wagmi";
import { USDC_ADDRESS } from "../contracts/usdc";

export default function Portfolio({
  transactions,
  setPage,
}) {
  const { address, isConnected } = useAccount();

  const { data: balance } = useBalance({
    address,
    token: USDC_ADDRESS,
  });

  return (
    <div className="portfolio-page">

      <div className="portfolio-header">

        <h1>Portfolio</h1>

        <p>Your on-chain assets.</p>

      </div>

      {/* Total Balance */}

      <div className="portfolio-balance-card">

        <span>Total Portfolio</span>

        <h2>
          {balance
            ? Number(balance.formatted).toFixed(4)
            : "0.0000"} USDC
        </h2>

        <small>
          {isConnected
            ? "Wallet Connected"
            : "Wallet Disconnected"}
        </small>

      </div>

      {/* Asset */}

      <div className="asset-card">

        <div className="asset-left">

          <Coins size={26} />

          <div>

            <h3>USDC</h3>

            <small>ARC Network</small>

          </div>

        </div>

        <div className="asset-right">

          <h3>
            {balance
              ? Number(balance.formatted).toFixed(4)
              : "0.0000"}
          </h3>

          <small>Available</small>

        </div>

      </div>

      {/* Statistics */}

      <div className="portfolio-grid">

        <div className="portfolio-stat">

          <Wallet size={22}/>

          <span>Wallet</span>

          <h3>
            {isConnected
              ? "Connected"
              : "Disconnected"}
          </h3>

        </div>

        <div className="portfolio-stat">

          <Globe size={22}/>

          <span>Network</span>

          <h3>ARC Testnet</h3>

        </div>

        <div className="portfolio-stat">

          <Activity size={22}/>

          <span>Transactions</span>

          <h3>{transactions.length}</h3>

        </div>

        <div className="portfolio-stat">

          <Coins size={22}/>

          <span>Assets</span>

          <h3>1</h3>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="portfolio-actions">

        <button
          onClick={() => setPage("send")}
        >
          <ArrowUpRight size={18}/>
          Send
        </button>

        <button
          onClick={() => setPage("receive")}
        >
          <ArrowDownLeft size={18}/>
          Receive
        </button>

      </div>

    </div>
  );
}