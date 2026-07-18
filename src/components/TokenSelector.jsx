import "./TokenSelector.css";

import { TOKENS } from "../lib/tokens";

export default function TokenSelector({ token, onClick }) {
  const selected = TOKENS[token];

  return (
    <button className="token-selector" onClick={onClick}>
      <img
        src={selected.logo}
        alt={selected.symbol}
        className="token-logo"
      />

      <span>{selected.symbol}</span>

      <span className="token-arrow">▼</span>
    </button>
  );
}