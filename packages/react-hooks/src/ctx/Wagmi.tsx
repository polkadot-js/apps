import React from 'react'
import {WagmiProvider as CacheWagmiProvider} from 'wagmi'
import {RainbowKitProvider} from '@rainbow-me/rainbowkit';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {getDefaultConfig, getDefaultWallets} from '@rainbow-me/rainbowkit'
import {defineChain} from 'viem'
import {bitgetWallet, bybitWallet, okxWallet} from '@rainbow-me/rainbowkit/wallets'

export const BEVM_MAINNET = defineChain({
  id: 11501,
  name: 'BEVM Mainnet',
  // iconUrl: IconBevm,
  nativeCurrency: {
    name: 'BEVM',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-mainnet-1.bevm.io', 'https://rpc-mainnet-2.bevm.io'],
    },
  },
  blockExplorers: {
    default: { name: 'BEVM Mainnet Explorer', url: 'https://scan-mainnet.bevm.io'}
  },
  contracts: {
    multicall3: {
      address: '0xa7487A536968Be0D563901aeb3Fc07B099e2fb04',
    },
  },
})

export const BEVM_SIGNET = defineChain({
  id: 11504,
  name: 'BEVM signet',
  // iconUrl: IconBevm,
  nativeCurrency: {
    name: 'BEVM',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://signet.bevm.io/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'BEVM Signet Explorer', url: 'https://scan-signet.bevm.io'}
  },
  contracts: {
    multicall3: {
      address: '0xc4eb65b3CE01B89dB73B50a33F2C608D3f17F043',
    },
  },
})

export const BEVM_TESTNET = defineChain({
  id: 11503,
  name: 'BEVM testnet',
  // iconUrl: IconBevm,
  nativeCurrency: {
    name: 'BEVM',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.bevm.io/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'BEVM Testnet Explorer', url: 'https://scan-testnet.bevm.io'}
  },
})

const { wallets } = getDefaultWallets();

export const wagmiConfig = getDefaultConfig({
  appName: 'BEVM Wallet',
  projectId: '0a044cdac8adede634b1be7f0516509e',
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [okxWallet, bybitWallet, bitgetWallet],
    },
  ],
  chains: [BEVM_MAINNET, BEVM_SIGNET, BEVM_TESTNET],
  ssr: true, // If your dApp uses server side rendering (SSR)
  // transports: {
  //   [BEVM_MAINNET.id]: fallback([
  //     http('https://rpc-mainnet-1.bevm.io'),
  //     http('https://rpc-mainnet-2.bevm.io')
  //   ],  { rank: true }),
  //   [BEVM_TESTNET.id]: fallback([http('https://signet.bevm.io/rpc')])
  // },
});

const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode
}

export const WagmiProvider: React.FC<Props> = ({children}: Props) => {
  return (
    <CacheWagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en-US">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </CacheWagmiProvider>
  )
}
