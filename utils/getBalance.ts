import { ethers } from 'ethers'

/**
 * Get native ETH balance for a given wallet address using ethers.js
 * @param address - The wallet address to check balance for
 * @param provider - ethers.js provider (optional, will use window.ethereum if not provided)
 * @returns Promise<{symbol: string, balance: string, decimals: number, address: string} | null>
 */
export const getBalance = async (
  address: string, 
  provider?: ethers.Provider
): Promise<{
  symbol: string
  balance: string
  decimals: number
  address: string
} | null> => {
  if (!address) {
    console.log('❌ Cannot fetch ETH balance: No address provided')
    return null
  }

  console.log(`🔍 Fetching ETH balance for address: ${address}`)

  try {
    // Use provided provider or create one from window.ethereum
    let providerInstance: ethers.Provider
    if (provider) {
      providerInstance = provider
    } else if (typeof window !== 'undefined' && window.ethereum) {
      providerInstance = new ethers.BrowserProvider(window.ethereum as any)
    } else {
      console.log('❌ No provider available')
      return null
    }
    
    // Get native ETH balance using getBalance
    const balance = await providerInstance.getBalance(address)
    console.log(`💰 Raw ETH balance:`, balance.toString())
    
    // Convert balance to ETH using formatEther
    const formattedBalance = ethers.formatEther(balance)
    console.log(`💵 Formatted ETH balance:`, formattedBalance)
    
    const finalBalance = parseFloat(formattedBalance).toFixed(6)
    console.log(`✅ Final ETH balance:`, finalBalance)
    
    return {
      symbol: 'ETH',
      balance: finalBalance,
      decimals: 18,
      address: 'native'
    }
  } catch (error) {
    console.error('❌ Error fetching ETH balance:', error)
    console.error('👤 Wallet address:', address)
    console.error('🔍 Error details:', error)
    
    // Return zero balance
    return {
      symbol: 'ETH',
      balance: '0.000000',
      decimals: 18,
      address: 'native'
    }
  }
}

/**
 * Example usage of getBalance function
 */
export const exampleUsage = async () => {
  // Example 1: Using with wallet address directly
  const walletAddress = '0x742d35Cc6634C0532925a3b8D0B8b6C6b6e8e5b6'
  const ethBalance = await getBalance(walletAddress)
  
  if (ethBalance) {
    console.log(`ETH Balance: ${ethBalance.balance} ${ethBalance.symbol}`)
  }

  // Example 2: Using with custom provider
  const customProvider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/your-api-key')
  const ethBalanceWithProvider = await getBalance(walletAddress, customProvider)
  
  if (ethBalanceWithProvider) {
    console.log(`ETH Balance with custom provider: ${ethBalanceWithProvider.balance} ${ethBalanceWithProvider.symbol}`)
  }
}
