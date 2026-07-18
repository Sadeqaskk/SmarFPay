import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Waypoints,
  Banknote,
  ChevronRight,
} from "lucide-react";
import "./ActivityFeed.css";

const TYPE_META = {
  Sent: { icon: ArrowUpRight, className: "sent" },
  Received: { icon: ArrowDownLeft, className: "received" },
  Swap: { icon: ArrowLeftRight, className: "swap" },
  Bridge: { icon: Waypoints, className: "bridge" },
  "Request Created": { icon: Banknote, className: "request" },
};

export default function ActivityFeed({ transactions, onSelectTx, onViewAll }) {
  const recent = transactions.slice(0, 6);

  return (
    <section className="activity-feed glass">
      <div className="activity-feed-header">
        <div className="activity-feed-title-row">
          <h2>Recent Activity</h2>
          <span className="activity-feed-live">
            <span className="activity-feed-live-dot" />
            Live
          </span>
        </div>
        {transactions.length > 0 && (
          <button className="activity-feed-viewall" onClick={onViewAll}>
            View all <ChevronRight size={14} />
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="activity-feed-empty">
          <div className="activity-feed-empty-icon">
            <ArrowLeftRight size={26} />
          </div>
          <h3>No Transactions Yet</h3>
          <p>Send, swap, or bridge USDC to see your activity here.</p>
        </div>
      ) : (
        <div className="activity-feed-list">
          {recent.map((tx, i) => {
            const meta = TYPE_META[tx.type] || TYPE_META["Sent"];
            const Icon = meta.icon;
            return (
              <div
                key={tx.id}
                className="activity-feed-row"
                style={{ animationDelay: `${i * 0.04}s` }}
                onClick={() => onSelectTx(tx)}
              >
                <div className={`activity-feed-icon ${meta.className}`}>
                  <Icon size={17} />
                </div>
                <div className="activity-feed-main">
                  <div className="activity-feed-top">
                    <span className="activity-feed-type">{tx.type}</span>
                    <span className="activity-feed-amount">
                      {tx.amount ? `${tx.amount} USDC` : "—"}
                    </span>
                  </div>
                  <div className="activity-feed-sub">
                    <span className="activity-feed-detail">
                      {tx.to || tx.recipient || (tx.hash ? `${tx.hash.slice(0, 12)}...` : "Pending")}
                    </span>
                    <span className="activity-feed-time">{tx.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}