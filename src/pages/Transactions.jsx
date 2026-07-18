import { useState } from "react";
import "./Transactions.css";
import transactionsProfile from "../assets/profile/transactions.png";

import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Waypoints,
  Banknote,
} from "lucide-react";

const TYPE_META = {
  Sent: { icon: ArrowUpRight, className: "sent" },
  Received: { icon: ArrowDownLeft, className: "received" },
  Swap: { icon: ArrowLeftRight, className: "swap" },
  Bridge: { icon: Waypoints, className: "bridge" },
  "Request Created": { icon: Banknote, className: "request" },
};

const FILTERS = [
  "All",
  "Sent",
  "Received",
  "Swap",
  "Bridge",
  "Request Created",
];

export default function Transactions({
  transactions = [],
  onSelectTx,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = transactions.filter((tx) => {
    const matchesFilter =
      filter === "All" || tx.type === filter;

    const matchesSearch =
      tx.type?.toLowerCase().includes(search.toLowerCase()) ||
      tx.hash?.toLowerCase().includes(search.toLowerCase()) ||
      tx.to?.toLowerCase().includes(search.toLowerCase()) ||
      tx.recipient?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="transactions-page">

      <div className="bgGlow bgGlow1"></div>
      <div className="bgGlow bgGlow2"></div>
      <div className="bgGlow bgGlow3"></div>

      <div className="transactions-hero">

        <div className="transactions-logo">
  <img
    src={transactionsProfile}
    alt="transactions"
  />
</div>

        <h1>Transactions</h1>

        <p>Your complete on-chain activity</p>

        <div className="transactions-pill">
          <span className="verified-dot"></span>
          Live Activity
        </div>

      </div>

{/* Footer */}

<div className="transactions-footer-card">

  

  <h3>SmarFPay</h3>

  <p>

    Built for the ARC ecosystem.

    Fast • Secure • Premium

  </p>

  <div className="footer-tags">

    <span>USDC</span>

    <span>ARC</span>

    <span>Wallet</span>

    <span>Bridge</span>

    <span>Swap</span>

  </div>

</div>

      <div className="transactions-stats">

        <div className="tx-stat-card">
          <h3>Total</h3>
          <h2>{transactions.length}</h2>
          <span>Transactions</span>
        </div>

        <div className="tx-stat-card">
          <h3>Sent</h3>
          <h2>{transactions.filter(t => t.type === "Sent").length}</h2>
          <span>Outgoing</span>
        </div>

        <div className="tx-stat-card">
          <h3>Received</h3>
          <h2>{transactions.filter(t => t.type === "Received").length}</h2>
          <span>Incoming</span>
        </div>

        <div className="tx-stat-card">
          <h3>Confirmed</h3>
          <h2>{transactions.filter(t => t.status === "Confirmed").length}</h2>
          <span>Success</span>
        </div>

      </div>

      <div className="transactions-toolbar">

        <input
          className="tx-search"
          placeholder="Search transaction..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="tx-filter-group">

          {FILTERS.map((item) => (

            <button
              key={item}
              className={
                filter === item ? "active-filter" : ""
              }
              onClick={() => setFilter(item)}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      <div className="transactions-container">

        {filtered.length === 0 ? (

          <div className="empty-transactions">

            <div className="empty-icon">📜</div>

            <h2>No Transactions Yet</h2>

            <p>
              Your activity will appear here after sending,
              receiving, swapping or bridging assets.
            </p>

          </div>

        ) : (

          filtered.map((tx) => {

            const meta =
              TYPE_META[tx.type] || TYPE_META["Sent"];

            const Icon = meta.icon;

            return (

              <div
                key={tx.id}
                className="premium-tx-card"
                onClick={() => onSelectTx(tx)}
              >

                <div className="tx-left">

                  <div className={`tx-icon ${meta.className}`}>
                    <Icon size={22} />
                  </div>

                  <div>

                    <h3>{tx.type}</h3>

                    <span>{tx.time}</span>

                  </div>

                </div>

                <div className="tx-right">

                  <h2>{tx.amount} USDC</h2>

                  <small>
                    {tx.hash
                      ? `${tx.hash.slice(0, 12)}...`
                      : "--"}
                  </small>

                  <span className="tx-status">
                    {tx.status || "Confirmed"}
                  </span>

                </div>

              </div>

            );

          })

        )}

      </div>

      {/* Bottom Summary */}

      <div className="transactions-footer">

        <div className="footer-card">
          <h3>Total Activity</h3>
          <h1>{transactions.length}</h1>
          <span>Recorded Transactions</span>
        </div>

        <div className="footer-card">
          <h3>Network</h3>
          <h1>ARC</h1>
          <span>Testnet</span>
        </div>

        <div className="footer-card">
          <h3>Wallet</h3>
          <h1>Active</h1>
          <span>Connected Successfully</span>
        </div>

      </div>

      {/* Analytics */}

      <div className="tx-analytics">

        <h2 className="tx-section-title">
          Analytics
        </h2>

        <div className="analytics-grid">

          <div className="analytics-card">
            <span>Total Volume</span>

            <h2>
              {transactions
                .reduce(
                  (sum, tx) => sum + Number(tx.amount || 0),
                  0
                )
                .toFixed(2)}{" "}
              USDC
            </h2>

          </div>

          <div className="analytics-card">

            <span>Largest Transfer</span>

            <h2>

              {transactions.length
                ? Math.max(
                    ...transactions.map(tx =>
                      Number(tx.amount || 0)
                    )
                  ).toFixed(2)
                : "0.00"}{" "}
              USDC

            </h2>

          </div>

          <div className="analytics-card">

            <span>Average</span>

            <h2>

              {transactions.length
                ? (
                    transactions.reduce(
                      (sum, tx) =>
                        sum + Number(tx.amount || 0),
                      0
                    ) / transactions.length
                  ).toFixed(2)
                : "0.00"}{" "}
              USDC

            </h2>

          </div>

          <div className="analytics-card">

            <span>Most Used</span>

            <h2>

              {(() => {

                const counts = {};

                transactions.forEach(tx => {
                  counts[tx.type] =
                    (counts[tx.type] || 0) + 1;
                });

                return Object.keys(counts).length
                  ? Object.keys(counts).reduce((a, b) =>
                      counts[a] > counts[b] ? a : b
                    )
                  : "None";

              })()}

            </h2>

          </div>

        </div>

      </div>

      {/* Recent Activity */}

      <div className="activity-timeline">

        <h2 className="section-title">
          Recent Activity
        </h2>

        {filtered.length === 0 ? (

          <div className="empty-activity">

            <div className="empty-icon">
              📭
            </div>

            <h3>No recent activity</h3>

            <p>
              Your latest transfers, swaps and bridges will appear here.
            </p>

          </div>

        ) : (

          filtered.slice(0, 5).map((tx) => {

            const meta =
              TYPE_META[tx.type] || TYPE_META["Sent"];

            const Icon = meta.icon;

            return (

              <div
                key={tx.id}
                className="timeline-item"
              >

                <div className={`timeline-icon ${meta.className}`}>
                  <Icon size={18} />
                </div>

                <div className="timeline-content">

                  <h4>{tx.type}</h4>

                  <p>{tx.time}</p>

                </div>

                <strong>
                  {tx.amount} USDC
                </strong>

              </div>

            );

          })

        )}

      </div>

      {/* Monthly Activity */}

      <div className="activity-chart">

        <h2 className="section-title">
          Monthly Activity
        </h2>

        <div className="chart-container">

          {[45, 62, 38, 82, 70, 55, 92].map((height, index) => (

            <div
              key={index}
              className="chart-column"
            >

              <div
                className="chart-bar"
                style={{
                  height: `${height}%`,
                }}
              ></div>

              <span>
                {
                  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][index]
                }
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Network Status */}

      <div className="network-status-card">

        <h2 className="section-title">
          Network Status
        </h2>

        <div className="network-grid">

          <div className="network-item">

            <span>Network</span>

            <strong>ARC Testnet</strong>

          </div>

          <div className="network-item">

            <span>Status</span>

            <strong className="network-online">

              ● Online

            </strong>

          </div>

          <div className="network-item">

            <span>Confirmation</span>

            <strong>~2 sec</strong>

          </div>

          <div className="network-item">

            <span>RPC</span>

            <strong>Healthy</strong>

          </div>

          <div className="network-item">

            <span>Explorer</span>

            <strong>ArcScan</strong>

          </div>

          <div className="network-item">

            <span>Chain ID</span>

            <strong>5042002</strong>

          </div>

        </div>

      </div>

    </div>

  );

}