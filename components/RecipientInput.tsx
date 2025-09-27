interface RecipientInputProps {
  description?: string
  optional?: boolean
}

export default function RecipientInput({
  description = "Transaction fees will be deducted from your input",
  optional = true
}: RecipientInputProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <label className="block text-sm font-medium text-white/90 mb-3">
        Recipient {optional && <span className="text-white/60 text-sm font-normal">(optional)</span>}
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Enter recipient address (optional)"
          className="flex-1 w-full text-lg bg-transparent border-none outline-none placeholder-white/50 text-white"
        />
        <div className="text-gray-600">
          <button className="text-blue-500 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0v4h4V6zm-8 7h4m-4 0l3 3 6-6" />
            </svg>
          </button>
        </div>
      </div>
      {description && (
        <div className="mt-2 text-sm text-white/70">
          {description}
        </div>
      )}
    </div>
  )
}
