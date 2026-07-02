import { useState, useEffect } from "react";
import "./App.css";
import WalletModal from "./components/WalletModal";
import {
  useAccount,
  useBalance,
  useChainId,
  useSwitchChain,
} from "wagmi";
import Receive from "./pages/Receive";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import {
  Wallet,
  Globe,
  ArrowLeftRight,
  Coins,
  Waypoints,
  Sparkles,
} from "lucide-react";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transactions";




import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Send from "./pages/Send";


export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

const { address, isConnected } = useAccount();

const [selectedTx, setSelectedTx] = useState(null);

const [search, setSearch] = useState("");
const [filter, setFilter] = useState("All");

useEffect(() => {
  const saved = localStorage.getItem("smarf_transactions");

  if (saved) {
    setTransactions(JSON.parse(saved));
  }
}, []);

const {
  data: balance,
  isLoading: balanceLoading,
  refetch,
} = useBalance({
  address,
  query: {
    refetchInterval: 5000, // refresh every 5 seconds
  },
});

const { chainId } = useAccount();

const isCorrectNetwork = chainId === 5042002;

console.log("Current Chain ID:", chainId);
console.log("Correct Network:", isCorrectNetwork);


const { switchChain } = useSwitchChain();

const [lastUpdated, setLastUpdated] = useState("Just now");

useEffect(() => {
  if (balance) {
    setLastUpdated(new Date().toLocaleTimeString());
  }
}, [balance]);

const shortAddress = address
  ? `${address.slice(0, 6)}...${address.slice(-4)}`
  : "Not Connected";


