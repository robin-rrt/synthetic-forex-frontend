// Pyth Hermes API service for fetching real-time price data

export interface PythPriceData {
  id: string
  price: {
    price: string
    conf: string
    expo: number
    publish_time: number
  }
  ema_price: {
    price: string
    conf: string
    expo: number
    publish_time: number
  }
  metadata: {
    slot: number
    proof_available_time: number
    prev_publish_time: number
  }
}

export interface PythResponse {
  binary: {
    encoding: string
    data: string[]
  }
  parsed: PythPriceData[]
}

// Pyth price feed IDs for different currency pairs
export const PYTH_PRICE_FEED_IDS = {
  'USD/INR': '0ac0f9a2886fc2dd708bc66cc2cea359052ce89d324f45d95fadbc6c4fcf1809',
  'USD/EUR': 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  'USD/JPY': 'ef2c98c803ba503c7f3edf8f4e4a9e7a9e5c5e5e5e5e5e5e5e5e5e5e5e5e5e5',
  'USD/XAU': 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // Gold
  // Add more as needed
} as const

/**
 * Fetch latest price data from Pyth Hermes API
 */
export async function fetchPythPrice(feedId: string): Promise<PythPriceData | null> {
  try {
    const url = `https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=${feedId}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: PythResponse = await response.json()
    
    if (data.parsed && data.parsed.length > 0) {
      return data.parsed[0]
    }
    
    return null
  } catch (error) {
    console.error('Error fetching Pyth price:', error)
    return null
  }
}

/**
 * Parse Pyth price data and convert to human-readable format
 */
export function parsePythPrice(priceData: PythPriceData): number {
  const price = BigInt(priceData.price.price)
  const expo = priceData.price.expo
  
  // Convert from the exponential format to decimal
  const multiplier = Math.pow(10, expo)
  const priceInDecimal = Number(price) * multiplier
  
  return priceInDecimal
}

/**
 * Fetch raw binary price update data from Pyth Hermes API
 * This returns the binary data needed for price updates in smart contracts
 */
export async function fetchPythPriceUpdate(feedId: string = PYTH_PRICE_FEED_IDS['USD/INR']): Promise<string> {
  try {
    const url = `https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=${feedId}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: PythResponse = await response.json()
    
    if (data.binary && data.binary.data && data.binary.data.length > 0) {
      return data.binary.data[0]
    }
    
    throw new Error('No binary price update data available')
  } catch (error) {
    console.error('Error fetching Pyth price update:', error)
    throw error
  }
}

/**
 * Get USD/INR exchange rate from Pyth
 */
export async function getUSDINRRate(): Promise<number | null> {
  const priceData = await fetchPythPrice(PYTH_PRICE_FEED_IDS['USD/INR'])
  
  if (!priceData) {
    return null
  }
  
  return parsePythPrice(priceData)
}

/**
 * Calculate expected output amount based on Pyth rate
 */
export function calculateExpectedOutput(
  inputAmount: number,
  exchangeRate: number,
  inputDecimals: number = 6,
  outputDecimals: number = 18
): number {
  // Convert input amount to base units (considering decimals)
  const inputInBaseUnits = inputAmount * Math.pow(10, inputDecimals)
  
  // Apply exchange rate
  const outputInBaseUnits = inputInBaseUnits * exchangeRate
  
  // Convert back to output token units
  const outputAmount = outputInBaseUnits / Math.pow(10, outputDecimals)
  
  return outputAmount
}

/**
 * Calculate PYUSDC to sINR conversion with correct decimals
 */
export function calculatePYUSDToSINR(
  pyusdAmount: number,
  usdInrRate: number
): number {
  // PYUSDC has 6 decimals, sINR has -5 decimals (10^-5)
  const inputInBaseUnits = pyusdAmount * Math.pow(10, 6)
  const outputInBaseUnits = inputInBaseUnits * usdInrRate
  const outputAmount = outputInBaseUnits / Math.pow(10, 5) // sINR has -5 decimals
  
  return outputAmount
}

/**
 * Calculate sINR to PYUSDC conversion with correct decimals
 */
export function calculateSINRToPYUSD(
  sinrAmount: number,
  usdInrRate: number
): number {
  // sINR has -5 decimals (multiply by 10^5), PYUSDC has 6 decimals (divide by 10^6)
  const reverseRate = 1 / usdInrRate
  const inputInBaseUnits = sinrAmount * Math.pow(10, 5)
  const outputInBaseUnits = inputInBaseUnits * reverseRate
  const outputAmount = outputInBaseUnits / Math.pow(10, 6)
  
  return outputAmount
}

/**
 * Format price for display
 */
export function formatPrice(price: number, decimals: number = 4): string {
  return price.toFixed(decimals)
}

/**
 * Get price feed ID for a given currency pair
 */
export function getPriceFeedId(fromCurrency: string, toCurrency: string): string | null {
  const pair = `${fromCurrency}/${toCurrency}`
  return PYTH_PRICE_FEED_IDS[pair as keyof typeof PYTH_PRICE_FEED_IDS] || null
}

/**
 * Parse binary Pyth price data (alternative function name for compatibility)
 */
export function parsePythPriceData(priceData: PythPriceData): number {
  return parsePythPrice(priceData)
}

/**
 * Get USD/INR rate (alternative function name for compatibility)
 */
export async function getUsdInrRate(): Promise<number | null> {
  return getUSDINRRate()
}
