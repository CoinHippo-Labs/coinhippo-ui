import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Chip } from '@material-tailwind/react'
import _ from 'lodash'
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { MdArrowDropUp } from 'react-icons/md'
import { IoInformationCircleSharp } from 'react-icons/io5'
import { HiShieldCheck, HiShieldExclamation } from 'react-icons/hi'
import { BsArrowRightShort } from 'react-icons/bs'

import SelectExchange from './select/exchange'
import Summary from './summary'
import History from './history'
import WhatIs from './what-is'
import Spinner from '../../spinner'
import Image from '../../image'
import NumberDisplay from '../../number'
import Copy from '../../copy'
import Datatable from '../../datatable'
import { ProgressBar, ProgressBarWithText } from '../../progress-bars'
import { getToken, getTokenTickers } from '../../../lib/api/coingecko'
import { trades } from '../../../lib/exchange'
import meta from '../../../lib/meta'
import { toArray, getTitle, ellipse } from '../../../lib/utils'

const PAGE_SIZE = 100

export default () => {
  const { preferences, cryptos } = useSelector(state => ({ preferences: state.preferences, cryptos: state.cryptos }), shallowEqual)
  const { theme } = { ...preferences }
  const { cryptos_data } = { ...cryptos }

  const router = useRouter()
  const { asPath, query } = { ...router }
  const { id, view } = { ...query }

  const [data, setData] = useState(null)
  const [tickers, setTickers] = useState(null)
  const [fetchTrigger, setFetchTrigger] = useState(null)
  const [fetching, setFetching] = useState(false)

  useEffect(
    () => {
      const getData = async () => {
        if (id) {
          const response = await getToken(id, { localization: false })
          const { market_cap_rank, market_data } = { ...response }
          if (response) {
            setData({
              ...response,
              market_cap_rank: ['number', 'string'].includes(typeof market_cap_rank) ? Number(market_cap_rank) : -1,
              market_data: Object.fromEntries(Object.entries({ ...market_data }).map(([k, v]) => {
                if (v) {
                  switch (k) {
                    case 'current_price':
                    case 'ath':
                    case 'atl':
                    case 'market_cap':
                    case 'fully_diluted_valuation':
                    case 'total_value_locked':
                    case 'total_volume':
                    case 'high_24h':
                    case 'low_24h':
                      return [k, Object.fromEntries(Object.entries(v).map(([_k, _v]) => [_k, ['number', 'string'].includes(typeof _v) ? Number(_v) : -1]))]
                    case 'ath_change_percentage':
                    case 'atl_change_percentage':
                    case 'price_change_24h_in_currency':
                    case 'price_change_percentage_1h_in_currency':
                    case 'price_change_percentage_24h_in_currency':
                    case 'price_change_percentage_7d_in_currency':
                    case 'price_change_percentage_14d_in_currency':
                    case 'price_change_percentage_30d_in_currency':
                    case 'price_change_percentage_60d_in_currency':
                    case 'price_change_percentage_200d_in_currency':
                    case 'price_change_percentage_1y_in_currency':
                    case 'market_cap_change_24h_in_currency':
                    case 'market_cap_change_percentage_24h_in_currency':
                      return [k, Object.fromEntries(Object.entries(v).map(([_k, _v]) => [_k, ['number', 'string'].includes(typeof _v) ? Number(_v) : Number.MIN_SAFE_INTEGER]))]
                    case 'market_cap_rank':
                    case 'mcap_to_tvl_ratio':
                    case 'fdv_to_tvl_ratio':
                    case 'total_supply':
                    case 'max_supply':
                    case 'circulating_supply':
                      return [k, ['number', 'string'].includes(typeof v) ? Number(v) : -1]
                    case 'price_change_24h':
                    case 'price_change_percentage_24h':
                    case 'price_change_percentage_7d':
                    case 'price_change_percentage_14d':
                    case 'price_change_percentage_30d':
                    case 'price_change_percentage_60d':
                    case 'price_change_percentage_200d':
                    case 'price_change_percentage_1y':
                    case 'market_cap_change_24h':
                    case 'market_cap_change_percentage_24h':
                      return [k, ['number', 'string'].includes(typeof v) ? Number(v) : Number.MIN_SAFE_INTEGER]
                  }
                }
                return [k, v]
              })),
            })
          }
        }
      }
      getData()
    },
    [id],
  )

  useEffect(
    () => {
      const getData = async () => {
        if (data) {
          setFetching(true)

          if (!fetchTrigger) {
            setTickers(null)
          }

          const { id } = { ...data }
          const _data = toArray(fetchTrigger && tickers)
          const page = [true, 1].includes(fetchTrigger) ? Math.floor(_data.length / PAGE_SIZE) : 0
          const response = await getTokenTickers(id, { order: 'trust_score_desc', per_page: PAGE_SIZE, page: page + 1, include_exchange_logo: true, depth: true })

          if (response?.tickers) {
            setTickers(
              _.uniqBy(
                _.concat(
                  toArray(_data),
                  response.tickers.map(d => {
                    const { id, market, coin_id, target_coin_id, trade_url } = { ...d }
                    const { identifier } = { ...market }
                    return { ...d, id: id || `${identifier}_${coin_id}_${target_coin_id}_${trade_url}` }
                  }),
                ),
                'id',
              )
              .map(d => {
                const { converted_last, bid_ask_spread_percentage, cost_to_move_up_usd, cost_to_move_down_usd, converted_volume, trust_score } = { ...d }
                return {
                  ...d,
                  converted_last: Object.fromEntries(Object.entries({ ...converted_last }).map(([k, v]) => [k, ['number', 'string'].includes(typeof v) ? Number(v) : -1])),
                  bid_ask_spread_percentage: ['number', 'string'].includes(typeof bid_ask_spread_percentage) ? Number(bid_ask_spread_percentage) : -1,
                  up_depth: ['number', 'string'].includes(typeof cost_to_move_up_usd) ? Number(cost_to_move_up_usd) : -1,
                  down_depth: ['number', 'string'].includes(typeof cost_to_move_down_usd) ? Number(cost_to_move_down_usd) : -1,
                  converted_volume: Object.fromEntries(Object.entries({ ...converted_volume }).map(([k, v]) => [k, ['number', 'string'].includes(typeof v) ? Number(v) : -1])),
                  trust_score: typeof trust_score === 'number' ? trust_score : trust_score === 'green' ? 1 : trust_score === 'yellow' ? 0.5 : 0,
                }
              })
            )
          }
          else if (!fetchTrigger) {
            setTickers([])
          }

          setFetching(false)
        }
      }
      getData()
    },
    [data, fetchTrigger],
  )

  const { coins } = { ...cryptos_data }
  const { market_cap_rank, name, symbol, categories, hashing_algorithm, market_data } = { ...data }
  const _tickers = data?.tickers
  const { large, thumb } = { ...data?.image }
  const { current_price, price_change_percentage_24h_in_currency, low_24h, high_24h, total_volume } = { ...market_data }
  const percentage = high_24h?.usd - low_24h?.usd > 0 ? (current_price?.usd - low_24h?.usd) * 100 / (high_24h?.usd - low_24h?.usd) : 0
  const { title, description, image, url } = { ...meta(asPath, data) }
  const is_widget = view === 'widget'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:site_name" property="og:site_name" content={title} />
        <meta name="og:title" property="og:title" content={title} />
        <meta itemProp="name" content={title} />
        <meta itemProp="headline" content={title} />
        <meta itemProp="publisher" content={title} />
        <meta name="twitter:title" content={title} />

        <meta name="description" content={description} />
        <meta name="og:description" property="og:description" content={description} />
        <meta itemProp="description" content={description} />
        <meta name="twitter:description" content={description} />

        <meta name="og:image" property="og:image" content={image} />
        <meta itemProp="thumbnailUrl" content={image} />
        <meta itemProp="image" content={image} />
        <meta name="twitter:image" content={image} />
        <link rel="image_src" href={image} />

        <meta name="og:url" property="og:url" content={url} />
        <meta itemProp="url" content={url} />
        <meta name="twitter:url" content={url} />
        <link rel="canonical" href={url} />
      </Head>
      <div className="children">
        {data ?
          <div className="space-y-2 sm:space-y-4 mt-4 sm:mt-6 mx-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 space-x-0 sm:space-x-3 px-3">
              <div className="space-y-0.5">
                {market_cap_rank > 0 && (
                  <NumberDisplay
                    value={market_cap_rank}
                    format="0,0"
                    prefix="Rank #"
                    className="text-lg font-semibold"
                  />
                )}
                <div className="flex items-center justify-between space-x-4">
                  <div className="token-column flex items-center space-x-3">
                    {(large || thumb) && (
                      <Image
                        src={large || thumb}
                        width={36}
                        height={36}
                      />
                    )}
                    <span className="text-xl font-bold">
                      {name}
                    </span>
                    {symbol && (
                      <span className={`${symbol.length > 6 ? 'break-all' : ''} uppercase text-slate-400 dark:text-slate-500 text-lg font-semibold`}>
                        {symbol}
                      </span>
                    )}
                  </div>
                  {!is_widget && (
                    <div className="flex flex-col items-end my-1 ml-0 sm:ml-4 pr-1">
                      <div className="max-w-screen-sm hidden sm:flex flex-wrap items-center justify-end my-1 ml-0 sm:ml-auto">
                        {toArray(_.concat(categories, hashing_algorithm)).map((d, i) => (
                          <div key={i} className="mb-1 ml-0 sm:ml-1 mr-1 sm:mr-0">
                            <Chip
                              color="teal"
                              value={d}
                              className="chip text-xs font-medium py-1 px-2.5"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center">
                        {_.slice(trades(data, coins, _tickers), 0, 3).map((d, i) => {
                          const { url, exchange } = { ...d }
                          const { id, name, large } = { ...exchange }
                          return (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center whitespace-nowrap space-x-1.5 my-1 mr-3"
                            >
                              {large && (
                                <Image
                                  src={large}
                                  width={16}
                                  height={16}
                                />
                              )}
                              <span className="hidden lg:block text-blue-400 dark:text-white font-semibold">
                                {name || getTitle(id)}
                              </span>
                            </a>
                          )
                        })}
                        <SelectExchange data={_.slice(trades(data, coins, _tickers), 3)} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <div className={`flex items-center ${price_change_percentage_24h_in_currency?.usd < 0 ? 'text-red-500 dark:text-red-400' : price_change_percentage_24h_in_currency?.usd > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} space-x-1.5`}>
                {current_price?.usd > -1 && (
                  <>
                    <NumberDisplay
                      value={current_price.usd}
                      format="0,0.00000000"
                      prefix="$"
                      className="text-3xl font-bold"
                    />
                    {typeof price_change_percentage_24h_in_currency?.usd === 'number' && (
                      <span className="flex items-center pr-1">
                        <NumberDisplay
                          value={price_change_percentage_24h_in_currency.usd}
                          format="0,0.00"
                          maxDecimals={2}
                          prefix={price_change_percentage_24h_in_currency.usd < 0 ? '' : '+'}
                          suffix="%"
                          className="whitespace-nowrap text-sm font-medium"
                        />
                        {price_change_percentage_24h_in_currency.usd < 0 ? <FiArrowDown size={14} className="ml-0.5 mb-0.5" /> : price_change_percentage_24h_in_currency.usd > 0 ? <FiArrowUp size={14} className="ml-0.5 mb-0.5" /> : null}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="w-full max-w-xs flex items-center justify-between space-x-2 my-1 mr-1">
                <NumberDisplay
                  value={low_24h?.usd}
                  format="0,0.00000000"
                  prefix="$"
                  noTooltip={true}
                  className="whitespace-nowrap text-xs font-medium"
                />
                <ProgressBarWithText
                  width={percentage}
                  color="bg-slate-200 dark:bg-slate-600 rounded-lg"
                  text={percentage > 0 && (
                    <MdArrowDropUp
                      size={24}
                      className="text-slate-200 dark:text-slate-600 mt-0.5 ml-auto"
                      style={percentage <= 5 ? { marginLeft: '-.5rem' } : { marginRight: '-.5rem' }}
                    />
                  )}
                  className="h-2 rounded-lg"
                  backgroundClassName="h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
                <NumberDisplay
                  value={high_24h?.usd}
                  format="0,0.00000000"
                  prefix="$"
                  noTooltip={true}
                  className="whitespace-nowrap text-xs font-medium"
                />
              </div>
            </div>
            <Summary data={data} />
            {!is_widget && (
              <>
                <History data={data} />
                <div className="flex flex-col xl:flex-row xl:justify-between space-y-8 xl:space-y-0 xl:space-x-8">
                  <WhatIs data={data} />
                  <div className="space-y-2">
                    <div className="text-base font-bold">
                      {name} Chart
                    </div>
                    <div id="tv" className="overflow-x-auto">
                      <AdvancedRealTimeChart
                        symbol={`${symbol ? symbol : 'btc'}usd`.toUpperCase()}
                        interval="D"
                        container_id="tv"
                        height={560}
                        theme={theme}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-base font-bold">
                    Markets
                  </div>
                  {tickers ?
                    <Datatable
                      columns={[
                        {
                          Header: '#',
                          accessor: 'i',
                          Cell: props => (
                            <span className="text-black dark:text-white font-medium">
                              {props.flatRows?.indexOf(props.row) + 1}
                            </span>
                          ),
                        },
                        {
                          Header: 'Exchange',
                          accessor: 'market_name',
                          sortType: (a, b) => a.original.market_name > b.original.market_name ? 1 : -1,
                          Cell: props => {
                            const { value, row } = { ...props }
                            const { market } = { ...row.original }
                            const { identifier, logo } = { ...market }
                            return (
                              <Link
                                href={`/exchange${identifier ? `/${identifier}` : 's'}`}
                                target={is_widget ? '_blank' : '_self'}
                                rel={is_widget ? 'noopener noreferrer' : ''}
                                className="flex flex-col mb-6"
                              >
                                <div className="flex items-center space-x-2">
                                  {logo && (
                                    <Image
                                      src={logo.replace('small', 'large')}
                                      width={24}
                                      height={24}
                                    />
                                  )}
                                  <span className="whitespace-pre-wrap text-sm font-bold">
                                    {value}
                                  </span>
                                </div>
                              </Link>
                            )
                          },
                        },
                        {
                          Header: 'Pair',
                          accessor: 'pair',
                          Cell: props => {
                            const { value, row } = { ...props }
                            const { base, target, trade_url, token_info_url, trust_score } = { ...row.original }
                            return (
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-0.5">
                                  {trade_url ?
                                    <a
                                      href={trade_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 dark:text-blue-500 font-bold"
                                    >
                                      {ellipse(value, 16)}
                                    </a> :
                                    <span className="font-semibold">
                                      {ellipse(value, 16)}
                                    </span>
                                  }
                                  {token_info_url && (
                                    <a
                                      href={token_info_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <IoInformationCircleSharp size={18} className="text-slate-400 dark:text-slate-500 mb-0.5" />
                                    </a>
                                  )}
                                  {trust_score > -1 && (!trust_score ? <HiShieldExclamation size={18} className="text-red-400 dark:text-red5600 mb-0.5" /> : <HiShieldCheck size={18} className={`${trust_score === 1 ? 'text-green-400 dark:text-green-500' : 'text-yellow-400 dark:text-yellow-500'} mb-0.5`} />)}
                                </div>
                                {base?.toLowerCase().startsWith('0x') && (
                                  <Copy
                                    value={base}
                                    title={
                                      <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                                        {ellipse(base, 6)}
                                      </span>
                                    }
                                  />
                                )}
                                {target?.toLowerCase().startsWith('0x') && (
                                  <Copy
                                    value={target}
                                    title={
                                      <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                                        {ellipse(target, 6)}
                                      </span>
                                    }
                                  />
                                )}
                              </div>
                            )
                          },
                        },
                        {
                          Header: 'Price',
                          accessor: 'converted_last.usd',
                          sortType: (a, b) => a.original.converted_last?.usd > b.original.converted_last?.usd ? 1 : -1,
                          Cell: props => {
                            const { value } = { ...props }
                            return (
                              <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                                {value > -1 && (
                                  <NumberDisplay
                                    value={value}
                                    format="0,0.00000000"
                                    prefix="$"
                                    noTooltip={true}
                                  />
                                )}
                              </div>
                            )
                          },
                          headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                        },
                        {
                          Header: 'Spread',
                          accessor: 'bid_ask_spread_percentage',
                          sortType: (a, b) => a.original.bid_ask_spread_percentage > b.original.bid_ask_spread_percentage ? 1 : -1,
                          Cell: props => {
                            const { value } = { ...props }
                            return (
                              <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                                {value > -1 && (
                                  <NumberDisplay
                                    value={value * 100}
                                    format="0,0.00"
                                    suffix="%"
                                    noTooltip={true}
                                    className="whitespace-nowrap text-slate-500 dark:text-slate-400 text-sm font-medium"
                                  />
                                )}
                              </div>
                            )
                          },
                          headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                        },
                        {
                          Header: '+2% Depth',
                          accessor: 'up_depth',
                          sortType: (a, b) => a.original.up_depth > b.original.up_depth ? 1 : -1,
                          Cell: props => {
                            const { value } = { ...props }
                            return (
                              <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                                {value > -1 && (
                                  <NumberDisplay
                                    value={value}
                                    format="0,0.00000000"
                                    prefix="$"
                                    noTooltip={true}
                                    className="whitespace-nowrap text-sm font-medium"
                                  />
                                )}
                              </div>
                            )
                          },
                          headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                        },
                        {
                          Header: '-2% Depth',
                          accessor: 'down_depth',
                          sortType: (a, b) => a.original.down_depth > b.original.down_depth ? 1 : -1,
                          Cell: props => {
                            const { value } = { ...props }
                            return (
                              <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                                {value > -1 && (
                                  <NumberDisplay
                                    value={value}
                                    format="0,0.00000000"
                                    prefix="$"
                                    noTooltip={true}
                                    className="whitespace-nowrap text-sm font-medium"
                                  />
                                )}
                              </div>
                            )
                          },
                          headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                        },
                        {
                          Header: 'Volume 24h',
                          accessor: 'converted_volume.usd',
                          sortType: (a, b) => a.original.converted_volume?.usd > b.original.converted_volume?.usd ? 1 : -1,
                          Cell: props => {
                            const { value } = { ...props }
                            return (
                              <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                                {value > -1 && (
                                  <NumberDisplay
                                    value={value}
                                    format="0,0"
                                    prefix="$"
                                    noTooltip={true}
                                  />
                                )}
                              </div>
                            )
                          },
                          headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                        },
                        {
                          Header: 'Market Share',
                          accessor: 'volume_percentage',
                          sortType: (a, b) => a.original.volume_percentage > b.original.volume_percentage ? 1 : -1,
                          Cell: props => {
                            const { value } = { ...props }
                            return (
                              <div className="flex flex-col space-y-2">
                                {value > -1 && (
                                  <>
                                    <NumberDisplay
                                      value={value * 100}
                                      format="0,0.00"
                                      suffix="%"
                                      noTooltip={true}
                                    />
                                    <ProgressBar
                                      width={value * 100}
                                      color="bg-yellow-500"
                                      className="h-1.5 rounded-lg"
                                    />
                                  </>
                                )}
                              </div>
                            )
                          },
                          headerClassName: 'whitespace-nowrap',
                        },
                      ]}
                      data={
                        toArray(tickers).map((d, i) => {
                          const { market, target_coin_id, base, target, converted_volume } = { ...d }
                          let { coin_id } = { ...d }
                          const { name } = { ...market }
                          const token_data = toArray(coins).find(d => d.id === coin_id)
                          coin_id = coin_id || token_data?.id
                          return {
                            ...d,
                            i,
                            token_data,
                            coin_id,
                            market_name: name,
                            pair: `${base?.toLowerCase().startsWith('0x') ? coin_id ? toArray(coins).find(d => d.id === coin_id)?.symbol || getTitle(coin_id) : ellipse(base, 6) : base}/${target?.toLowerCase().startsWith('0x') ? target_coin_id ? toArray(coins).find(d => d.id === target_coin_id)?.symbol || getTitle(target_coin_id) : ellipse(target, 6) : target}`,
                            volume_percentage: converted_volume?.usd > -1 && total_volume?.usd ? converted_volume.usd / total_volume.usd : -1,
                          }
                        })
                      }
                      defaultPageSize={10}
                      noPagination={tickers.length <= 10}
                      extra={
                        tickers.length >= 0 && (
                          <div className="flex justify-center">
                            {!fetching ?
                              <button
                                onClick={() => setFetchTrigger(typeof fetchTrigger === 'number' ? true : 1)}
                                className="flex items-center text-black dark:text-white space-x-0.5"
                              >
                                <span className="font-medium">
                                  Load more
                                </span>
                                <BsArrowRightShort size={18} />
                              </button> :
                              <Spinner name="ProgressBar" width={32} height={32} />
                            }
                          </div>
                        )
                      }
                      className="no-border no-shadow striped"
                    /> :
                    <Spinner name="ProgressBar" width={36} height={36} />
                  }
                </div>
              </>
            )}
          </div> :
          <div className="loading">
            <Spinner name="Blocks" />
          </div>
        }
      </div>
    </>
  )
}