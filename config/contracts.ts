// Contract addresses and configurations
export const FOREX_AMM_ADDRESS = "0xEa9FD265B4AD929a6bfDD431B66a42fcdD554E01" as `0x${string}`

// Token addresses
// TODO: Replace with actual token addresses
export const TOKEN_ADDRESSES = {
  PYUSDC: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9" as `0x${string}`, // Placeholder - replace with actual PYUSDC address
  SINR: "0x814ebF49951162795526126553BEbd3C52cd942A" as `0x${string}`,   // Placeholder - replace with actual sINR address
  ETH: "0x0000000000000000000000000000000000000000" as `0x${string}` // ETH address
}

// ForexAMM Contract ABI
export const FOREX_AMM_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_vault", "type": "address"},
      {"internalType": "address", "name": "_tokenFactory", "type": "address"},
      {"internalType": "address", "name": "_oracle", "type": "address"},
      {"internalType": "address", "name": "_pyusd", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "CrossRateDisabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EnforcedPause",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ExpectedPause",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientFee",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientLiquidity",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidToken",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OraclePriceError",
    "type": "error"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"}
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "account", "type": "address"}
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SameToken",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TokenNotInitialized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TransferFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ZeroAmount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "bool", "name": "enabled", "type": "bool"}
    ],
    "name": "CrossRateTradingToggled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "address", "name": "account", "type": "address"}
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "tokenIn", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "tokenOut", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amountIn", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "amountOut", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256"},
      {"indexed": false, "internalType": "bool", "name": "isDirectCrossRate", "type": "bool"}
    ],
    "name": "Swap",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "TradingFeeCollected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "address", "name": "account", "type": "address"}
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "token", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "virtualReserve", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "virtualUSDReserve", "type": "uint256"}
    ],
    "name": "VirtualReservesUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "BASIS_POINTS",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PYUSD",
    "outputs": [
      {"internalType": "contract IERC20", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TRADING_FEE_BPS",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "VIRTUAL_RESERVE_BASE",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "allowDirectCrossRate",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"}
    ],
    "name": "getMarketData",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "token", "type": "address"},
          {"internalType": "string", "name": "asset", "type": "string"},
          {"internalType": "uint256", "name": "oraclePrice", "type": "uint256"},
          {"internalType": "uint256", "name": "confidence", "type": "uint256"},
          {"internalType": "uint256", "name": "expo", "type": "uint256"},
          {"internalType": "uint256", "name": "ammPrice", "type": "uint256"},
          {"internalType": "uint256", "name": "priceDeviationBps", "type": "uint256"},
          {"internalType": "uint256", "name": "virtualReserve", "type": "uint256"},
          {"internalType": "uint256", "name": "virtualUSDReserve", "type": "uint256"},
          {"internalType": "uint256", "name": "totalCollateral", "type": "uint256"},
          {"internalType": "uint256", "name": "lockedCollateral", "type": "uint256"},
          {"internalType": "uint256", "name": "utilization", "type": "uint256"}
        ],
        "internalType": "struct ForexAMM.MarketData",
        "name": "marketData",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenIn", "type": "address"},
      {"internalType": "address", "name": "tokenOut", "type": "address"},
      {"internalType": "uint256", "name": "amountIn", "type": "uint256"}
    ],
    "name": "getQuote",
    "outputs": [
      {"internalType": "uint256", "name": "amountOut", "type": "uint256"},
      {"internalType": "uint256", "name": "fee", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"}
    ],
    "name": "getTokenPrice",
    "outputs": [
      {"internalType": "uint256", "name": "oraclePrice", "type": "uint256"},
      {"internalType": "uint256", "name": "ammPrice", "type": "uint256"},
      {"internalType": "uint256", "name": "priceDeviationBps", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"}
    ],
    "name": "getVirtualReserves",
    "outputs": [
      {"internalType": "uint256", "name": "virtualReserve", "type": "uint256"},
      {"internalType": "uint256", "name": "virtualUSDReserve", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"}
    ],
    "name": "initializeVirtualReserves",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "oracle",
    "outputs": [
      {"internalType": "contract PythOracle", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "preferDirectCrossRate",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenOut", "type": "address"},
      {"internalType": "uint256", "name": "amountIn", "type": "uint256"}
    ],
    "name": "quotePYUSDForToken",
    "outputs": [
      {"internalType": "uint256", "name": "amountOut", "type": "uint256"},
      {"internalType": "uint256", "name": "fee", "type": "uint256"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "uint256", "name": "slippageBps", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenIn", "type": "address"},
      {"internalType": "uint256", "name": "amountIn", "type": "uint256"}
    ],
    "name": "quoteTokenForPYUSD",
    "outputs": [
      {"internalType": "uint256", "name": "amountOut", "type": "uint256"},
      {"internalType": "uint256", "name": "fee", "type": "uint256"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "uint256", "name": "slippageBps", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenIn", "type": "address"},
      {"internalType": "address", "name": "tokenOut", "type": "address"},
      {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
      {"internalType": "bool", "name": "useDirectCrossRate", "type": "bool"}
    ],
    "name": "quoteTokenForToken",
    "outputs": [
      {"internalType": "uint256", "name": "amountOut", "type": "uint256"},
      {"internalType": "uint256", "name": "fee", "type": "uint256"},
      {"internalType": "uint256", "name": "crossRate", "type": "uint256"},
      {"internalType": "uint256", "name": "slippageBps", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bool", "name": "enabled", "type": "bool"}
    ],
    "name": "setDirectCrossRateEnabled",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenOut", "type": "address"},
      {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
      {"internalType": "uint256", "name": "minAmountOut", "type": "uint256"}
    ],
    "name": "swapPYUSDForToken",
    "outputs": [
      {"internalType": "uint256", "name": "amountOut", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenOut", "type": "address"},
      {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
      {"internalType": "uint256", "name": "minAmountOut", "type": "uint256"},
      {"internalType": "bytes[]", "name": "priceUpdate", "type": "bytes[]"}
    ],
    "name": "swapPYUSDForToken",
    "outputs": [
      {"internalType": "uint256", "name": "amountOut", "type": "uint256"}
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenIn", "type": "address"},
      {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
      {"internalType": "uint256", "name": "minAmountOut", "type": "uint256"}
    ],
    "name": "swapTokenForPYUSD",
    "outputs": [
      {"internalType": "uint256", "name": "amountOut", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenIn", "type": "address"},
      {"internalType": "address", "name": "tokenOut", "type": "address"},
      {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
      {"internalType": "uint256", "name": "minAmountOut", "type": "uint256"},
      {"internalType": "bool", "name": "useDirectCrossRate", "type": "bool"}
    ],
    "name": "swapTokenForToken",
    "outputs": [
      {"internalType": "uint256", "name": "amountOut", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenFactory",
    "outputs": [
      {"internalType": "contract SyntheticTokenFactory", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "newOwner", "type": "address"}
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "newVirtualReserve", "type": "uint256"},
      {"internalType": "uint256", "name": "newVirtualUSDReserve", "type": "uint256"}
    ],
    "name": "updateVirtualReserves",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vault",
    "outputs": [
      {"internalType": "contract ForexVault", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "name": "virtualReserves",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "name": "virtualUSDReserves",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const
