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
    address: '0x814ebF49951162795526126553BEbd3C52cd942A'
  },
  {
    symbol: 'PYUSDC',
    name: 'PayPal USD Coin',
    icon: '💵',
    chain: 'sepolia',
    address: '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9'
  },
  {
    symbol: 'sEUR',
    name: 'Synthetic Euro',
    icon: '🇪🇺',
    chain: 'sepolia',
    address: '0x9Dd77683Eea8c532E4d01A8322d25C505Ffe1A28'
  },
  {
    symbol: 'sJPY',
    name: 'Synthetic Japanese Yen',
    icon: '🇯🇵',
    chain: 'sepolia',
    address: '0x40c7A8c0afF326039feEa2630Ff3fFAB0FB0Acfa'
  },
  {
    symbol: 'sXAU',
    name: 'Synthetic Gold',
    icon: '🥇',
    chain: 'sepolia',
    address: '0x1419b1AFd8C61a01DBBCda2f9A45cac8B26F548F'
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
    name: 'PayPal USD Coin',
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
    symbol: 'sJPY',
    name: 'Synthetic Japanese Yen',
    icon: '🇯🇵',
    chain: 'flow-testnet',
    address: '0x0123456789012345678901234567890123456789'
  },
  {
    symbol: 'sXAU',
    name: 'Synthetic Gold',
    icon: '🥇',
    chain: 'flow-testnet',
    address: '0x1234567890123456789012345678901234567890'
  }
]

export default function TokenDropdown({ selectedToken, onTokenSelect, isOpen, onToggle }: TokenDropdownProps) {
  const [selectedChain, setSelectedChain] = useState<'sepolia' | 'flow-testnet'>('sepolia')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTokens = availableTokens.filter(token => 
    token.chain === selectedChain && 
    (token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
     token.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Reset search when modal opens
  const handleToggle = () => {
    if (!isOpen) {
      setSearchQuery('')
    }
    onToggle()
  }

  return (
    <>
      {/* Token Selection Button - MetaMask Style */}
      <button
        onClick={handleToggle}
        className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 rounded-xl px-4 py-3 border border-white/20 min-w-[140px] group"
      >
        {selectedToken ? (
          <>
            <div className="text-2xl flex-shrink-0">{selectedToken.icon}</div>
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-white font-semibold text-sm truncate">{selectedToken.symbol}</span>
              <span className="text-white/60 text-xs">{selectedToken.chain}</span>
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 bg-[#95B309] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">?</span>
            </div>
            <span className="text-white/70 text-sm">Select Token</span>
          </>
        )}
        <svg 
          className="w-4 h-4 text-white/60 transition-transform duration-200 group-hover:text-white/80 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Token Selection Modal - MetaMask Style */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 z-[99998]"
            onClick={handleToggle}
          />
          
          {/* Modal - MetaMask Style */}
          <div className="relative bg-white rounded-3xl p-0 max-w-sm w-full mx-4 shadow-2xl z-[100000] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 transform">
            {/* Header - MetaMask Style */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Select a token</h2>
              <button
                onClick={handleToggle}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Input - MetaMask Style */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search tokens"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#95B309] focus:border-transparent"
                />
              </div>
            </div>

            {/* Chain Selection - MetaMask Style */}
            <div className="px-4 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-1 bg-gray-50 rounded-2xl p-1">
                <button
                  onClick={() => setSelectedChain('sepolia')}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedChain === 'sepolia'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sepolia
                </button>
                <button
                  onClick={() => setSelectedChain('flow-testnet')}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedChain === 'flow-testnet'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Flow Testnet
                </button>
              </div>
            </div>

            {/* Token List - MetaMask Style */}
            <div className="max-h-80 overflow-y-auto">
              {filteredTokens.length > 0 ? (
                filteredTokens.map((token, index) => (
                  <button
                    key={`${token.chain}-${token.symbol}-${index}`}
                    onClick={() => {
                      onTokenSelect(token)
                      handleToggle()
                    }}
                    className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                  >
                    <div className="text-2xl flex-shrink-0">{token.icon}</div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900 font-medium text-sm">{token.symbol}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {token.chain}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{token.name}</p>
                    </div>
                    <div className="text-gray-300 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No tokens found</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {searchQuery ? 'Try a different search term' : 'No tokens available on this network'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer - MetaMask Style */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Select a token to continue
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
