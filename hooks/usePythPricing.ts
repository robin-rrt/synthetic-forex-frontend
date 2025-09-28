import { useState, useEffect, useCallback } from 'react'
import { 
  getUSDINRRate, 
  calculateExpectedOutput, 
  formatPrice,
  getPriceFeedId 
} from '@/services/pythService'

interface PythPricingState {
  usdInrRate: number | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

export function usePythPricing() {
  const [state, setState] = useState<PythPricingState>({
    usdInrRate: null,
    isLoading: false,
    error: null,
    lastUpdated: null
  })

  const fetchUSDINRRate = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const rate = await getUSDINRRate()
      
      setState(prev => ({
        ...prev,
        usdInrRate: rate,
        isLoading: false,
        lastUpdated: new Date(),
        error: rate === null ? 'Failed to fetch rate' : null
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }))
    }
  }, [])

  // Fetch rate on mount and set up periodic updates
  useEffect(() => {
    fetchUSDINRRate()
    
    // Update rate every 30 seconds
    const interval = setInterval(fetchUSDINRRate, 30000)
    
    return () => clearInterval(interval)
  }, [fetchUSDINRRate])

  const calculateSwapOutput = useCallback((
    inputAmount: string,
    fromToken: string,
    toToken: string
  ): { outputAmount: string; rate: string; error?: string } => {
    const amount = parseFloat(inputAmount)
    
    if (isNaN(amount) || amount <= 0) {
      return { outputAmount: '0', rate: '0', error: 'Invalid input amount' }
    }

    // Handle PYUSD to sINR conversion using Pyth rate
    if (fromToken === 'PYUSDC' && toToken === 'sINR') {
      if (!state.usdInrRate) {
        return { 
          outputAmount: '0', 
          rate: '0', 
          error: 'USD/INR rate not available' 
        }
      }

      // PYUSDC has 6 decimals, sINR has -5 decimals (10^-5)
      // Convert input amount to base units (PYUSDC: multiply by 10^6)
      const inputInBaseUnits = amount * Math.pow(10, 5)
      
      // Apply exchange rate
      const outputInBaseUnits = inputInBaseUnits * state.usdInrRate
      
      // Convert to sINR units (divide by 10^5 since sINR has -5 decimals)
      const outputAmount = outputInBaseUnits / Math.pow(10, 5)
      
      return {
        outputAmount: outputAmount.toFixed(5),
        rate: formatPrice(state.usdInrRate, 2)
      }
    }

    // Handle sINR to PYUSD conversion (reverse rate)
    if (fromToken === 'sINR' && toToken === 'PYUSDC') {
      if (!state.usdInrRate) {
        return { 
          outputAmount: '0', 
          rate: '0', 
          error: 'USD/INR rate not available' 
        }
      }

      // Reverse rate: 1 USD = 1/rate INR
      const reverseRate = 1 / state.usdInrRate
      
      // sINR has -5 decimals (multiply by 10^5), PYUSDC has 6 decimals (divide by 10^6)
      const inputInBaseUnits = amount * Math.pow(10, 5)
      const outputInBaseUnits = inputInBaseUnits * reverseRate
      const outputAmount = outputInBaseUnits / Math.pow(10, 6)
      
      return {
        outputAmount: outputAmount.toFixed(6),
        rate: formatPrice(reverseRate, 6)
      }
    }

    // For other token pairs, return zero (not implemented yet)
    return { 
      outputAmount: '0', 
      rate: '0', 
      error: 'Token pair not supported by Pyth pricing' 
    }
  }, [state.usdInrRate])

  return {
    ...state,
    calculateSwapOutput,
    refreshRate: fetchUSDINRRate
  }
}
