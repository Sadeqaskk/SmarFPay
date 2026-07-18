import { TOKENS } from "../lib/tokens";
import "./SwapCard.css";
import { getQuote } from "../lib/circle";



export default function SwapCard({
  fromToken,
  toToken,
  setFromToken,
  setToToken,
  amount,
  setAmount,
}) {
  


const [quote, setQuote] = useState(null);

const [loading, setLoading] = useState(false);



async function handleQuote() {
  try {
    setLoading(true);

    const result = await getQuote({
      fromToken,
      toToken,
      amount,
    });

    setQuote(result);

    console.log(result);

  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
}
  
  return (
    <div className="swap-card">

      <div className="swap-header">
        <h2>Swap</h2>
        <span>Trade stablecoins on Arc</span>
      </div>

      {/* FROM */}

      <div className="token-box">

        <div className="token-top">
          <span>From</span>

          <span className="balance">
            Balance: 0.00
          </span>
        </div>

        <div className="token-row">

          <select
            value={fromToken}
            onChange={(e)=>setFromToken(e.target.value)}
          >
            {Object.values(TOKENS).map(token=>(
              <option
                key={token.symbol}
                value={token.symbol}
              >
                {token.symbol}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
          />

        </div>

        <div className="usd-value">

          ≈ $0.00

        </div>

      </div>

      {/* Flip */}

      <button className="flip-btn">

        ⇅

      </button>

      {/* TO */}

      <div className="token-box">

        <div className="token-top">
          <span>To</span>

          <span className="balance">
            Balance: 0.00
          </span>
        </div>

        <div className="token-row">

          <select
            value={toToken}
            onChange={(e)=>setToToken(e.target.value)}
          >
            {Object.values(TOKENS).map(token=>(
              <option
                key={token.symbol}
                value={token.symbol}
              >
                {token.symbol}
              </option>
            ))}
          </select>

          <h2>0.00</h2>

        </div>

        <div className="usd-value">

          ≈ $0.00

        </div>

      </div>

      {/* Quote */}

      <div className="quote-box">

        <div>

          <span>Rate</span>

          <span>
  {quote ? quote.rate : "--"}
</span>

        </div>

        <div>

          <span>Price Impact</span>

          <span>--</span>

        </div>

        <div>

          <span>Network Fee</span>

          <span>--</span>

        </div>

        <div>

          <span>Route</span>

          <span>Circle</span>

        </div>

      </div>

      <button
  className="swap-button"
  onClick={handleQuote}
  disabled={loading}
>
  {loading ? "Loading Quote..." : "Get Quote"}
</button>

    </div>
  );
}