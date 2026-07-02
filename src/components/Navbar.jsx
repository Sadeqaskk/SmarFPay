import { useAccount, useConnect, useDisconnect } from "wagmi";
import arcLogo from "../assets/arc-logo.jpg";

export default function Navbar({
  menuOpen,
  setMenuOpen,
  setWalletModalOpen,
}) {
  
  
  const { address, isConnected } = useAccount();

  const { disconnect } = useDisconnect();

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <header className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <button
          className={`menu-btn ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <img
          src={arcLogo}
          alt="ARC Logo"
          className="arc-logo"
        />

        <div className="brand">
          <h1>SmarFArcPay</h1>
          <p>Powered by ARC</p>
        </div>
      </div>

      {/* Right */}
      <div className="navbar-right">
        <div className="network-badge">
          <span className="network-dot"></span>
          ARC Testnet
        </div>

        {!isConnected ? (
          <button
  className="wallet-btn"
  onClick={() => setWalletModalOpen(true)}
>
  Connect Wallet
</button>
        ) : (
          <div className="wallet-connected">
            <div className="wallet-address">
              {shortAddress}
            </div>

            <button
  className="disconnect-btn"
  onClick={() => {
    console.log("Disconnect clicked");
    disconnect();
  }}
>
  Disconnect
</button>
          </div>
        )}
      </div>
    </header>
  );
}