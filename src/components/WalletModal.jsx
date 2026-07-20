import "./WalletModal.css";
import { useEffect } from "react";
import { useConnect } from "wagmi";
import {
  useLogin,
  usePrivy,
} from "@privy-io/react-auth";


export default function WalletModal({ open, onClose }) {
 
  const { connect, connectors } = useConnect();

  const { login } = useLogin({

    onComplete: ({ user, loginMethod }) => {
  console.log("Logged in!", user);
  console.dir(user);
  
  console.log("Login method:", loginMethod);

  console.log("User:", user);
  console.log("Linked accounts:", user?.linkedAccounts);
  console.log("Wallet:", user?.wallet);
  console.log("Embedded wallets:", user?.linkedAccounts?.filter(
    account => account.type === "wallet"
  ));

  onClose();
},

  onError: (error) => {
    console.error(error);
  },
});

const {
  authenticated,
  user,
  logout,
} = usePrivy();



useEffect(() => {
  if (!authenticated || !user) return;

  console.log("========== PRIVY USER ==========");
  console.dir(user);

  console.log("Wallet:", user.wallet);
  console.log("Linked Accounts:", user.linkedAccounts);

  user.linkedAccounts?.forEach((account, index) => {
    console.log(`Account ${index}:`, account);
  });
}, [authenticated, user]);



console.log("Connectors:", connectors);

console.log("window.ethereum:", window.ethereum);

  useEffect(() => {
    console.log("window.ethereum:", window.ethereum);
    console.log("isMetaMask:", window.ethereum?.isMetaMask);
    console.log("isRabby:", window.ethereum?.isRabby);
    console.log("Connectors:", connectors);
  }, [connectors]);

  if (!open) return null;


 
  return (
    <>
      <div className="wallet-overlay" onClick={onClose}></div>

      <div className="wallet-modal">

        <div className="wallet-modal-header">

          <h2>Connect Wallet</h2>

          <button
            className="wallet-close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <p className="wallet-subtitle">
         Sign in with Email, Google, or connect your existing wallet.
        </p>

{!authenticated ? (

  <div className="login-section">

    <button
      className="login-button email-login"
      onClick={() =>
        login({
          loginMethods: ["email"],
        })
      }
    >
      📧
      <div>
        <h3>Continue with Email</h3>
        <p>Create your Smart Wallet</p>
      </div>
    </button>

    <button
      className="login-button google-login"
      onClick={() =>
        login({
          loginMethods: ["google"],
        })
      }
    >
      🔵
      <div>
        <h3>Continue with Google</h3>
        <p>Fast & Secure Sign In</p>
      </div>
    </button>

  </div>

) : (

  <div className="profile-preview">

    <img
      src={user?.google?.picture || "https://ui-avatars.com/api/?name=User"}
      alt="Profile"
      className="profile-avatar"
    />

    <h3>
      {user?.google?.name ||
        user?.email?.address ||
        "SmarFPay User"}
    </h3>

    <p>{user?.email?.address}</p>

    <span className="connected-badge">
      🟢 Connected
    </span>

    <button
      className="logout-btn"
      onClick={logout}
    >
      Logout
    </button>

  </div>

)}

<div className="wallet-divider">
  <span>OR CONNECT EXISTING WALLET</span>
</div>

       <div className="wallet-list">

  <button
    className="wallet-option"
    onClick={() => {
      console.log("Clicked");
      console.log(connectors);

      if (!connectors.length) {
        console.log("No connectors found");
        return;
      }

      connect(
        { connector: connectors[0] },
        {
          onSuccess() {
            console.log("Connected!");
            onClose();
          },
          onError(error) {
            console.error("Connection error:", error);
          },
        }
      );
    }}
  >
    🦊
    <div>
      <h3>Rabby / Browser Wallet</h3>
      <p>Injected Wallet</p>
    </div>
  </button>

  <button className="wallet-option">
    🔵
    <div>
      <h3>Coinbase Wallet</h3>
      <p>Mobile & Desktop</p>
    </div>
  </button>

          <button
  className="wallet-option"
  onClick={() => {
  if (connectors[1]) {
    connect({ connector: connectors[1] });
    onClose();
  }
}}
>
  📱
  <div>
    <h3>WalletConnect</h3>
    <p>Scan QR Code</p>
  </div>
</button>

        </div>

      </div>
    </>
  );
}