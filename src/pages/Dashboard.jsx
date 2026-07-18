import "./Dashboard.css";
import ActivityFeed from "../components/ActivityFeed";
import {
  Wallet,
  Globe,
  ArrowUp,
  ArrowDown,
  ArrowLeftRight,
  Waypoints,
  HandCoins,
  ShieldCheck,
  Activity,
  Copy,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import usdcLogo from "../assets/tokens/usdc.png";
import eurcLogo from "../assets/tokens/eurc.png";
import cirBTCLogo from "../assets/tokens/cirBTC_Icon.png";

import CountUp from "react-countup";

import {
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { value: 22 },
  { value: 28 },
  { value: 24 },
  { value: 37 },
  { value: 35 },
  { value: 48 },
  { value: 45 },
  { value: 58 },
];

// Tiny decorative peg-stability sparklines — these are cosmetic only,
// meant to signal "steady / pegged" rather than plot real price data.
const sparklines = {
  usdc: "M2,14 L10,12 L18,15 L26,11 L34,13 L42,10 L50,12",
  eurc: "M2,12 L10,14 L18,11 L26,13 L34,12 L42,14 L50,13",
  btc: "M2,16 L10,10 L18,13 L26,7 L34,11 L42,6 L50,9",
};

function AssetSparkline({ path, color }) {
  return (
    <svg className="asset-sparkline" viewBox="0 0 52 20" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Ultra-premium web3 mark: a segmented, glowing diamond ring around a
// faceted gem core, with a single amber accent arc. Fully vector, no
// image asset required, scales cleanly at any size.
function WalletLogo() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="wallet-logo-svg">
      <defs>
        <linearGradient id="logoRing" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="55%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="logoGem" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#8fc3ff" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="logoGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <polygon
        points="50,7 93,50 50,93 7,50"
        fill="none"
        stroke="url(#logoRing)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="34 15"
        filter="url(#logoGlow)"
      />

      <path d="M50 22 L74 50 L50 78 L26 50 Z" fill="url(#logoGem)" opacity="0.95" filter="url(#logoGlow)" />
      <path d="M50 22 L50 78 M26 50 L74 50" stroke="rgba(6,20,40,0.35)" strokeWidth="1.4" />

      <path
        d="M78 14 A46 46 0 0 1 93 45"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="3.4"
        strokeLinecap="round"
        opacity="0.9"
        filter="url(#logoGlow)"
      />
    </svg>
  );
}

// Drives the mouse-tracking radial glow (--x / --y) used by the
// ::after pseudo-elements on every glass card in Dashboard.css
const handleCardMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
};

