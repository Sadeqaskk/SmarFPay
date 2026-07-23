import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";

import usdcLogo from "../assets/tokens/usdc.png";
import eurcLogo from "../assets/tokens/eurc.png";
import cirBTC from "../assets/tokens/cirBTC_Icon.png";


import "./Send.css";

import { createWalletClient, custom } from "viem";
import { arcTestnet } from "../wagmi";

import { useWallets } from "@privy-io/react-auth";

import { parseUnits, isAddress } from "viem";
import { ERC20_ABI } from "../contracts/usdc";
import { ARC_TOKENS } from "../lib/chains";
import { addTransaction } from "../lib/transactions";

import {
  Wallet,
  ClipboardPaste,
  ArrowUpRight,
  Loader2,
  Copy,
  ExternalLink,
} from "lucide-react";

const TOKEN_LIST = [ARC_TOKENS.USDC, ARC_TOKENS.EURC, ARC_TOKENS.cirBTC];

const TOKEN_LOGOS = {
  USDC: usdcLogo,
  EURC: eurcLogo,
  cirBTC: cirBTC,
};

export default function Send() {

  const { address: externalAddress } = useAccount();

  const { wallets } = useWallets();

  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  const address =
    externalAddress ||
    embeddedWallet?.address;

  const [token, setToken] = useState(TOKEN_LIST[0]);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const [txHash, setTxHash] = useState("");
  const [success, setSuccess] = useState(false);


  async function sendWithEmbeddedWallet() {
    if (!embeddedWallet) {
      console.log("No embedded wallet found");
      return;
    }

    console.log("All wallets:", wallets);
    console.log("Embedded wallet:", embeddedWallet);

    // First switch the embedded wallet to Arc Testnet
    await embeddedWallet.switchChain(arcTestnet.id);

    // Then get a provider connected to Arc Testnet
    const provider = await embeddedWallet.getEthereumProvider({
      chainId: arcTestnet.id,
    });

    console.log("Provider:", provider);

    const walletClient = createWalletClient({
      chain: arcTestnet,
      transport: custom(provider),
    });

    const [account] = await walletClient.getAddresses();
    console.log("Account:", account);

    const hash = await walletClient.writeContract({
      account,
      address: token.address,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [
        recipient,
        parseUnits(amount, token.decimals),
      ],
    });

    console.log("Transaction Hash:", hash);

    addTransaction({
      type: "Sent",
      amount: Number(amount),
      token: token.symbol,
      to: recipient,
      hash,
    });

    setTxHash(hash);
    setSuccess(true);
  }

  const {
    writeContract,
    isPending,
    error,
  } = useWriteContract();

  useWatchContractEvent({
    address: token.address,
    abi: ERC20_ABI,
    eventName: "Transfer",

    onLogs(logs) {
      logs.forEach((log) => {
        const { from, to, value } = log.args;

        if (!address || !from || !to) return;

        if (
          from.toLowerCase() === address.toLowerCase() ||
          to.toLowerCase() === address.toLowerCase()
        ) {
          addTransaction({
            type:
              from.toLowerCase() === address.toLowerCase()
                ? "Sent"
                : "Received",
            amount: Number(value) / 10 ** token.decimals,
            token: token.symbol,
            to: from.toLowerCase() === address.toLowerCase() ? to : from,
            hash: log.transactionHash,
          });
        }
      });
    },
  });

  async function pasteRecipient() {
    try {
      const text = await navigator.clipboard.readText();
      setRecipient(text);
    } catch (err) {
      console.error(err);
    }
  }

  function copyHash() {
    navigator.clipboard.writeText(txHash);
  }

  return (
    <div className="send-page">

      <div className="send-glow send-glow-a" aria-hidden="true"></div>
      <div className="send-glow send-glow-b" aria-hidden="true"></div>

      <header className="send-masthead">

        <span className="send-eyebrow">
          <span className="send-eyebrow-dot"></span>
          Arc Testnet &middot; Live Transfer
        </span>

        <h1 className="send-title">Send {token.symbol}</h1>

        <p className="send-subtitle">
          Transfer {token.symbol} securely across the ARC ecosystem.
        </p>

      </header>

      <div className="send-panel">

        <div className="send-panel-sheen" aria-hidden="true"></div>

        <div className="send-field">

          <label className="send-label">Asset</label>

          <div className="token-rail">

            {TOKEN_LIST.map((t) => (
              <button
                type="button"
                key={t.symbol}
                className={`token-medallion ${
                  token.symbol === t.symbol ? "is-active" : ""
                }`}
                onClick={() => setToken(t)}
              >
                {TOKEN_LOGOS[t.symbol] ? (
                  <img
                    src={TOKEN_LOGOS[t.symbol]}
                    alt={t.symbol}
                    className="token-logo-img"
                  />
                ) : (
                  <span className="token-monogram">
                    {t.symbol.slice(0, 1)}
                  </span>
                )}
                <span className="token-name">{t.symbol}</span>
              </button>
            ))}

          </div>

        </div>

        <div className="send-field">

          <label className="send-label">Recipient</label>

          <div className="send-input-row">

            <Wallet className="send-input-icon" size={17} strokeWidth={1.6} />

            <input
              type="text"
              placeholder="Recipient wallet address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="send-input"
            />

            <button
              type="button"
              className="send-ghost-btn"
              onClick={pasteRecipient}
            >
              <ClipboardPaste size={15} strokeWidth={1.8} />
              Paste
            </button>

          </div>

        </div>

        <div className="send-field">

          <label className="send-label">Amount</label>

          <div className="send-input-row amount-row">

            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="send-input"
            />

            <span className="amount-suffix">{token.symbol}</span>

            <button
              type="button"
              className="send-ghost-btn"
              onClick={() => {
                // later we'll connect this to wallet balance
                alert("MAX balance coming soon.");
              }}
            >
              Max
            </button>

          </div>

        </div>

        <button
          className={`send-cta ${isPending ? "is-loading" : ""}`}
          disabled={isPending}
          onClick={() => {

            if (!address) {
              alert("Connect your wallet first.");
              return;
            }

            if (!isAddress(recipient)) {
              alert("Invalid recipient address.");
              return;
            }

            if (recipient.toLowerCase() === address.toLowerCase()) {
              alert(`You can't send ${token.symbol} to yourself.`);
              return;
            }

            if (!amount || Number(amount) <= 0) {
              alert("Enter a valid amount.");
              return;
            }

            if (externalAddress) {

              writeContract(
                {
                  address: token.address,
                  abi: ERC20_ABI,
                  functionName: "transfer",
                  args: [
                    recipient,
                    parseUnits(amount, token.decimals),
                  ],
                },
                {
                  onSuccess(hash) {
                    addTransaction({
                      type: "Sent",
                      amount: Number(amount),
                      token: token.symbol,
                      to: recipient,
                      hash,
                    });
                    setTxHash(hash);
                    setSuccess(true);
                  },
                  onError(error) {
                    alert(error.shortMessage || error.message);
                  },
                }
              );

            } else if (embeddedWallet) {

              sendWithEmbeddedWallet();

            } else {

              alert("Connect a wallet first.");

            }

          }}
        >

          {isPending ? (
            <>
              <Loader2 className="send-spinner" size={18} strokeWidth={2} />
              Confirming
            </>
          ) : (
            <>
              Send {token.symbol}
              <ArrowUpRight size={18} strokeWidth={2} />
            </>
          )}

        </button>

      </div>

      {success && (
        <div className="send-receipt">

          <div className="receipt-seal">
            <svg viewBox="0 0 120 120" className="receipt-seal-svg">
              <circle
                className="seal-ring-outer"
                cx="60" cy="60" r="52"
                fill="none"
              />
              <circle
                className="seal-ring-inner"
                cx="60" cy="60" r="40"
                fill="none"
              />
              <path
                className="seal-check"
                d="M40 62 L54 76 L82 46"
                fill="none"
              />
            </svg>
          </div>

          <h2 className="receipt-title">Transfer Submitted</h2>

          <p className="receipt-subtitle">
            Your {token.symbol} transfer is now settling on Arc Testnet.
          </p>

          <div className="receipt-divider"></div>

          <dl className="receipt-rows">

            <div className="receipt-row">
              <dt>Asset</dt>
              <dd>{token.symbol}</dd>
            </div>

            <div className="receipt-row">
              <dt>Amount</dt>
              <dd>{amount} {token.symbol}</dd>
            </div>

            <div className="receipt-row">
              <dt>Recipient</dt>
              <dd className="mono">
                {recipient.slice(0, 8)}...{recipient.slice(-6)}
              </dd>
            </div>

            <div className="receipt-row">
              <dt>Status</dt>
              <dd className="status-pending">Pending confirmation</dd>
            </div>

          </dl>

          <div className="receipt-hash">

            <div>
              <span>Transaction hash</span>
              <p className="mono">
                {txHash.slice(0, 20)}...{txHash.slice(-18)}
              </p>
            </div>

            <button
              type="button"
              className="receipt-copy-btn"
              onClick={copyHash}
            >
              <Copy size={14} strokeWidth={1.8} />
            </button>

          </div>

          <a
          
            href={`https://testnet.arcscan.app/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="receipt-link"
          >
            View on ArcScan
            <ExternalLink size={14} strokeWidth={1.8} />
          </a>

        </div>
      )}

    </div>
  );

}