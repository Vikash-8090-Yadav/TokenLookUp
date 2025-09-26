export interface Chain {
  id: string
  name: string
  shortName: string
  rpcUrl: string
  blockExplorer: string
  apiUrl: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  color: string
  icon: string
}

export const chains: Chain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    shortName: 'ETH',
    rpcUrl: 'https://eth.blockscout.com',
    blockExplorer: 'https://eth.blockscout.com',
    apiUrl: 'https://eth.blockscout.com/api/v2',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    color: '#627EEA',
    icon: '🔷'
  },
  {
    id: 'base',
    name: 'Base',
    shortName: 'BASE',
    rpcUrl: 'https://base.blockscout.com',
    blockExplorer: 'https://base.blockscout.com',
    apiUrl: 'https://base.blockscout.com/api/v2',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    color: '#0052FF',
    icon: '🔵'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    shortName: 'MATIC',
    rpcUrl: 'https://polygon.blockscout.com',
    blockExplorer: 'https://polygon.blockscout.com',
    apiUrl: 'https://polygon.blockscout.com/api/v2',
    nativeCurrency: {
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18
    },
    color: '#8247E5',
    icon: '🟣'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum One',
    shortName: 'ARB',
    rpcUrl: 'https://arbitrum.blockscout.com',
    blockExplorer: 'https://arbitrum.blockscout.com',
    apiUrl: 'https://arbitrum.blockscout.com/api/v2',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    color: '#28A0F0',
    icon: '🔵'
  },
  {
    id: 'optimism',
    name: 'Optimism',
    shortName: 'OP',
    rpcUrl: 'https://optimism.blockscout.com',
    blockExplorer: 'https://optimism.blockscout.com',
    apiUrl: 'https://optimism.blockscout.com/api/v2',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    color: '#FF0420',
    icon: '🔴'
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain',
    shortName: 'BSC',
    rpcUrl: 'https://bsc.blockscout.com',
    blockExplorer: 'https://bsc.blockscout.com',
    apiUrl: 'https://bsc.blockscout.com/api/v2',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    color: '#F3BA2F',
    icon: '🟡'
  }
]

export const defaultChain = chains[0] // Ethereum

export function getChainById(id: string): Chain | undefined {
  return chains.find(chain => chain.id === id)
}
