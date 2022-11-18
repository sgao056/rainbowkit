import Metamask from "assets/img/wallets/metamaskWallet.png";
import Coin98 from "assets/img/wallets/Coin98.png";
import WalletConnect from "assets/img/wallets/wallet-connect.svg";
import MathWallet from "assets/img/wallets/MathWallet.svg";
import TokenPocket from "assets/img/wallets/TokenPocket.svg";
import SafePal from "assets/img/wallets/SafePal.svg";
import TrustWallet from "assets/img/wallets/TrustWallet.png";

const connectors = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: "injected",
    priority: 1,
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    connectorId: "walletconnect",
    priority: 2,
  },
  {
    title: "Trust Wallet",
    icon: TrustWallet,
    connectorId: "injected",
    priority: 3,
  },
  {
    title: "MathWallet",
    icon: MathWallet,
    connectorId: "injected",
    priority: 999,
  },
  {
    title: "TokenPocket",
    icon: TokenPocket,
    connectorId: "injected",
    priority: 999,
  },
  {
    title: "SafePal",
    icon: SafePal,
    connectorId: "injected",
    priority: 999,
  },
  {
    title: "Coin98",
    icon: Coin98,
    connectorId: "injected",
    priority: 999,
  },
];

export default connectors