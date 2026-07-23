import { useAccount, useDisconnect } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import SmarfLogo from "../assets/icons/smarf-logo.png";
import "./Navbar.css";

export default function Navbar({
  menuOpen,
  setMenuOpen,
  setWalletModalOpen,
}) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { user, logout } = usePrivy();

  // Embedded Privy wallet
  const embeddedWallet = user?.linkedAccounts?.find(
    (account) => account.type === "wallet"
  );
  const embeddedAddress = embeddedWallet?.address;

  // Final wallet address — external wallet takes priority, otherwise embedded
  const walletAddress = isConnected ? address : embeddedAddress;
  const walletConnected = !!walletAddress;

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  const handleDisconnect = () => {
    console.log("Disconnect clicked");
    if (isConnected) {
      disconnect();
    } else {
      logout();
    }
  };

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

        <img src={SmarfLogo} alt="Smarf Logo" className="smarf-logo" />

        <div className="brand">
          <h1>SmarFPay</h1>
          <p>Stablecoin Infrastructure</p>
        </div>
      </div>

      {/* Right */}
      <div className="navbar-right">
        <div className="network-badge">
          <span className="network-dot"></span>
          ARC Testnet
        </div>

        {!walletConnected ? (
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
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </header>
  );
}