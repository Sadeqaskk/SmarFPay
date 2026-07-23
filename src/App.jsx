import { useState, useEffect } from "react";
import "./App.css";
import WalletModal from "./components/WalletModal";
import {
  useAccount,
  useBalance,
  useChainId,
  useSwitchChain,
} from "wagmi";
import Dashboard from "./pages/Dashboard";
import Receive from "./pages/Receive";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transactions";
import { usePrivy } from "@privy-io/react-auth";
import Login from "./pages/Login";
import RequestMoney from "./pages/RequestMoney";
import Bridge from "./pages/Bridge";
import ActivityFeed from "./components/ActivityFeed";
import { ARC_TOKENS } from "./lib/chains";
import { Routes, Route } from "react-router-dom";
import Pay from "./pages/Pay";


import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Send from "./pages/Send";
import Swap from "./pages/Swap";


import { useWatchContractEvent } from "wagmi";
import { USDC_ADDRESS, ERC20_ABI } from "./contracts/usdc";
import { getTransactions, addTransaction, TX_UPDATED_EVENT } from "./lib/transactions";
import TransactionModal from "./components/TransactionModal";


export default function App() {
  
  console.log("App started");

  
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);


const {
  user,
  ready,
  authenticated,
} = usePrivy();

const { address, isConnected } = useAccount();
const chainId = useChainId();


// Embedded Privy wallet
const embeddedWallet = user?.linkedAccounts?.find(
  (account) => account.type === "wallet"
);

const embeddedAddress = embeddedWallet?.address;

// Final wallet address
const walletAddress = isConnected ? address : embeddedAddress;

// Is a wallet available?
const walletConnected = !!walletAddress;

console.log("External Wallet:", address);
console.log("Embedded Wallet:", embeddedAddress);
console.log("Final Wallet:", walletAddress);
console.log("Connected:", walletConnected);



const [selectedTx, setSelectedTx] = useState(null);

const [search, setSearch] = useState("");
const [filter, setFilter] = useState("All");




useEffect(() => {
  const loadTransactions = () => {
    setTransactions(getTransactions());
  };

  loadTransactions();
  window.addEventListener(TX_UPDATED_EVENT, loadTransactions);
  return () => window.removeEventListener(TX_UPDATED_EVENT, loadTransactions);
}, []);

useWatchContractEvent({
  address: USDC_ADDRESS,
  abi: ERC20_ABI,
  eventName: "Transfer",
  pollingInterval: 15000,
  enabled: page !== "bridge",
  onLogs(logs) {
    logs.forEach((log) => {
      const { from, to, value } = log.args;
      if (
        walletAddress &&
        (from?.toLowerCase() === walletAddress.toLowerCase() ||
          to?.toLowerCase() === walletAddress.toLowerCase())
      ) {
        addTransaction({
          type: from.toLowerCase() === walletAddress.toLowerCase() ? "Sent" : "Received",
          amount: Number(value) / 1_000_000,
          to: from.toLowerCase() === walletAddress.toLowerCase() ? to : from,
          hash: log.transactionHash,
        });
      }
    });
  },
});




// Pause background balance polling while the user is on the Bridge page,
// so our own requests don't compete with the bridge kit's RPC calls
// (rpc.testnet.arc.network) at the exact moment a bridge is in flight.
const pollingPaused = page === "bridge";

// USDC (native-ish balance query — no token address, matches existing behavior)
const { 

  data: balance, 

  isLoading: balanceLoading, 

  refetch, 

} = useBalance({ 

  address: walletAddress, 

  query: { 

    refetchInterval: pollingPaused ? false : 20000, 

  }, 

});

// EURC — ERC-20 balance on Arc Testnet
const {
  data: eurcBalance,
  isLoading: eurcLoading,
  refetch: refetchEurc,
} = useBalance({
  address: walletAddress,
  token: ARC_TOKENS.EURC.address,
  query: {
    refetchInterval: pollingPaused ? false : 26000,
    enabled: !!walletAddress,
  },
});

// cirBTC — ERC-20 balance on Arc Testnet
const {
  data: cirBTCBalance,
  isLoading: cirBTCLoading,
  refetch: refetchCirBTC,
} = useBalance({
  address: walletAddress,
  token: ARC_TOKENS.cirBTC.address,
  query: {
    refetchInterval: pollingPaused ? false : 32000,
    enabled: !!walletAddress,
  },
});


const isCorrectNetwork = chainId === 5042002;

console.log("Current Chain ID:", chainId);
console.log("Correct Network:", isCorrectNetwork);

const { switchChain } = useSwitchChain();

const [lastUpdated, setLastUpdated] = useState("Just now");

useEffect(() => {
  if (balance) {
    setLastUpdated(new Date().toLocaleTimeString());
  }
}, [balance]);

const shortAddress = walletAddress
  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
  : "Not Connected";

const copyAddress = async () => {
  if (!walletAddress) return;

  try {
    await navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied!");
  } catch (err) {
    console.error(err);
  }
};

  const renderPage = () => {
  switch (page) {

    case "send":
      return <Send />;

    case "receive":
      return <Receive />;

    case "swap":
      return <Swap />;

case "profile":
  return <Profile />;

  case "transactions":
      return (
        <Transactions
          transactions={transactions}
          onSelectTx={setSelectedTx}
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
      );

case "bridge":
  return <Bridge />;

    case "request":
      return <RequestMoney />;

case "portfolio":
  return <Portfolio />;

   case "settings":
  return <Settings />;


   case "support":
  return <Support />;

     
      default:
  return (
    <Dashboard
  balance={balance}
  balanceLoading={balanceLoading}
  eurcBalance={eurcBalance}
  eurcLoading={eurcLoading}
  cirBTCBalance={cirBTCBalance}
  cirBTCLoading={cirBTCLoading}
  walletAddress={walletAddress}
  shortAddress={shortAddress}
  copyAddress={copyAddress}
  transactions={transactions}
  lastUpdated={lastUpdated}
  setPage={setPage}
  onSelectTx={setSelectedTx}
/>
  );
    }
  };

  if (!ready) {
    return null;
  }

  return (
    <Routes>
      <Route path="/pay" element={<Pay />} />
      <Route
        path="*"
        element={
          <div className="app">
            <Navbar
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              setWalletModalOpen={setWalletModalOpen}
            />
            <Sidebar
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              setPage={setPage}
            />
            <main className="main-content">
              {renderPage()}
            </main>
            <WalletModal
              open={walletModalOpen}
              onClose={() => setWalletModalOpen(false)}
            />
            <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
          </div>
        }
      />
    </Routes>
  );
}