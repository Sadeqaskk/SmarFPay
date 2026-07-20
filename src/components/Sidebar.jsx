import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  HandCoins,
  User,
  Settings,
  LifeBuoy,
  Sparkles,
} from "lucide-react";

import smarfLogo from "../assets/icons/smarf-logo.png";
import "./Sidebar.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "portfolio", label: "Portfolio", icon: Wallet },
  { key: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { key: "request", label: "Request Money", icon: HandCoins },
  { key: "profile", label: "Profile", icon: User },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "support", label: "Support", icon: LifeBuoy },
];

export default function Sidebar({
  menuOpen,
  setMenuOpen,
  setPage,
  activePage,
}) {
  const navigate = (key) => {
    setPage(key);
    setMenuOpen(false);
  };

  return (
    <>
      {menuOpen && (
        <div
          className={`sidebar-overlay ${menuOpen ? "show" : ""}`}
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-box">
            <img src={smarfLogo} alt="SmarFPay" className="sidebar-logo" />
          </div>

          <div className="sidebar-brand">
            <h2>SmarFPay</h2>
            <span>Built on Arc</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={activePage === key ? "active" : ""}
              onClick={() => navigate(key)}
            >
              <span className="nav-icon">
                <Icon size={18} />
              </span>
              {label}
            </button>
          ))}

          <div className="ai-card">
            <div className="ai-card-glow"></div>

            <div className="ai-card-icon">
              <Sparkles size={20} />
            </div>

            <div className="ai-card-text">
              <h4>AI Agent</h4>
              <p>Coming Soon</p>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <a href="https://x.com/smarfpay" target="_blank" rel="noreferrer">
            Project X
          </a>

          <a href="https://x.com/0xsadik0" target="_blank" rel="noreferrer">
            Builder
          </a>
        </div>
      </aside>
    </>
  );
}