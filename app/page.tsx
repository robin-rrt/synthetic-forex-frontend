'use client'

import { useState } from 'react'
import CurrencyInput from '@/components/CurrencyInput'
import AmountInput from '@/components/AmountInput'
import RecipientInput from '@/components/RecipientInput'
import Background from '@/components/BackgroundImage'
import WalletModal from '@/components/WalletModal'
import Header from '@/components/Header'

export default function Home() {
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [swapAmount, setSwapAmount] = useState('')
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [activeTab, setActiveTab] = useState<'swap' | 'buy'>('swap')
  
  // Buy tab states
  const [buyFromAmount, setBuyFromAmount] = useState('')
  const [buyToAmount, setBuyToAmount] = useState('')

  const handleMaxClick = () => {
    setFromAmount('100.00') // Example max amount
  }

  const handleConnectWallet = () => {
    console.log('Connect button clicked')
    setIsWalletModalOpen(true)
  }

  const handleWalletConnect = (walletName: string, address?: string) => {
    setIsConnected(true)
    setConnectedWallet(walletName)
    if (address) {
      setWalletAddress(address)
    }
    setIsWalletModalOpen(false)
  }

  return (
    <main className="min-h-screen relative">
      {/* Background Video */}
      <Background videoPath="/entities/videos/background.mp4" />
      
      {/* Header */}
      <Header />
      
      {/* Connect Button - Top Right */}
      <div className="absolute top-6 right-6 z-40">
        {isConnected ? (
          <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-white/30 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{connectedWallet}</span>
              {walletAddress && (
                <span className="text-xs text-white/70">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <button 
            onClick={handleConnectWallet}
            className="bg-green-400 backdrop-blur-sm text-white px-8 py-3 rounded-xl hover:bg-green-500 transition-colors border border-green-300/30 text-lg font-semibold cursor-pointer shadow-lg"
            style={{ pointerEvents: 'auto' }}
          >
            Connect
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-2xl pt-32">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/30">
          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20 mb-6">
            <button
              onClick={() => setActiveTab('swap')}
              className={`flex-1 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'swap'
                  ? 'bg-green-400 text-white font-semibold hover:bg-green-500'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Swap
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'buy'
                  ? 'bg-green-400 text-white font-semibold hover:bg-green-500'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Buy
            </button>
          </div>

          <div className="space-y-6">

            {/* Swap Tab Content */}
            {activeTab === 'swap' && (
              <>
                {/* From Currency */}
                <CurrencyInput
                  label="From"
                  balance="0.00"
                  amount={fromAmount}
                  onAmountChange={setFromAmount}
                  onMaxClick={handleMaxClick}
                />

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>

                {/* To Currency */}
                <CurrencyInput
                  label="To"
                  balance="0.00"
                  amount={toAmount}
                  onAmountChange={setToAmount}
                  showSelectButton={true}
                />

                {/* Amount */}
                <AmountInput
                  label="Amount"
                  amount={swapAmount}
                  placeholder="Enter amount"
                  onAmountChange={setSwapAmount}
                  unit="ETH"
                />

                {/* Recipient */}
                <RecipientInput />

                {/* Swap Button */}
                <button className="w-full bg-green-400 backdrop-blur-sm text-white text-lg font-bold py-4 rounded-2xl hover:bg-green-500 transition-all duration-300 shadow-lg border border-green-300/30">
                  Swap
                </button>
              </>
            )}

            {/* Buy Tab Content */}
            {activeTab === 'buy' && (
              <>
                {/* From Token */}
                <CurrencyInput
                  label="Pay with"
                  balance="0.00"
                  amount={buyFromAmount}
                  onAmountChange={setBuyFromAmount}
                />

                {/* To Token */}
                <CurrencyInput
                  label="Receive"
                  balance="0.00"
                  amount={buyToAmount}
                  onAmountChange={setBuyToAmount}
                />

                {/* Buy Button */}
                <button className="w-full bg-green-400 backdrop-blur-sm text-white text-lg font-bold py-4 rounded-2xl hover:bg-green-500 transition-all duration-300 shadow-lg border border-green-300/30">
                  Buy
                </button>
              </>
            )}

            {/* Info Text */}
            <div className="text-center text-sm text-white/60">
              By {activeTab === 'swap' ? 'swapping' : 'buying'}, you agree to our Terms of Service
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)}
        onWalletConnect={handleWalletConnect}
      />
    </main>
  )
}