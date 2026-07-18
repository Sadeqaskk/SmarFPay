import { useRef } from "react";
import { useAccount } from "wagmi";
import { useWallets } from "@privy-io/react-auth";
import QRCode from "react-qr-code";
import { Copy, Share2, Download } from "lucide-react";
import "./Receive.css";

import receiveProfile from "../assets/profile/receive.png";
import usdcLogo from "../assets/tokens/usdc.png";
import eurcLogo from "../assets/tokens/eurc.png";
import cirBTC from "../assets/tokens/cirBTC_Icon.png";

export default function Receive() {
  const { address: externalAddress } = useAccount();
  const { wallets } = useWallets();

  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  const address = externalAddress || embeddedWallet?.address;

  const qrRef = useRef(null);

  const copyAddress = async () => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      alert("Address copied!");
    } catch (err) {
      console.error(err);
    }
  };

  const shareAddress = async () => {
    if (!address) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "SmarFArcPay Wallet",
          text: "Send USDC, EURC or cirBTC to my wallet:",
          url: address,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      copyAddress();
    }
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width || 220;
      canvas.height = img.height || 220;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "smarf-wallet-qr.png";
      link.click();
    };

    img.src = url;
  };

  return (
    <div className="receive-page">

      <div className="receive-hero">

        <div className="receive-hero-glow"></div>

        <div className="receive-logo">

          <img
            src={receiveProfile}
            alt="Receive"
          />

        </div>

        <div className="receive-live">

          <span className="live-dot"></span>

          Receive Center

        </div>

        <h1>Receive Assets</h1>

        <p>

          Receive
          <span> USDC</span>,
          <span> EURC</span>
          and
          <span> cirBTC</span>
          instantly on the ARC Ecosystem.

        </p>

      </div>

      <div className="receive-wallet-card">

        <div className="receive-glow"></div>

        <div className="receive-header">

          <img
            src={receiveProfile}
            alt="SmarFArcPay"
            className="receive-wallet-logo"
          />

          <div>

            <h2>Your Receiving Wallet</h2>

            <span>ARC Testnet</span>

          </div>

        </div>

        <div className="receive-address-card">

          <span>Wallet Address</span>

          <strong>

            {address
              ? `${address.slice(0, 10)}...${address.slice(-8)}`
              : "Wallet Not Connected"}

          </strong>

        </div>

        <div className="receive-network-grid">

          <div>

            <span>Network</span>

            <strong>ARC Testnet</strong>

          </div>

          <div>

            <span>Status</span>

            <strong>Ready</strong>

          </div>

          <div className="security-item">


  <h4>Supported Assets</h4>

  <div className="supported-assets">

    <img src={usdcLogo} alt="USDC" />

    <img src={eurcLogo} alt="EURC" />

    <img src={cirBTC} alt="cirBTC" />

  </div>

</div>

        </div>

      </div>

      <div className="receive-qr-section">

        <div className="receive-qr-glow"></div>

        <div className="receive-qr-card">

          <div className="receive-qr-header">

            <h2>Scan to Receive</h2>

            <span>Instant Payment</span>

          </div>

          <div className="receive-qr" ref={qrRef}>

            <QRCode
              value={address || ""}
              size={220}
              bgColor="transparent"
              fgColor="#ffffff"
            />

          </div>

          <p className="receive-qr-text">

            Anyone can scan this QR code to send
            <strong> USDC</strong>,
            <strong> EURC</strong>,
            or
            <strong> cirBTC</strong>
            directly to your wallet.

          </p>

        </div>

      </div>

      <div className="receive-actions">

        <button
          className="receive-action primary-action"
          onClick={copyAddress}
        >
          <Copy size={18} />
          Copy Address
        </button>

        <button
          className="receive-action"
          onClick={shareAddress}
        >
          <Share2 size={18} />
          Share Wallet
        </button>

        <button
          className="receive-action"
          onClick={downloadQR}
        >
          <Download size={18} />
          Download QR
        </button>

      </div>

      <div className="receive-security-card">

        <div className="security-header">

          <h2>Receive Securely</h2>

          <span>ARC Protected</span>

        </div>

        <div className="security-grid">

          <div className="security-item">

  <h4>Supported Assets</h4>

  <div className="supported-assets">

    <img src={usdcLogo} alt="USDC" />

    <img src={eurcLogo} alt="EURC" />

    <img src={cirBTC} alt="cirBTC" />

  </div>

</div>

          <div className="security-item">

            <h4>Network</h4>

            <p>ARC Testnet</p>

          </div>

          <div className="security-item">

            <h4>Confirmation</h4>

            <p>Instant Detection</p>

          </div>

          <div className="security-item">

            <h4>Security</h4>

            <p>Non-Custodial Wallet</p>

          </div>

        </div>

      </div>

    </div>
  );
}