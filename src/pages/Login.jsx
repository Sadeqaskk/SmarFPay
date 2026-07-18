import { usePrivy } from "@privy-io/react-auth";
import "./Login.css";
import smarfLogo from "../assets/icons/smarf-logo.png";
import {
  Zap,
  Fingerprint,
  Waypoints,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant settlement",
    detail: "USDC transfers confirm in under two seconds on ARC.",
  },
  {
    icon: Fingerprint,
    title: "Non-custodial by design",
    detail: "Signing keys are generated on your device and never touch our servers.",
  },
  {
    icon: Waypoints,
    title: "Cross-chain bridging",
    detail: "Move liquidity between ARC and connected networks in one flow.",
  },
  {
    icon: ShieldCheck,
    title: "Hardware-grade encryption",
    detail: "Every session is secured end-to-end, the same standard institutions rely on.",
  },
];

export default function Login() {
  const { login } = usePrivy();

  return (
    <div className="login-page">

      <div className="login-texture" aria-hidden="true">
        <div className="login-glow login-glow1"></div>
        <div className="login-glow login-glow2"></div>
        <div className="login-glow login-glow3"></div>
      </div>

      <div className="login-aurora" aria-hidden="true"></div>

      <div className="login-vignette" aria-hidden="true"></div>

      <div className="login-card">

        <div className="login-seal">

          <svg
            className="login-seal-ring"
            viewBox="0 0 120 120"
            width="132"
            height="132"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="sealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            <circle className="seal-ring-outer" cx="60" cy="60" r="56" />
            <circle className="seal-ring-inner" cx="60" cy="60" r="46" />

            <g className="seal-ticks">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                (deg) => (
                  <line
                    key={deg}
                    x1="60"
                    y1="6"
                    x2="60"
                    y2="14"
                    transform={`rotate(${deg} 60 60)`}
                  />
                )
              )}
            </g>

            <circle className="seal-sweep" cx="60" cy="60" r="46" />
          </svg>

          <div className="login-seal-glow" aria-hidden="true"></div>

          <img
            src={smarfLogo}
            alt="SmarFPay"
            className="login-seal-mark"
          />

        </div>

        <span className="login-eyebrow">ARC Network · Private Access</span>

        <h1 className="login-wordmark">SmarFPay</h1>

        <p className="login-tagline">
          A single custody layer for USDC, built for those who move
          capital with precision.
        </p>

        <div className="login-status">
          <span className="login-status-dot"></span>
          Network online
        </div>

        <div className="login-features">

          {FEATURES.map(({ icon: Icon, title, detail }) => (

            <div className="login-feature-row" key={title}>

              <div className="login-feature-icon">
                <Icon size={17} strokeWidth={1.6} />
              </div>

              <div className="login-feature-text">
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>

            </div>

          ))}

        </div>

        <button
          className="login-btn"
          onClick={login}
        >
          <span>Connect wallet</span>
          <ArrowRight size={17} strokeWidth={2} className="login-btn-arrow" />
        </button>

        <div className="login-footer">
          <span>ARC Testnet</span>
          <span>Version 1.9</span>
        </div>

      </div>

    </div>
  );
}