function relativeTime(timestamp) {
  if (!timestamp) return "Just now";
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Dashboard({
  balance,
  balanceLoading,
  
  eurcBalance,
  eurcLoading,

  cirBTCBalance,
  cirBTCLoading,
  
  walletAddress,
  shortAddress,
  copyAddress,
  transactions,
  lastUpdated,
  setPage,
}) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
        <div className="grid-overlay"></div>
      </div>

      <section className="dashboard-hero">
        <div className="hero-stars"></div>
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>

        <div className="hero-left">
          <div className="hero-chip">
            <span className="live-dot"></span>
            ARC TESTNET
          </div>

          {lastUpdated && (
            <small className="hero-updated">Updated {lastUpdated}</small>
          )}

          <h1 className="hero-title">Total Portfolio</h1>

          <div className="hero-balance">
            <h2 className="balance-value">
              {balanceLoading ? (
                "Loading..."
              ) : (
                <CountUp
                  end={balance ? Number(balance.formatted) : 0}
                  decimals={4}
                  duration={1.8}
                />
              )}
              <small>USDC</small>
            </h2>
          </div>

          <p className="hero-description">
            Secure Stablecoin Wallet
            <br />
            built for the ARC Ecosystem.
          </p>

          <div className="hero-buttons">
            <button className="hero-btn hero-primary" onClick={() => setPage("send")}>
              <ArrowUp size={18} />
              Send
            </button>

            <button className="hero-btn" onClick={() => setPage("receive")}>
              <ArrowDown size={18} />
              Receive
            </button>
          </div>
        </div>

        <div className="hero-particles">
          <img src={usdcLogo} className="floating-token token1" alt="USDC" />
          <img src={eurcLogo} className="floating-token token2" alt="EURC" />
          <img src={cirBTCLogo} className="floating-token token3" alt="cirBTC" />
        </div>

        <div className="hero-right">
          <div className="coin-platform">
            <div className="coin-ring ring-1"></div>
            <div className="coin-ring ring-2"></div>
            <div className="coin-ring ring-3"></div>
            <img src={usdcLogo} alt="USDC" className="hero-coin" />
          </div>
        </div>
      </section>

      <section className="premium-stats">
        <div className="premium-card" onMouseMove={handleCardMove}>
          <div className="premium-icon wallet">
            <Wallet size={24} />
          </div>
          <div>
            <span>Wallet</span>
            <h3>Connected</h3>
          </div>
        </div>

        <div className="premium-card" onMouseMove={handleCardMove}>
          <div className="premium-icon network">
            <Globe size={24} />
          </div>
          <div>
            <span>Network</span>
            <h3>ARC Testnet</h3>
          </div>
        </div>

        <div className="premium-card" onMouseMove={handleCardMove}>
          <div className="premium-icon tx">
            <Activity size={24} />
          </div>
          <div>
            <span>Transactions</span>
            <h3>{transactions.length}</h3>
          </div>
        </div>

        <div className="premium-card" onMouseMove={handleCardMove}>
          <div className="premium-icon security">
            <ShieldCheck size={24} />
          </div>
          <div>
            <span>Security</span>
            <h3>Protected</h3>
          </div>
        </div>
      </section>

      <section className="wallet-glass-card" onMouseMove={handleCardMove}>
        <div className="wallet-glow"></div>

        <div className="wallet-left">
          <div className="wallet-avatar">
            <WalletLogo />
          </div>

          <div>
            <span className="wallet-label">CONNECTED WALLET</span>
            <h2>{shortAddress}</h2>
            <p>
              ARC Testnet • Smart Wallet
              <span className="badge-pro">
                <Sparkles size={11} />
                PRO
              </span>
            </p>
          </div>
        </div>

        <div className="wallet-right">
          <button className="wallet-copy-btn" onClick={copyAddress}>
            <Copy size={18} />
            Copy
          </button>
        </div>
      </section>

      <section className="quick-actions">
        <div className="quick-card send" onClick={() => setPage("send")} onMouseMove={handleCardMove}>
          <div className="quick-icon">
            <ArrowUp size={28} />
          </div>
          <div>
            <h3>Send</h3>
            <p>Transfer assets instantly.</p>
          </div>
        </div>

        <div className="quick-card receive" onClick={() => setPage("receive")} onMouseMove={handleCardMove}>
          <div className="quick-icon">
            <ArrowDown size={28} />
          </div>
          <div>
            <h3>Receive</h3>
            <p>Generate your wallet QR.</p>
          </div>
        </div>

        <div className="quick-card swap" onClick={() => setPage("swap")} onMouseMove={handleCardMove}>
          <div className="quick-icon">
            <ArrowLeftRight size={28} />
          </div>
          <div>
            <h3>Swap</h3>
            <p>Exchange supported assets.</p>
          </div>
        </div>

        <div className="quick-card bridge" onClick={() => setPage("bridge")} onMouseMove={handleCardMove}>
          <div className="quick-icon">
            <Waypoints size={28} />
          </div>
          <div>
            <h3>Bridge</h3>
            <p>Move assets across chains.</p>
          </div>
        </div>

        <div className="quick-card request" onClick={() => setPage("request")} onMouseMove={handleCardMove}>
          <div className="quick-icon">
            <HandCoins size={28} />
          </div>
          <div>
            <h3>Request</h3>
            <p>Generate payment requests.</p>
          </div>
        </div>
      </section>

      <section className="portfolio-assets">
        <div className="section-header">
          <div>
            <span>PORTFOLIO</span>
            <h2>Your Assets</h2>
          </div>
        </div>

        <div className="asset-grid">
          <div className="asset-card usdc" onMouseMove={handleCardMove}>
            <div className="asset-glow"></div>
            <img src={usdcLogo} alt="USDC" />
            <h3>USDC</h3>
            <small>USD Coin</small>
            <h1>
              {balanceLoading
                ? "..."
                : balance
                ? Number(balance.formatted).toFixed(4)
                : "0.0000"}
            </h1>
            <div className="asset-meta">
              <span className="asset-status">Active</span>
              <span className="asset-peg">1 USDC ≈ $1.00</span>
            </div>
            <AssetSparkline path={sparklines.usdc} color="#06b6d4" />
          </div>

          <div className="asset-card eurc" onMouseMove={handleCardMove}>
            <div className="asset-glow"></div>
            <img src={eurcLogo} alt="EURC" />
            <h3>EURC</h3>
            <small>Euro Coin</small>
            <h1>
  {eurcLoading
    ? "..."
    : eurcBalance
      ? Number(eurcBalance.formatted).toFixed(4)
      : "0.0000"}
</h1>

<div className="asset-meta">
  <span className="asset-status">Active</span>
              <span className="asset-peg">1 EURC ≈ €1.00</span>
            </div>
            <AssetSparkline path={sparklines.eurc} color="#3b82f6" />
          </div>

          <div className="asset-card btc" onMouseMove={handleCardMove}>
            <div className="asset-glow"></div>
            <img src={cirBTCLogo} alt="cirBTC" />
            <h3>cirBTC</h3>
            <small>Wrapped Bitcoin</small>
            <h1>
  {cirBTCLoading
    ? "..."
    : cirBTCBalance
      ? Number(cirBTCBalance.formatted).toFixed(8)
      : "0.00000000"}
</h1>

<div className="asset-meta">
  <span className="asset-status">Active</span>
              <span className="asset-peg">1:1 BTC Reserve</span>
            </div>
            <AssetSparkline path={sparklines.btc} color="#f7931a" />
          </div>
        </div>
      </section>

      <div className="portfolio-chart">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />

            <Tooltip
              cursor={{ stroke: "rgba(59,130,246,0.35)", strokeWidth: 1 }}
              contentStyle={{
                background: "rgba(11,20,40,0.92)",
                border: "1px solid rgba(59,130,246,0.25)",
                borderRadius: "12px",
                color: "#eaf2ff",
                fontSize: "13px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
              }}
              labelFormatter={() => ""}
              formatter={(value) => [`${value}`, "Balance"]}
            />

            <Area dataKey="value" stroke="#3b82f6" strokeWidth={4} fill="url(#gradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <section className="activity-section">
        <div className="section-header">
          <div>
            <span>LIVE ACTIVITY</span>
            <h2>Recent Transactions</h2>
          </div>
        </div>

        <div className="activity-card" onMouseMove={handleCardMove}>
          {transactions.length === 0 ? (
            <div className="activity-empty">
              <Activity size={40} />
              <h3>No Activity Yet</h3>
              <p>Your latest transfers will appear here.</p>
            </div>
          ) : (
            transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="activity-row">
                <div className="activity-left">
                  <div className={`activity-icon ${tx.type === "Sent" ? "sent" : "received"}`}>
                    {tx.type === "Sent" ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                  </div>

                  <div>
                    <h4>{tx.type}</h4>
                    <small>{tx.hash?.slice(0, 12)}...</small>
                  </div>
                </div>

                <div className="activity-right">
                  <div className="activity-right-top">
                    <h3>
                      {tx.amount}
                      <small>{tx.token || "USDC"}</small>
                    </h3>
                    <span className="activity-status">
                      <CheckCircle2 size={12} />
                      Confirmed
                    </span>
                  </div>
                  <span className="activity-time">{relativeTime(tx.timestamp)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}