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
  selectedToken?: string
  onTokenSelect?: (token: string) => void
}

export default function CurrencyInput({
  label,
  balance,
  amount,
  onAmountChange,
  onMaxClick,
  showSelectButton = false,
  selectedToken: propSelectedToken,
  onTokenSelect
}: CurrencyInputProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token)
    onTokenSelect?.(token.symbol)
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
        <div className="flex-1">
          <input
            type="text"
            placeholder="0.0"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="w-full text-xl font-semibold bg-transparent border-none outline-none placeholder-white/50 text-white"
          />
        </div>
        <TokenDropdown
          selectedToken={selectedToken}
          onTokenSelect={handleTokenSelect}
          isOpen={isDropdownOpen}
          onToggle={handleToggle}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-sm text-white/70">
          Balance: {balance}
        </div>
        {!showSelectButton && onMaxClick ? (
          <button 
            onClick={onMaxClick}
            className="text-sm text-[#95B309] hover:text-[#7A9207] transition-colors font-medium"
          >
            MAX
          </button>
        ) : null}
      </div>
    </div>
  )
}
