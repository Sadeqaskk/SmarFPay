import "./Support.css";

import {
  LifeBuoy,
  UserRound,
  Building2,
  MessageCircle,
  BookOpen,
  Rocket,
  ArrowUpRight,
} from "lucide-react";

export default function Support() {
  return (
    <div className="support-page">

      <div className="support-header">

        <LifeBuoy size={34} />

        <h1>Support Center</h1>

        <p>
          Need help with SmarFArcPay?
          We're here to help.
        </p>

      </div>

      {/* Founder */}

      <div
        className="support-card clickable"
        onClick={() =>
          window.open(
            "https://x.com/0xsadik0",
            "_blank"
          )
        }
      >

        <div className="support-icon">
          <UserRound size={24} />
        </div>

        <div className="support-content">

          <h2>Founder</h2>

          <p>Sadik Sani Namadi</p>

          <small>Founder & Lead Developer</small>

        </div>

        <ArrowUpRight size={20} />

      </div>

      {/* Official Project */}

      <div
        className="support-card clickable"
        onClick={() =>
          window.open(
            "https://x.com/SmarFArcPay",
            "_blank"
          )
        }
      >

        <div className="support-icon">
          <Building2 size={24} />
        </div>

        <div className="support-content">

          <h2>SmarFArcPay</h2>

          <p>Official Project</p>

          <small>Follow latest updates</small>

        </div>

        <ArrowUpRight size={20} />

      </div>

      {/* Community */}

      <div className="support-card disabled">

        <div className="support-icon">
          <MessageCircle size={24} />
        </div>

        <div className="support-content">

          <h2>Community</h2>

          <p>Telegram & Discord</p>

          <small>Coming Soon</small>

        </div>

        <Rocket size={20} />

      </div>

      {/* Documentation */}

      <div className="support-card disabled">

        <div className="support-icon">
          <BookOpen size={24} />
        </div>

        <div className="support-content">

          <h2>Documentation</h2>

          <p>Developer Docs</p>

          <small>Coming Soon</small>

        </div>

        <Rocket size={20} />

      </div>

      <div className="support-footer">

        <h3>SmarFArcPay v1.5</h3>

        <p>Powered by ARC Network</p>

      </div>

    </div>
  );
}