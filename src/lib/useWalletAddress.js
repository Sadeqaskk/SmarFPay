import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

export function useWalletAddress() {
  const { user } = usePrivy();
  const { address, isConnected } = useAccount();

  const embeddedWallet = user?.linkedAccounts?.find(
    (account) => account.type === "wallet"
  );
  const embeddedAddress = embeddedWallet?.address;

  const walletAddress = isConnected ? address : embeddedAddress;
  const walletConnected = !!walletAddress;

  return { address: walletAddress, isConnected: walletConnected };
}