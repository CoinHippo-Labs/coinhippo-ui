import { FiCompass, FiHash } from 'react-icons/fi'
import { RiHandCoinLine } from 'react-icons/ri'
import { CgTag } from 'react-icons/cg'
import { BsGraphUp } from 'react-icons/bs'
import { BiTransferAlt } from 'react-icons/bi'
import { HiOutlineViewGridAdd } from 'react-icons/hi'

export default [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/',
        icon: <FiCompass size={20} />,
        items: [],
      },
    ],
  },
  {
    title: 'Cryptocurrencies',
    items: [
      {
        title: 'Ranking',
        url: '/tokens',
        icon: <FiHash size={20} />,
        items: [
          {
            title: 'Market Cap',
            url: '/tokens',
            index_shortcut: 'Market Cap',
            items: [],
          },
          {
            title: 'High Volume',
            url: '/tokens/high-volume',
            items: [],
          },
          {
            title: 'Categories',
            url: '/tokens/categories',
            is_shortcut: true,
            items: [],
          },
        ],
      },
      {
        title: 'Categories',
        url: '/tokens/categories',
        icon: <CgTag size={20} />,
        items: [
          {
            title: 'All',
            url: '/tokens/categories',
            index_shortcut: 'Categories',
            items: [],
          },
          {
            title: 'DeFi',
            url: '/tokens/decentralized-finance-defi',
            index_shortcut: 'DeFi',
            items: [],
          },
          {
            title: 'NFTs',
            url: '/tokens/non-fungible-tokens-nft',
            index_shortcut: 'NFTs',
            items: [],
          },
          {
            title: 'Gaming',
            url: '/tokens/gaming',
            items: [],
          },
          {
            title: 'Binance Smart Chain',
            url: '/tokens/binance-smart-chain',
            image: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
            is_ecosystem: true,
            items: [],
          },
          {
            title: 'Solana',
            url: '/tokens/solana-ecosystem',
            image: 'https://assets.coingecko.com/coins/images/4128/large/coinmarketcap-solana-200.png',
            is_ecosystem: true,
            items: [],
          },
          {
            title: 'Avalanche',
            url: '/tokens/avalanche-ecosystem',
            image: 'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png',
            is_ecosystem: true,
            items: [],
          },
          {
            title: 'Polygon',
            url: '/tokens/polygon-ecosystem',
            image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
            is_ecosystem: true,
            items: [],
          },
          {
            title: 'Polkadot',
            url: '/tokens/dot-ecosystem',
            image: 'https://assets.coingecko.com/coins/images/12171/large/aJGBjJFU_400x400.jpg',
            is_ecosystem: true,
            items: [],
          },
        ],
        itemsClassName: 'max-h-80 overflow-y-scroll',
      },
      {
        title: 'Derivatives',
        url: '/derivatives',
        icon: <BsGraphUp size={20} />,
        items: [
          {
            title: 'Perpetuals',
            url: '/derivatives',
            items: [],
          },
          {
            title: 'Futures',
            url: '/derivatives/futures',
            items: [],
          },
          {
            title: 'Exchanges',
            url: '/exchanges/derivatives',
            is_shortcut: true,
            items: [],
          },
        ],
      },
      {
        title: 'Exchanges',
        url: '/exchanges',
        icon: <BiTransferAlt size={20} />,
        items: [
          {
            title: 'Spot',
            url: '/exchanges',
            index_shortcut: 'Exchanges',
            items: [],
          },
          {
            title: 'DEX',
            url: '/exchanges/dex',
            index_shortcut: 'DEX',
            items: [],
          },
          {
            title: 'Derivatives',
            url: '/exchanges/derivatives',
            items: [],
          },
        ],
      },
      {
        title: 'Public Companies',
        url: '/public-companies',
        icon: <RiHandCoinLine size={20} />,
        items: [
          {
            title: 'Bitcoin Treasury',
            url: '/public-companies/bitcoin',
            items: [],
          },
          {
            title: 'Ethereum Treasury',
            url: '/public-companies/ethereum',
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
        title: 'Widgets',
        url: '/widgets',
        icon: <HiOutlineViewGridAdd size={20} />,
        items: [],
      },
    ],
  },
]