import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Summary from './summary'
import History from './history'
import WhatIs from './what-is'
import Datatable from '../../components/datatable'
import Image from '../../components/image'
import { ProgressBar } from '../../components/progress-bars'
import { PaginationLoadMore } from '../../components/pagination'
import Copy from '../../components/copy'
import { IoInformationCircleSharp } from 'react-icons/io5'
import { HiShieldCheck, HiShieldExclamation } from 'react-icons/hi'
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets'
import _ from 'lodash'
import { coinTickers } from '../../lib/api/coingecko'
import { currencies } from '../../lib/menus'
import { getName, numberFormat, ellipseAddress } from '../../lib/utils'

const per_page = 100

export default ({ coinData }) => {
  const { preferences, data, theme } = useSelector(state => ({ preferences: state.preferences, data: state.data, theme: state.theme }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { all_crypto_data, exchange_rates_data } = { ...data }
  const { background } = { ...theme }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyUSD = currencies[currencies.findIndex(c => c.id === 'usd')]

  const router = useRouter()
  const { query } = { ...router }
  const { token_id, view } = { ...query }

  const [tickersData, setTickersData] = useState(null)
  const [numPage, setNumPage] = useState(1)
  const [seeMore, setSeeMore] = useState(false)

  useEffect(() => {
    const getTickers = async () => {
      let _tickersData

      for (let i = 0; i < numPage; i++) {
        if (i < numPage - 1 && tickersData && tickersData.data.length / per_page >= i) {
          _tickersData = _.concat(_tickersData || [], _.slice(tickersData.data, i * per_page, (i + 1) * per_page))
        }
        else {
          const response = await coinTickers(coinData.id, { page: i + 1, include_exchange_logo: true, order: 'trust_score_desc', depth: true })

          if (response && response.tickers) {
            _tickersData = (
              _.concat(_tickersData || [], response.tickers)
              .map(tickerData => {
                return {
                  ...tickerData,
                  converted_last: tickerData.converted_last && Object.fromEntries(new Map(Object.entries(tickerData.converted_last).map(([key, value]) => [key, typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : -1]))),
                  bid_ask_spread_percentage: typeof tickerData.bid_ask_spread_percentage === 'string' ? Number(tickerData.bid_ask_spread_percentage) : typeof tickerData.bid_ask_spread_percentage === 'number' ? tickerData.bid_ask_spread_percentage : -1,
                  up_depth: typeof tickerData.cost_to_move_up_usd === 'string' ? Number(tickerData.cost_to_move_up_usd) : typeof tickerData.cost_to_move_up_usd === 'number' ? tickerData.cost_to_move_up_usd : -1,
                  down_depth: typeof tickerData.cost_to_move_down_usd === 'string' ? Number(tickerData.cost_to_move_down_usd) : typeof tickerData.cost_to_move_down_usd === 'number' ? tickerData.cost_to_move_down_usd : -1,
                  converted_volume: tickerData.converted_volume && Object.fromEntries(new Map(Object.entries(tickerData.converted_volume).map(([key, value]) => [key, typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : -1]))),
                  trust_score: typeof tickerData.trust_score === 'number' ? tickerData.trust_score : tickerData.trust_score === 'green' ? 1 : tickerData.trust_score === 'yellow' ? 0.5 : 0,
                }
              })
            )

            if (_tickersData) {
              setTickersData({ data: _tickersData, token_id: coinData.id, page: numPage })
            }

            if (response.tickers.length < per_page) {
              break
            }
          }
        }
      }
    }

    if (coinData && coinData.vs_currency) {
      getTickers()
    }
  }, [coinData, numPage])

  return (
    <div className="mx-1">
      <Summary coinData={coinData && token_id === coinData.id && coinData} />
      {!(['widget'].includes(view)) && (
        <>
          <History coinData={coinData && token_id === coinData.id && coinData} />
          <div className="flex flex-col xl:flex-row">
            {coinData && token_id === coinData.id && coinData.description && coinData.description.en && (
              <div className="xl:pr-8">
                <WhatIs coinData={coinData && token_id === coinData.id && coinData} />
              </div>
            )}
            {coinData && token_id === coinData.id && (
              <div className="w-full my-8 xl:ml-auto">
                <div
                  title={<div className="text-gray-800 dark:text-gray-200 text-base font-semibold space-x-1">
                    {coinData.name && (
                      <span>{coinData.name}</span>
                    )}
                    <span>Chart</span>
                  </div>}
                  className="bg-transparent border-0 p-0"
                >
                  <div id="tv" className="overflow-x-auto mt-4">
                    <AdvancedRealTimeChart
                      symbol={`${coinData.symbol ? coinData.symbol : 'btc'}usd`.toUpperCase()}
                      interval="D"
                      height={560}
                      theme={background}
                      container_id="tv"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="my-4">
            <div className="text-gray-800 dark:text-gray-200 text-base font-semibold mb-0 sm:mb-2">Markets</div>
            <Datatable
              columns={[
                {
                  Header: '#',
                  accessor: 'i',
                  sortType: 'number',
                  Cell: props => (
                    <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                      {!props.row.original.skeleton ?
                        numberFormat(props.value + 1, '0,0')
                        :
                        <div className="skeleton w-4 h-3 rounded" />
                      }
                    </div>
                  ),
                  headerClassName: 'justify-center',
                },
                {
                  Header: 'Exchange',
                  accessor: 'market_name',
                  Cell: props => (
                    !props.row.original.skeleton ?
                      <Link href={`/exchange${props.row.original.market && props.row.original.market.identifier ? `/${props.row.original.market.identifier}` : 's'}`}>
                        <a className="flex flex-col whitespace-pre-wrap font-medium" style={{ maxWidth: '10rem' }}>
                          <div className="coin-column flex items-center space-x-2">
                            <Image
                              useImg={numPage > 1}
                              src={props.row.original.market && props.row.original.market.logo && props.row.original.market.logo.replace('small', 'large')}
                              alt=""
                              width={24}
                              height={24}
                              className="rounded"
                            />
                            <span>{props.value}</span>
                          </div>
                        </a>
                      </Link>
                      :
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <div className="skeleton w-6 h-6 rounded mr-2" />
                          <div className="skeleton w-24 h-4 rounded" />
                          <div className="skeleton w-8 h-4 rounded ml-1.5" />
                        </div>
                      </div>
                  ),
                },
                {
                  Header: 'Pair',
                  accessor: 'pair',
                  Cell: props => (
                    <div className="text-gray-800 dark:text-gray-200 font-semibold">
                      {!props.row.original.skeleton ?
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-0.5">
                            {props.row.original.trade_url ?
                              <a href={props.row.original.trade_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400">
                                {props.value}
                              </a>
                              :
                              <span>{props.value}</span>
                            }
                            {props.row.original.token_info_url && (
                              <a href={props.row.original.token_info_url} target="_blank" rel="noopener noreferrer">
                                <IoInformationCircleSharp size={18} className="text-gray-300 dark:text-gray-600 mb-0.5" />
                              </a>
                            )}
                            {props.row.original.trust_score > -1 && (
                              <>
                                {!props.row.original.trust_score ?
                                  <HiShieldExclamation size={18} className="text-red-400 dark:text-red-600 mb-0.5" />
                                  :
                                  <HiShieldCheck size={18} className={`text-${props.row.original.trust_score === 1 ? 'green' : 'yellow'}-400 dark:text-${props.row.original.trust_score === 1 ? 'green' : 'yellow'}-600 mb-0.5`} />
                                }
                              </>
                            )}
                          </div>
                          {props.row.original.base && props.row.original.base.startsWith('0X') && (
                            <span className="flex items-center text-gray-400 dark:text-gray-600 font-normal space-x-1" style={{ fontSize: '.65rem' }}>
                              <span>{ellipseAddress(props.row.original.base, 6)}</span>
                              <Copy text={props.row.original.base} size={14} className="mb-0.5" />
                            </span>
                          )}
                          {props.row.original.target && props.row.original.target.startsWith('0X') && (
                            <span className="flex items-center text-gray-400 dark:text-gray-600 font-normal space-x-1" style={{ fontSize: '.65rem' }}>
                              <span>/</span>
                              <span>{ellipseAddress(props.row.original.target, 6)}</span>
                              <Copy text={props.row.original.target} size={14} className="mb-0.5" />
                            </span>
                          )}
                        </div>
                        :
                        <div className="skeleton w-20 h-4 rounded" />
                      }
                    </div>
                  ),
                },
                {
                  Header: 'Price',
                  accessor: `converted_last.${[currencyUSD.id]}`,
                  sortType: (rowA, rowB) => rowA.original.converted_last[currencyUSD.id] > rowB.original.converted_last[currencyUSD.id] ? 1 : -1,
                  Cell: props => (
                    <div className="flex flex-col font-semibold text-right ml-auto mr-2" style={{ minWidth: '7.5rem' }}>
                      {!props.row.original.skeleton ?
                        <>
                          {props.value > -1 ?
                            <span className="space-x-1">
                              {currencyUSD.symbol}
                              <span>{numberFormat(props.value, '0,0.00000000')}</span>
                              {!currencyUSD.symbol && (<span className="uppercase">{currencyUSD.id}</span>)}
                            </span>
                            :
                            '-'
                          }
                          {exchange_rates_data && currency.id !== currencyUSD.id && (
                            <span className="text-gray-400 font-medium space-x-1" style={{ fontSize: '.65rem' }}>
                              {props.value > -1 ?
                                <>
                                  <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), `0,0.00${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1)) < 0.01 ? '0000' : ''}`)}</span>
                                  <span className="uppercase">{currency.id}</span>
                                </>
                                :
                                '-'
                              }
                            </span>
                          )}
                          {props.row.original.target && !([currency.id, currencyUSD.id].includes(props.row.original.target.toLowerCase())) && typeof props.row.original.last === 'number' && (
                            <span className="text-gray-400 font-medium space-x-1" style={{ fontSize: '.65rem' }}>
                              <span>{numberFormat(props.row.original.last, `0,0.00${props.row.original.last < 0.01 ? '0000' : ''}`)}</span>
                              <span className="uppercase">
                                {props.row.original.target.startsWith('0X') ?
                                  props.row.original.target_coin_id && all_crypto_data && all_crypto_data.coins && all_crypto_data.coins.findIndex(coinData => coinData.id === props.row.original.target_coin_id) > -1 ?
                                    all_crypto_data.coins[all_crypto_data.coins.findIndex(coinData => coinData.id === props.row.original.target_coin_id)].symbol
                                    :
                                    ellipseAddress(props.row.original.target, 4)
                                  :
                                  props.row.original.target
                                }
                              </span>
                            </span>
                          )}
                        </>
                        :
                        <>
                          <div className="skeleton w-28 h-4 rounded ml-auto" />
                          <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
                        </>
                      }
                    </div>
                  ),
                  headerClassName: 'justify-end text-right mr-2',
                },
                {
                  Header: 'Spread',
                  accessor: 'bid_ask_spread_percentage',
                  sortType: (rowA, rowB) => rowA.original.bid_ask_spread_percentage > rowB.original.bid_ask_spread_percentage ? 1 : -1,
                  Cell: props => (
                    <div className="text-gray-400 dark:text-gray-500 font-normal text-right mr-2">
                      {!props.row.original.skeleton ?
                        props.value > -1 ? `${numberFormat(props.value, `0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%` : '-'
                        :
                        <div className="skeleton w-10 h-3 rounded ml-auto" />
                      }
                    </div>
                  ),
                  headerClassName: 'justify-end text-right mr-2',
                },
                {
                  Header: '+2% Depth',
                  accessor: 'up_depth',
                  sortType: (rowA, rowB) => rowA.original.up_depth > rowB.original.up_depth ? 1 : -1,
                  Cell: props => (
                    <div className="flex flex-col font-semibold text-right mr-2" style={{ minWidth: '7.5rem' }}>
                      {!props.row.original.skeleton ?
                        <>
                          {props.value > -1 ?
                            <span className="space-x-1">
                              {currencyUSD.symbol}
                              <span>{numberFormat(props.value, '0,0.00000000')}</span>
                              {!currencyUSD.symbol && (<span className="uppercase">{currencyUSD.id}</span>)}
                            </span>
                            :
                            '-'
                          }
                          {exchange_rates_data && currency.id !== currencyUSD.id && (
                            <span className="text-gray-400 font-medium space-x-1" style={{ fontSize: '.65rem' }}>
                              {props.value > -1 ?
                                <>
                                  <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), `0,0.00${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1)) < 0.01 ? '0000' : ''}`)}</span>
                                  <span className="uppercase">{currency.id}</span>
                                </>
                                :
                                '-'
                              }
                            </span>
                          )}
                        </>
                        :
                        <>
                          <div className="skeleton w-28 h-4 rounded ml-auto" />
                          <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
                        </>
                      }
                    </div>
                  ),
                  headerClassName: 'justify-end text-right mr-2',
                },
                {
                  Header: '-2% Depth',
                  accessor: 'down_depth',
                  sortType: (rowA, rowB) => rowA.original.down_depth > rowB.original.down_depth ? 1 : -1,
                  Cell: props => (
                    <div className="flex flex-col font-semibold text-right mr-2" style={{ minWidth: '7.5rem' }}>
                      {!props.row.original.skeleton ?
                        <>
                          {props.value > -1 ?
                            <span className="space-x-1">
                              {currencyUSD.symbol}
                              <span>{numberFormat(props.value, '0,0.00000000')}</span>
                              {!currencyUSD.symbol && (<span className="uppercase">{currencyUSD.id}</span>)}
                            </span>
                            :
                            '-'
                          }
                          {exchange_rates_data && currency.id !== currencyUSD.id && (
                            <span className="text-gray-400 font-medium space-x-1" style={{ fontSize: '.65rem' }}>
                              {props.value > -1 ?
                                <>
                                  <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), `0,0.00${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1)) < 0.01 ? '0000' : ''}`)}</span>
                                  <span className="uppercase">{currency.id}</span>
                                </>
                                :
                                '-'
                              }
                            </span>
                          )}
                        </>
                        :
                        <>
                          <div className="skeleton w-28 h-4 rounded ml-auto" />
                          <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
                        </>
                      }
                    </div>
                  ),
                  headerClassName: 'justify-end text-right mr-2',
                },
                {
                  Header: '24 Volume',
                  accessor: `converted_volume.${[currencyUSD.id]}`,
                  sortType: (rowA, rowB) => rowA.original.converted_volume[currencyUSD.id] > rowB.original.converted_volume[currencyUSD.id] ? 1 : -1,
                  Cell: props => (
                    <div className="flex flex-col font-semibold text-right ml-auto mr-2" style={{ minWidth: '7.5rem' }}>
                      {!props.row.original.skeleton ?
                        <>
                          {props.value > -1 ?
                            <span className="space-x-1">
                              {currencyUSD.symbol}
                              <span>{numberFormat(props.value, '0,0')}</span>
                              {!currencyUSD.symbol && (<span className="uppercase">{currencyUSD.id}</span>)}
                            </span>
                            :
                            '-'
                          }
                          {exchange_rates_data && currency.id !== currencyUSD.id && (
                            <span className="text-gray-400 font-medium space-x-1" style={{ fontSize: '.65rem' }}>
                              {props.value > -1 ?
                                <>
                                  <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), `0,0.00${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1)) < 0.01 ? '0000' : ''}`)}</span>
                                  <span className="uppercase">{currency.id}</span>
                                </>
                                :
                                '-'
                              }
                            </span>
                          )}
                          {props.row.original.target && !([currency.id, currencyUSD.id].includes(props.row.original.target.toLowerCase())) && (typeof props.row.original.volume === 'number' || typeof props.row.original.h24_volume === 'number') && (
                            <span className="text-gray-400 font-medium space-x-1" style={{ fontSize: '.65rem' }}>
                              <span>{numberFormat(typeof props.row.original.volume === 'number' ? props.row.original.volume : props.row.original.h24_volume, `0,0.00${typeof props.row.original.volume === 'number' ? props.row.original.volume : props.row.original.h24_volume < 0.01 ? '0000' : ''}`)}</span>
                              <span className="uppercase">
                                {props.row.original.target.startsWith('0X') ?
                                  props.row.original.target_coin_id && all_crypto_data && all_crypto_data.coins && all_crypto_data.coins.findIndex(coinData => coinData.id === props.row.original.target_coin_id) > -1 ?
                                    all_crypto_data.coins[all_crypto_data.coins.findIndex(coinData => coinData.id === props.row.original.target_coin_id)].symbol
                                    :
                                    ellipseAddress(props.row.original.target, 4)
                                  :
                                  props.row.original.target
                                }
                              </span>
                            </span>
                          )}
                        </>
                        :
                        <>
                          <div className="skeleton w-28 h-4 rounded ml-auto" />
                          <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
                        </>
                      }
                    </div>
                  ),
                  headerClassName: 'justify-end text-right mr-2',
                },
                {
                  Header: 'Market Share',
                  accessor: 'volume_percentage',
                  sortType: (rowA, rowB) => rowA.original.volume_percentage > rowB.original.volume_percentage ? 1 : -1,
                  Cell: props => (
                    <div className="flex flex-col text-gray-600 dark:text-gray-400 font-normal">
                      {!props.row.original.skeleton ?
                        <>
                          <span>{props.value > -1 ? `${numberFormat(props.value * 100, `0,0.000${Math.abs(props.value * 100) < 0.001 ? '000' : ''}`)}%` : '-'}</span>
                          <ProgressBar width={props.value > -1 ? props.value * 100 : 0} color="bg-yellow-500" className="h-1" />
                        </>
                        :
                        <>
                          <div className="skeleton w-10 h-3 rounded" />
                          <div className={`skeleton w-${Math.floor((12 - props.row.original.i) / 3)}/12 h-1 rounded mt-1.5`} />
                        </>
                      }
                    </div>
                  ),
                },
              ].filter(column => !([].includes(column.accessor)))}
              data={tickersData && coin_id === tickersData.coin_id ?
                _.slice(tickersData.data, 0, seeMore ? undefined : 10).map((tickerData, i) => {
                  const coinIndex = all_crypto_data && all_crypto_data.coins ? all_crypto_data.coins.findIndex(coinData => coinData.id === tickerData.coin_id) : -1

                  if (coinIndex > -1) {
                    tickerData.coin = { ...all_crypto_data.coins[coinIndex], image: all_crypto_data.coins[coinIndex].large }
                    tickerData.coin_id = tickerData.coin_id || tickerData.coin.id
                  }

                  return {
                    ...tickerData,
                    i,
                    market_name: tickerData.market && tickerData.market.name,
                    pair: `
                      ${tickerData.base && tickerData.base.startsWith('0X') ?
                        tickerData.coin_id ?
                          all_crypto_data && all_crypto_data.coins && all_crypto_data.coins.findIndex(coinData => coinData.id === tickerData.coin_id) > -1 ?
                            all_crypto_data.coins[all_crypto_data.coins.findIndex(coinData => coinData.id === tickerData.coin_id)].symbol
                            :
                            getName(tickerData.coin_id)
                          :
                          ellipseAddress(tickerData.base, 6)
                        :
                        tickerData.base
                      }/${tickerData.target && tickerData.target.startsWith('0X') ?
                        tickerData.target_coin_id ?
                          all_crypto_data && all_crypto_data.coins && all_crypto_data.coins.findIndex(coinData => coinData.id === tickerData.target_coin_id) > -1 ?
                            all_crypto_data.coins[all_crypto_data.coins.findIndex(coinData => coinData.id === tickerData.target_coin_id)].symbol
                            :
                            getName(tickerData.target_coin_id)
                          :
                          ellipseAddress(tickerData.target, 6)
                        :
                        tickerData.target
                      }
                    `,
                    volume_percentage: coinData && coinData.market_data && coinData.market_data.total_volume ?
                      coinData.market_data.total_volume[currency.id] > -1 && tickerData.converted_volume[currency.id] > -1 ?
                        tickerData.converted_volume[currency.id] / coinData.market_data.total_volume[currency.id]
                        :
                        coinData.market_data.total_volume[currencyUSD.id] > -1 && tickerData.converted_volume[currencyUSD.id] > -1 ?
                          tickerData.converted_volume[currencyUSD.id] / coinData.market_data.total_volume[currencyUSD.id]
                          :
                          -1
                      :
                      -1,
                  }
                })
                :
                [...Array(10).keys()].map(i => { return { i, skeleton: true } })
              }
              noPagination={true}
              defaultPageSize={per_page}
              pagination={tickersData && tickersData.data.length > 0 && tickersData.data.length % per_page === 0 ?
                <div className="flex flex-col sm:flex-row items-center justify-center my-4">
                  <PaginationLoadMore
                    disabled={!(tickersData && coin_id === tickersData.coin_id && numPage === tickersData.page)}
                    item="Load More"
                    onClick={() => {
                      setNumPage(numPage + (seeMore ? 1 : 0))
                      setSeeMore(true)
                    }}
                  />
                </div>
                :
                <></>
              }
            />
          </div>
        </>
      )}
    </div>
  )
}