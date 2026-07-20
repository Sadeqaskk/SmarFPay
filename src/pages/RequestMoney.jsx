import { useAccount } from "wagmi";
import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { Copy, Check, Share2, Download } from "lucide-react";
import "./RequestMoney.css";


import usdcLogo from "../assets/tokens/usdc.png";
import eurcLogo from "../assets/tokens/eurc.png";
import cirBTCLogo from "../assets/tokens/cirBTC_Icon.png";
import requestProfile from "../assets/profile/request.png";
import smarfLogo from "../assets/icons/smarf-logo.png";

const TOKEN_LIST = [
  { symbol: "USDC", name: "USD Coin", logo: usdcLogo },
  { symbol: "EURC", name: "Euro Coin", logo: eurcLogo },
  { symbol: "cirBTC", name: "Circle Wrapped Bitcoin", logo: cirBTCLogo },
];

export default function RequestMoney() {
  const { address } = useAccount();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [token, setToken] = useState(TOKEN_LIST[0]);

  const [copied, setCopied] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  const qrWrapRef = useRef(null);

  const requestLink = address
    ? `${window.location.origin}/pay?address=${address}&token=${token.symbol}&amount=${amount}`
    : "";

  async function copyLink() {
    if (!requestLink) return;
    await navigator.clipboard.writeText(requestLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyAddress() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  }

  async function shareRequest() {
    if (!requestLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "SmarPay Request",
          text: `Payment request for ${amount || "0.00"} ${token.symbol}`,
          url: requestLink,
        });
      } catch {
        // user cancelled share sheet — no action needed
      }
    } else {
      copyLink();
    }
  }

  function downloadQR() {
    const svg = qrWrapRef.current?.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `request-${token.symbol}-${amount || "0"}.svg`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="request-page">

      {/* Hero */}
      <div className="request-hero">

        <div className="request-hero-glow"></div>

        <div className="request-logo">
  <img src={requestProfile} alt="SmarFPay" />
</div>

        <div className="request-live">
          <span className="live-dot"></span>
          Request Center
        </div>

        <h1>Request Money</h1>

        <p>
          Generate premium payment requests instantly across the
          <span> ARC Ecosystem</span>
        </p>

      </div>

      {/* Token Selector */}
      <div className="token-selector">

        {TOKEN_LIST.map((t) => (

          <div
            key={t.symbol}
            className={`token-card ${
              token.symbol === t.symbol ? "active-token" : ""
            }`}
            onClick={() => setToken(t)}
          >

            <div className="token-card-top">

              <img
                src={t.logo}
                alt={t.symbol}
                className="token-logo"
              />

              <span className="token-badge">{t.symbol}</span>

            </div>

            <h3>{t.name}</h3>

            <p>
              {t.symbol === "USDC" && "Digital Dollar"}
              {t.symbol === "EURC" && "Digital Euro"}
              {t.symbol === "cirBTC" && "Wrapped Bitcoin"}
            </p>

          </div>

        ))}

      </div>

      {/* Amount */}
      <div className="amount-panel">

        <span className="amount-label">Amount</span>

        <div className="amount-box">

          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="amount-token">
            <img src={token.logo} alt={token.symbol} />
            <span>{token.symbol}</span>
          </div>

        </div>

        <div className="quick-amounts">

          {[10, 25, 50, 100].map((value) => (

            <button
              key={value}
              onClick={() => setAmount(value.toString())}
            >
              {value}
            </button>

          ))}

        </div>

      </div>

      {/* Note */}
      <div className="request-note-card">

        <div className="note-header">
          <h3>Payment Message</h3>
          <span>Optional</span>
        </div>

        <textarea
          placeholder="Add a note for the recipient..."
          value={note}
          maxLength={120}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="note-footer">
          <small>
            This message will appear together with the payment request.
          </small>
          <span>{note.length}/120</span>
        </div>

      </div>

      {/* Payment Preview Card */}
      <div className="payment-request-card">

        <div className="payment-glow"></div>

        <div className="payment-header">

          <img
  src={smarfLogo}
  alt="SmarFPay"
  className="payment-logo"
/>
<div>
    <h2>SmarFPay</h2>
    <span>Payment Request</span>
  </div>
        </div>

        <div className="payment-amount">
          <h1>{amount || "0.00"}</h1>
          <small>{token.symbol}</small>
        </div>

        <div className="payment-wallet">

          <span>Receiving Wallet</span>

          <strong>
            {address
              ? `${address.slice(0, 8)}...${address.slice(-6)}`
              : "Wallet Not Connected"}

            {address && (
              <button
                className="copy-inline-btn"
                onClick={copyAddress}
                aria-label="Copy wallet address"
              >
                {addressCopied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            )}
          </strong>

        </div>

        <div className="payment-network">

          <div>
            <span>Network</span>
            <strong>ARC Testnet</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>Ready</strong>
          </div>

        </div>

        <div className="payment-qr" ref={qrWrapRef}>
          <div className="qr-glass">
            <QRCode
              value={JSON.stringify({
                wallet: address,
                token: token.symbol,
                amount,
                note,
              })}
              size={180}
              bgColor="transparent"
              fgColor="#ffffff"
            />
          </div>
        </div>

      </div>

      {/* Actions */}
      <div className="payment-actions">

        <button
          className="action-btn primary-action"
          onClick={copyLink}
          disabled={!address}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy Request"}
        </button>

        <button
          className="action-btn"
          onClick={shareRequest}
          disabled={!address}
        >
          <Share2 size={16} />
          Share
        </button>

        <button
          className="action-btn"
          onClick={downloadQR}
        >
          <Download size={16} />
          Download QR
        </button>

      </div>

    </div>
  );
}