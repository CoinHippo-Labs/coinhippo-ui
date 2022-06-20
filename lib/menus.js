import { FiCompass, FiHash } from 'react-icons/fi'
import { RiHandCoinLine } from 'react-icons/ri'
import { CgTag } from 'react-icons/cg'
import { BsGraphUp } from 'react-icons/bs'
import { HiOutlineViewGridAdd } from 'react-icons/hi'
import { BiTransferAlt } from 'react-icons/bi'

export const navigations = [
  {
    title: 'Overview',
    items: [
      {
        url: '/',
        icon: <FiCompass size={20} />,
        title: 'Dashboard',
        items: [],
      },
    ],
  },
  {
    title: 'Cryptocurrencies',
    items: [
      {
        url: '/tokens',
        icon: <FiHash size={20} />,
        title: 'Ranking',
        items: [
          {
            url: '/tokens',
            title: 'Market Cap',
            index_shortcut: 'Market Cap',
            items: [],
          },
          {
            url: '/tokens/high-volume',
            title: 'High Volume',
            items: [],
          },
          {
            url: '/tokens/categories',
            title: 'Categories',
            items: [],
            is_shortcut: true,
          },
        ],
      },
      {
        url: '/tokens/categories',
        icon: <CgTag size={20} />,
        title: 'Categories',
        itemsClassName: 'max-h-80 overflow-y-scroll',
        items: [
          {
            url: '/tokens/categories',
            title: 'All',
            index_shortcut: 'Categories',
            items: [],
          },
          {
            url: '/tokens/decentralized-finance-defi',
            title: 'DeFi',
            index_shortcut: 'DeFi',
            items: [],
          },
          {
            url: '/tokens/non-fungible-tokens-nft',
            title: 'NFTs',
            index_shortcut: 'NFTs',
            items: [],
          },
          {
            url: '/tokens/binance-smart-chain',
            title: 'Binance Smart Chain',
            image: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
            items: [],
            isEcosystem: true,
          },
          {
            url: '/tokens/dot-ecosystem',
            title: 'Polkadot',
            image: 'https://assets.coingecko.com/coins/images/12171/large/aJGBjJFU_400x400.jpg',
            items: [],
            isEcosystem: true,
          },
          {
            url: '/tokens/polygon-ecosystem',
            title: 'Polygon',
            image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
            items: [],
            isEcosystem: true,
          },
          {
            url: '/tokens/solana-ecosystem',
            title: 'Solana',
            image: 'https://assets.coingecko.com/coins/images/4128/large/coinmarketcap-solana-200.png',
            items: [],
            isEcosystem: true,
          },
          {
             url: '/tokens/avalanche-ecosystem',
            title: 'Avalanche',
            image: 'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png',
            items: [],
            isEcosystem: true,
          },
          {
            url: '/tokens/heco-chain-ecosystem',
            title: 'Heco',
            image: 'https://assets.coingecko.com/coins/images/2822/large/huobi-token-logo.png',
            items: [],
            isEcosystem: true,
          },
          {
            url: '/tokens/gaming',
            title: 'Play to Earn',
            items: [],
          },
        ],
      },
      {
        url: '/derivatives',
        icon: <BsGraphUp size={20} />,
        title: 'Derivatives',
        items: [
          {
            url: '/derivatives',
            title: 'Perpetuals',
            items: [],
          },
          {
            url: '/derivatives/futures',
            title: 'Futures',
            items: [],
          },
          {
            url: '/exchanges/derivatives',
            title: 'Exchanges',
            items: [],
            is_shortcut: true,
          },
        ],
      },
      {
        url: '/exchanges',
        icon: <BiTransferAlt size={20} />,
        title: 'Exchanges',
        items: [
          {
            url: '/exchanges',
            title: 'Spot',
            index_shortcut: 'Exchanges',
            items: [],
          },
          {
            url: '/exchanges/dex',
            title: 'DEX',
            index_shortcut: 'DEX',
            items: [],
          },
          {
            url: '/exchanges/derivatives',
            title: 'Derivatives',
            items: [],
          },
        ],
      },
      {
        url: '/public-companies',
        icon: <RiHandCoinLine size={20} />,
        title: 'Public Companies',
        items: [
          {
            url: '/public-companies/bitcoin',
            title: 'Bitcoin Treasury',
            image: 'https://bitcoin.org/favicon.png',
            symbol: 'btc',
            items: [],
          },
          {
            url: '/public-companies/ethereum',
            title: 'Ethereum Treasury',
            image: 'https://ethereum.org/favicon-32x32.png',
            symbol: 'eth',
            items: [],
          },
        ],
      },
    ],
  },
  {
    title: 'Resources',
    items: [
      {
        url: '/widgets',
        icon: <HiOutlineViewGridAdd size={20} />,
        title: 'Widgets',
        items: [],
      },
    ],
  },
]