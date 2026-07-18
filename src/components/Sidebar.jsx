import arcLogo from "../assets/arc-logo.jpg";

export default function Sidebar({
  menuOpen,
  setMenuOpen,
  setPage,
}) {
  return (
    <>
      {/* Overlay */}
      {menuOpen && (
        <div
  className={`sidebar-overlay ${menuOpen ? "show" : ""}`}
  onClick={() => setMenuOpen(false)}
/>
      )}

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>

        <div className="sidebar-header">

          <img
            src={arcLogo}
            alt="ARC"
            className="sidebar-logo"
          />

          <div>
            <h2>SmarFPay</h2>
            <p>ARC Testnet</p>
          </div>

        </div>

        <nav className="sidebar-menu">

          <button
            onClick={() => {
              setPage("dashboard");
              setMenuOpen(false);
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              setPage("portfolio");
              setMenuOpen(false);
            }}
          >
            Portfolio
          </button>

          <button
            onClick={() => {
              setPage("transactions");
              setMenuOpen(false);
            }}
          >
            Transactions
          </button>

<button
  onClick={() => {
    setPage("request");
    setMenuOpen(false);
  }}
>
  Request Money
</button>

          <button
            onClick={() => {
              setPage("profile");
              setMenuOpen(false);
            }}
          >
            Profile
          </button>

          <button
            onClick={() => {
              setPage("settings");
              setMenuOpen(false);
            }}
          >
            Settings
          </button>

          <button
            onClick={() => {
              setPage("support");
              setMenuOpen(false);
            }}
          >
            Support
          </button>


<button
  className="coming-soon-btn"
  disabled
>
  AI Agent
  <span className="coming-soon-badge">Coming Soon</span>
</button>


        </nav>

        <div className="sidebar-footer">

          <a
            href="https://x.com/smarfarcpay"
            target="_blank"
            rel="noreferrer"
          >
            Project X
          </a>

          <a
            href="https://x.com/0xsadik0"
            target="_blank"
            rel="noreferrer"
          >
            Builder
          </a>

        </div>

      </aside>
    </>
  );
}