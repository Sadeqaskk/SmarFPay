import "./Settings.css";

import {
  Settings2,
  Bell,
  Palette,
  ShieldCheck,
  Globe,
  Moon,
  ChevronRight,
  Info,
  Wallet,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="settings-page">

      <div className="settings-header">

        <Settings2 size={34} />

        <h1>Settings</h1>

        <p>
          Personalize your SmarFArcPay experience.
        </p>

      </div>

      {/* Preferences */}

      <div className="settings-card">

        <h2>Preferences</h2>

        <button className="setting-row">
          <div className="setting-left">
            <Palette size={20}/>
            <span>Appearance</span>
          </div>
          <ChevronRight size={18}/>
        </button>

        <button className="setting-row">
          <div className="setting-left">
            <Moon size={20}/>
            <span>Theme</span>
          </div>
          <ChevronRight size={18}/>
        </button>

        <button className="setting-row">
          <div className="setting-left">
            <Globe size={20}/>
            <span>Language</span>
          </div>
          <ChevronRight size={18}/>
        </button>

      </div>

      {/* Notifications */}

      <div className="settings-card">

        <h2>Notifications</h2>

        <button className="setting-row">
          <div className="setting-left">
            <Bell size={20}/>
            <span>Push Notifications</span>
          </div>

          <span className="coming-label">
            Soon
          </span>

        </button>

      </div>

      {/* Security */}

      <div className="settings-card">

        <h2>Security</h2>

        <button className="setting-row">
          <div className="setting-left">
            <ShieldCheck size={20}/>
            <span>Privacy</span>
          </div>

          <ChevronRight size={18}/>

        </button>

        <button className="setting-row">
          <div className="setting-left">
            <Wallet size={20}/>
            <span>Wallet Settings</span>
          </div>

          <ChevronRight size={18}/>

        </button>

      </div>

      {/* About */}

      <div className="settings-card">

        <h2>About</h2>

        <button className="setting-row">
          <div className="setting-left">
            <Info size={20}/>
            <span>Version</span>
          </div>

          <small>v1.5</small>

        </button>

      </div>

    </div>
  );
}