'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ethers } from 'ethers'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import CurrencyInput from '@/components/CurrencyInput'
import AmountInput from '@/components/AmountInput'
import RecipientInput from '@/components/RecipientInput'
import Background from '@/components/BackgroundImage'
import Header from '@/components/Header'
import { usePythPricing } from '@/hooks/usePythPricing'
import { useForexAmmSwap, useForexAmmQuote, useForexAmmStatus } from '@/hooks/useForexAmmSwap'
import { getTokenAddress, getTokenDecimals } from '@/services/forexAmmService'

interface TokenBalance {
  symbol: string
  balance: string
  decimals: number
  address: string
}

export default function Home() {
  const { address, isConnected } = useAccount()
  const [isClient, setIsClient] = useState(false)
  
  // Pyth pricing hook
  const { 
    usdInrRate, 
    isLoading: pythLoading, 
    error: pythError, 
    calculateSwapOutput,
    lastUpdated 
  } = usePythPricing()


  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Get ETH balance using wagmi
  const { data: ethBalance, isLoading: ethLoading, error: ethError } = useBalance({
    address: address,
    query: {
      enabled: !!address && isConnected
    }
  })
  
  // Get token balances using wagmi
  const { data: sINRBalance, isLoading: sINRLoading, error: sINRError } = useReadContract({
    address: '0x814ebF49951162795526126553BEbd3C52cd942A',
    abi: [
      {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
      }
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected
    }
  })
  
  const { data: pyusdcBalance, isLoading: pyusdcLoading, error: pyusdcError } = useReadContract({
    address: '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9',
    abi: [
      {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
      }
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected
    }
  })
  
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromToken, setFromToken] = useState('sINR')
  const [toToken, setToToken] = useState('PYUSDC')
  const [swapAmount, setSwapAmount] = useState('')
  const [activeTab, setActiveTab] = useState<'swap' | 'buy'>('swap')
  const [activePage, setActivePage] = useState<'trade' | 'portfolio'>('trade')
  
  // Buy tab states
  const [buyFromAmount, setBuyFromAmount] = useState('')
  const [buyToAmount, setBuyToAmount] = useState('')
  
  // Portfolio states
  const [hedgeAmount, setHedgeAmount] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [selectedToken, setSelectedToken] = useState('sINR')
  const [isSwapping, setIsSwapping] = useState(false)

  // ForexAMM hooks
  const { executeSwap, hash: swapHash, isLoading: swapLoading, isPending: swapPending, isSuccess: swapSuccess, isError: swapError, error: swapErrorMsg } = useForexAmmSwap()
  
  // Get quote from ForexAMM for PYUSD swaps
  const tokenOutAddress = getTokenAddress(toToken)
  
  // Debug token address lookup
  console.log('🔍 Token address lookup debug:', {
    toToken,
    tokenOutAddress,
    fromToken
  })
  const { 
    data: ammQuote, 
    isLoading: ammQuoteLoading, 
    error: ammQuoteError 
  } = useForexAmmQuote(
    tokenOutAddress || undefined, 
    fromAmount, 
    !!(isConnected && fromToken === 'PYUSDC' && fromAmount && fromAmount !== '0')
  )
  
  // Check if ForexAMM is paused
  const { data: isAmmPaused, isLoading: ammStatusLoading } = useForexAmmStatus()
  const [swapQuote, setSwapQuote] = useState<{
    amountOut: string
    fee: string
    price: string
    slippage: string
  } | null>(null)
  
  // Open orders state
  const [openOrders, setOpenOrders] = useState<Array<{
    id: string
    market: string
    size: string
    positionValue: string
    entryPrice: string
    markPrice: string
    liqPrice: string
    unrealizedPnL: string
    margin: string
    funding: string
    tpSl: string
  }>>([])

  // Contract configuration
  const CONTRACT_ADDRESS = useMemo(() => '0xEa9FD265B4AD929a6bfDD431B66a42fcdD554E01', [])
  const RPC_URL = 'https://eth-sepolia.g.alchemy.com/v2/la4goIlWFrPCEjICAnzbOlU2YXgjKtTz'
  const CHAIN_ID = 11155111

  // Token addresses for Sepolia testnet
  const TOKEN_ADDRESSES = useMemo(() => ({
    'sINR': '0x814ebF49951162795526126553BEbd3C52cd942A',
    'PYUSDC': '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9', // USDC on Sepolia (official testnet)
    'sEUR': '0x9Dd77683Eea8c532E4d01A8322d25C505Ffe1A28',
    'sJPY': '0x40c7A8c0afF326039feEa2630Ff3fFAB0FB0Acfa',
    'sXAU': '0x1419b1AFd8C61a01DBBCda2f9A45cac8B26F548F'
  }), [])

  // Token decimals mapping (in case some tokens have different decimals)
  const TOKEN_DECIMALS = {
    'sINR': 18,
    'PYUSDC': 6, // USDC typically has 6 decimals
    'sEUR': 18,
    'sJPY': 18,
    'sXAU': 18
  }

  // Contract ABI
  const CONTRACT_ABI = useMemo(() => [
    {"inputs":[{"internalType":"address","name":"_vault","type":"address"},{"internalType":"address","name":"_tokenFactory","type":"address"},{"internalType":"address","name":"_oracle","type":"address"},{"internalType":"address","name":"_pyusd","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
    {"inputs":[],"name":"CrossRateDisabled","type":"error"},
    {"inputs":[],"name":"EnforcedPause","type":"error"},
    {"inputs":[],"name":"ExpectedPause","type":"error"},
    {"inputs":[],"name":"InsufficientAllowance","type":"error"},
    {"inputs":[],"name":"InsufficientBalance","type":"error"},
    {"inputs":[],"name":"InsufficientFee","type":"error"},
    {"inputs":[],"name":"InsufficientLiquidity","type":"error"},
    {"inputs":[],"name":"InvalidAmount","type":"error"},
    {"inputs":[],"name":"InvalidToken","type":"error"},
    {"inputs":[],"name":"OraclePriceError","type":"error"},
    {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},
    {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},
    {"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},
    {"inputs":[],"name":"SameToken","type":"error"},
    {"inputs":[],"name":"TokenNotInitialized","type":"error"},
    {"inputs":[],"name":"TransferFailed","type":"error"},
    {"inputs":[],"name":"ZeroAmount","type":"error"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"CrossRateTradingToggled","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"tokenIn","type":"address"},{"indexed":true,"internalType":"address","name":"tokenOut","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"},{"indexed":false,"internalType":"bool","name":"isDirectCrossRate","type":"bool"}],"name":"Swap","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TradingFeeCollected","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"virtualReserve","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"virtualUSDReserve","type":"uint256"}],"name":"VirtualReservesUpdated","type":"event"},
    {"inputs":[],"name":"BASIS_POINTS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"PYUSD","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"TRADING_FEE_BPS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"VIRTUAL_RESERVE_BASE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"allowDirectCrossRate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"getMarketData","outputs":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"string","name":"asset","type":"string"},{"internalType":"uint256","name":"oraclePrice","type":"uint256"},{"internalType":"uint256","name":"confidence","type":"uint256"},{"internalType":"uint256","name":"expo","type":"uint256"},{"internalType":"uint256","name":"ammPrice","type":"uint256"},{"internalType":"uint256","name":"priceDeviationBps","type":"uint256"},{"internalType":"uint256","name":"virtualReserve","type":"uint256"},{"internalType":"uint256","name":"virtualUSDReserve","type":"uint256"},{"internalType":"uint256","name":"totalCollateral","type":"uint256"},{"internalType":"uint256","name":"lockedCollateral","type":"uint256"},{"internalType":"uint256","name":"utilization","type":"uint256"}],"internalType":"struct ForexAMM.MarketData","name":"marketData","type":"tuple"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"}],"name":"getQuote","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"fee","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"getTokenPrice","outputs":[{"internalType":"uint256","name":"oraclePrice","type":"uint256"},{"internalType":"uint256","name":"ammPrice","type":"uint256"},{"internalType":"uint256","name":"priceDeviationBps","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"getVirtualReserves","outputs":[{"internalType":"uint256","name":"virtualReserve","type":"uint256"},{"internalType":"uint256","name":"virtualUSDReserve","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"initializeVirtualReserves","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"oracle","outputs":[{"internalType":"contract PythOracle","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"preferDirectCrossRate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"}],"name":"quotePYUSDForToken","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"slippageBps","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"}],"name":"quoteTokenForPYUSD","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"slippageBps","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"bool","name":"useDirectCrossRate","type":"bool"}],"name":"quoteTokenForToken","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"uint256","name":"crossRate","type":"uint256"},{"internalType":"uint256","name":"slippageBps","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"bool","name":"enabled","type":"bool"}],"name":"setDirectCrossRateEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"minAmountOut","type":"uint256"}],"name":"swapPYUSDForToken","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"minAmountOut","type":"uint256"},{"internalType":"bytes[]","name":"priceUpdate","type":"bytes[]"}],"name":"swapPYUSDForToken","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},
    {"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"minAmountOut","type":"uint256"}],"name":"swapTokenForPYUSD","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"minAmountOut","type":"uint256"},{"internalType":"bool","name":"useDirectCrossRate","type":"bool"}],"name":"swapTokenForToken","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"tokenFactory","outputs":[{"internalType":"contract SyntheticTokenFactory","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"newVirtualReserve","type":"uint256"},{"internalType":"uint256","name":"newVirtualUSDReserve","type":"uint256"}],"name":"updateVirtualReserves","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"vault","outputs":[{"internalType":"contract ForexVault","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"virtualReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"virtualUSDReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
  ], [])

  // ERC-20 ABI for balanceOf function
  const ERC20_ABI = [
    {
      "constant": true,
      "inputs": [{"name": "_owner", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"name": "balance", "type": "uint256"}],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [{"name": "", "type": "uint8"}],
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
      "name": "approve",
      "outputs": [{"name": "", "type": "bool"}],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
      "name": "allowance",
      "outputs": [{"name": "", "type": "uint256"}],
      "type": "function"
    }
  ]


  const getTokenBalance = (symbol: string) => {
    console.log(`🔍 Getting balance for ${symbol}:`, {
      symbol,
      ethBalance,
      sINRBalance,
      pyusdcBalance,
      isConnected,
      address
    })
    
    switch (symbol) {
      case 'ETH':
        const ethResult = ethBalance ? parseFloat(ethBalance.formatted).toFixed(6) : '0.000000'
        console.log(`💰 ETH balance result:`, ethResult)
        return ethResult
      case 'sINR':
        // sINR has -5 decimals (10^-5), so we need to divide by 10^5 = 100000
        const sINRResult = sINRBalance && typeof sINRBalance === 'bigint' ? 
          (Number(sINRBalance) / 100000).toFixed(5) : '0.00000'
        console.log(`💰 sINR balance result:`, sINRResult, 'Raw:', sINRBalance)
        return sINRResult
      case 'PYUSDC':
        // PYUSDC has 6 decimals (10^6)
        const pyusdcResult = pyusdcBalance && typeof pyusdcBalance === 'bigint' ? 
          parseFloat(formatUnits(pyusdcBalance, 6)).toFixed(6) : '0.000000'
        console.log(`💰 PYUSDC balance result:`, pyusdcResult, 'Raw:', pyusdcBalance)
        return pyusdcResult
      default:
        return '0.0000'
    }
  }

  const getTotalPortfolioValue = () => {
    const ethValue = parseFloat(getTokenBalance('ETH'))
    const sINRValue = parseFloat(getTokenBalance('sINR'))
    const pyusdcValue = parseFloat(getTokenBalance('PYUSDC'))
    return (ethValue + sINRValue + pyusdcValue).toFixed(4)
  }

  const handleAddLimit = () => {
    if (!limitPrice) {
      alert('Please fill in the limit price')
      return
    }
    
    // Add to open orders
    const newOrder = {
      id: Date.now().toString(),
      market: `${selectedToken}/GOLD`,
      size: 'Auto', // Will be determined by available balance
      positionValue: '0.0000', // Will be calculated when executed
      entryPrice: limitPrice,
      markPrice: '0.0000', // Will be fetched later
      liqPrice: '0.0000', // Will be calculated later
      unrealizedPnL: '0.0000', // Will be calculated later
      margin: '0.0000', // Will be calculated later
      funding: '0.0000', // Will be calculated later
      tpSl: '0.0000' // Will be set later
    }
    
    setOpenOrders([...openOrders, newOrder])
    
    // Clear form
    setLimitPrice('')
    
    alert(`Limit order added: ${selectedToken} → GOLD at ${limitPrice}`)
  }

  const handleCloseAll = () => {
    setOpenOrders([])
    alert('All orders closed')
  }

  // Get quote for swap
  const getSwapQuote = useCallback(async (tokenIn: string, tokenOut: string, amountIn: string) => {
    if (!window.ethereum || !address || !amountIn || parseFloat(amountIn) <= 0) {
      setSwapQuote(null)
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      
      const tokenInAddress = TOKEN_ADDRESSES[tokenIn as keyof typeof TOKEN_ADDRESSES]
      const tokenOutAddress = TOKEN_ADDRESSES[tokenOut as keyof typeof TOKEN_ADDRESSES]
      
      if (!tokenInAddress || !tokenOutAddress) {
        console.error('Invalid token addresses')
        return
      }

      // Convert amount to wei (assuming 18 decimals)
      const amountInWei = ethers.parseUnits(amountIn, 18)
      
      let quote
      if (tokenIn === 'PYUSDC') {
        // PYUSDC to other token
        quote = await contract.quotePYUSDForToken(tokenOutAddress, amountInWei)
      } else if (tokenOut === 'PYUSDC') {
        // Other token to PYUSDC
        quote = await contract.quoteTokenForPYUSD(tokenInAddress, amountInWei)
      } else {
        // Token to token
        quote = await contract.quoteTokenForToken(tokenInAddress, tokenOutAddress, amountInWei, false)
      }

      const amountOut = ethers.formatUnits(quote[0], 18)
      const fee = ethers.formatUnits(quote[1], 18)
      const price = quote[2] ? ethers.formatUnits(quote[2], 18) : '0'
      const slippage = quote[3] ? quote[3].toString() : '0'

      setSwapQuote({
        amountOut,
        fee,
        price,
        slippage
      })
    } catch (error) {
      console.error('Error getting quote:', error)
      setSwapQuote(null)
    }
  }, [address, CONTRACT_ADDRESS, CONTRACT_ABI, TOKEN_ADDRESSES])

  // Check and approve token
  const approveToken = async (tokenAddress: string, amount: string) => {
    if (!window.ethereum || !address) return false

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any)
      const signer = await provider.getSigner()
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer)
      
      const amountWei = ethers.parseUnits(amount, 18)
      
      // Check current allowance
      const allowance = await tokenContract.allowance(address, CONTRACT_ADDRESS)
      
      if (allowance >= amountWei) {
        return true // Already approved
      }

      // Request approval
      const tx = await tokenContract.approve(CONTRACT_ADDRESS, amountWei)
      await tx.wait()
      return true
    } catch (error) {
      console.error('Error approving token:', error)
      return false
    }
  }

  // Execute swap
  const executeSwapTransaction = async () => {
    if (!fromAmount || fromAmount === '0') {
      alert('Please enter a valid amount to swap')
      return
    }

    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    if (isAmmPaused) {
      alert('ForexAMM contract is currently paused. Please try again later.')
      return
    }

    if (!tokenOutAddress) {
      alert(`Token address not found for ${toToken}. Available tokens: PYUSDC, SINR, ETH`)
      console.error('Token address lookup failed:', { 
        toToken, 
        tokenOutAddress
      })
      return
    }

    if (tokenOutAddress === '0x0000000000000000000000000000000000000000') {
      alert(`Token address for ${toToken} is set to zero address. Please update the token configuration.`)
      console.error('Zero address detected:', { 
        toToken, 
        tokenOutAddress 
      })
      return
    }

    console.log('Swap parameters:', {
      tokenOutAddress,
      amountIn: fromAmount,
      fromToken,
      toToken
    })

    try {
      console.log('Executing ForexAMM swap:', {
        fromToken,
        toToken,
        fromAmount,
        tokenOutAddress,
        recipient: address
      })

      // Calculate minimum amount out (5% slippage tolerance)
      const minAmountOut = ammQuote && ammQuote[0] 
        ? (Number(ammQuote[0]) * 0.95).toString()
        : '0'

      // Execute swap via ForexAMM contract
      const result = await executeSwap({
        tokenOutAddress,
        amountIn: fromAmount,
        minAmountOut,
        usePriceUpdate: false // Try without price update first to debug
      })

      if (result.isError) {
        throw new Error(result.error?.message || 'Swap transaction failed')
      }

      console.log('Swap transaction submitted:', result.hash)
      alert(`Swap transaction submitted!\nHash: ${result.hash}\n${fromAmount} ${fromToken} → ${toToken}`)
      
      // Reset amounts after successful transaction
      if (result.isSuccess) {
        setFromAmount('')
        setToAmount('')
        setSwapQuote(null)
      }
      
    } catch (error) {
      console.error('Swap execution failed:', error)
      alert(`Swap execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleMaxClick = () => {
    // Get balance of selected token (assuming sINR for now)
    const balance = getTokenBalance('sINR')
    setFromAmount(balance)
  }

  // Manual refresh function
  const refreshBalances = () => {
    console.log('Manual refresh triggered - balances will auto-refresh with wagmi')
  }


  // Test function to check current token balances
  const testTokenBalances = () => {
    if (!isConnected) {
      alert('Please connect wallet first')
      return
    }

    const result = `Current Token Balances:
ETH: ${getTokenBalance('ETH')}
sINR: ${getTokenBalance('sINR')}
PYUSDC: ${getTokenBalance('PYUSDC')}

Raw Data Debug:
ETH Balance Data: ${ethBalance ? JSON.stringify(ethBalance, null, 2) : 'null'}
ETH Loading: ${ethLoading}
ETH Error: ${ethError ? ethError.message : 'None'}

sINR Balance Data: ${sINRBalance ? sINRBalance.toString() : 'null'}
sINR Loading: ${sINRLoading}
sINR Error: ${sINRError ? sINRError.message : 'None'}

PYUSDC Balance Data: ${pyusdcBalance ? pyusdcBalance.toString() : 'null'}
PYUSDC Loading: ${pyusdcLoading}
PYUSDC Error: ${pyusdcError ? pyusdcError.message : 'None'}

Pyth Pricing:
USD/INR Rate: ${usdInrRate ? usdInrRate.toFixed(4) : 'N/A'}
Pyth Loading: ${pythLoading}
Pyth Error: ${pythError || 'None'}
Last Updated: ${lastUpdated ? lastUpdated.toLocaleString() : 'Never'}

Connection Info:
Address: ${address}
Is Connected: ${isConnected}
Is Client: ${isClient}`
    
    console.log('📊 Token Balance Test Results:', result)
    alert(result)
  }

  // Get quote when amounts change
  useEffect(() => {
    if (fromAmount && fromToken && toToken && parseFloat(fromAmount) > 0) {
      // Check if we can use Pyth pricing for PYUSD/sINR pairs
      if ((fromToken === 'PYUSDC' && toToken === 'sINR') || 
          (fromToken === 'sINR' && toToken === 'PYUSDC')) {
        
        const pythResult = calculateSwapOutput(fromAmount, fromToken, toToken)
        
        if (pythResult.error) {
          console.warn('Pyth pricing error:', pythResult.error)
          // Fallback to contract quote
          getSwapQuote(fromToken, toToken, fromAmount)
        } else {
          // Use Pyth pricing
          setSwapQuote({
            amountOut: pythResult.outputAmount,
            fee: '0.0000', // Pyth doesn't provide fee info, using 0 for now
            price: pythResult.rate,
            slippage: '0' // Pyth provides spot price, no slippage
          })
          
          // Update the "to" amount with the calculated output
          setToAmount(pythResult.outputAmount)
        }
      } else {
        // Use contract quote for other token pairs
        getSwapQuote(fromToken, toToken, fromAmount)
      }
    } else {
      setSwapQuote(null)
      setToAmount('')
    }
  }, [fromAmount, fromToken, toToken, getSwapQuote, calculateSwapOutput])

  return (
    <main className="min-h-screen relative">
      {/* Background Video */}
      <Background videoPath="/entities/videos/background.mp4" />
      
      {/* Header */}
      <Header onPageChange={setActivePage} />
      
      {/* Connect Button - Top Right */}
      {isClient && (
        <div className="absolute top-6 right-6 z-40 flex flex-col space-y-2">
          <ConnectButton />
          {isConnected && (
            <button
              onClick={testTokenBalances}
              className="bg-blue-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-blue-500/30 transition-colors border border-blue-500/30 text-sm"
            >
              Test Balances
            </button>
          )}
        </div>
      )}
      
      {/* Content */}
      {activePage === 'trade' ? (
        <div className="relative z-10 container mx-auto px-4 max-w-4xl pt-32">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/30">
          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20 mb-6">
            <button
              onClick={() => setActiveTab('swap')}
              className={`flex-1 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'swap'
                  ? 'bg-[#95B309] text-white font-semibold hover:bg-[#7A9207]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Swap
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'buy'
                  ? 'bg-[#95B309] text-white font-semibold hover:bg-[#7A9207]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Buy
            </button>
          </div>

          <div className="space-y-6">

            {/* Swap Tab Content */}
            {activeTab === 'swap' && (
              <>
                {/* From Currency */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">From</span>
                </div>

                <CurrencyInput
                  label="From"
                  balance={isClient ? getTokenBalance(fromToken) : '0.0000'}
                  amount={fromAmount}
                  onAmountChange={setFromAmount}
                  onMaxClick={handleMaxClick}
                  selectedToken={fromToken}
                  onTokenSelect={setFromToken}
                />

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>

                {/* To Currency */}
                <CurrencyInput
                  label="To"
                  balance={isClient ? getTokenBalance(toToken) : '0.0000'}
                  amount={toAmount}
                  onAmountChange={setToAmount}
                  selectedToken={toToken}
                  onTokenSelect={setToToken}
                  showSelectButton={true}
                />



                {/* Quote Display */}
                {swapQuote && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-center text-white/90 mb-2">
                      <div className="text-sm">Estimated Output: {parseFloat(swapQuote.amountOut).toFixed(6)}</div>
                      
                      {/* Show Pyth pricing info for PYUSD/sINR pairs */}
                      {((fromToken === 'PYUSDC' && toToken === 'sINR') || 
                        (fromToken === 'sINR' && toToken === 'PYUSDC')) && (
                        <>
                          <div className="text-sm">
                            Pyth Rate: {swapQuote.price} USD/INR
                          </div>
                          {pythLoading && (
                            <div className="text-xs text-yellow-400">Updating rate...</div>
                          )}
                          {pythError && (
                            <div className="text-xs text-red-400">Rate error: {pythError}</div>
                          )}
                          {lastUpdated && (
                            <div className="text-xs text-gray-400">
                              Updated: {lastUpdated.toLocaleTimeString()}
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Show contract quote info for other pairs */}
                      {!((fromToken === 'PYUSDC' && toToken === 'sINR') || 
                          (fromToken === 'sINR' && toToken === 'PYUSDC')) && (
                        <>
                          <div className="text-sm">Fee: {parseFloat(swapQuote.fee).toFixed(6)}</div>
                          <div className="text-sm">Price: {parseFloat(swapQuote.price).toFixed(6)}</div>
                          <div className="text-sm">Slippage: {swapQuote.slippage} bps</div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* ForexAMM Quote Display */}
                {fromToken === 'PYUSDC' && ammQuote && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <h3 className="text-white font-semibold mb-2">ForexAMM Quote</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-white/80">
                        <span>Amount Out:</span>
                        <span>{formatUnits(ammQuote[0], getTokenDecimals(toToken))}</span>
                      </div>
                      <div className="flex justify-between text-white/80">
                        <span>Fee:</span>
                        <span>{formatUnits(ammQuote[1], 6)} PYUSD</span>
                      </div>
                      <div className="flex justify-between text-white/80">
                        <span>Price:</span>
                        <span>{formatUnits(ammQuote[2], 18)}</span>
                      </div>
                      <div className="flex justify-between text-white/80">
                        <span>Slippage:</span>
                        <span>{Number(ammQuote[3]) / 100}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Debug Info */}
                {isClient && (
                  <div className="bg-yellow-500/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20">
                    <h3 className="text-yellow-400 font-semibold mb-2">🐛 Debug Info</h3>
                    <div className="space-y-1 text-xs text-yellow-200/80">
                      <div>From Token: {fromToken}</div>
                      <div>To Token: {toToken}</div>
                      <div>Amount: {fromAmount}</div>
                      <div>Token Address: {tokenOutAddress || 'Not found'}</div>
                      <div>Contract Paused: {isAmmPaused ? 'Yes' : 'No'}</div>
                      <div>Swap Quote: {swapQuote ? 'Available' : 'None'}</div>
                    </div>
                  </div>
                )}

                {/* Swap Button */}
                <button 
                  onClick={executeSwapTransaction}
                  disabled={swapLoading || swapPending || !swapQuote || isAmmPaused }
                  className="w-full bg-[#95B309] backdrop-blur-sm text-white text-lg font-bold py-4 rounded-2xl hover:bg-[#7A9207] transition-all duration-300 shadow-lg border border-[#95B309]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSwapping ? 'Swapping...' : 'Swap'}
                </button>
              </>
            )}

            {/* Buy Tab Content */}
            {activeTab === 'buy' && (
              <>
                {/* From Token */}
                <CurrencyInput
                  label="Pay with"
                  balance={isClient ? getTokenBalance('sINR') : '0.0000'}
                  amount={buyFromAmount}
                  onAmountChange={setBuyFromAmount}
                />

                {/* To Token */}
                <CurrencyInput
                  label="Receive"
                  balance={isClient ? getTokenBalance('PYUSDC') : '0.0000'}
                  amount={buyToAmount}
                  onAmountChange={setBuyToAmount}
                />

                {/* Buy Button */}
                <button className="w-full bg-[#95B309] backdrop-blur-sm text-white text-lg font-bold py-4 rounded-2xl hover:bg-[#7A9207] transition-all duration-300 shadow-lg border border-[#95B309]/30">
                  Buy
                </button>
              </>
            )}

            {/* Info Text */}
            <div className="text-center text-sm text-white/60">
              By {activeTab === 'swap' ? 'swapping' : 'buying'}, you agree to our Terms of Service
            </div>
          </div>

        </div>
      </div>
      ) : (
        /* Portfolio Page */
        <div className="relative z-10 container mx-auto px-4 max-w-4xl pt-32">

          {/* Total Portfolio Value */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/30 mb-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">Total Portfolio Value</h2>
              <p className="text-3xl font-bold text-[#95B309]">{isClient ? getTotalPortfolioValue() : '0.0000'} Tokens</p>
            </div>
          </div>


          {/* Limit Order */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/30">
            <h2 className="text-xl font-semibold text-white mb-6">Set Limit Order</h2>
            
            <div className="space-y-4">
              {/* Token Selection */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Token to Convert to GOLD
                </label>
                <select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  className="w-full text-xl font-semibold bg-transparent border-none outline-none text-white"
                >
                  {Object.keys(TOKEN_ADDRESSES).map((token) => (
                    <option key={token} value={token} className="bg-gray-800 text-white">
                      {token} - Balance: {isClient ? getTokenBalance(token) : '0.0000'}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-sm text-white/70">
                  Available: {isClient ? getTokenBalance(selectedToken) : '0.0000'} {selectedToken}
                </div>
              </div>

              {/* Limit Price Input */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Limit Price (GOLD per {selectedToken})
                </label>
                <input
                  type="text"
                  placeholder="Enter limit price in GOLD"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-full text-xl font-semibold bg-transparent border-none outline-none placeholder-white/50 text-white"
                />
              </div>

              {/* Add Limit Button */}
              <button 
                onClick={handleAddLimit}
                className="w-full bg-[#95B309] backdrop-blur-sm text-white text-lg font-bold py-4 rounded-2xl hover:bg-[#7A9207] transition-all duration-300 shadow-lg border border-[#95B309]/30"
              >
                Add Limit Order
              </button>
            </div>
          </div>

          {/* Open Orders Table */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/30 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Open Orders</h2>
              {openOrders.length > 0 && (
                <button 
                  onClick={handleCloseAll}
                  className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                >
                  Close All
                </button>
              )}
            </div>
            
            {openOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/70 border-b border-white/20">
                      <th className="text-left py-3 px-2">Market</th>
                      <th className="text-left py-3 px-2">Size</th>
                      <th className="text-left py-3 px-2">Position Value</th>
                      <th className="text-left py-3 px-2">Entry Price</th>
                      <th className="text-left py-3 px-2">Mark Price</th>
                      <th className="text-left py-3 px-2">Liq. Price</th>
                      <th className="text-left py-3 px-2">Unrealized PnL</th>
                      <th className="text-left py-3 px-2">Margin</th>
                      <th className="text-left py-3 px-2">Funding</th>
                      <th className="text-left py-3 px-2">TP / SL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openOrders.map((order) => (
                      <tr key={order.id} className="text-white border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-2">{order.market}</td>
                        <td className="py-3 px-2">{order.size}</td>
                        <td className="py-3 px-2">{order.positionValue}</td>
                        <td className="py-3 px-2">{order.entryPrice}</td>
                        <td className="py-3 px-2">{order.markPrice}</td>
                        <td className="py-3 px-2">{order.liqPrice}</td>
                        <td className="py-3 px-2">{order.unrealizedPnL}</td>
                        <td className="py-3 px-2">{order.margin}</td>
                        <td className="py-3 px-2">{order.funding}</td>
                        <td className="py-3 px-2">{order.tpSl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-white/70 py-8">
                No open orders
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  )
}