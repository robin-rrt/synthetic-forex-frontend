interface AmountInputProps {
  label: string
  amount: string
  placeholder?: string
  onAmountChange: (amount: string) => void
  unit?: string
}

export default function AmountInput({
  label,
  amount,
  placeholder = "Enter amount",
  onAmountChange,
  unit
}: AmountInputProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <label className="block text-sm font-medium text-white/90 mb-3">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="number"
          placeholder={placeholder}
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="flex-1 w-full text-xl font-semibold bg-transparent border-none outline-none placeholder-white/50 text-white"
        />
        {unit && (
          <div className="text-white/70">
            <span className="text-sm">{unit}</span>
          </div>
        )}
      </div>
    </div>
  )
}
