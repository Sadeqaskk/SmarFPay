import "./Portfolio.css";
import { useBalance, useAccount } from "wagmi";
import { useEffect, useState } from "react";

import portfolioProfile from "../assets/profile/portfolio.png";
import usdcLogo from "../assets/icons/USDC_Token.png";

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();

  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
};

export default function Portfolio() {
  const { address } = useAccount();
  const [displayBalance, setDisplayBalance] = useState(0);

  const { data: balance, isLoading } = useBalance({
    address,
    watch: true,
  });

  const usdcBalance = Number(balance?.formatted || 0);
  const portfolioValue = usdcBalance.toFixed(2);
  const [wholePart, decimalPart] = portfolioValue.split(".");
  const assetCount = usdcBalance > 0 ? 1 : 0;
  const activityCount = 0;

  useEffect(() => {
    if (!balance) return;

    const target = usdcBalance;
    let current = 0;

    const duration = 1000;
    const steps = 60;
    const increment = target / steps;

    const interval = setInterval(() => {
      current += increment;

      if (current >= target) {
        current = target;
        clearInterval(interval);
      }

      setDisplayBalance(current);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [balance, usdcBalance]);

  return (
    <div className="portfolio-page">
      <div className="particle particle1"></div>
      <div className="particle particle2"></div>
      <div className="particle particle3"></div>
      <div className="particle particle4"></div>
      <div className="particle particle5"></div>

      <div className="bgGlow bgGlow1"></div>
      <div className="bgGlow bgGlow2"></div>
      <div className="bgGlow bgGlow3"></div>

      <div className="portfolio-hero">
        <div className="glass-shine"></div>

        <div className="portfolio-logo">
  <img
    src={portfolioProfile}
    alt="portfolio"
  />
</div>

        <span className="portfolio-label">Total Portfolio</span>

        <h1 className="portfolio-balance">
          <span className="balance-currency">$</span>
          <span className="balance-value">{wholePart}</span>
          <span className="balance-decimal">.{decimalPart}</span>
        </h1>

        <div className="balance-usd-tag">USD</div>

        <div className="portfolio-profit">
          <span className="profit-dot"></span>
          +4.82% Today
        </div>
      </div>

      <div className="section-header">
        <h2>Assets</h2>
        <span>{assetCount} Asset</span>
      </div>

      <div className="asset-card" onMouseMove={handleMouseMove}>
        <div className="glass-shine"></div>
        <div className="asset-glow"></div>

        <div className="asset-left">
          <div className="asset-logo">
            <img src={usdcLogo} alt="USDC" />
          </div>

          <div>
            <h2>USDC</h2>
            <span>Arc Testnet Stablecoin</span>
          </div>
        </div>

        <div className="asset-right">
          <h2>{isLoading ? "Loading..." : `${usdcBalance.toFixed(4)} USDC`}</h2>
          <small>≈ ${portfolioValue}</small>

          <div className="asset-status">
            <span className="live-dot"></span>
            LIVE
          </div>
        </div>
      </div>

      <div className="performance-card" onMouseMove={handleMouseMove}>
        <div className="glass-shine"></div>

        <div className="performance-header">
          <div>
            <h2>Portfolio Performance</h2>
            <span>24H Performance</span>
          </div>

          <div className="performance-badge">+98%</div>
        </div>

        <div className="performance-chart">
          <div className="chart-line"></div>
          <div className="chart-fill"></div>
        </div>

        <div className="performance-footer">
          <span>${portfolioValue}</span>
          <span>Positive Growth</span>
        </div>
      </div>

      <div className="allocation-card" onMouseMove={handleMouseMove}>
        <div className="glass-shine"></div>

        <div className="allocation-header">
          <h2>Allocation</h2>
          <span>Asset breakdown</span>
        </div>

        <div className="allocation-content">
          <div className="allocation-ring">
            <div className="ring-glow"></div>

            <div className="ring-center">
              <h2>100%</h2>
              <span>USDC</span>
            </div>
          </div>

          <div className="allocation-details">
            <div className="allocation-row">
              <div>
                <h3>USDC</h3>
                <small>Stablecoin</small>
              </div>
              <strong>100%</strong>
            </div>

            <div className="allocation-bar">
              <div className="allocation-fill"></div>
            </div>

            <div className="allocation-row">
              <div>
                <h3>Network</h3>
                <small>Blockchain</small>
              </div>
              <strong>ARC</strong>
            </div>

            <div className="allocation-row">
              <div>
                <h3>Status</h3>
                <small>Portfolio Health</small>
              </div>
              <strong className="healthy">Healthy</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-card" onMouseMove={handleMouseMove}>
          <span>Net Worth</span>
          <h2>{isLoading ? "Loading..." : `$${portfolioValue}`}</h2>
        </div>

        <div className="stats-card" onMouseMove={handleMouseMove}>
          <span>Assets</span>
          <h2>{assetCount}</h2>
        </div>

        <div className="stats-card" onMouseMove={handleMouseMove}>
          <span>Activity</span>
          <h2>{activityCount}</h2>
        </div>
      </div>
    </div>
  );
}