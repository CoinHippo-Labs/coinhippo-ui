import Image from '../../image'
import { toArray } from '../../../lib/utils'

export default toArray([
  {
    title: 'Overview',
    path: '/',
  },
  {
    title: 'Market Cap',
    path: '/tokens',
    group: 'ranking',
  },
  {
    title: 'High Volume',
    path: '/tokens/high-volume',
    group: 'ranking',
  },
  {
    title: 'All',
    path: '/tokens/categories',
    group: 'categories',
  },
  {
    title: 'DeFi',
    path: '/tokens/decentralized-finance-defi',
    group: 'categories',
  },
  {
    title: 'NFTs',
    path: '/tokens/non-fungible-tokens-nft',
    group: 'categories',
  },
  {
    title: 'Gaming',
    path: '/tokens/gaming',
    group: 'categories',
  },
  {
    title: 'Binance Smart Chain',
    path: '/tokens/binance-smart-chain',
    group: 'categories',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    is_ecosystem: true,
  },
  {
    title: 'Polygon',
    path: '/tokens/polygon-ecosystem',
    group: 'categories',
    image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    is_ecosystem: true,
  },
  {
    title: 'Perpetuals',
    path: '/derivatives',
    group: 'derivatives',
  },
  {
    title: 'Futures',
    path: '/derivatives/futures',
    group: 'derivatives',
  },
  {
    title: 'Exchanges',
    path: '/exchanges/derivatives',
    group: 'derivatives',
  },
  {
    title: 'Spot',
    path: '/exchanges',
    group: 'exchanges',
  },
  {
    title: 'DEX',
    path: '/exchanges/dex',
    group: 'exchanges',
  },
  {
    title: 'Derivatives',
    path: '/exchanges/derivatives',
    group: 'exchanges',
  },
  {
    title: 'Swap',
    path: '/swap',
    icon: (
      <Image
        src="/logos/others/squid.svg"
        width={24}
        height={24}
      />
    ),
    highlight: true,
  },
])