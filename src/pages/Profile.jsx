import "./Profile.css";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useBalance } from "wagmi";
import { USDC_ADDRESS } from "../contracts/usdc";
import {
  User,
  Mail,
  ShieldCheck,
  Wallet,
  Globe,
  Coins,
  Activity,
  Copy,
  LogOut,
  Link2,
} from "lucide-react";



export default function Profile({ onOpenWalletModal }) {
  
    const {
    user,
    authenticated,
    logout,
  } = usePrivy();

const { address, isConnected } = useAccount();

const { data: balance } = useBalance({
  address,
  token: USDC_ADDRESS,
});

  if (!authenticated) {
    return (
      <div className="profile-page">

        <h1>Profile</h1>

        <p>Please login first.</p>

      </div>
    );
  }

  return (
  <div className="profile-page">

    <div className="profile-card">

      <img
        src={user?.google?.picture || "https://ui-avatars.com/api/?name=SmarFArcPay"}
        alt="Profile"
        className="profile-avatar"
      />

      <h2>
        {user?.google?.name ||
          user?.email?.address ||
          "SmarFArcPay User"}
      </h2>

      <p>
        {user?.email?.address}
      </p>

      <span className="connected-badge">
  <Activity size={16} />
  Connected
</span>

    </div>


<div className="coming-soon-card">

  <div className="coming-header">

    <span className="coming-badge">
  <Link2 size={16} />
  Coming Soon
</span>
    <h2>Smart Wallet</h2>

  </div>

  <p>
    Sign in with Email or Google and receive a secure
    embedded ARC wallet automatically.
  </p>

  <div className="coming-features">

    <div className="coming-item">
  <Coins size={18} />
  Deposit USDC on ARC
</div>

<div className="coming-item">
  <Wallet size={18} />
  Send without MetaMask
</div>

<div className="coming-item">
  <ShieldCheck size={18} />
  Embedded Smart Wallet
</div>

<div className="coming-item">
  <Activity size={18} />
  One-click onboarding
</div>

  </div>

  <button
    className="coming-btn"
    disabled
  >
    Coming Soon
  </button>

</div>



  <div className="profile-info">

      {isConnected ? (

  <div className="wallet-card">

    <h2>Wallet</h2>

    <div className="info-item">
      <span>
  <Wallet size={18} />
  Connected Wallet
</span>

      <div className="wallet-row">

        <p>
          {address.slice(0, 6)}...
          {address.slice(-4)}
        </p>

        <button
          className="copy-btn"
          onClick={() => navigator.clipboard.writeText(address)}
        >
          <Copy size={16} />
        </button>

      </div>
    </div>

    <div className="info-item">
      <span>
  <Globe size={18} />
  Network
</span>
      <p>ARC Testnet</p>
    </div>

    <div className="info-item">
      <span>
  <Coins size={18} />
  USDC Balance
</span>
      <p>
        {balance
          ? Number(balance.formatted).toFixed(4)
          : "0.0000"} USDC
      </p>
    </div>

    <div className="info-item">
      <span>
  <Activity size={18} />
  Status
</span>
      <p>Connected</p>
    </div>

  </div>

) : (

  <div className="wallet-card empty-wallet">

    <h2>Wallet</h2>

    <p>No wallet connected yet.</p>

    <small>
      Connect MetaMask, Rabby or WalletConnect to unlock on-chain features.
    </small>

    <button
  className="connect-wallet-btn"
  onClick={onOpenWalletModal}
>
  Connect Wallet
</button>

  </div>

)}

    

    </div>

    <button
  className="logout-btn"
  onClick={logout}
>
  <LogOut size={18} />
  Logout
</button>

  </div>
);
}