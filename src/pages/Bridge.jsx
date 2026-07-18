import { useState, useEffect, useRef } from "react";
import { BridgeKit } from "@circle-fin/bridge-kit";
import { createViemAdapterFromProvider } from "@circle-fin/adapter-viem-v2";
import { useWallets } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { ChevronDown, Check } from "lucide-react";
import { addTransaction } from "../lib/transactions";
import "./Bridge.css";
import arcLogo from "../assets/chains/arc.png";
import ethereumLogo from "../assets/chains/ethereum.png";
import baseLogo from "../assets/chains/base.png";
import usdcLogo from "../assets/tokens/usdc.png";

const CHAINS = [
  { id: "Arc_Testnet", label: "Arc Testnet", color: "#4F7CFF", logo: arcLogo },
  { id: "Ethereum_Sepolia", label: "Ethereum Sepolia", color: "#627EEA", logo: ethereumLogo },
  { id: "Base_Sepolia", label: "Base Sepolia", color: "#0052FF", logo: baseLogo },
];

const kit = new BridgeKit();

function findChain(id) {
  return CHAINS.find((c) => c.id === id);
}

function ChainDropdown({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = findChain(value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="chain-panel" ref={ref}>
      <div className="chain-panel-label">{label}</div>
      <button
        type="button"
        className="chain-select-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        <img className="chain-dot" src={selected.logo} alt={selected.label} />
        <span className="chain-select-text">{selected.label}</span>
        <ChevronDown
          size={16}
          className={`chain-chevron${open ? " open" : ""}`}
        />
      </button>

      {open && (
        <div className="chain-dropdown">
          {CHAINS.map((c) => (
            <div
              key={c.id}
              className={`chain-option${c.id === value ? " selected" : ""}`}
              onClick={() => {
                onChange(c.id);
                setOpen(false);
              }}
            >
              <img className="chain-dot" src={c.logo} alt={c.label} />
              <span className="chain-select-text">{c.label}</span>
              {c.id === value && <Check size={15} className="chain-check" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Bridge() {
  const { address } = useAccount();
  const { wallets } = useWallets();

  const [sourceChain, setSourceChain] = useState("Ethereum_Sepolia");
  const [destChain, setDestChain] = useState("Arc_Testnet");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("idle");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (status === "success") {
      addTransaction({
        type: "Bridge",
        amount,
        to: `${findChain(sourceChain)?.label} → ${findChain(destChain)?.label}`,
        hash: events[events.length - 1]?.values?.txHash || null,
      });
    }
  }, [status]);

  async function handleBridge() {
    if (!wallets.length) {
      alert("No wallet found. Please log in first.");
      return;
    }
    if (sourceChain === destChain) {
      alert("Source and destination must be different.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert("Enter an amount to bridge.");
      return;
    }

    setStatus("bridging");
    setEvents([]);

    try {
      const activeWallet =
        wallets.find((w) => w.address?.toLowerCase() === address?.toLowerCase()) ||
        wallets[0];
      const provider = await activeWallet.getEthereumProvider();
      const adapter = await createViemAdapterFromProvider({ provider });

      const unsubscribe = kit.on("*", (payload) => {
        setEvents((prev) => [...prev, payload]);
      });

      let bridgeResult;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        attempts++;
        bridgeResult = await kit.bridge({
          from: { adapter, chain: sourceChain },
          to: { adapter, chain: destChain },
          amount,
        });

        if (bridgeResult.state !== "error") break;

        console.warn(`Bridge attempt ${attempts} failed, retrying...`, bridgeResult);
        if (attempts < maxAttempts) {
          await new Promise((r) => setTimeout(r, 1500));
        }
      }

      unsubscribe?.();

      if (bridgeResult.state === "error") {
        console.error("Bridge error detail after retries:", bridgeResult);
      }
      setStatus(bridgeResult.state === "error" ? "error" : "success");
    } catch (err) {
      console.error("Bridge threw:", err);
      setStatus("error");
    }
  }

  return (
    <div className="bridge-shell">
      <div className="bridge-card-wrap">
        <div className="bridge-card">
          <div className="bridge-header">
            <h1 className="bridge-title">Bridge</h1>
            <div className="cctp-chip">Circle CCTP</div>
          </div>
          <p className="bridge-subtitle">
            Move USDC between Arc Testnet and other chains.
          </p>

          <div className="chain-stack">
            <ChainDropdown label="From" value={sourceChain} onChange={setSourceChain} />

            <div className="chain-connector">
              <div className={`chain-connector-btn${status === "bridging" ? " pulsing" : ""}`}>
                ↓
              </div>
            </div>

            <ChainDropdown label="To" value={destChain} onChange={setDestChain} />
          </div>

          <div className="amount-panel">
            <div className="amount-panel-label">Amount</div>
            <div className="amount-panel-row">
              <input
                className="bridge-amount-input"
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="usdc-tag">
                <img className="usdc-tag-logo" src={usdcLogo} alt="USDC" />
                USDC
              </div>
            </div>
          </div>

          <button
            className="bridge-cta"
            onClick={handleBridge}
            disabled={status === "bridging"}
          >
            {status === "bridging" ? "Bridging…" : "Bridge USDC"}
          </button>

          {events.length > 0 && (
            <div className="progress-panel">
              <div className="progress-panel-title">Progress</div>
              {events.map((e, i) => (
                <div className="progress-step" key={i}>
                  <span className="progress-step-dot" />
                  <span>
                    {e?.values?.name || e?.method || "step"}
                    {e?.values?.state ? `: ${e.values.state}` : ""}
                    {e?.values?.explorerUrl && (
                      <a href={e.values.explorerUrl} target="_blank" rel="noopener noreferrer">
                        view
                      </a>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          {status === "success" && (
            <div className="bridge-success">
              Bridge complete — check your wallet on {findChain(destChain)?.label}.
            </div>
          )}

          {status === "error" && (
            <div className="bridge-error">
              Something went wrong. Check the progress log above or try again.
            </div>
          )}

          <div className="bridge-note">
            <span>ⓘ</span>
            <span>
              Bridging from Ethereum or Base Sepolia requires that chain's own
              gas token in your wallet, in addition to USDC.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}