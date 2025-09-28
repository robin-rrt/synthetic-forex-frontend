import { useState, useCallback } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { FOREX_AMM_ABI, FOREX_AMM_ADDRESS, TOKEN_ADDRESSES } from '../config/contracts'
import { parseUnits } from 'viem'
import { fetchPythPriceUpdate } from '../services/pythService'

interface SwapParams {
  tokenOutAddress: `0x${string}`
  amountIn: string
  minAmountOut?: string
  usePriceUpdate?: boolean
}

interface SwapResult {
  hash: `0x${string}` | undefined
  isLoading: boolean
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  error: Error | null
  data: any
}

export function useForexAmmSwap() {
  const [isPreparing, setIsPreparing] = useState(false)
  
  const { writeContract, data: hash, error: writeError, isPending, isError } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const executeSwap = useCallback(async (params: SwapParams): Promise<SwapResult> => {
    const {
      tokenOutAddress,
      amountIn,
      minAmountOut = '0',
      usePriceUpdate = false // Default to false for debugging
    } = params

    console.log('🔧 executeSwap called with params:', params)
    setIsPreparing(true)

    try {
      // Validate inputs
      if (!amountIn || amountIn === '0') {
        throw new Error('Invalid amount: amountIn is required and must be greater than 0')
      }

      if (!tokenOutAddress || tokenOutAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('Invalid token address: tokenOutAddress is required')
      }

      // Convert amounts to proper units (PYUSD has 6 decimals)
      const amountInWei = parseUnits(amountIn, 6)
      const minAmountOutWei = 0n // No slippage protection for now - must be bigint

      console.log('💰 Converted amounts:', {
        amountIn,
        amountInWei: amountInWei.toString(),
        minAmountOutWei: minAmountOutWei.toString(),
        tokenOutAddress
      })

      let txParams: any
      let shouldUsePriceUpdate = usePriceUpdate

      if (shouldUsePriceUpdate) {
        console.log('📊 Fetching Pyth price update...')
        try {
          const priceUpdateData = await fetchPythPriceUpdate()
          const priceUpdateBytes = [`0x${priceUpdateData}`] as `0x${string}`[]

          txParams = {
            address: FOREX_AMM_ADDRESS as `0x${string}`,
            abi: FOREX_AMM_ABI,
            functionName: 'swapPYUSDForToken',
            args: [tokenOutAddress, amountInWei, minAmountOutWei, priceUpdateBytes],
            value: 1n, // 1 wei as specified
          }
          console.log('✅ Using payable version with price update')
        } catch (priceError) {
          console.warn('⚠️ Failed to fetch price update, falling back to non-payable version:', priceError)
          shouldUsePriceUpdate = false
        }
      }

      if (!shouldUsePriceUpdate) {
        // Use the non-payable version without price update (3 parameters)
        txParams = {
          address: FOREX_AMM_ADDRESS as `0x${string}`,
          abi: FOREX_AMM_ABI,
          functionName: 'swapPYUSDForToken',
          args: [tokenOutAddress, amountInWei, minAmountOutWei],
          value: 0n, // No value for non-payable version
        }
        console.log('✅ Using non-payable version without price update')
      }

      console.log('📝 Final txParams:', txParams)

      // Execute the transaction
      console.log('🚀 Executing writeContract...')
      writeContract(txParams)

      return {
        hash,
        isLoading: isConfirming || isPreparing,
        isPending: isPending,
        isSuccess: isConfirmed,
        isError: isError,
        error: writeError,
        data: null
      }
    } catch (error) {
      console.error('❌ Error executing swap:', error)
      return {
        hash: undefined,
        isLoading: false,
        isPending: false,
        isSuccess: false,
        isError: true,
        error: error as Error,
        data: null
      }
    } finally {
      setIsPreparing(false)
    }
  }, [writeContract, hash, isPending, isError, isConfirming, isConfirmed, writeError])

  return {
    executeSwap,
    hash,
    isLoading: isPreparing || isConfirming,
    isPending,
    isSuccess: isConfirmed,
    isError,
    error: writeError,
  }
}

/**
 * Hook to get quote from ForexAMM contract
 */
export function useForexAmmQuote(
  tokenOutAddress: `0x${string}` | undefined,
  amountIn: string,
  enabled: boolean = true
) {
  const amountInWei = amountIn && amountIn !== '0' ? parseUnits(amountIn, 6) : 0n

  return useReadContract({
    address: FOREX_AMM_ADDRESS as `0x${string}`,
    abi: FOREX_AMM_ABI,
    functionName: 'quotePYUSDForToken',
    args: tokenOutAddress && amountInWei > 0n ? [tokenOutAddress, amountInWei] : undefined,
    query: {
      enabled: enabled && !!tokenOutAddress && amountInWei > 0n,
    },
  })
}

/**
 * Hook to check if ForexAMM contract is paused
 */
export function useForexAmmStatus() {
  return useReadContract({
    address: FOREX_AMM_ADDRESS as `0x${string}`,
    abi: FOREX_AMM_ABI,
    functionName: 'paused',
  })
}
