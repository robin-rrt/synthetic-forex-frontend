import { FOREX_AMM_ABI, FOREX_AMM_ADDRESS } from '../config/contracts'
import { parseUnits, formatUnits } from 'viem'
import { fetchPythPriceUpdate } from './pythService'

/**
 * Get quote from ForexAMM contract for PYUSD to token swap
 */
export async function getForexAmmQuote(
  tokenOutAddress: `0x${string}`,
  amountIn: string,
  decimals: number = 6
) {
  try {
    // Convert amount to proper units (PYUSD has 6 decimals)
    const amountInWei = parseUnits(amountIn, decimals)
    
    // This would be called via wagmi's useReadContract hook
    // For now, return a mock structure
    return {
      amountOut: '0',
      fee: '0',
      price: '0',
      slippageBps: '0'
    }
  } catch (error) {
    console.error('Error getting ForexAMM quote:', error)
    throw error
  }
}

/**
 * Execute swapPYUSDForToken transaction with Pyth price update
 */
export async function executeSwapPYUSDForToken(
  tokenOutAddress: `0x${string}`,
  amountIn: string,
  minAmountOut: string = '0',
  decimals: number = 6
) {
  try {
    // Fetch Pyth price update data
    const priceUpdateData = await fetchPythPriceUpdate()
    
    // Convert amounts to proper units
    const amountInWei = parseUnits(amountIn, decimals)
    const minAmountOutWei = parseUnits(minAmountOut, decimals)
    
    // Prepare price update bytes array
    const priceUpdateBytes = [`0x${priceUpdateData}`] as `0x${string}`[]
    
    // Return transaction parameters for wagmi
    return {
      address: FOREX_AMM_ADDRESS as `0x${string}`,
      abi: FOREX_AMM_ABI,
      functionName: 'swapPYUSDForToken' as const,
      args: [tokenOutAddress, amountInWei, minAmountOutWei, priceUpdateBytes],
      value: 1n, // 1 wei as specified
    }
  } catch (error) {
    console.error('Error preparing swap transaction:', error)
    throw error
  }
}

/**
 * Execute swapPYUSDForToken transaction without Pyth price update
 */
export async function executeSwapPYUSDForTokenWithoutPriceUpdate(
  tokenOutAddress: `0x${string}`,
  amountIn: string,
  minAmountOut: string = '0',
  decimals: number = 6
) {
  try {
    // Convert amounts to proper units
    const amountInWei = parseUnits(amountIn, decimals)
    const minAmountOutWei = parseUnits(minAmountOut, decimals)
    
    // Return transaction parameters for wagmi
    return {
      address: FOREX_AMM_ADDRESS as `0x${string}`,
      abi: FOREX_AMM_ABI,
      functionName: 'swapPYUSDForToken' as const,
      args: [tokenOutAddress, amountInWei, minAmountOutWei],
    }
  } catch (error) {
    console.error('Error preparing swap transaction:', error)
    throw error
  }
}

/**
 * Get token address by symbol
 */
export function getTokenAddress(symbol: string): `0x${string}` | null {
  console.log('🔍 getTokenAddress called with:', symbol)
  
  // Define token addresses directly to avoid import issues
  const TOKEN_ADDRESSES = {
    PYUSDC: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9" as `0x${string}`,
    SINR: "0x814ebF49951162795526126553BEbd3C52cd942A" as `0x${string}`,
    ETH: "0x0000000000000000000000000000000000000000" as `0x${string}`
  }
  
  console.log('🔍 Available token addresses:', TOKEN_ADDRESSES)
  
  const result = (() => {
    switch (symbol.toUpperCase()) {
      case 'PYUSDC':
        console.log('🔍 Returning PYUSDC address:', TOKEN_ADDRESSES.PYUSDC)
        return TOKEN_ADDRESSES.PYUSDC
      case 'SINR':
        console.log('🔍 Returning SINR address:', TOKEN_ADDRESSES.SINR)
        return TOKEN_ADDRESSES.SINR
      case 'ETH':
        console.log('🔍 Returning ETH address:', TOKEN_ADDRESSES.ETH)
        return TOKEN_ADDRESSES.ETH
      default:
        console.log('🔍 No match found for symbol:', symbol)
        return null
    }
  })()
  
  console.log('🔍 Final result:', result)
  return result
}

/**
 * Get token decimals by symbol
 */
export function getTokenDecimals(symbol: string): number {
  switch (symbol.toUpperCase()) {
    case 'PYUSDC':
      return 6
    case 'SINR':
      return 5 // -5 decimals means 5 decimal places
    case 'ETH':
      return 18
    default:
      return 18
  }
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(amount: string, symbol: string): string {
  const decimals = getTokenDecimals(symbol)
  
  switch (symbol.toUpperCase()) {
    case 'PYUSDC':
      return parseFloat(amount).toFixed(6)
    case 'SINR':
      return parseFloat(amount).toFixed(5)
    case 'ETH':
      return parseFloat(amount).toFixed(6)
    default:
      return parseFloat(amount).toFixed(4)
  }
}
