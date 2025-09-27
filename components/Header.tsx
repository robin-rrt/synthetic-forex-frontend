import { useState } from 'react'

export default function Header() {
  const [activeTab, setActiveTab] = useState('trade')

  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo Button */}
          <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-xl p-3 border border-white/20">
            <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
          </button>

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
              onClick={() => setActiveTab('pool')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'pool'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Pool
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
