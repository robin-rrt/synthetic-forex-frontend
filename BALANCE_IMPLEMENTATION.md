# getBalance Implementation with ethers.js

This implementation provides a way to fetch native ETH wallet balances using ethers.js library.

## Features

- ✅ Native ETH balance fetching using `provider.getBalance(address)`
- ✅ Automatic balance formatting using `ethers.formatEther()`
- ✅ Error handling and fallback values
- ✅ Integration with existing wallet connection flow
- ✅ UI display of ETH balance alongside token balances
- ✅ Test functions for debugging

## Implementation Details

### Core Function: `getBalance`

```typescript
const getBalance = async (address: string) => {
  // Creates ethers provider from window.ethereum
  const provider = new ethers.BrowserProvider(window.ethereum as any)
  
  // Gets native ETH balance using getBalance
  const balance = await provider.getBalance(address)
  
  // Formats balance using formatEther
  const formattedBalance = ethers.formatEther(balance)
  
  return {
    symbol: 'ETH',
    balance: parseFloat(formattedBalance).toFixed(6),
    decimals: 18,
    address: 'native'
  }
}
```

### Integration Points

1. **Wallet Connection**: Automatically fetches ETH balance when wallet connects
2. **Token Balances**: ETH balance is included in the token balances array
3. **UI Display**: ETH balance is shown in the balance debug section
4. **Testing**: "Test ETH Balance" button for debugging

### Usage Examples

#### Basic Usage
```typescript
// Get balance for connected wallet
const ethBalance = await getBalance(walletAddress)
console.log(`ETH Balance: ${ethBalance.balance} ${ethBalance.symbol}`)
```

#### With Custom Provider
```typescript
const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/your-api-key')
const ethBalance = await getBalance(walletAddress, provider)
```

#### In React Component
```typescript
const [ethBalance, setEthBalance] = useState('0.000000')

useEffect(() => {
  if (walletAddress) {
    getBalance(walletAddress).then(balance => {
      if (balance) {
        setEthBalance(balance.balance)
      }
    })
  }
}, [walletAddress])
```

## Files Modified

1. **`app/page.tsx`** - Main implementation with `getBalance` function
2. **`components/Header.tsx`** - Fixed prop interface for page navigation
3. **`utils/getBalance.ts`** - Standalone utility function with examples
4. **`BALANCE_IMPLEMENTATION.md`** - This documentation

## Testing

Use the "Test ETH Balance" button in the UI to test the `getBalance` function. This will:
- Fetch the current wallet's ETH balance
- Display the results in an alert dialog
- Log detailed information to the console

## Error Handling

The function includes comprehensive error handling:
- Checks for wallet connection
- Validates address parameter
- Catches and logs errors
- Returns fallback zero balance on errors

## Dependencies

- `ethers` v6.15.0 - For blockchain interactions
- Browser wallet (MetaMask, Coinbase Wallet, etc.) - For provider access
