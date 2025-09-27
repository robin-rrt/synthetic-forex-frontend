import { useState } from 'react'

interface Token {
  symbol: string
  name: string
  icon: string
  chain: 'sepolia' | 'flow-testnet'
  address: string
}

interface TokenDropdownProps {
  selectedToken: Token | null
  onTokenSelect: (token: Token) => void
  isOpen: boolean
  onToggle: () => void
}

const availableTokens: Token[] = [
  // Sepolia tokens
  {
    symbol: 'sINR',
    name: 'Synthetic Indian Rupee',
    icon: '🇮🇳',
    chain: 'sepolia',
    address: '0x1234567890123456789012345678901234567890'
  },
  {
    symbol: 'PYUSDC',
    name: 'Pyth USD Coin',
    icon: '💵',
    chain: 'sepolia',
    address: '0x2345678901234567890123456789012345678901'
  },
  {
    symbol: 'sEUR',
    name: 'Synthetic Euro',
    icon: '🇪🇺',
    chain: 'sepolia',
    address: '0x3456789012345678901234567890123456789012'
  },
  {
    symbol: 'sGBP',
    name: 'Synthetic British Pound',
    icon: '🇬🇧',
    chain: 'sepolia',
    address: '0x4567890123456789012345678901234567890123'
  },
  {
    symbol: 'sJPY',
    name: 'Synthetic Japanese Yen',
    icon: '🇯🇵',
    chain: 'sepolia',
    address: '0x5678901234567890123456789012345678901234'
  },
  // Flow testnet tokens
  {
    symbol: 'sINR',
    name: 'Synthetic Indian Rupee',
    icon: '🇮🇳',
    chain: 'flow-testnet',
    address: '0x6789012345678901234567890123456789012345'
  },
  {
    symbol: 'PYUSDC',
    name: 'Pyth USD Coin',
    icon: '💵',
    chain: 'flow-testnet',
    address: '0x7890123456789012345678901234567890123456'
  },
  {
    symbol: 'sEUR',
    name: 'Synthetic Euro',
    icon: '🇪🇺',
    chain: 'flow-testnet',
    address: '0x8901234567890123456789012345678901234567'
  },
  {
    symbol: 'sGBP',
    name: 'Synthetic British Pound',
    icon: '🇬🇧',
    chain: 'flow-testnet',
    address: '0x9012345678901234567890123456789012345678'
  },
  {
    symbol: 'sJPY',
    name: 'Synthetic Japanese Yen',
    icon: '🇯🇵',
    chain: 'flow-testnet',
    address: '0x0123456789012345678901234567890123456789'
  }
]

export default function TokenDropdown({ selectedToken, onTokenSelect, isOpen, onToggle }: TokenDropdownProps) {
  const [selectedChain, setSelectedChain] = useState<'sepolia' | 'flow-testnet'>('sepolia')

  const filteredTokens = availableTokens.filter(token => token.chain === selectedChain)

  return (
    <>
      {/* Token Selection Button */}
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 rounded-xl px-4 py-3 border border-white/20 min-w-[140px]"
      >
        {selectedToken ? (
          <>
            <div className="text-2xl">{selectedToken.icon}</div>
            <div className="flex flex-col items-start">
              <span className="text-white font-semibold text-sm">{selectedToken.symbol}</span>
              <span className="text-white/60 text-xs">{selectedToken.chain}</span>
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">?</span>
            </div>
            <span className="text-white/70 text-sm">Select Token</span>
          </>
        )}
        <svg 
          className="w-4 h-4 text-white/60 transition-transform duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Token Selection Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[99998]"
            onClick={onToggle}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl z-[100000]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Select Token</h2>
              <button
                onClick={onToggle}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chain Selection */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setSelectedChain('sepolia')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedChain === 'sepolia'
                      ? 'bg-green-400 text-white font-semibold hover:bg-green-500'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Sepolia
                </button>
                <button
                  onClick={() => setSelectedChain('flow-testnet')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedChain === 'flow-testnet'
                      ? 'bg-green-400 text-white font-semibold hover:bg-green-500'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Flow Testnet
                </button>
              </div>
            </div>

            {/* Token List */}
            <div className="max-h-80 overflow-y-auto space-y-2">
              {filteredTokens.map((token, index) => (
                <button
                  key={`${token.chain}-${token.symbol}-${index}`}
                  onClick={() => {
                    onTokenSelect(token)
                    onToggle()
                  }}
                  className="w-full flex items-center space-x-4 p-4 hover:bg-gray-100 transition-colors duration-200 rounded-xl"
                >
                  <div className="text-2xl">{token.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900 font-semibold">{token.symbol}</span>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        {token.chain}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{token.name}</p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
