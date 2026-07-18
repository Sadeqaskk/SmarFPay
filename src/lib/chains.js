// Known token addresses on Arc Testnet
export const ARC_TOKENS = {
  USDC: {
    address: '0x3600000000000000000000000000000000000000',
    symbol: 'USDC',
    decimals: 6,
  },
  EURC: {
    address: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a',
    symbol: 'EURC',
    decimals: 6,
  },
cirBTC: {
    address: '0xf0C4a4CE82A5746AbAAd9425360Ab04fbBA432BF',
    symbol: 'cirBTC',
    decimals: 8,
  },
}

// Presto's Hub AMM on Arc Testnet — verified via source on GitHub
// (Emperoar07/Presto, contracts/ArcHubAMMNormalized.sol)
export const ROUTER_ADDRESS = '0xE830C6d6a0cd69F8541AA923b6b8fAaedF377DE6'