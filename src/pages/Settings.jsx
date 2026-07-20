import "./Settings.css";
import settingProfile from "../assets/profile/setting.png";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useBalance } from "wagmi";
import { Copy, Globe, LogOut, Bell, Shield, Moon } from "lucide-react";


export default function Settings() {

  const { address } = useAccount();

  const { data: balance } = useBalance({
    address,
  });

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Not Connected";

  const { logout } = usePrivy();

  return (
    <div className="settings-page">

      <div className="bgGlow bgGlow1"></div>
      <div className="bgGlow bgGlow2"></div>
      <div className="bgGlow bgGlow3"></div>

      <div className="settings-hero">

        <div className="settings-logo">
  <img
    src={settingProfile}
    alt="Setting"
  />
</div>

        <h1>Settings</h1>

        <p>

          Customize your SmarFPay experience

        </p>

        <div className="settings-pill">

          <span className="verified-dot"></span>

          Wallet Configured

        </div>

      </div>

      {/* Quick Settings */}

      <div className="settings-grid">

        <div className="setting-card">

          <div className="setting-icon">
            <Bell size={22}/>
          </div>

          <div>

            <h3>Notifications</h3>

            <p>
              Transaction alerts enabled
            </p>

          </div>

          <label className="switch">

            <input
              type="checkbox"
              defaultChecked
            />

            <span className="slider"></span>

          </label>

        </div>

        <div className="setting-card">

          <div className="setting-icon">

            <Shield size={22}/>

          </div>

          <div>

            <h3>Security</h3>

            <p>
              Wallet protection enabled
            </p>

          </div>

          <span className="status-active">

            Active

          </span>

        </div>

        <div className="setting-card">

          <div className="setting-icon">

            <Globe size={22}/>

          </div>

          <div>

            <h3>Network</h3>

            <p>

              ARC Testnet

            </p>

          </div>

          <span className="network-pill">

            Live

          </span>

        </div>

        <div className="setting-card">

          <div className="setting-icon">

            <Moon size={22}/>

          </div>

          <div>

            <h3>Appearance</h3>

            <p>

              Premium Dark Theme

            </p>

          </div>

          <span className="theme-pill">

            Dark

          </span>

        </div>

      </div>

      {/* Account Information */}

      <div className="account-section">

        <h2 className="section-title">

          Account Information

        </h2>

        <div className="account-card">

          <div className="account-row">

            <span>

              Wallet

            </span>

            <strong>

              {shortAddress}

            </strong>

          </div>

          <div className="account-row">

            <span>

              Network

            </span>

            <strong>

              ARC Testnet

            </strong>

          </div>

          <div className="account-row">

            <span>

              Balance

            </span>

            <strong>

              {balance
                ? Number(balance.formatted).toFixed(4)
                : "0.0000"} USDC

            </strong>

          </div>

          <div className="account-row">

            <span>

              Wallet Status

            </span>

            <span className="wallet-status">

              ● Connected

            </span>

          </div>

        </div>

      </div>

      {/* Settings Actions */}

      <div className="settings-actions">

        <button
          className="settings-action-btn"
          onClick={() => navigator.clipboard.writeText(address)}
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
          className="settings-action-btn"
          onClick={() =>
            window.open(
              `https://testnet.arcscan.app/address/${address}`,
              "_blank"
            )
          }
        >

          <div>

            <h3>Open ArcScan</h3>

            <span>
              View your wallet on explorer
            </span>

          </div>

          <Globe size={20} />

        </button>

        <button
          className="settings-action-btn logout-btn"
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

      {/* App Info */}

      <div className="app-info-card">

        <h3>SmarFPay</h3>

        <p>

          Version <strong>1.9</strong>

        </p>

        <span>

          Built with ❤️ by Sadik Sani Namadi

        </span>

      </div>

    </div>

  );

}