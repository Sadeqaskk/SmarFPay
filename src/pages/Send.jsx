import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";


import { parseUnits, isAddress } from "viem";
import { USDC_ADDRESS, ERC20_ABI } from "../contracts/usdc";


export default function Send() {
  
  
    const { address } = useAccount();

const [recipient, setRecipient] = useState("");
const [amount, setAmount] = useState("");

const [txHash, setTxHash] = useState("");
const [success, setSuccess] = useState(false);
const [transactions, setTransactions] = useState([]);

useEffect(() => {
  const saved = localStorage.getItem("smarf_transactions");

  if (saved) {
    setTransactions(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "smarf_transactions",
    JSON.stringify(transactions)
  );
}, [transactions]);

const {
  writeContract,
  isPending,
  error,
} = useWriteContract();

useWatchContractEvent({
  address: USDC_ADDRESS,
  abi: ERC20_ABI,
  eventName: "Transfer",

 onLogs(logs) {
  logs.forEach((log) => {
    const { from, to, value } = log.args;

    if (
      from?.toLowerCase() === address?.toLowerCase() ||
      to?.toLowerCase() === address?.toLowerCase()
    ) {
      const tx = {
        id: log.transactionHash,
        hash: log.transactionHash,
        type:
          from.toLowerCase() === address.toLowerCase()
            ? "Sent"
            : "Received",
        amount: Number(value) / 1_000_000,
        from,
        to,
      };

      setTransactions((prev) => [
  tx,
  ...prev,
]);
    }
  });
},
});

  return (
    <div className="page">

      <h1>Send USDC</h1>

      <p>Transfer USDC securely on ARC Testnet.</p>

      <div className="send-card">

        <label>Recipient Address</label>

       <input
  type="text"
  placeholder="0x..."
  value={recipient}
  onChange={(e) => setRecipient(e.target.value)}
/>

        <label>Amount</label>

        <input
  type="number"
  placeholder="0.00"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
/>

   <button

  className="send-button"

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

  alert("You can't send USDC to yourself.");

  return;

}



if (!amount || Number(amount) <= 0) {

  alert("Enter a valid amount.");

  return;

} 

    

    writeContract(
  {
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [
      recipient,
      parseUnits(amount || "0", 6),
    ],
  },
  {
   
   onSuccess(hash) {
      setTxHash(hash);
      setSuccess(true);

      setTransactions((prev) => [
  {
    id: Date.now(),
    type: "Sent",
    recipient,
    amount,
    status: "Pending",
    time: new Date().toLocaleString(),
  },
  ...prev,
]);


      setRecipient("");
      setAmount("");
    },

    onError(error) {
      alert(error.shortMessage || error.message);
    },
  }
);

  }}

>

  {isPending ? "Preparing..." : "Send USDC"}

</button>

{success && (
  <div className="tx-success">
    <h3>✅ Transaction Submitted</h3>
    <p>Your USDC transfer has been sent.</p>

    <small>{txHash}</small>
  </div>
)}

</div>



    </div>

  );

}