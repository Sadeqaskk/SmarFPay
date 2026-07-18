import "./Support.css";
import smarfLogo from "../assets/icons/smarf-logo.png";
import sadikProfile from "../assets/profile/sadik.png";
import supportProfile from "../assets/profile/support.png";

import {
  Bug,
  FileText,
  Sparkles,
  Users,
} from "lucide-react";

export default function Support() {

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    e.currentTarget.style.setProperty(
      "--x",
      `${e.clientX - rect.left}px`
    );

    e.currentTarget.style.setProperty(
      "--y",
      `${e.clientY - rect.top}px`
    );
  };

  return (

    <div className="support-page">

      <div className="bgGlow bgGlow1"></div>
      <div className="bgGlow bgGlow2"></div>
      <div className="bgGlow bgGlow3"></div>

      {/* Hero */}

      <div className="support-hero">

        <div className="support-icon">
  <img
    src={supportProfile}
    alt="Support"
  />
</div>

        <h1>Support Hub</h1>

        <p>
          Need help with <span>SmarFPay</span>? We're here to help.
        </p>

      </div>


<div className="support-footer">

  <div>

    <h3>SmarFPay</h3>

    <span>
      Stablecoin Wallet for the Arc Ecosystem
    </span>

  </div>

  <div className="footer-version">

    Version 0.1.0 Alpha

  </div>

</div>


      {/* Founder */}

      <div className="support-card">

       <div className="support-avatar">
  <img
    src={sadikProfile}
    alt="Sadik Sani Namadi"
  />
</div>

        <div className="support-info">

          <h2>Sadik Sani Namadi</h2>

          <p>Founder & Lead Developer</p>

          <span>
            Building the future of stablecoin payments on ARC.
          </span>

        </div>

        <a
          href="https://x.com/0xsadik0"
          target="_blank"
          rel="noopener noreferrer"
          className="visit-btn"
        >
          Visit X →
        </a>

      </div>

      {/* Project */}

      <div className="project-card">

        <div className="project-left">

          <div className="project-logo">
  <img
    src={smarfLogo}
    alt="SmarFPay"
  />
</div>

          <div>

            <div className="project-title">

              <h2>SmarFPay</h2>

              <span className="live-badge">
                ● LIVE
              </span>

            </div>

            <p className="project-desc">
              Stablecoin Wallet built for the Arc Ecosystem.
            </p>

            <span className="builder-badge">
              Powered by ARC Testnet
            </span>

          </div>

        </div>

        <div className="project-actions">

          <a
            href="https://x.com/smarfarcpay"
            target="_blank"
            rel="noopener noreferrer"
            className="follow-btn"
          >
            Follow X
          </a>

          <button className="website-btn">
            Website
            <small>Coming Soon</small>
          </button>

        </div>

      </div>

      {/* Action Grid */}

      <div className="action-grid">

        <div
  className="action-card docs"
  onMouseMove={handleMouseMove}
  onClick={() =>
    window.open("https://docs.arc.io/", "_blank")
  }
>
  <div className="actionIcon">
    <FileText size={34} />
  </div>

  <h3>Documentation</h3>

  <p>
    Read Arc documentation and developer guides.
  </p>
</div>

        <div
  className="action-card bug"
  onMouseMove={handleMouseMove}
>
  <div className="actionIcon">
    <Bug size={34} />
  </div>

  <h3>Report Bug</h3>

  <p>
    Report bugs directly to the SmarFArcPay team.
  </p>
</div>

        <div
          className="action-card feature"
          onMouseMove={handleMouseMove}
        >

          <div className="actionIcon">
            <Sparkles size={34}/>
          </div>

          <h3>Feature Request</h3>

          <p>
            Suggest new features and improvements for SmarFArcPay.
          </p>

        </div>

        <div
          className="action-card community"
          onMouseMove={handleMouseMove}
        >

          <div className="actionIcon">
            <Users size={34}/>
          </div>

          <h3>Community</h3>

          <p>
            Join ARC builders and our community.
          </p>

        </div>

      </div>

    </div>

  );

}