const copyAddress = async () => {
  if (!address) return;

  try {
    await navigator.clipboard.writeText(address);
    alert("Wallet address copied!");
  } catch (err) {
    console.error(err);
  }
};

  
  const renderPage = () => {
    switch (page) {
     case "send":
  return <Send />; 
    case "receive":
  return <Receive />;  
  case "portfolio":
  return (
    <Portfolio
      transactions={transactions}
      setPage={setPage}
    />
  );
  return (

    <div className="portfolio-page">

      <h1 className="page-title">
        Portfolio
      </h1>

      <p className="page-subtitle">
        Manage all your assets in one place.
      </p>

      <section className="portfolio-hero">

        <span>Total Portfolio</span>

        <h2>
          {balanceLoading
            ? "Loading..."
            : `${balance
                ? Number(balance.formatted).toFixed(4)
                : "0.0000"} USDC`}
        </h2>

      </section>

      <section className="asset-card">

        <div>

          <h3>USDC</h3>

          <small>ARC Testnet</small>

        </div>

        <h2>
          {balanceLoading
            ? "..."
            : Number(balance?.formatted || 0).toFixed(4)}
        </h2>

      </section>

      <section className="portfolio-stats">

        <div className="portfolio-stat">
          <h4>Assets</h4>
          <p>1</p>
        </div>

        <div className="portfolio-stat">
          <h4>Network</h4>
          <p>ARC</p>
        </div>

        <div className="portfolio-stat">
          <h4>Status</h4>
          <p>Active</p>
        </div>

      </section>

    </div>
  );

case "settings":
  return <Settings />;

  case "support":
  return <Support />;
      case "transactions":
  return (
    <Transactions
      transactions={transactions}
      search={search}
      setSearch={setSearch}
      filter={filter}
      setFilter={setFilter}
    />
  );
  return (
    <div className="transactions-page">

      <h1 className="page-title">
        Transactions
      </h1>

      <p className="page-subtitle">
        View your complete USDC activity.
      </p>

      <section className="tx-summary">

        <div className="summary-card">
          <h4>Total</h4>
          <h2>{transactions.length}</h2>
        </div>

        <div className="summary-card">
          <h4>Sent</h4>
          <h2>
            {transactions.filter(
              tx => tx.type === "Sent"
            ).length}
          </h2>
        </div>

        <div className="summary-card">
          <h4>Received</h4>
          <h2>
            {transactions.filter(
              tx => tx.type === "Received"
            ).length}
          </h2>
        </div>

      </section>

      <input
  className="tx-search"
  placeholder="Search address, hash or type..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<div className="tx-filters">

  <button
    className={filter === "All" ? "active-filter" : ""}
    onClick={() => setFilter("All")}
  >
    All
  </button>

  <button
    className={filter === "Sent" ? "active-filter" : ""}
    onClick={() => setFilter("Sent")}
  >
    Sent
  </button>

  <button
    className={filter === "Received" ? "active-filter" : ""}
    onClick={() => setFilter("Received")}
  >
    Received
  </button>

</div>

      <div className="transactions-list">

        {transactions.length === 0 ? (

          <div className="empty-transactions">

            <h3>No Transactions Yet</h3>

            <p>
              Your history will appear here.
            </p>

          </div>

        ) : (

          transactions
  .filter((tx) => {
    const matchesFilter =
      filter === "All" || tx.type === filter;

    const matchesSearch =
      tx.type?.toLowerCase().includes(search.toLowerCase()) ||
      tx.hash?.toLowerCase().includes(search.toLowerCase()) ||
      tx.recipient?.toLowerCase().includes(search.toLowerCase()) ||
      tx.to?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  })
  .map((tx) => (

            <div
              key={tx.id}
              className="transaction-card"
              onClick={() => setSelectedTx(tx)}
            >

              <div>

                <h3>{tx.type}</h3>

                <small>{tx.time}</small>

              </div>

              <div>

                <h2>{tx.amount} USDC</h2>

                <small>
                  {tx.hash?.slice(0,12)}...
                </small>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
case "profile":
  return (
    <Profile
      onOpenWalletModal={() => setWalletModalOpen(true)}
    />
  );
     
      case "settings":
  return (
    <div className="settings-page">

      <h1 className="page-title">
        Settings
      </h1>

      <p className="page-subtitle">
        Customize your SmarFArcPay experience.
      </p>

      <section className="settings-group">

        <h3>Wallet</h3>

        <div className="setting-card">
          <span>Wallet Status</span>
          <strong>
            {isConnected ? "Connected" : "Disconnected"}
          </strong>
        </div>

        <div className="setting-card">
          <span>Network</span>
          <strong>ARC Testnet</strong>
        </div>

        <div className="setting-card">
          <span>Chain ID</span>
          <strong>5042002</strong>
        </div>

      </section>

      <section className="settings-group">

        <h3>Notifications</h3>

        <div className="setting-card">
          <span>Transaction Alerts</span>
          <strong>ON</strong>
        </div>

        <div className="setting-card">
          <span>Receive Alerts</span>
          <strong>ON</strong>
        </div>

        <div className="setting-card">
          <span>Security Alerts</span>
          <strong>ON</strong>
        </div>

      </section>

      <section className="settings-group">

        <h3>About</h3>

        <div className="setting-card">
          <span>Wallet Version</span>
          <strong>v1.0.0</strong>
        </div>

        <div className="setting-card">
          <span>Developer</span>
          <strong>Sadik Sani Namadi</strong>
        </div>

      </section>

    </div>
  );

      case "support":
  return (
    <div className="support-page">

      <h1 className="page-title">
        Support Center
      </h1>

      <p className="page-subtitle">
        Need help or want to connect with the SmarFArcPay team?
      </p>

      {/* Founder */}

      <div className="support-card">

        <div className="support-avatar">
          👨‍💻
        </div>

        <div>

          <h2>Sadik Sani Namadi</h2>

          <p>Founder & Developer</p>

        </div>

        <button
          className="support-btn"
          onClick={() =>
            window.open(
              "https://x.com/0xsadik0",
              "_blank"
            )
          }
        >
          Visit X
        </button>

      </div>

      {/* Official */}

      <div className="support-card">

        <div className="support-avatar">
          ✦
        </div>

        <div>

          <h2>SmarFArcPay</h2>

          <p>Official Project Account</p>

        </div>

        <button
          className="support-btn"
          onClick={() =>
            window.open(
              "https://x.com/SmarFArcPay",
              "_blank"
            )
          }
        >
          Follow
        </button>

      </div>

      {/* Help */}

      <div className="support-grid">

        <div className="help-card">
          <h3>📚 Documentation</h3>
          <p>Learn how SmarFArcPay works.</p>
        </div>

        <div className="help-card">
          <h3>🐞 Report a Bug</h3>
          <p>Help us improve the wallet.</p>
        </div>

        <div className="help-card">
          <h3>💡 Feature Request</h3>
          <p>Share your ideas for future updates.</p>
        </div>

      </div>

      <div className="community-card">

        <h2>Built for ARC Testnet</h2>

        <p>
          SmarFArcPay is a modern Web3 wallet focused on secure,
          fast and beautiful USDC payments.
        </p>

        <span>Version 1.0.0</span>

      </div>

    </div>
  );

      default:
        return (
    <div className="dashboard">

      <div className="dashboard-header">

        <div>

          <p className="dashboard-label">
            DASHBOARD
          </p>

          <h1 className="dashboard-title">
            Explore the Ecosystem
          </h1>

          <p className="dashboard-subtitle">
            Everything you need to manage your USDC in one place.
          </p>
          </div>

        <div className="dashboard-status">

          <div className="status-dot"></div>

          <span>Wallet Ready</span>

        </div>

      </div>

      {/* Hero Card */}
      <section className="hero-card glass">

        <span className="hero-badge">
          ARC TESTNET
        </span>

        <h1>Welcome to SmarFArcPay</h1>

        <p>
          Securely send and receive USDC on ARC Testnet.
        </p>


  </section>

            
      {/* =========================
    Premium Statistics
========================= */}

<section className="stats-grid">

 <div className="stat-card glass">

    <div className="stat-icon">
  <Wallet size={30} />
</div>

    <div>

      <h4>Wallet</h4>

      <p>Connected</p>

    </div>

  </div>

  <div className="stat-card glass">

   <div className="stat-icon">
  <Globe size={30} />
</div>

    <div>

      <h4>Network</h4>

      <p>ARC Testnet</p>

    </div>

  </div>

  <div className="stat-card glass">

    <div className="stat-icon">
  <ArrowLeftRight size={30} />
</div>

    <div>

      <h4>Transactions</h4>

      <p>
  {transactions.filter(tx => tx.status === "Confirmed").length}
</p>

    </div>

  </div>

  <div className="stat-card glass">

    <div className="stat-icon">
  <Coins size={30} />
</div>

    <div>

      <h4>Assets</h4>

      <p>USDC</p>

    </div>

  </div>

</section>      


<section className="wallet-info-card glass">

  <div className="wallet-info-header">
    <h2>Connected Wallet</h2>

    <span className="wallet-live">
  {isConnected ? "● Connected" : "● Not Connected"}
</span>
  </div>

  <div className="wallet-info-content">

    <div className="wallet-avatar">
      👤
    </div>

    <div className="wallet-details">

      <p className="wallet-name">
        Smart Wallet
      </p>

      <h3 className="wallet-address-display">
  {shortAddress}
</h3>

    </div>

    <button
  className="copy-wallet-btn"
  onClick={copyAddress}
>
  Copy
</button>

  </div>

</section>

{isConnected && !isCorrectNetwork && (
  <section className="network-warning">
    <div>
      <h3>⚠️ Wrong Network</h3>
      <p>Please switch to ARC Testnet to continue.</p>
    </div>

    <button
      className="switch-network-btn"
      onClick={() => switchChain({ chainId: 5042002 })}
    >
      Switch Network
    </button>
  </section>
)}

<section className="portfolio-card glass">

  <div className="portfolio-glow"></div>

  <div className="portfolio-top">

    <div>

      <span className="portfolio-label">
        Total Portfolio
      </span>

      <h2 className="portfolio-balance">

       <span className="balance-number">
  {balanceLoading ? (
    <span className="balance-skeleton"></span>
  ) : (
    balance
      ? Number(balance.formatted).toFixed(4)
      : "0.0000"
  )}
</span>

        <small>USDC</small>

      </h2>

    </div>

    <div className="online-status">

  <span className="status-dot"></span>

  {isConnected ? "Connected" : "Not Connected"}

</div>

  </div>

  <div className="portfolio-bottom">

    <div>

      <p className="portfolio-title">
        Network
      </p>

      <h4>ARC Testnet</h4>

    </div>

    <div>

  <p className="portfolio-title">
    Last Updated
  </p>

  <h4>{lastUpdated}</h4>

</div>

  </div>

</section>


<section className="action-buttons">

  <button
  className="action-card send-btn"
  onClick={() => setPage("send")}
>

    <div className="action-icon">
      ↑
    </div>

    <div>

      <h3>Send USDC</h3>

      <p>Transfer assets securely</p>

    </div>

  </button>

  <button
  className="action-card receive-btn"
  onClick={() => setPage("receive")}
>

  <div className="action-icon">
    ↓
  </div>

  <div>
    <h3>Receive USDC</h3>
    <p>Share your wallet address</p>
  </div>

</button>

</section>
            


{/* Swap & Bridge */}

<div className="dashboard-features">

  <div className="feature-card">

    <div className="feature-icon swap-icon">
      <ArrowLeftRight size={28} />
    </div>

    <div className="feature-content">

      <div className="feature-header">
        <h3>Swap</h3>
        <span>Coming Soon</span>
      </div>

      <p>
        Instantly swap assets across the ARC ecosystem.
      </p>

    </div>

    <Sparkles className="feature-sparkle" size={18} />

  </div>

  <div className="feature-card">

    <div className="feature-icon bridge-icon">
      <Waypoints size={28} />
    </div>

    <div className="feature-content">

      <div className="feature-header">
        <h3>Bridge</h3>
        <span>Coming Soon</span>
      </div>

      <p>
        Transfer assets securely between supported networks.
      </p>

    </div>

    <Sparkles className="feature-sparkle" size={18} />

  </div>

</div>


  <section className="activity-card glass">

  <div className="activity-header">

    <h2>Recent Activity</h2>

    <span className="activity-live">
      Live
    </span>

  </div>

  <div className="empty-activity">

  {transactions.length === 0 ? (
    <>
      <h3>No Transactions Yet</h3>

      <p>
        Send or receive USDC to see your on-chain history.
      </p>
    </>
  ) : (
    transactions.map((tx) => (
  <div
  key={tx.id}
  className="tx-item"
 onClick={() => setSelectedTx(tx)} 
  
>
  <div className="tx-top">
    <span
      className={
        tx.type === "Sent"
          ? "tx-badge sent"
          : "tx-badge received"
      }
    >
      {tx.type}
    </span>

    <span className="tx-amount">
      {tx.amount} USDC
    </span>
  </div>

  <p className="tx-address">
    {tx.recipient || tx.to}
  </p>

  <small className="tx-time">
    {tx.time}
  </small>

  <small className="tx-hash">
    {tx.hash
      ? `Hash: ${tx.hash.slice(0, 10)}...`
      : "Hash unavailable"}
  </small>

  <p className="tx-status">
    {tx.status || "✅ Confirmed"}
  </p>
</div>
))
)}
</div> 
</section>          
            
          </div>
        );
    }
  };

  return (
    <div className="app">

      <Navbar
  menuOpen={menuOpen}
  setMenuOpen={setMenuOpen}
  setWalletModalOpen={setWalletModalOpen}
/>
      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setPage={setPage}
      />

      <main className="main-content">
        {renderPage()}
      </main>

<WalletModal
  open={walletModalOpen}
  onClose={() => setWalletModalOpen(false)}
/>


{selectedTx && (
  <div
    className="tx-modal-overlay"
    onClick={() => setSelectedTx(null)}
  >
    <div
      className="tx-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <h2>Transaction Details</h2>

      <div className="tx-detail">
  <span>Type</span>

  <span
    className={
      selectedTx.type === "Sent"
        ? "tx-pill sent"
        : "tx-pill received"
    }
  >
    {selectedTx.type}
  </span>
</div>

      <div className="tx-detail">
        <span>Amount</span>
        <strong>{selectedTx.amount} USDC</strong>
      </div>

      <div className="tx-detail">
  <span>Status</span>

  <span className="status-pill">
    {selectedTx.status || "Confirmed"}
  </span>
</div>

     <div className="tx-detail">
  <span>Recipient</span>

  <div className="hash-box">

    <small>
      {selectedTx.recipient || selectedTx.to}
    </small>

    <button
      className="copy-btn"
      onClick={() => {
        navigator.clipboard.writeText(
          selectedTx.recipient || selectedTx.to
        );

        alert("Address copied!");
      }}
    >
      Copy
    </button>

  </div>
</div>

      <div className="tx-detail">
  <span>Hash</span>

  <div className="hash-box">

    <small>
      {selectedTx.hash?.slice(0,18)}...
    </small>

    <button
      className="copy-btn"
      onClick={() => {
        navigator.clipboard.writeText(selectedTx.hash);

        alert("Transaction hash copied!");
      }}
    >
      Copy
    </button>

  </div>
</div>

      <div className="tx-modal-buttons">

        <button
          className="arcscan-btn"
          onClick={() =>
            window.open(
              `https://testnet.arcscan.app/tx/${selectedTx.hash}`,
              "_blank"
            )
          }
        >
          View on ArcScan
        </button>

        <button
          className="close-btn"
          onClick={() => setSelectedTx(null)}
        >
          Close
        </button>

      </div>
    </div>
  </div>
)}

    </div>
  );
}