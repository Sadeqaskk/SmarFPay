import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { USDC_ADDRESS, ERC20_ABI } from "../contracts/usdc";
import { addTransaction } from "../lib/transactions";
import usdcLogo from "../assets/tokens/usdc.png";
import "./Pay.css";

export default function Pay() {
  const [params] = useSearchParams();
  const recipient = params.get("address");
  const requestedAmount = params.get("amount") || "";

  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState(requestedAmount);

  const {
    writeContract,
    data: hash,
    isPending,
  } = useWriteContract();

  const { isLoading: confirming, isSuccess: confirmed } =
    useWaitForTransactionReceipt({ hash });

  function handlePay() {
    if (!recipient || !amount) return;
    writeContract(
      {
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [recipient, parseUnits(amount, 6)],
      },
      {
        onSuccess(txHash) {
          addTransaction({
            type: "Sent",
            amount,
            to: recipient,
            hash: txHash,
          });
        },
        onError(err) {
          alert(err.shortMessage || err.message);
        },
      }
    );
  }

  if (!recipient) {
    return (
      <div className="pay-shell">
        <div className="pay-card">
          <h2>Invalid payment link</h2>
          <p>This link is missing a recipient address.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pay-shell">
      <div className="pay-card">
        <img className="pay-token-logo" src={usdcLogo} alt="USDC" />
        <h1 className="pay-title">Payment Request</h1>
        <p className="pay-subtitle">
          {recipient.slice(0, 8)}...{recipient.slice(-6)} is requesting USDC
        </p>

        <div className="pay-amount-box">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
          />
          <span>USDC</span>
        </div>

        {!isConnected ? (
          <p className="pay-connect-msg">Connect your wallet in the app to pay.</p>
        ) : confirmed ? (
          <div className="pay-success">
            Payment sent ✓{" "}
            <a
              href={`https://testnet.arcscan.app/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on ArcScan
            </a>
          </div>
        ) : (
          <button
            className="pay-btn"
            onClick={handlePay}
            disabled={isPending || confirming || !amount}
          >
            {isPending || confirming ? "Processing…" : `Pay ${amount || "0"} USDC`}
          </button>
        )}
      </div>
    </div>
  );
}