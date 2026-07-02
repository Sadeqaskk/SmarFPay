import { useAccount } from "wagmi";
import QRCode from "react-qr-code";

export default function Receive() {
  const { address } = useAccount();

  return (
    <div className="page">

      <h1>Receive USDC</h1>

      <p>Receive USDC securely on ARC Testnet.</p>

      <div className="receive-card">

        <h3>Your Wallet Address</h3>


<div className="qr-wrapper">
  {address ? (
    <QRCode
      value={address}
      size={180}
      bgColor="#ffffff"
      fgColor="#000000"
    />
  ) : (
    <p>Connect your wallet to generate a QR code.</p>
  )}
</div>

        <div className="wallet-address">
          {address || "Connect your wallet"}
        </div>

        <button
          className="copy-button"
          onClick={() => {
            if (!address) return;

            navigator.clipboard.writeText(address);

            alert("Wallet address copied!");
          }}
        >
          Copy Address
        </button>

<button
  className="share-button"
  onClick={async () => {
    if (!address) return;

    if (navigator.share) {
      await navigator.share({
        title: "My ARC Testnet Wallet",
        text: address,
      });
    } else {
      alert("Sharing is not supported on this device.");
    }
  }}
>
  Share Address
</button>

      </div>

    </div>
  );
}