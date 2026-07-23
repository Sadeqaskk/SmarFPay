import "./WalletModal.css";
import { useState } from "react";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import {
  useLogin,
  usePrivy,
} from "@privy-io/react-auth";
import { Mail, ExternalLink, LogOut, X, ShieldCheck } from "lucide-react";
import { arcTestnet } from "../wagmi";

export default function WalletModal({ open, onClose }) {

  const [connectingWallet, setConnectingWallet] = useState(false);
  const [connectError, setConnectError] = useState("");

  const { login } = useLogin({
    onComplete: () => {
      setConnectingWallet(false);
      onClose();
    },
    onError: (error) => {
      console.error(error);
      setConnectingWallet(false);
      setConnectError("Sign-in failed. Please try again.");
    },
  });

  const {
    authenticated,
    user,
    logout,
  } = usePrivy();

  if (!open) return null;

  function handleWalletConnect() {
    setConnectError("");
    setConnectingWallet(true);
    login({ loginMethods: ["wallet"] });
  }

  async function handleWalletConnectQR() {
    setConnectError("");
    setConnectingWallet(true);

    try {
      const provider = await EthereumProvider.init({
        projectId: "ce05547a42469cc7b3e0fe02f8f0015f",
        chains: [arcTestnet.id],
        showQrModal: true,
        metadata: {
          name: "SmarFPay",
          description: "Access your SmarFPay vault",
          url: window.location.origin,
          icons: [],
        },
      });

      await provider.enable();

      setConnectingWallet(false);
      onClose();
    } catch (error) {
      console.error("WalletConnect error:", error);
      setConnectingWallet(false);
      setConnectError(error?.message || "Couldn't connect via WalletConnect.");
    }
  }

  return (
    <>
      <div className="wm-overlay" onClick={onClose}></div>

      <div className="wm-modal" role="dialog" aria-modal="true">

        <div className="wm-aura wm-aura-a" aria-hidden="true"></div>
        <div className="wm-aura wm-aura-b" aria-hidden="true"></div>
        <div className="wm-grain" aria-hidden="true"></div>

        <div className="wm-drag-handle" aria-hidden="true"></div>

        <div className="wm-header">
          <div className="wm-crest">
            <svg viewBox="0 0 40 40" className="wm-crest-ring" aria-hidden="true">
              <circle cx="20" cy="20" r="18" />
            </svg>
            <ShieldCheck size={18} strokeWidth={2} className="wm-crest-icon" />
          </div>

          <div className="wm-heading-text">
            <h2>Connect</h2>
            <p>Access your SmarFPay vault</p>
          </div>

          <button className="wm-close" onClick={onClose} aria-label="Close">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {connectError && (
          <div className="wm-error" role="alert">
            {connectError}
          </div>
        )}

        {!authenticated ? (
          <div className="wm-login-section">

            <button
              className="wm-login-row wm-login-email"
              onClick={() => login({ loginMethods: ["email"] })}
            >
              <span className="wm-row-icon">
                <Mail size={19} strokeWidth={2} />
              </span>
              <span className="wm-row-text">
                <strong>Continue with Email</strong>
                <small>Creates your Smart Wallet instantly</small>
              </span>
              <span className="wm-row-shine" aria-hidden="true"></span>
            </button>

            <button
              className="wm-login-row wm-login-google"
              onClick={() => login({ loginMethods: ["google"] })}
            >
              <span className="wm-row-icon wm-row-icon-google">G</span>
              <span className="wm-row-text">
                <strong>Continue with Google</strong>
                <small>Fast, secure single sign-on</small>
              </span>
              <span className="wm-row-shine" aria-hidden="true"></span>
            </button>

          </div>
        ) : (
          <div className="wm-profile">
            <div className="wm-profile-glow" aria-hidden="true"></div>

            <img
              src={user?.google?.picture || "https://ui-avatars.com/api/?name=User&background=0B1428&color=fff"}
              alt=""
              className="wm-profile-avatar"
            />

            <h3>{user?.google?.name || user?.email?.address || "SmarFPay User"}</h3>
            {user?.email?.address && <p>{user.email.address}</p>}

            <span className="wm-connected-pill">
              <span className="wm-pulse-dot"></span>
              Connected
            </span>

            <button className="wm-logout-btn" onClick={logout}>
              <LogOut size={15} strokeWidth={2} />
              Sign out
            </button>
          </div>
        )}

        <div className="wm-divider">
          <span>or connect a wallet</span>
        </div>

        <div className="wm-wallet-list">

          <button
            className="wm-wallet-row"
            onClick={handleWalletConnect}
            disabled={connectingWallet}
          >
            <span className="wm-wallet-badge wm-badge-fox">🦊</span>
            <span className="wm-row-text">
              <strong>Browser Wallet</strong>
              <small>MetaMask, Rabby & more</small>
            </span>
            <span className="wm-row-arrow">→</span>
            <span className="wm-row-shine" aria-hidden="true"></span>
          </button>

          <button
            className="wm-wallet-row"
            onClick={handleWalletConnect}
            disabled={connectingWallet}
          >
            <span className="wm-wallet-badge wm-badge-coinbase">◎</span>
            <span className="wm-row-text">
              <strong>Coinbase Wallet</strong>
              <small>Mobile & desktop</small>
            </span>
            <span className="wm-row-arrow">→</span>
            <span className="wm-row-shine" aria-hidden="true"></span>
          </button>

          <button
            className="wm-wallet-row"
            onClick={handleWalletConnectQR}
            disabled={connectingWallet}
          >
            <span className="wm-wallet-badge wm-badge-wc">◈</span>
            <span className="wm-row-text">
              <strong>WalletConnect</strong>
              <small>Scan a QR code</small>
            </span>
            <span className="wm-row-arrow">→</span>
            <span className="wm-row-shine" aria-hidden="true"></span>
          </button>

        </div>

        <div className="wm-footer-note">
          <ExternalLink size={13} strokeWidth={2} />
          <span>Non-custodial. Your keys never touch our servers.</span>
        </div>

      </div>
    </>
  );
}