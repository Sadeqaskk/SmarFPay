import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Waypoints,
  Banknote,
  X,
  Copy,
  ExternalLink,
} from "lucide-react";
import "./TransactionModal.css";

const TYPE_META = {
  Sent: { icon: ArrowUpRight, className: "sent" },
  Received: { icon: ArrowDownLeft, className: "received" },
  Swap: { icon: ArrowLeftRight, className: "swap" },
  Bridge: { icon: Waypoints, className: "bridge" },
  "Request Created": { icon: Banknote, className: "request" },
};

export default function TransactionModal({ tx, onClose }) {
  if (!tx) return null;

  const meta = TYPE_META[tx.type] || TYPE_META["Sent"];
  const Icon = meta.icon;

  function copy(text, label) {
    navigator.clipboard.writeText(text);
    alert(`${label} copied!`);
  }

  return (
    <div className="txm-overlay" onClick={onClose}>
      <div className="txm-card" onClick={(e) => e.stopPropagation()}>
        <button className="txm-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className={`txm-icon ${meta.className}`}>
          <Icon size={26} />
        </div>

        <h2 className="txm-type">{tx.type}</h2>
        <div className="txm-amount">
          {tx.amount ? `${tx.amount} USDC` : "—"}
        </div>
        <div className="txm-status">{tx.status || "Confirmed"}</div>

        <div className="txm-divider" />

        <div className="txm-rows">
          {(tx.to || tx.recipient) && (
            <div className="txm-row">
              <span className="txm-row-label">
                {tx.type === "Received" ? "From" : "To"}
              </span>
              <div className="txm-row-value">
                <span>{(tx.to || tx.recipient)?.slice(0, 10)}...{(tx.to || tx.recipient)?.slice(-6)}</span>
                <button
                  className="txm-copy-btn"
                  onClick={() => copy(tx.to || tx.recipient, "Address")}
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>
          )}

          <div className="txm-row">
            <span className="txm-row-label">Time</span>
            <span className="txm-row-value">{tx.time}</span>
          </div>

          {tx.hash && (
            <div className="txm-row">
              <span className="txm-row-label">Hash</span>
              <div className="txm-row-value">
                <span>{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</span>
                <button
                  className="txm-copy-btn"
                  onClick={() => copy(tx.hash, "Transaction hash")}
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {tx.hash && (
          <button
            className="txm-explorer-btn"
            onClick={() =>
              window.open(`https://testnet.arcscan.app/tx/${tx.hash}`, "_blank")
            }
          >
            View on ArcScan <ExternalLink size={15} />
          </button>
        )}
      </div>
    </div>
  );
}