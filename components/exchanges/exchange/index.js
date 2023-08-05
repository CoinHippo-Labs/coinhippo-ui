import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { IoInformationCircleSharp } from 'react-icons/io5'
import { HiShieldCheck, HiShieldExclamation } from 'react-icons/hi'

import Summary from './summary'
import Spinner from '../../spinner'
import Image from '../../image'
import NumberDisplay from '../../number'
import Copy from '../../copy'
import Datatable from '../../datatable'
import { ProgressBar } from '../../progress-bars'
import { getExchange, getDerivativesExchange, getExchangeTickers } from '../../../lib/api/coingecko'
import meta from '../../../lib/meta'
import { toArray, getTitle, ellipse, equalsIgnoreCase } from '../../../lib/utils'

const PAGE_SIZE = 100

export default () => {
  const { cryptos } = useSelector(state => ({ cryptos: state.cryptos }), shallowEqual)
  const { cryptos_data } = { ...cryptos }

  const router = useRouter()
  const { asPath, query } = { ...router }
  const { id } = { ...query }

  const [data, setData] = useState(null)
  const [tickers, setTickers] = useState(null)

  useEffect(
    () => {
      const getData = async () => {
        const { exchanges } = { ...cryptos_data }
        const exchange_data = toArray(exchanges).find(d => d.id === id)
        if (exchange_data) {
          const { market_type } = { ...exchange_data }
          const response = await (market_type !== 'spot' ? getDerivativesExchange(id, { include_tickers: 'unexpired' }) : getExchange(id))
          const { trust_score_rank, trust_score } = { ...response }
          setData({
            ...response,
            ...exchange_data,
            trust_score_rank: ['number', 'string'].includes(typeof trust_score_rank) ? Number(trust_score_rank) : -1,
            trust_score: ['number', 'string'].includes(typeof trust_score) ? Number(trust_score) : -1,
          })
        }
      }
      getData()
    },
    [cryptos_data, id],
  )

  useEffect(
    () => {
      const getData = async () => {
        if (data) {
          const { id, market_type } = { ...data }
          let _tickers
          for (let i = 0; i < (market_type !== 'spot' ? 1 : 20); i++) {
            const response = market_type !== 'spot' ? { ...data } : await getExchangeTickers(id, { page: i + 1, order: 'trust_score_desc', depth: true })
            const { tickers } = { ...response }
            if (tickers) {
              _tickers = _.orderBy(
                toArray(_.concat(_tickers, tickers)).map(d => {
                  const { converted_last, h24_percentage_change, index, index_basis_percentage, bid_ask_spread_percentage, bid_ask_spread, cost_to_move_up_usd, cost_to_move_down_usd, funding_rate, open_interest_usd, converted_volume, trust_score } = { ...d }
                  return {
                    ...d,
                    converted_last: Object.fromEntries(Object.entries({ ...converted_last }).map(([k, v]) => [k, ['number', 'string'].includes(typeof v) ? Number(v) : -1])),
                    h24_percentage_change: ['number', 'string'].includes(typeof h24_percentage_change) ? Number(h24_percentage_change) : Number.MIN_SAFE_INTEGER,
                    index: ['number', 'string'].includes(typeof index) ? Number(index) : -1,
                    index_basis_percentage: ['number', 'string'].includes(typeof index_basis_percentage) ? Number(index_basis_percentage) : Number.MIN_SAFE_INTEGER,
                    bid_ask_spread_percentage: ['number', 'string'].includes(typeof bid_ask_spread_percentage) ? Number(bid_ask_spread_percentage) : -1,
                    bid_ask_spread: ['number', 'string'].includes(typeof bid_ask_spread) ? Number(bid_ask_spread) : -1,
                    up_depth: ['number', 'string'].includes(typeof cost_to_move_up_usd) ? Number(cost_to_move_up_usd) : -1,
                    down_depth: ['number', 'string'].includes(typeof cost_to_move_down_usd) ? Number(cost_to_move_down_usd) : -1,
                    funding_rate: ['number', 'string'].includes(typeof funding_rate) ? Number(funding_rate) : Number.MIN_SAFE_INTEGER,
                    open_interest_usd: ['number', 'string'].includes(typeof open_interest_usd) ? Number(open_interest_usd) : -1,
                    converted_volume: Object.fromEntries(Object.entries({ ...converted_volume }).map(([k, v]) => [k, ['number', 'string'].includes(typeof v) ? Number(v) : -1])),
                    trust_score: typeof trust_score === 'number' ? trust_score : trust_score === 'green' ? 1 : trust_score === 'yellow' ? 0.5 : 0,
                  }
                }),
                [market_type !== 'spot' ? 'open_interest_usd' : 'trust_score'], ['desc'],
              )
              setTickers(_tickers)
              if (tickers.length < PAGE_SIZE) {
                break
              }
            }
          }
        }
      }
      getData()
    },
    [data],
  )

  const { coins } = { ...cryptos_data }
  const { market_type } = { ...data }
  const _data = data && {
    ...data,
    number_of_perpetual_pairs: market_type !== 'spot' && toArray(tickers).filter(d => d.contract_type === 'perpetual').length,
    number_of_futures_pairs: market_type !== 'spot' && toArray(tickers).filter(d => d.contract_type === 'futures').length,
    number_of_tokens: market_type === 'spot' && _.uniqBy(toArray(tickers), 'base').length,
    number_of_pairs: market_type === 'spot' && toArray(tickers).length,
  }
  const { name, large, thumb, centralized, exchange_type, trade_volume_24h_btc } = { ..._data }
  const _url = _data?.url
  const { title, description, image, url } = { ...meta(asPath, _data) }

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
        {_data ?
          <div className="space-y-2 sm:space-y-4 mt-4 sm:mt-6 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 space-x-0 sm:space-x-3 px-3">
              <div className="space-y-0.5">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-3">
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
                  </div>
                  {_url && (
                    <a
                      href={_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-max bg-blue-400 dark:bg-blue-600 shadow-lg rounded-lg uppercase text-white text-xs font-bold py-1.5 px-2"
                    >
                      Start Trading
                    </a>
                  )}
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-base font-semibold">
                    {getTitle(market_type)} Exchange
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                    {getTitle(typeof centralized === 'boolean' ? centralized ? 'centralized' : 'decentralized' : exchange_type)}
                  </span>
                </div>
              </div>
            </div>
            <Summary data={_data} tickers={tickers} />
            <Datatable
              columns={[
                {
                  Header: '#',
                  accessor: 'i',
                  disableSortBy: true,
                  Cell: props => (
                    <span className="text-black dark:text-white font-medium">
                      {props.flatRows?.indexOf(props.row) + 1}
                    </span>
                  ),
                },
                {
                  Header: 'Token',
                  accessor: 'name',
                  sortType: (a, b) => a.original.name > b.original.name ? 1 : -1,
                  Cell: props => {
                    const { value, row } = { ...props }
                    const { token_id, token_data } = { ...row.original }
                    const { symbol, image } = { ...token_data }
                    return (
                      <Link
                        href={`/token${token_id ? `/${token_id}` : 's'}`}
                        className="flex flex-col mb-6"
                        style={{ maxWidth: '15rem' }}
                      >
                        <div className="token-column flex items-center space-x-2">
                          {image && (
                            <Image
                              src={image}
                              width={24}
                              height={24}
                            />
                          )}
                          <span className="flex items-start space-x-2">
                            <span className="whitespace-pre-wrap text-blue-400 dark:text-blue-500 text-xs font-bold">
                              {value}
                            </span>
                            {symbol && (
                              <span className={`${symbol.length > 6 ? 'break-all' : ''} uppercase text-slate-400 dark:text-slate-500 text-xs font-semibold`}>
                                {symbol}
                              </span>
                            )}
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
                          {trade_url || _url ?
                            <a
                              href={trade_url || _url}
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
                          {market_type === 'spot' && trust_score > -1 && (!trust_score ? <HiShieldExclamation size={18} className="text-red-400 dark:text-red5600 mb-0.5" /> : <HiShieldCheck size={18} className={`${trust_score === 1 ? 'text-green-400 dark:text-green-500' : 'text-yellow-400 dark:text-yellow-500'} mb-0.5`} />)}
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
                  Header: '24h',
                  accessor: 'h24_percentage_change',
                  sortType: (a, b) => a.original.h24_percentage_change > b.original.h24_percentage_change ? 1 : -1,
                  Cell: props => {
                    const { value } = { ...props }
                    return (
                      <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                        {value > Number.MIN_SAFE_INTEGER && (
                          <NumberDisplay
                            value={value}
                            format="0,0.00"
                            maxDecimals={2}
                            prefix={value < 0 ? '' : '+'}
                            suffix="%"
                            noTooltip={true}
                            className={`whitespace-nowrap ${value < 0 ? 'text-red-500 dark:text-red-400' : value > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} text-sm font-medium`}
                          />
                        )}
                      </div>
                    )
                  },
                  headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                },
                {
                  Header: 'Index Price',
                  accessor: 'index',
                  sortType: (a, b) => a.original.index > b.original.index ? 1 : -1,
                  Cell: props => {
                    const { value } = { ...props }
                    return (
                      <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                        {value > -1 && (
                          <NumberDisplay
                            value={value}
                            format="0,0.00000000"
                            noTooltip={true}
                          />
                        )}
                      </div>
                    )
                  },
                  headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                },
                {
                  Header: 'Basis',
                  accessor: 'index_basis_percentage',
                  sortType: (a, b) => a.original.index_basis_percentage > b.original.index_basis_percentage ? 1 : -1,
                  Cell: props => {
                    const { value } = { ...props }
                    return (
                      <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                        {value > Number.MIN_SAFE_INTEGER && (
                          <NumberDisplay
                            value={value * 100}
                            format="0,0.00"
                            maxDecimals={2}
                            prefix={value < 0 ? '' : '+'}
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
                  Header: 'Spread',
                  accessor: market_type === 'spot' ? 'bid_ask_spread_percentage' : 'bid_ask_spread',
                  sortType: (a, b) => a.original[market_type === 'spot' ? 'bid_ask_spread_percentage' : 'bid_ask_spread'] > b.original[market_type === 'spot' ? 'bid_ask_spread_percentage' : 'bid_ask_spread'] ? 1 : -1,
                  Cell: props => {
                    const { value } = { ...props }
                    return (
                      <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                        {value > -1 && (
                          <NumberDisplay
                            value={value * (market_type !== 'spot' ? 100 : 1)}
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
                  Header: 'Funding Rate',
                  accessor: 'funding_rate',
                  sortType: (a, b) => a.original.funding_rate > b.original.funding_rate ? 1 : -1,
                  Cell: props => {
                    const { value } = { ...props }
                    return (
                      <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                        {value > Number.MIN_SAFE_INTEGER && (
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
                  Header: 'Open Interest',
                  accessor: 'open_interest_usd',
                  sortType: (a, b) => a.original.open_interest_usd > b.original.open_interest_usd ? 1 : -1,
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
              ].filter(c => !(market_type !== 'spot' ? ['bid_ask_spread_percentage', 'up_depth', 'down_depth', 'volume_percentage', 'trust_score'] : ['h24_percentage_change', 'index', 'index_basis_percentage', 'bid_ask_spread', 'funding_rate', 'open_interest_usd']).includes(c.accessor))}
              data={
                toArray(tickers).map(d => {
                  const { base, target, coin_id, target_coin_id, converted_volume } = { ...d }
                  const token_data = toArray(coins).find(d => market_type !== 'spot' ? base && ['symbol', 'name', 'id'].findIndex(f => equalsIgnoreCase(d[f], base)) > -1 : d.id === coin_id)
                  const { id, name, large } = { ...token_data }
                  return {
                    ...d,
                    token_id: coin_id || id,
                    token_data: {
                      ...token_data,
                      image: large,
                    },
                    name: name || (base?.toLowerCase().startsWith('0x') ? coin_id ? toArray(coins).find(d => d.id === coin_id)?.name || getTitle(coin_id) : ellipse(base, 6) : base),
                    pair: `${base?.toLowerCase().startsWith('0x') ? coin_id ? toArray(coins).find(d => d.id === coin_id)?.name || getTitle(coin_id) : ellipse(base, 6) : base}/${target?.toLowerCase().startsWith('0x') ? target_coin_id ? toArray(coins).find(d => d.id === target_coin_id)?.symbol || getTitle(target_coin_id) : ellipse(target, 6) : target}`,
                    volume_percentage: converted_volume?.btc > -1 && trade_volume_24h_btc ? converted_volume.btc / trade_volume_24h_btc : -1,
                  }
                })
              }
              defaultPageSize={PAGE_SIZE}
              noPagination={toArray(tickers).length <= 10}
              className="no-border no-shadow striped"
            />
          </div> :
          <div className="loading">
            <Spinner name="Blocks" />
          </div>
        }
      </div>
    </>
  )
}