export default {
  mainnet: {
    evm: [
      {
        id: 'ethereum',
        name: 'Ethereum',
        short_name: 'ETH',
        chain_id: 1,
        provider_params: [
          {
            chainId: '0x1',
            chainName: 'Ethereum',
            rpcUrls: [
              'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
              'https://rpc.ankr.com/eth',
            ],
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://etherscan.io',
            ],
          },
        ],
        explorer: {
          name: 'Etherscan',
          url: 'https://etherscan.io',
          icon: '/logos/explorers/etherscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/ethereum.png',
      },
      {
        id: 'binance',
        name: 'BNB Chain',
        short_name: 'BNB',
        chain_id: 56,
        provider_params: [
          {
            chainId: '0x38',
            chainName: 'BNB Chain',
            rpcUrls: [
              'https://rpc.ankr.com/bsc',
              'https://bscrpc.com',
            ],
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://bscscan.com',
            ],
          },
        ],
        explorer: {
          name: 'BscScan',
          url: 'https://bscscan.com',
          icon: '/logos/explorers/bscscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/binance.png',
      },
      {
        id: 'polygon',
        name: 'Polygon',
        short_name: 'MATIC',
        chain_id: 137,
        provider_params: [
          {
            chainId: '0x89',
            chainName: 'Polygon',
            rpcUrls: [
              'https://rpc.ankr.com/polygon',
              'https://matic-mainnet.chainstacklabs.com',
              'https://polygon-rpc.com',
            ],
            nativeCurrency: {
              name: 'Polygon',
              symbol: 'MATIC',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://polygonscan.com',
            ],
          },
        ],
        explorer: {
          name: 'Polygonscan',
          url: 'https://polygonscan.com',
          icon: '/logos/explorers/polygonscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/polygon.png',
      },
      {
        id: 'optimism',
        name: 'Optimism',
        short_name: 'OPT',
        chain_id: 10,
        provider_params: [
          {
            chainId: '0xa',
            chainName: 'Optimism',
            rpcUrls: [
              'https://rpc.ankr.com/optimism',
              'https://mainnet.optimism.io',
            ],
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://optimistic.etherscan.io',
            ],
          },
        ],
        explorer: {
          name: 'Etherscan',
          url: 'https://optimistic.etherscan.io',
          icon: '/logos/explorers/etherscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/optimism.png',
      },
      {
        id: 'arbitrum',
        name: 'Arbitrum',
        short_name: 'ARB',
        chain_id: 42161,
        provider_params: [
          {
            chainId: '0xa4b1',
            chainName: 'Arbitrum',
            rpcUrls: [
              'https://arbitrum-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
              'https://rpc.ankr.com/arbitrum',
              'https://arb1.arbitrum.io/rpc',
            ],
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://arbiscan.io',
            ],
          },
        ],
        explorer: {
          name: 'Arbiscan',
          url: 'https://arbiscan.io',
          icon: '/logos/explorers/arbiscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/arbitrum.png',
      },
      {
        id: 'avalanche',
        name: 'Avalanche',
        short_name: 'AVAX',
        chain_id: 43114,
        provider_params: [
          {
            chainId: '0xa86a',
            chainName: 'Avalanche',
            rpcUrls: [
              'https://rpc.ankr.com/avalanche',
              'https://api.avax.network/ext/bc/C/rpc',
            ],
            nativeCurrency: {
              name: 'Avalanche',
              symbol: 'AVAX',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://snowtrace.io',
            ],
          },
        ],
        explorer: {
          name: 'Snowtrace',
          url: 'https://snowtrace.io',
          icon: '/logos/explorers/snowtrace.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/avalanche.png',
      },
      {
        id: 'fantom',
        name: 'Fantom',
        short_name: 'FTM',
        chain_id: 250,
        provider_params: [
          {
            chainId: '0xfa',
            chainName: 'Fantom',
            rpcUrls: [
              'https://rpc.ankr.com/fantom',
              'https://rpc.ftm.tools',
              'https://rpcapi.fantom.network',
            ],
            nativeCurrency: {
              name: 'Fantom',
              symbol: 'FTM',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://ftmscan.com',
            ],
          },
        ],
        explorer: {
          name: 'FTMScan',
          url: 'https://ftmscan.com',
          icon: '/logos/explorers/ftmscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/fantom.png',
      },
      {
        id: 'moonbeam',
        name: 'Moonbeam',
        short_name: 'MBEAM',
        chain_id: 1284,
        provider_params: [
          {
            chainId: '0x504',
            chainName: 'Moonbeam',
            rpcUrls: [
              'https://rpc.ankr.com/moonbeam',
              'https://rpc.api.moonbeam.network',
            ],
            nativeCurrency: {
              name: 'Moonbeam',
              symbol: 'GLMR',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://moonscan.io',
            ],
          },
        ],
        explorer: {
          name: 'Moonscan',
          url: 'https://moonscan.io',
          icon: '/logos/explorers/moonbeam.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/moonbeam.png',
      },
      {
        id: 'aurora',
        name: 'Aurora',
        short_name: 'AURORA',
        chain_id: 1313161554,
        provider_params: [
          {
            chainId: '0x4e454152',
            chainName: 'Aurora',
            rpcUrls: [
              'https://mainnet.aurora.dev',
            ],
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://aurorascan.dev',
            ],
          },
        ],
        explorer: {
          name: 'Aurorascan',
          url: 'https://aurorascan.dev',
          icon: '/logos/explorers/aurorascan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/aurora.png',
      },
      {
        id: 'celo',
        name: 'Celo',
        short_name: 'CELO',
        chain_id: 42220,
        provider_params: [
          {
            chainId: '0xa4ec',
            chainName: 'Celo',
            rpcUrls: [
              'https://rpc.ankr.com/celo',
              'https://forno.celo.org',
            ],
            nativeCurrency: {
              name: 'Celo',
              symbol: 'CELO',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://celoscan.io',
            ],
          },
        ],
        explorer: {
          name: 'Celoscan',
          url: 'https://celoscan.io',
          icon: '/logos/explorers/celoscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/celo.png',
      },
      {
        id: 'kava',
        name: 'Kava',
        short_name: 'KAVA',
        chain_id: 2222,
        provider_params: [
          {
            chainId: '0x8ae',
            chainName: 'Kava',
            rpcUrls: [
              'https://evm.kava.io',
              'https://evm2.kava.io',
            ],
            nativeCurrency: {
              name: 'Kava',
              symbol: 'KAVA',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://explorer.kava.io',
            ],
          },
        ],
        explorer: {
          name: 'Kava',
          url: 'https://explorer.kava.io',
          icon: '/logos/explorers/kava.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/kava.png',
      },
    ],
    cosmos: [
      {
        id: 'axelarnet',
        name: 'Axelar',
        short_name: 'AXELAR',
        provider_params: [
          {
            chainName: 'Axelar',
            lcds: [
              'https://lcd-axelar.imperator.co',
              'https://api-axelar-ia.cosmosia.notional.ventures',
              'https://axelar-api.polkachu.com',
            ],
            nativeCurrency: {
              name: 'Axelar',
              symbol: 'AXL',
              decimals: 6,
            },
          },
        ],
        explorer: {
          name: 'Axelarscan',
          url: 'https://axelarscan.io',
          icon: '/logos/explorers/axelarscan.png',
          block_path: '/block/{block}',
          address_path: '/account/{address}',
          contract_path: '/account/{address}',
          contract_0_path: '/account/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/axelarnet.png',
        prefix_address: 'axelar',
      },
      {
        id: 'osmosis',
        name: 'Osmosis',
        short_name: 'OSMO',
        provider_params: [
          {
            chainName: 'Osmosis',
            lcds: [
              'https://lcd.osmosis.zone',
              'https://lcd-osmosis.blockapsis.com',
              'https://rest-osmosis.ecostake.com',
              'https://api-osmosis-ia.cosmosia.notional.ventures',
              'https://api.osmosis.interbloc.org',
              'https://osmosis-api.polkachu.com',
            ],
            nativeCurrency: {
              name: 'Osmosis',
              symbol: 'OSMO',
              decimals: 6,
            },
          },
        ],
        explorer: {
          name: 'Mintscan',
          url: 'https://www.mintscan.io/osmosis',
          icon: '/logos/explorers/mintscan.png',
          block_path: '/blocks/{block}',
          address_path: '/account/{address}',
          contract_path: '/account/{address}',
          contract_0_path: '/account/{address}',
          asset_path: '/assets/{ibc_denom}?type=ibc',
          transaction_path: '/txs/{tx}',
        },
        image: '/logos/chains/osmosis.png',
        prefix_address: 'osmo',
      },
      {
        id: 'kujira',
        name: 'Kujira',
        short_name: 'KUJI',
        provider_params: [
          {
            chainName: 'Kujira',
            lcds: [
              'https://kujira-api.polkachu.com',
              'https://lcd.kaiyo.kujira.setten.io',
              'https://kujira-api.lavenderfive.com',
              'https://lcd-kujira.whispernode.com',
              'https://rest-kujira.ecostake.com',
              'https://api.kujira.chaintools.tech',
              'https://api-kujira-ia.cosmosia.notional.ventures',
              'https://kujira-lcd.wildsage.io',
            ],
            nativeCurrency: {
              name: 'Kujira',
              symbol: 'KUJI',
              decimals: 6,
            },
          },
        ],
        explorer: {
          name: 'Kujira',
          url: 'https://kujira.explorers.guru',
          icon: '/logos/explorers/kujira.png',
          block_path: '/blocks/{block}',
          address_path: '/account/{address}',
          contract_path: '/account/{address}',
          contract_0_path: '/account/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/kujira.png',
        prefix_address: 'kujira',
      },
    ],
  },
  testnet: {
    evm: [
      {
        id: 'ethereum',
        name: 'Ethereum',
        short_name: 'ETH',
        chain_id: 5,
        provider_params: [
          {
            chainId: '0x5',
            chainName: 'Ethereum Goerli',
            rpcUrls: [
              'https://rpc.ankr.com/eth_goerli',
              'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
            ],
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://goerli.etherscan.io',
            ],
          },
        ],
        explorer: {
          name: 'Etherscan',
          url: 'https://goerli.etherscan.io',
          icon: '/logos/explorers/etherscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/ethereum.png',
      },
      {
        id: 'polygon',
        name: 'Polygon',
        short_name: 'MATIC',
        chain_id: 80001,
        provider_params: [
          {
            chainId: '0x13881',
            chainName: 'Polygon Mumbai',
            rpcUrls: [
              'https://rpc.ankr.com/polygon_mumbai',
              'https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
              'https://matic-mumbai.chainstacklabs.com',
            ],
            nativeCurrency: {
              name: 'Polygon',
              symbol: 'MATIC',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://mumbai.polygonscan.com',
            ],
          },
        ],
        explorer: {
          name: 'Polygonscan',
          url: 'https://mumbai.polygonscan.com',
          icon: '/logos/explorers/polygonscan.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/polygon.png',
      },
      {
        id: 'avalanche',
        name: 'Avalanche',
        short_name: 'AVAX',
        chain_id: 43113,
        provider_params: [
          {
            chainId: '0xa869',
            chainName: 'Avalanche Fuji',
            rpcUrls: [
              'https://rpc.ankr.com/avalanche_fuji',
              'https://api.avax-test.network/ext/bc/C/rpc',
            ],
            nativeCurrency: {
              name: 'Avalanche',
              symbol: 'AVAX',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://testnet.snowtrace.io',
            ],
          },
        ],
        explorer: {
          name: 'Snowtrace',
          url: 'https://testnet.snowtrace.io',
          icon: '/logos/explorers/snowtrace.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/avalanche.png',
      },
      {
        id: 'moonbeam',
        name: 'Moonbase',
        short_name: 'MBASE',
        chain_id: 1287,
        provider_params: [
          {
            chainId: '0x507',
            chainName: 'Moonbase Alpha',
            rpcUrls: [
              'https://rpc.api.moonbase.moonbeam.network',
              'https://rpc.testnet.moonbeam.network',
              'https://moonbase-alpha.public.blastapi.io',
            ],
            nativeCurrency: {
              name: 'Dev',
              symbol: 'DEV',
              decimals: 18,
            },
            blockExplorerUrls: [
              'https://moonbase.moonscan.io',
            ],
          },
        ],
        explorer: {
          name: 'Moonscan',
          url: 'https://moonbase.moonscan.io',
          icon: '/logos/explorers/moonbeam.png',
          block_path: '/block/{block}',
          address_path: '/address/{address}',
          contract_path: '/token/{address}',
          contract_0_path: '/address/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/moonbase.png',
      },
    ],
    cosmos: [
      {
        id: 'axelarnet',
        name: 'Axelar',
        short_name: 'AXELAR',
        provider_params: [
          {
            chainName: 'Axelar',
            lcds: [
              'https://axelar-testnet-lcd.qubelabs.io',
              'https://testnet.lcd.axelarscan.io',
            ],
            nativeCurrency: {
              name: 'Axelar',
              symbol: 'AXL',
              decimals: 6,
            },
          },
        ],
        explorer: {
          name: 'Axelarscan',
          url: 'https://testnet.axelarscan.io',
          icon: '/logos/explorers/axelarscan.png',
          block_path: '/block/{block}',
          address_path: '/account/{address}',
          contract_path: '/account/{address}',
          contract_0_path: '/account/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/axelarnet.png',
        prefix_address: 'axelar',
      },
      {
        id: 'osmosis',
        name: 'Osmosis',
        short_name: 'OSMO',
        provider_params: [
          {
            chainName: 'Osmosis',
            lcds: [
              'https://testnet-rest.osmosis.zone',
            ],
            nativeCurrency: {
              name: 'Osmosis',
              symbol: 'OSMO',
              decimals: 6,
            },
          },
        ],
        explorer: {
          name: 'Mintscan',
          url: 'https://testnet.mintscan.io/osmosis-testnet',
          icon: '/logos/explorers/mintscan.png',
          block_path: '/blocks/{block}',
          address_path: '/account/{address}',
          contract_path: '/account/{address}',
          contract_0_path: '/account/{address}',
          asset_path: '/assets/{ibc_denom}?type=ibc',
          transaction_path: '/txs/{tx}',
        },
        image: '/logos/chains/osmosis.png',
        prefix_address: 'osmo',
      },
      {
        id: 'kujira',
        name: 'Kujira',
        short_name: 'KUJI',
        provider_params: [
          {
            chainName: 'Kujira',
            lcds: [
              'https://test-lcd-kujira.mintthemoon.xyz',
            ],
            nativeCurrency: {
              name: 'Kujira',
              symbol: 'KUJI',
              decimals: 6,
            },
          },
        ],
        explorer: {
          name: 'Kujira',
          url: 'https://testnets-cosmos.mintthemoon.xyz/kujira',
          icon: '/logos/explorers/kujira.png',
          block_path: '/blocks/{block}',
          address_path: '/account/{address}',
          contract_path: '/account/{address}',
          contract_0_path: '/account/{address}',
          transaction_path: '/tx/{tx}',
        },
        image: '/logos/chains/kujira.png',
        prefix_address: 'kujira',
      },
      {
        id: 'sei',
        name: 'Sei Network',
        short_name: 'SEI',
        provider_params: [
          {
            chainName: 'Sei',
            lcds: [
              'https://rest-sei-test.ecostake.com',
            ],
            nativeCurrency: {
              name: 'Sei',
              symbol: 'SEI',
              decimals: 6,
            },
          },
        ],
        explorer: {
          name: 'Sei',
          url: 'https://sei.explorers.guru',
          icon: '/logos/explorers/sei.png',
          block_path: '/block/{block}',
          address_path: '/account/{address}',
          contract_path: '/account/{address}',
          contract_0_path: '/account/{address}',
          transaction_path: '/transaction/{tx}',
        },
        image: '/logos/chains/sei.png',
        prefix_address: 'sei',
      },
      {
        id: 'fetch',
        name: 'Fetch.ai',
        short_name: 'FET',
        provider_params: [
          {
            chainName: 'Fetch',
            lcds: [
              'https://rest-dorado.fetch.ai:443',
            ],
            nativeCurrency: {
              name: 'Fetch',
              symbol: 'FET',
              decimals: 6,
            },
          },
        ],
        explorer: {
          name: 'Fetch',
          url: ' https://explore-dorado.fetch.ai',
          icon: '/logos/explorers/fetch.png',
          block_path: '/blocks/{block}',
          address_path: '/account/{address}',
          contract_path: '/account/{address}',
          contract_0_path: '/account/{address}',
          transaction_path: '/transactions/{tx}',
        },
        image: '/logos/chains/fetch.png',
        prefix_address: 'fetch',
      },
    ],
  },
}