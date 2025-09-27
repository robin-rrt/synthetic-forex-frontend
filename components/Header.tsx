import { useState } from 'react'

export default function Header() {
  const [activeTab, setActiveTab] = useState('portfolio')

  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side - Navigation */}
        <div className="flex items-center -ml-8">
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
            <button
              onClick={() => setActiveTab('trade')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'trade'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Trade
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'portfolio'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Portfolio
            </button>
          </div>
        </div>

        {/* Right side - Connect Button (moved from main page) */}
        <div className="flex items-center space-x-4">
          {/* Additional header buttons can go here */}
        </div>
      </div>
    </header>
  )
}
