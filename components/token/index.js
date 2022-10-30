import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets'
import { TailSpin, ThreeDots } from 'react-loader-spinner'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { MdArrowDropUp } from 'react-icons/md'
import { IoInformationCircleSharp } from 'react-icons/io5'
import { HiShieldCheck, HiShieldExclamation } from 'react-icons/hi'

import SelectExchange from './select/exchange'
import Summary from './summary'
import History from './history'
import WhatIs from './what-is'
import Image from '../image'
import Copy from '../copy'
import Datatable from '../datatable'
import { ProgressBar, ProgressBarWithText } from '../progress-bars'
import { token, token_tickers } from '../../lib/api/coingecko'
import { trades } from '../../lib/object/exchange'
import { currency, currency_symbol, currency_btc } from '../../lib/object/currency'
import meta from '../../lib/meta'
import { name, number_format, ellipse, equals_ignore_case, loader_color } from '../../lib/utils'

const per_page = 100

export default () => {
  const { preferences, cryptos } = useSelector(state => ({ preferences: state.preferences, cryptos: state.cryptos }), shallowEqual)
  const { theme } = { ...preferences }
  const { cryptos_data } = { ...cryptos }

  const router = useRouter()
  const { query, asPath } = { ...router }
  const { token_id, view } = { ...query }

  const [data, setData] = useState(null)
  const [tickers, setTickers] = useState(null)
  const [fetchTrigger, setFetchTrigger] = useState(null)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    const getData = async () => {
      if (token_id) {
        const response = await token(token_id, {
          localization: false,
        })
        if (!response?.error) {
          const { market_cap_rank, market_data } = { ...response }
          setData({
            ...response,
            market_cap_rank: typeof market_cap_rank === 'string' ? Number(market_cap_rank) : typeof market_cap_rank === 'number' ? market_cap_rank : -1,
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
                    return [k, Object.fromEntries(Object.entries(v).map(([_k, _v]) => [_k, typeof _v === 'string' ? Number(_v) : typeof _v === 'number' ? _v : -1]))]
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
                    return [k, Object.fromEntries(Object.entries(v).map(([_k, _v]) => [_k, typeof _v === 'string' ? Number(_v) : typeof _v === 'number' ? _v : Number.MIN_SAFE_INTEGER]))]
                  case 'market_cap_rank':
                  case 'mcap_to_tvl_ratio':
                  case 'fdv_to_tvl_ratio':
                  case 'total_supply':
                  case 'max_supply':
                  case 'circulating_supply':
                    return [k, typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : -1]
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
                    return [k, typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : Number.MIN_SAFE_INTEGER]
                }
              }
              return [k, v]
            })),
          })
        }
      }
    }
    getData()
  }, [token_id])

  useEffect(() => {
    const getData = async () => {
      if (data) {
        setFetching(true)
        if (!fetchTrigger) {
          setTickers(null)
        }
        const { id } = { ...data }
        const _tickers = !fetchTrigger ? [] : (tickers || [])
        const page = fetchTrigger === true || fetchTrigger === 1 ? Math.floor(_tickers.length / per_page) : 0
        const response = await token_tickers(id, {
          per_page,
          page: page + 1,
          include_exchange_logo: true,
          order: 'trust_score_desc',
          depth: true,
        })
        if (response?.tickers) {
          setTickers(
            _.uniqBy(_.concat(_tickers, response.tickers.map(t => {
              const { id, market, coin_id, target_coin_id, trade_url } = { ...t }
              const { identifier } = { ...market }
              return {
                ...t,
                id: id || `${identifier}_${coin_id}_${target_coin_id}_${trade_url}`,
              }
            })), 'id')
            .map(t => {
              const { converted_last, bid_ask_spread_percentage, cost_to_move_up_usd, cost_to_move_down_usd, converted_volume, trust_score } = { ...t }
              return {
                ...t,
                converted_last: Object.fromEntries(Object.entries({ ...converted_last }).map(([k, v]) => [k, typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : -1])),
                bid_ask_spread_percentage: typeof bid_ask_spread_percentage === 'string' ? Number(bid_ask_spread_percentage) : typeof bid_ask_spread_percentage === 'number' ? bid_ask_spread_percentage : -1,
                up_depth: typeof cost_to_move_up_usd === 'string' ? Number(cost_to_move_up_usd) : typeof cost_to_move_up_usd === 'number' ? cost_to_move_up_usd : -1,
                down_depth: typeof cost_to_move_down_usd === 'string' ? Number(cost_to_move_down_usd) : typeof cost_to_move_down_usd === 'number' ? cost_to_move_down_usd : -1,
                converted_volume: Object.fromEntries(Object.entries({ ...converted_volume }).map(([k, v]) => [k, typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : -1])),
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
  }, [data, fetchTrigger])

  const { market_cap_rank, image, symbol, categories, hashing_algorithm, market_data, description } = { ...data }
  const { large, thumb } = { ...image }
  const { current_price, price_change_percentage_24h_in_currency, low_24h, high_24h } = { ...market_data }
  const is_widget = ['widget'].includes(view)

  const headMeta = meta(asPath, data)

  return (
    <>
      <Head>
        <title>{headMeta.title}</title>
        <meta name="og:site_name" property="og:site_name" content={headMeta.title} />
        <meta name="og:title" property="og:title" content={headMeta.title} />
        <meta itemProp="name" content={headMeta.title} />
        <meta itemProp="headline" content={headMeta.title} />
        <meta itemProp="publisher" content={headMeta.title} />
        <meta name="twitter:title" content={headMeta.title} />

        <meta name="description" content={headMeta.description} />
        <meta name="og:description" property="og:description" content={headMeta.description} />
        <meta itemProp="description" content={headMeta.description} />
        <meta name="twitter:description" content={headMeta.description} />

        <meta name="og:image" property="og:image" content={headMeta.image} />
        <meta itemProp="thumbnailUrl" content={headMeta.image} />
        <meta itemProp="image" content={headMeta.image} />
        <meta name="twitter:image" content={headMeta.image} />
        <link rel="image_src" href={headMeta.image} />

        <meta name="og:url" property="og:url" content={headMeta.url} />
        <meta itemProp="url" content={headMeta.url} />
        <meta name="twitter:url" content={headMeta.url} />
        <link rel="canonical" href={headMeta.url} />
      </Head>
      <div className="space-y-2 my-4 mx-2">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            {data && (
              <span className="text-lg font-semibold">
                Rank #{market_cap_rank > -1 ? number_format(market_cap_rank, '0,0')  : '-'}
              </span>
            )}
            <div className="token-column flex items-center space-x-3">
              {(large || thumb) && (
                <Image
                  src={large || thumb}
                  alt=""
                  width={36}
                  height={36}
                />
              )}
              <h1 className="text-2xl font-bold">
                {data?.name}
              </h1>
              {symbol && (
                <span className={`${symbol.length > 6 ? 'break-all' : ''} uppercase text-slate-400 dark:text-slate-500 text-lg font-semibold`}>
                  {symbol}
                </span>
              )}
            </div>
          </div>
          {!is_widget && (
            <div className="flex flex-col items-end my-1 ml-0 sm:ml-4 pr-1">
              <div className="max-w-screen-sm hidden sm:flex flex-wrap items-center justify-end my-1 ml-0 sm:ml-auto">
                {_.concat(categories || [], hashing_algorithm || []).filter(t => t).map((t, i) => (
                  <div
                    key={i}
                    className="max-w-min bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center whitespace-nowrap text-xs font-medium my-1 mx-0.5 py-0.5 px-2"
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center">
                {_.slice(trades(data, cryptos_data?.coins, data?.tickers), 0, 3).map((t, i) => (
                  <a
                    key={i}
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center whitespace-nowrap space-x-1.5 my-1 mr-3"
                  >
                    {t.exchange?.large && (
                      <Image
                        src={t.exchange.large}
                        alt=""
                        width={16}
                        height={16}
                      />
                    )}
                    <span className="hidden lg:block text-blue-500 hover:text-blue-600 dark:text-slate-200 dark:hover:text-white font-semibold">
                      {t.exchange.name || name(t.exchange.id)}
                    </span>
                  </a>
                ))}
                <SelectExchange data={_.slice(trades(data, cryptos_data?.coins, data?.tickers), 3)} />
              </div>
            </div>
          )}
        </div>
        {data && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <div className={`flex items-center ${price_change_percentage_24h_in_currency?.[currency] < 0 ? 'text-red-600 dark:text-red-400' : price_change_percentage_24h_in_currency?.[currency] > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} space-x-1.5`}>
              <span className="text-3xl font-bold">
                {current_price?.[currency] > -1 ?
                  <>
                    {currency_symbol}
                    {number_format(current_price[currency], '0,0.0000000000')}
                  </> : '-'
                }
              </span>
              <span className="flex items-center pr-1">
                <span className="text-sm font-medium">
                  {number_format(price_change_percentage_24h_in_currency?.[currency], '+0,0.000')}%
                </span>
                {price_change_percentage_24h_in_currency?.[currency] < 0 ?
                  <FiArrowDown size={14} className="ml-0.5 mb-0.5" /> :
                  price_change_percentage_24h_in_currency?.[currency] > 0 ?
                    <FiArrowUp size={14} className="ml-0.5 mb-0.5" /> :
                    null
                }
              </span>
            </div>
            <div className="w-full max-w-xs flex items-center justify-between space-x-2 my-1 mr-1">
              <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
                {currency_symbol}
                {number_format(low_24h?.[currency], '0,0.00000000')}
              </span>
              <ProgressBarWithText
                width={high_24h?.[currency] - low_24h?.[currency] > 0 ? (current_price?.[currency] - low_24h?.[currency]) * 100 / (high_24h?.[currency] - low_24h?.[currency]) : 0}
                color="bg-slate-200 dark:bg-slate-600 rounded-lg"
                text={high_24h?.[currency] - low_24h?.[currency] > 0 && (
                  <MdArrowDropUp
                    size={24}
                    className="text-slate-200 dark:text-slate-600 mt-0.5 ml-auto"
                    style={(current_price?.[currency] - low_24h?.[currency]) * 100 / (high_24h?.[currency] - low_24h?.[currency]) <= 5 ?
                      { marginLeft: '-.5rem' } :
                      { marginRight: '-.5rem' }
                    }
                  />
                )}
                className="h-2 rounded-lg"
                backgroundClassName="h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
              />
              <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
                {currency_symbol}
                {number_format(high_24h?.[currency], '0,0.00000000')}
              </span>
            </div>
          </div>
        )}
        <div className="space-y-4">
          {data && (
            <Summary data={data} />
          )}
          {!is_widget && data && (
            <>
              <History data={data} />
              <div className="flex flex-col xl:flex-row xl:justify-between space-y-8 xl:space-y-0 xl:space-x-8">
                {description?.en && (
                  <WhatIs data={data} />
                )}
                {data && (
                  <div className="space-y-2">
                    <div className="text-base font-bold">
                      {data.name} Chart
                    </div>
                    <div
                      id="tv"
                      className="overflow-x-auto"
                    >
                      <AdvancedRealTimeChart
                        symbol={`${symbol ? symbol : 'btc'}usd`.toUpperCase()}
                        interval="D"
                        container_id="tv"
                        height={560}
                        theme={theme}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="text-base font-bold">
                  Markets
                </div>
                {tickers ?
                  <>
                    <Datatable
                      columns={[
                        {
                          Header: '#',
                          accessor: 'i',
                          Cell: props => (
                            <span className="font-mono font-semibold">
                              {number_format((props.flatRows?.indexOf(props.row) > -1 ?
                                props.flatRows.indexOf(props.row) : props.value
                              ) + 1, '0,0')}
                            </span>
                          ),
                        },
                        {
                          Header: 'Exchange',
                          accessor: 'market_name',
                          sortType: (a, b) => a.original.market_name > b.original.market_name ? 1 : -1,
                          Cell: props => (
                            <Link
                              href={`/exchange${props.row.original.market?.identifier ? `/${props.row.original.market.identifier}` : 's'}`}
                            >
                            <a
                              target={is_widget ? '_blank' : '_self'}
                              rel={is_widget ? 'noopener noreferrer' : ''}
                              className="flex flex-col items-start space-y-1 -mt-0.5 mb-2"
                            >
                              <div className="flex items-center space-x-2">
                                {props.row.original.market?.logo && (
                                  <Image
                                    src={props.row.original.market.logo.replace('small', 'large')}
                                    alt=""
                                    width={24}
                                    height={24}
                                  />
                                )}
                                <span className="font-semibold">
                                  {props.value}
                                </span>
                              </div>
                            </a>
                            </Link>
                          ),
                        },
                        {
                          Header: 'Pair',
                          accessor: 'pair',
                          Cell: props => (
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center space-x-0.5">
                                {props.row.original.trade_url ?
                                  <a
                                    href={props.row.original.trade_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 font-bold"
                                  >
                                    {props.value}
                                  </a> :
                                  <span className="font-semibold">
                                    {props.value}
                                  </span>
                                }
                                {props.row.original.token_info_url && (
                                  <a
                                    href={props.row.original.token_info_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <IoInformationCircleSharp size={18} className="text-slate-300 dark:text-slate-600 mb-0.5" />
                                  </a>
                                )}
                                {props.row.original.trust_score > -1 && (
                                  <>
                                    {!props.row.original.trust_score ?
                                      <HiShieldExclamation size={18} className="text-red-400 dark:text-red-600 mb-0.5" /> :
                                      <HiShieldCheck size={18} className={`${props.row.original.trust_score === 1 ? 'text-green-400 dark:text-green-600' : 'text-yellow-400 dark:text-yellow-600'} mb-0.5`} />
                                    }
                                  </>
                                )}
                              </div>
                              {props.row.original.base?.toLowerCase().startsWith('0x') && (
                                <Copy
                                  value={props.row.original.base}
                                  title={<span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                                    {ellipse(props.row.original.base, 6)}
                                  </span>}
                                />
                              )}
                              {props.row.original.target?.toLowerCase().startsWith('0x') && (
                                <Copy
                                  value={props.row.original.target}
                                  title={<span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                                    {ellipse(props.row.original.target, 6)}
                                  </span>}
                                />
                              )}
                            </div>
                          ),
                        },
                        {
                          Header: 'Price',
                          accessor: `converted_last.${[currency]}`,
                          sortType: (a, b) => a.original.converted_last[currency] > b.original.converted_last[currency] ? 1 : -1,
                          Cell: props => (
                            <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-0">
                              <div className="flex items-center uppercase font-semibold space-x-1">
                                <span>
                                  {currency_symbol}
                                  {props.value > -1 ? number_format(props.value, '0,0.00000000') : '-'}
                                </span>
                              </div>
                            </div>
                          ),
                          headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
                        },
                        {
                          Header: 'Spread',
                          accessor: 'bid_ask_spread_percentage',
                          sortType: (a, b) => a.original.bid_ask_spread_percentage > b.original.bid_ask_spread_percentage ? 1 : -1,
                          Cell: props => (
                            <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                              <span className="text-slate-400 dark:text-slate-500 font-medium">
                                {props.value > -1 ? `${number_format(props.value, `0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%` : '-'}
                              </span>
                            </div>
                          ),
                          headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
                        },
                        {
                          Header: '+2% Depth',
                          accessor: 'up_depth',
                          sortType: (a, b) => a.original.up_depth > b.original.up_depth ? 1 : -1,
                          Cell: props => (
                            <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                              <div className="flex items-center uppercase font-semibold space-x-1">
                                <span>
                                  {currency_symbol}
                                  {props.value > -1 ? number_format(props.value, '0,0.00000000') : '-'}
                                </span>
                              </div>
                            </div>
                          ),
                          headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                        },
                        {
                          Header: '-2% Depth',
                          accessor: 'down_depth',
                          sortType: (a, b) => a.original.down_depth > b.original.down_depth ? 1 : -1,
                          Cell: props => (
                            <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                              <div className="flex items-center uppercase font-semibold space-x-1">
                                <span>
                                  {currency_symbol}
                                  {props.value > -1 ? number_format(props.value, '0,0.00000000') : '-'}
                                </span>
                              </div>
                            </div>
                          ),
                          headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                        },
                        {
                          Header: 'Volume 24h',
                          accessor: `converted_volume.${[currency]}`,
                          sortType: (a, b) => a.original.converted_volume[currency] > b.original.converted_volume[currency] ? 1 : -1,
                          Cell: props => (
                            <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                              <div className="flex items-center uppercase font-semibold space-x-1">
                                <span>
                                  {currency_symbol}
                                  {props.value > -1 ? number_format(props.value, '0,0') : '-'}
                                </span>
                              </div>
                            </div>
                          ),
                          headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                        },
                        {
                          Header: 'Market Share',
                          accessor: 'volume_percentage',
                          sortType: (a, b) => a.original.volume_percentage > b.original.volume_percentage ? 1 : -1,
                          Cell: props => (
                            <div className="flex flex-col space-y-2.5">
                              <span className="font-semibold">
                                {props.value > -1 ? number_format(props.value * 100, '0,0.000') : '-'}%
                              </span>
                              <ProgressBar
                                width={(props.value > -1 ? props.value : 0) * 100}
                                color="bg-yellow-500"
                                className="h-1.5 rounded-lg"
                              />
                            </div>
                          ),
                          headerClassName: 'whitespace-nowrap',
                        },
                      ]}
                      data={tickers.map((t, i) => {
                        const { market, target_coin_id, base, target, converted_volume } = { ...t }
                        let { coin_id } = { ...t }
                        const { market_data } = { ...data }
                        const { total_volume } = { ...market_data }
                        const token_data = cryptos_data?.coins?.find(d => d?.id === t?.coin_id)
                        coin_id = coin_id || token_data?.id
                        return {
                          ...t,
                          i,
                          token_data,
                          coin_id,
                          market_name: market?.name,
                          pair: `
                            ${base?.toLowerCase().startsWith('0x') ?
                              coin_id ?
                                cryptos_data?.coins?.find(_t => _t.id === coin_id)?.symbol || name(coin_id) :
                                ellipse(base, 6) :
                              base
                            }/${target?.toLowerCase().startsWith('0x') ?
                              target_coin_id ?
                                cryptos_data?.coins?.find(_t => _t.id === target_coin_id)?.symbol || name(target_coin_id) :
                                ellipse(target, 6) :
                              target
                            }
                          `,
                          volume_percentage: total_volume?.[currency] > -1 && converted_volume?.[currency] > -1 ?
                            converted_volume[currency] / total_volume[currency] :
                            -1,
                        }
                      })}
                      noPagination={tickers.length <= 10}
                      defaultPageSize={10}
                      className="no-border striped"
                    />
                    {tickers.length > 0 && (
                      <div className="flex justify-center p-1.5">
                        {!fetching ?
                          <button
                            onClick={() => setFetchTrigger(typeof fetchTrigger === 'number' ? true : 1)}
                            className="max-w-min hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg whitespace-nowrap font-medium hover:font-bold mx-auto py-1.5 px-2.5"
                          >
                            Load more
                          </button>
                          :
                          <ThreeDots color={loader_color(theme)} width="24" height="24" />
                        }
                      </div>
                    )}
                  </> :
                  <TailSpin
                    color={loader_color(theme)}
                    width="32"
                    height="32"
                  />
                }
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}