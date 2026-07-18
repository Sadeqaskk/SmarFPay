import { useState } from "react";
import { useAccount } from "wagmi";

export default function Request() {
  const { address } = useAccount();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");

  function generateRequest() {
    if (!amount) return;

    const url =
      `${window.location.origin}/pay?` +
      `address=${address}` +
      `&amount=${amount}` +
      `&note=${encodeURIComponent(note)}`;

    setLink(url);
  }

  return (
    <div className="swap-page">
      <div className="swap-card">

        <h2>Request USDC</h2>

        <input
          type="number"
          placeholder="Amount (USDC)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <br /><br />

        <button
          className="swap-button"
          onClick={generateRequest}
        >
          Generate Request
        </button>

        {link && (
          <>
            <br /><br />

            <h4>Payment Link</h4>

            <textarea
              readOnly
              value={link}
              rows={4}
              style={{
                width: "100%"
              }}
            />
          </>
        )}

      </div>
    </div>
  );
}