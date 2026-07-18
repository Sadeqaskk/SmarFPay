import "./TokenModal.css";

export default function TokenModal({
  open,
  onClose,
  tokens,
  onSelect,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="token-modal">

        <div className="modal-header">

          <h3>Select Token</h3>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <input
          className="search-input"
          placeholder="Search token..."
        />

        <div className="token-list">

          {tokens.map((token) => (

            <button
              key={token.symbol}
              className="token-item"
              onClick={() => onSelect(token.symbol)}
            >

              <div className="token-info">

                <img
                  src={token.logo}
                  alt={token.symbol}
                />

                <div>

                  <div className="symbol">
                    {token.symbol}
                  </div>

                  <div className="name">
                    {token.name}
                  </div>

                </div>

              </div>

              <span className="balance">
                --
              </span>

            </button>

          ))}

        </div>

      </div>

    </div>
  );
}