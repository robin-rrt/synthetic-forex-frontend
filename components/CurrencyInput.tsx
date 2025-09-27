import { useState } from 'react'
import TokenDropdown from './TokenDropdown'

interface Token {
  symbol: string
  name: string
  icon: string
  chain: 'sepolia' | 'flow-testnet'
  address: string
}

interface CurrencyInputProps {
  label: string
  balance: string
  amount: string
  onAmountChange: (amount: string) => void
  onMaxClick?: () => void
  showSelectButton?: boolean
}

export default function CurrencyInput({
  label,
  balance,
  amount,
  onAmountChange,
  onMaxClick,
  showSelectButton = false
}: CurrencyInputProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token)
  }

  const handleToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <label className="block text-sm font-medium text-white/90 mb-3">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        <TokenDropdown
          selectedToken={selectedToken}
          onTokenSelect={handleTokenSelect}
          isOpen={isDropdownOpen}
          onToggle={handleToggle}
        />
        <div className="flex-1">
          <input
            type="text"
            placeholder="0.0"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="w-full text-xl font-semibold bg-transparent border-none outline-none placeholder-white/50 text-white"
          />
        </div>
        <div className="text-gray-600">
          {!showSelectButton && onMaxClick ? (
            <button 
              onClick={onMaxClick}
              className="px-4 py-2 bg-green-400 text-white rounded-xl hover:bg-green-500 transition-all duration-300 font-semibold"
            >
              MAX
            </button>
          ) : null}
        </div>
      </div>
      <div className="mt-2 text-sm text-white/70">
        Balance: {balance}
      </div>
    </div>
  )
}
