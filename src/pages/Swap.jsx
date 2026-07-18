import { useState, useEffect, useRef } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { createWalletClient, custom } from "viem";
import { ChevronDown, Check } from "lucide-react";
import { useWallets } from "@privy-io/react-auth";
import { ARC_TOKENS, ROUTER_ADDRESS } from "../lib/chains";
import { ROUTER_ABI, ERC20_ABI } from "../lib/abis";
import { arcTestnet } from "../wagmi";
import "./Swap.css";
import usdcLogo from "../assets/tokens/usdc.png";
import eurcLogo from "../assets/tokens/eurc.png";
import cirBTC from "../assets/tokens/cirBTC_Icon.png";


const TOKEN_LOGOS = {
  USDC: usdcLogo,
  EURC: eurcLogo,
  cirBTC: cirBTC,
};

const TOKEN_LIST = [ARC_TOKENS.USDC, ARC_TOKENS.EURC, ARC_TOKENS.cirBTC];

function TokenDropdown({ value, onChange, exclude }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const options = TOKEN_LIST.filter((t) => t.symbol !== exclude);


async function getWalletClient() {
  await activeWallet.switchChain(arcTestnet.id);

  const provider = await activeWallet.getEthereumProvider({
    chainId: arcTestnet.id,
  });

  return createWalletClient({
    chain: arcTestnet,
    transport: custom(provider),
  });
}

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
    <div className="token-pill-wrap" ref={ref}>
      <button
        type="button"
        className="token-pill"
        onClick={() => setOpen((o) => !o)}
      >
        <img className="token-avatar-img" src={TOKEN_LOGOS[value.symbol]} alt={value.symbol} />
        <span>{value.symbol}</span>
        <ChevronDown size={14} className={`token-chevron${open ? " open" : ""}`} />
      </button>

      {open && (
        <div className="token-dropdown">
          {options.map((t) => (
            <div
              key={t.symbol}
              className="token-option"
              onClick={() => {
                onChange(t);
                setOpen(false);
              }}
            >
              <img className="token-avatar-img" src={TOKEN_LOGOS[t.symbol]} alt={t.symbol} />
              <span>{t.symbol}</span>
              {t.symbol === value.symbol && <Check size={14} className="token-check" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Swap() {
  const { address: wagmiAddress } = useAccount();
  const { wallets } = useWallets();

  const activeWallet =
    wallets.find(
      (w) => w.address?.toLowerCase() === wagmiAddress?.toLowerCase()
    ) || wallets[0];

  const address = wagmiAddress || activeWallet?.address;
  const isConnected = !!address;

  const [tokenIn, setTokenIn] = useState(TOKEN_LIST[0]);
  const [tokenOut, setTokenOut] = useState(TOKEN_LIST[1]);
  const [amountIn, setAmountIn] = useState("");
  const [flipped, setFlipped] = useState(false);

  const amountInParsed =
    amountIn && !isNaN(Number(amountIn))
      ? parseUnits(amountIn, tokenIn.decimals)
      : 0n;

  const { data: quoteData, isLoading: quoteLoading } = useReadContract({
    address: ROUTER_ADDRESS,
    abi: ROUTER_ABI,
    functionName: "getQuote",
    args: [tokenIn.address, tokenOut.address, amountInParsed],
    query: { enabled: amountInParsed > 0n },
  });

  const amountOut = quoteData ? quoteData : 0n;

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenIn.address,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, ROUTER_ADDRESS] : undefined,
    query: { enabled: !!address },
  });

  const needsApproval = allowance !== undefined && allowance < amountInParsed;

  const [approveHash, setApproveHash] = useState(undefined);
  const [approvePending, setApprovePending] = useState(false);

  const [swapHash, setSwapHash] = useState(undefined);
  const [swapPending, setSwapPending] = useState(false);

  const { isLoading: approveConfirming, isSuccess: approveConfirmed } =
    useWaitForTransactionReceipt({ hash: approveHash });

  const { isLoading: swapConfirming, isSuccess: swapConfirmed } =
    useWaitForTransactionReceipt({ hash: swapHash });

  useEffect(() => {
    if (approveConfirmed) refetchAllowance();
  }, [approveConfirmed, refetchAllowance]);

  async function getWalletClient() {
    await activeWallet.switchChain(arcTestnet.id);

    const provider = await activeWallet.getEthereumProvider({
      chainId: arcTestnet.id,
    });

    return createWalletClient({
      chain: arcTestnet,
      transport: custom(provider),
    });
  }

  async function handleApprove() {
    if (!activeWallet) {
      alert("No wallet found. Please log in first.");
      return;
    }

    try {
      setApprovePending(true);

      const walletClient = await getWalletClient();
      const [account] = await walletClient.getAddresses();

      const hash = await walletClient.writeContract({
        account,
        address: tokenIn.address,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [ROUTER_ADDRESS, amountInParsed],
      });

      setApproveHash(hash);
    } catch (err) {
      console.error("Approve failed:", err);
      alert(err.shortMessage || err.message);
    } finally {
      setApprovePending(false);
    }
  }

  async function handleSwap() {
    if (!activeWallet) {
      alert("No wallet found. Please log in first.");
      return;
    }

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 10);
    const slippageBps = 50n;
    const amountOutMin = amountOut - (amountOut * slippageBps) / 10000n;

    try {
      setSwapPending(true);

      const walletClient = await getWalletClient();
      const [account] = await walletClient.getAddresses();

      const hash = await walletClient.writeContract({
        account,
        address: ROUTER_ADDRESS,
        abi: ROUTER_ABI,
        functionName: "swap",
        args: [
          tokenIn.address,
          tokenOut.address,
          amountInParsed,
          amountOutMin,
          deadline,
        ],
      });

      setSwapHash(hash);
    } catch (err) {
      console.error("Swap failed:", err);
      alert(err.shortMessage || err.message);
    } finally {
      setSwapPending(false);
    }
  }

  function flipTokens() {
    setFlipped((f) => !f);
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn("");
  }

  const rate =
    amountOut > 0n && amountInParsed > 0n
      ? Number(formatUnits(amountOut, tokenOut.decimals)) /
        Number(formatUnits(amountInParsed, tokenIn.decimals))
      : null;

  return (
    <div className="swap-shell">
      <div className="swap-card-wrap">
        <div className="swap-card">
          <div className="swap-header">
            <h1 className="swap-title">Swap</h1>
            <div className="network-chip">
              <span className="pulse-dot" />
              Arc Testnet
            </div>
          </div>

          <div className="token-panel">
            <div className="token-panel-label">
              <span>You pay</span>
            </div>
            <div className="token-row">
              <input
                className="amount-input"
                type="number"
                placeholder="0.0"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
              />
              <TokenDropdown value={tokenIn} onChange={setTokenIn} exclude={tokenOut.symbol} />
            </div>
          </div>

          <div className="flip-row">
            <button
              className={`flip-btn${flipped ? " flipped" : ""}`}
              onClick={flipTokens}
              aria-label="Flip tokens"
            >
              ↓
            </button>
          </div>

          <div className="token-panel">
            <div className="token-panel-label">
              <span>You receive</span>
            </div>
            <div className="token-row">
              <input
                className="amount-input"
                type="text"
                readOnly
                placeholder="0.0"
                value={amountOut > 0n ? formatUnits(amountOut, tokenOut.decimals) : ""}
              />
              <TokenDropdown value={tokenOut} onChange={setTokenOut} exclude={tokenIn.symbol} />
            </div>
          </div>

          <div className="rate-row">
            <span className={quoteLoading ? "loading-dots" : ""}>
              {quoteLoading
                ? "Fetching rate"
                : rate
                ? `1 ${tokenIn.symbol} ≈ ${rate.toFixed(4)} ${tokenOut.symbol}`
                : "Enter an amount"}
            </span>
            <span>0.5% slippage</span>
          </div>

          {!isConnected ? (
            <p className="swap-connect-msg">Connecting your wallet…</p>
          ) : needsApproval ? (
            <button
              className="swap-cta"
              disabled={approvePending || approveConfirming || amountInParsed === 0n}
              onClick={handleApprove}
            >
              {approvePending || approveConfirming
                ? "Approving…"
                : `Approve ${tokenIn.symbol}`}
            </button>
          ) : (
            <button
              className="swap-cta"
              disabled={swapPending || swapConfirming || amountInParsed === 0n}
              onClick={handleSwap}
            >
              {swapPending || swapConfirming ? "Swapping…" : "Swap"}
            </button>
          )}

          {swapConfirmed && (
            <div className="swap-success">
              <span>Swap confirmed</span>
              <button
                className="swap-success-link"
                onClick={() =>
                  window.open(`https://testnet.arcscan.app/tx/${swapHash}`, "_blank")
                }
              >
                View on ArcScan →
              </button>
            </div>
          )}

          <div className="swap-note">
            <span>ⓘ</span>
            <span>
              Quotes are read live from Presto's Hub AMM on Arc Testnet.
              Prices may shift slightly between quote and confirmation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}