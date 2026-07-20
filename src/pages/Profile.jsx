import "./Profile.css";
import profileProfile from "../assets/profile/profile.png";

import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useBalance } from "wagmi";

import {
  Activity,
  Wallet,
  Globe,
  Coins,
  Copy,
  LogOut,
} from "lucide-react";

export default function Profile() {

  const { user, logout } = usePrivy();

  const { address } = useAccount();

  const { data: balance } = useBalance({
    address,
    watch: true,
  });

  const shortAddress = address
    ? `${address.slice(0,6)}...${address.slice(-4)}`
    : "Not Connected";

  return (

    <div className="profile-page">

      <div className="bgGlow bgGlow1"></div>
      <div className="bgGlow bgGlow2"></div>
      <div className="bgGlow bgGlow3"></div>

      {/* Hero */}

      <div className="profile-hero">

        <div className="profile-logo">
  <img
    src={profileProfile}
    alt="profile"
  />
</div>

        <h1>Profile</h1>

        <p>
          Smart Wallet Identity
        </p>

        <div className="verified-pill">

          <span className="verified-dot"></span>

          Wallet Verified

        </div>

      </div>

      {/* Identity */}

      <div className="identity-card">

        <div className="identity-left">

          <img
            className="identity-avatar"
            src={
              user?.google?.picture ||
              "https://ui-avatars.com/api/?name=SmarFPay"
            }
            alt=""
          />

          <div>

            <h2>
              {user?.google?.name ||
                "SmarFPay User"}
            </h2>

            <p>
              {user?.email?.address}
            </p>

          </div>

        </div>

        <div className="identity-status">

          <Activity size={16} />

          Connected

        </div>

      </div>

      {/* Wallet */}

      <div className="wallet-card">

        <h2>

          Live Wallet

        </h2>

        <div className="wallet-row">

          <div>

            <Wallet size={18}/>

            Wallet

          </div>

          <div className="wallet-address">

            {shortAddress}

            <button
              className="copy-wallet"

              onClick={() => {

                navigator.clipboard.writeText(address);

              }}

            >

              <Copy size={15}/>

            </button>

          </div>

        </div>

        <div className="wallet-row">

          <div>

            <Globe size={18}/>

            Network

          </div>

          <strong>

            ARC Testnet

          </strong>

        </div>

        <div className="wallet-row">

          <div>

            <Coins size={18}/>

            Balance

          </div>

          <strong>

            {balance
              ? Number(balance.formatted).toFixed(4)
              : "0.0000"} USDC

          </strong>

        </div>

        <div className="wallet-row">

          <div>

            <Activity size={18}/>

            Status

          </div>

          <span className="wallet-live">

            ● Active

          </span>

        </div>

      </div>

      <div className="profile-stats">

        <div className="profile-stat-card">

          <h3>Assets</h3>

          <h2>3</h2>

          <span>Digital Assets</span>

        </div>

        <div className="profile-stat-card">

          <h3>Transactions</h3>

          <h2>98</h2>

          <span>Completed</span>

        </div>

        <div className="profile-stat-card">

          <h3>Network</h3>

          <h2>ARC</h2>

          <span>Testnet</span>

        </div>

        <div className="profile-stat-card">

          <h3>Security</h3>

          <h2>100%</h2>

          <span>Protected</span>

        </div>

      </div>

      <div className="account-actions">

        <button
          className="action-btn"

          onClick={() =>
            navigator.clipboard.writeText(address)
          }
        >

          <div>

            <h3>Copy Wallet</h3>

            <span>
              Copy your wallet address
            </span>

          </div>

          <Copy size={20} />

        </button>

        <button
          className="action-btn"

          onClick={() =>
            window.open(
              `https://testnet.arcscan.app/address/${address}`,
              "_blank"
            )
          }
        >

          <div>

            <h3>View on ArcScan</h3>

            <span>
              Open blockchain explorer
            </span>

          </div>

          <Globe size={20} />

        </button>

        <button
          className="action-btn logout-action"

          onClick={logout}
        >

          <div>

            <h3>Logout</h3>

            <span>
              Securely sign out
            </span>

          </div>

          <LogOut size={20} />

        </button>

      </div>

    </div>

  );

}