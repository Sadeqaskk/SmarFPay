import { useState, useEffect } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { ARC_TOKENS, ROUTER_ADDRESS } from '../lib/chains'
import { ROUTER_ABI, ERC20_ABI } from '../lib/abis'
import styles from './swapStyles'

const TOKEN_LIST = [ARC_TOKENS.USDC, ARC_TOKENS.EURC]

export default function SwapWidget() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const [tokenIn, setTokenIn] = useState(TOKEN_LIST[0])
  const [tokenOut, setTokenOut] = useState(TOKEN_LIST[1])
  const [amountIn, setAmountIn] = useState('')

  const amountInParsed =
    amountIn && !isNaN(Number(amountIn))
      ? parseUnits(amountIn, tokenIn.decimals)
      : 0n

  const { data: quoteData, isLoading: quoteLoading } = useReadContract({
    address: ROUTER_ADDRESS,
    abi: ROUTER_ABI,
    functionName: 'getAmountsOut',
    args: [amountInParsed, [tokenIn.address, tokenOut.address]],
    query: { enabled: amountInParsed > 0n },
  })

  const amountOut = quoteData ? quoteData[quoteData.length - 1] : 0n

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenIn.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, ROUTER_ADDRESS] : undefined,
    query: { enabled: !!address },
  })

  const needsApproval = allowance !== undefined && allowance < amountInParsed

  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: approvePending,
  } = useWriteContract()

  const { isLoading: approveConfirming, isSuccess: approveConfirmed } =
    useWaitForTransactionReceipt({ hash: approveHash })

  useEffect(() => {
    if (approveConfirmed) refetchAllowance()
  }, [approveConfirmed, refetchAllowance])

  function handleApprove() {
    writeApprove({
      address: tokenIn.address,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [ROUTER_ADDRESS, amountInParsed],
    })
  }

  const {
    writeContract: writeSwap,
    data: swapHash,
    isPending: swapPending,
  } = useWriteContract()

  const { isLoading: swapConfirming, isSuccess: swapConfirmed } =
    useWaitForTransactionReceipt({ hash: swapHash })

  function handleSwap() {
    if (!address) return
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 10)
    const slippageBps = 50n
    const amountOutMin = amountOut - (amountOut * slippageBps) / 10000n

    writeSwap({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'swapExactTokensForTokens',
      args: [
        amountInParsed,
        amountOutMin,
        [tokenIn.address, tokenOut.address],
        address,
        deadline,
      ],
    })
  }

  function flipTokens() {
    setTokenIn(tokenOut)
    setTokenOut(tokenIn)
    setAmountIn('')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Swap</h1>
          {isConnected ? (
            <button style={styles.walletBtn} onClick={() => disconnect()}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
          ) : (
            <button
              style={styles.walletBtn}
              onClick={() => connect({ connector: connectors[0] })}
            >
              Connect wallet
            </button>
          )}
        </div>

        <div style={styles.tokenBox}>
          <div style={styles.tokenBoxHeader}>
            <span>You pay</span>
          </div>
          <div style={styles.tokenRow}>
            <input
              style={styles.amountInput}
              type="number"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
            />
            <select
              style={styles.tokenSelect}
              value={tokenIn.symbol}
              onChange={(e) =>
                setTokenIn(TOKEN_LIST.find((t) => t.symbol === e.target.value))
              }
            >
              {TOKEN_LIST.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.flipRow}>
          <button style={styles.flipBtn} onClick={flipTokens} aria-label="Flip tokens">
            ↓
          </button>
        </div>

        <div style={styles.tokenBox}>
          <div style={styles.tokenBoxHeader}>
            <span>You receive</span>
          </div>
          <div style={styles.tokenRow}>
            <input
              style={styles.amountInput}
              type="text"
              placeholder="0.0"
              value={
                amountOut > 0n ? formatUnits(amountOut, tokenOut.decimals) : ''
              }
              readOnly
            />
            <select
              style={styles.tokenSelect}
              value={tokenOut.symbol}
              onChange={(e) =>
                setTokenOut(TOKEN_LIST.find((t) => t.symbol === e.target.value))
              }
            >
              {TOKEN_LIST.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>
          {quoteLoading && <div style={styles.hint}>Fetching quote…</div>}
        </div>

        {!isConnected ? (
          <button
            style={styles.actionBtn}
            onClick={() => connect({ connector: connectors[0] })}
          >
            Connect wallet
          </button>
        ) : needsApproval ? (
          <button
            style={styles.actionBtn}
            disabled={approvePending || approveConfirming || amountInParsed === 0n}
            onClick={handleApprove}
          >
            {approvePending || approveConfirming
              ? 'Approving…'
              : `Approve ${tokenIn.symbol}`}
          </button>
        ) : (
          <button
            style={styles.actionBtn}
            disabled={swapPending || swapConfirming || amountInParsed === 0n}
            onClick={handleSwap}
          >
            {swapPending || swapConfirming ? 'Swapping…' : 'Swap'}
          </button>
        )}

    
   {swapConfirmed && (
  <div style={styles.successMsg}>
    Swap confirmed ✓{' '}
    <a
      href={`https://testnet.arcscan.app/tx/${swapHash}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      View on ArcScan
    </a>
  </div>
)}
   

        <div style={styles.warning}>
          ROUTER_ADDRESS in lib/chains.js is a placeholder. Replace it with a
          verified router contract before this will actually work.
        </div>
      </div>
    </div>
  )
}