import { useState } from 'react'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  onWalletConnect?: (walletName: string, address?: string) => void
}

interface Wallet {
  name: string
  icon: string
  description: string
  isInstalled: boolean
  onClick: () => void
}

export default function WalletModal({ isOpen, onClose, onWalletConnect }: WalletModalProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null)

  console.log('WalletModal render - isOpen:', isOpen)

  if (!isOpen) return null

  const connectToMetaMask = async () => {
    console.log('MetaMask connection attempt')
    if (typeof window === 'undefined' || !window.ethereum?.isMetaMask) {
      console.log('MetaMask not detected, redirecting to download')
      window.open('https://metamask.io/download/', '_blank')
      return
    }

    console.log('MetaMask detected, requesting connection')
    setIsConnecting('MetaMask')
    
    try {
      // Request account access
      const accounts = await window.ethereum?.request?.({
        method: 'eth_requestAccounts'
      })
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0]
        console.log('Connected to MetaMask:', address)
        onWalletConnect?.('MetaMask', address)
      }
    } catch (error: any) {
      console.error('MetaMask connection failed:', error)
      
      if (error.code === 4001) {
        alert('Connection rejected by user')
      } else {
        alert('Failed to connect to MetaMask. Please try again.')
      }
    } finally {
      setIsConnecting(null)
    }
  }

  const connectToCoinbase = async () => {
    if (typeof window === 'undefined' || !window.ethereum?.isCoinbaseWallet) {
      window.open('https://www.coinbase.com/wallet', '_blank')
      return
    }

    setIsConnecting('Coinbase Wallet')
    
    try {
      const accounts = await window.ethereum?.request?.({
        method: 'eth_requestAccounts'
      })
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0]
        console.log('Connected to Coinbase Wallet:', address)
        onWalletConnect?.('Coinbase Wallet', address)
      }
    } catch (error: any) {
      console.error('Coinbase Wallet connection failed:', error)
      
      if (error.code === 4001) {
        alert('Connection rejected by user')
      } else {
        alert('Failed to connect to Coinbase Wallet. Please try again.')
      }
    } finally {
      setIsConnecting(null)
    }
  }

  const connectToTrust = async () => {
    if (typeof window === 'undefined' || !window.ethereum?.isTrust) {
      window.open('https://trustwallet.com/', '_blank')
      return
    }

    setIsConnecting('Trust Wallet')
    
    try {
      const accounts = await window.ethereum?.request?.({
        method: 'eth_requestAccounts'
      })
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0]
        console.log('Connected to Trust Wallet:', address)
        onWalletConnect?.('Trust Wallet', address)
      }
    } catch (error: any) {
      console.error('Trust Wallet connection failed:', error)
      
      if (error.code === 4001) {
        alert('Connection rejected by user')
      } else {
        alert('Failed to connect to Trust Wallet. Please try again.')
      }
    } finally {
      setIsConnecting(null)
    }
  }

  const wallets: Wallet[] = [
    {
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using MetaMask browser extension',
      isInstalled: typeof window !== 'undefined' && !!window.ethereum?.isMetaMask,
      onClick: connectToMetaMask
    },
    {
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect using WalletConnect protocol',
      isInstalled: true,
      onClick: () => {
        console.log('Connecting to WalletConnect...')
        onWalletConnect?.('WalletConnect')
      }
    },
    {
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Connect using Coinbase Wallet',
      isInstalled: typeof window !== 'undefined' && !!window.ethereum?.isCoinbaseWallet,
      onClick: connectToCoinbase
    },
    {
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Connect using Trust Wallet',
      isInstalled: typeof window !== 'undefined' && !!window.ethereum?.isTrust,
      onClick: connectToTrust
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Wallet List */}
        <div className="space-y-3">
          {wallets.map((wallet, index) => (
            <button
              key={index}
              onClick={wallet.onClick}
              disabled={isConnecting === wallet.name}
              className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{wallet.icon}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-white">{wallet.name}</h3>
                    {wallet.isInstalled && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                        Installed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/70">{wallet.description}</p>
                </div>
                <div className="text-white/50 group-hover:text-white transition-colors">
                  {isConnecting === wallet.name ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-white/60 text-center">
            By connecting a wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      isCoinbaseWallet?: boolean
      isTrust?: boolean
      request?: (args: { method: string; params?: any[] }) => Promise<any>
    }
  }
}
