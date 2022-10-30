import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'
import { IoInformationCircleSharp } from 'react-icons/io5'
import { HiShieldCheck, HiShieldExclamation } from 'react-icons/hi'

import Summary from './summary'
import Image from '../image'
import Copy from '../copy'
import Datatable from '../datatable'
import { ProgressBar } from '../progress-bars'
import { exchange as getExchange, derivatives_exchange as getDerivativesExchange, exchange_tickers as getExchangeTickers } from '../../lib/api/coingecko'
import { currency, currency_symbol, currency_btc } from '../../lib/object/currency'
import meta from '../../lib/meta'
import { name, number_format, ellipse, equals_ignore_case, loader_color } from '../../lib/utils'

const per_page = 100

export default () => {
  const { preferences, cryptos, rates } = useSelector(state => ({ preferences: state.preferences, cryptos: state.cryptos, rates: state.rates }), shallowEqual)
  const { theme } = { ...preferences }
  const { cryptos_data } = { ...cryptos }
  const { rates_data } = { ...rates }

  const router = useRouter()
  const { query, asPath } = { ...router }
  const { exchange_id } = { ...query }

  const [data, setData] = useState(null)
  const [tickers, setTickers] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const exchange_data = cryptos_data?.exchanges?.find(e => e?.id === exchange_id)
      if (exchange_data) {
        const { market_type } = { ...exchange_data }
        const response = await (market_type !== 'spot' ?
          getDerivativesExchange(exchange_id, { include_tickers: 'unexpired' }) :
          getExchange(exchange_id)
        )
        if (!response?.error) {
          const { trust_score_rank, trust_score } = { ...response }
          setData({
            ...response,
            ...exchange_data,
            trust_score_rank: typeof trust_score_rank === 'string' ? Number(trust_score_rank) : typeof trust_score_rank === 'number' ? trust_score_rank : -1,
            trust_score: typeof trust_score === 'string' ? Number(trust_score) : typeof trust_score === 'number' ? trust_score : -1,
          })
        }
      }
    }
    getData()
  }, [cryptos_data, exchange_id])

  useEffect(() => {
    const getData = async () => {
      if (data) {
        const { id, market_type } = { ...data }
        let _tickers
        for (let i = 0; i < (market_type !== 'spot' ? 1 : 20); i++) {
          const response = market_type !== 'spot' ?
            { ...data } :
            await getExchangeTickers(id, {
              page: i + 1,
              order: 'trust_score_desc',
              depth: true,
            })
          if (response?.tickers) {
            _tickers = _.orderBy(
              _.concat(_tickers || [], response.tickers)
              .map(t => {
                const { converted_last, h24_percentage_change, index, index_basis_percentage, bid_ask_spread_percentage, bid_ask_spread, cost_to_move_up_usd, cost_to_move_down_usd, funding_rate, open_interest_usd, converted_volume, trust_score } = { ...t }
                return {
                  ...t,
                  converted_last: Object.fromEntries(Object.entries({ ...converted_last }).map(([k, v]) => [k, typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : -1])),
                  h24_percentage_change: typeof h24_percentage_change === 'string' ? Number(h24_percentage_change) : typeof h24_percentage_change === 'number' ? h24_percentage_change : Number.MIN_SAFE_INTEGER,
                  index: index === 'string' ? Number(index) : typeof index === 'number' ? index : -1,
                  index_basis_percentage: index_basis_percentage === 'string' ? Number(index_basis_percentage) : typeof index_basis_percentage === 'number' ? index_basis_percentage : Number.MIN_SAFE_INTEGER,
                  bid_ask_spread_percentage: typeof bid_ask_spread_percentage === 'string' ? Number(bid_ask_spread_percentage) : typeof bid_ask_spread_percentage === 'number' ? bid_ask_spread_percentage : -1,
                  bid_ask_spread: typeof bid_ask_spread === 'string' ? Number(bid_ask_spread) : typeof bid_ask_spread === 'number' ? bid_ask_spread : -1,
                  up_depth: typeof cost_to_move_up_usd === 'string' ? Number(cost_to_move_up_usd) : typeof cost_to_move_up_usd === 'number' ? cost_to_move_up_usd : -1,
                  down_depth: typeof cost_to_move_down_usd === 'string' ? Number(cost_to_move_down_usd) : typeof cost_to_move_down_usd === 'number' ? cost_to_move_down_usd : -1,
                  funding_rate: typeof funding_rate === 'string' ? Number(funding_rate) : typeof funding_rate === 'number' ? funding_rate : Number.MIN_SAFE_INTEGER,
                  open_interest_usd: typeof open_interest_usd === 'string' ? Number(open_interest_usd) : typeof open_interest_usd === 'number' ? open_interest_usd : -1,
                  converted_volume: Object.fromEntries(Object.entries({ ...converted_volume }).map(([k, v]) => [k, typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : -1])),
                  trust_score: typeof trust_score === 'number' ? trust_score : trust_score === 'green' ? 1 : trust_score === 'yellow' ? 0.5 : 0,
                }
              }),
              [market_type !== 'spot' ? 'open_interest_usd' : 'trust_score'], ['desc']
            )
            setTickers(_tickers)
            if (response.tickers.length < per_page) {
              break
            }
          }
        }
      }
    }
    getData()
  }, [data])

  const _data = data && {
    ...data,
    number_of_perpetual_pairs: data.market_type !== 'spot' && tickers?.filter(t => t?.contract_type === 'perpetual').length,
    number_of_futures_pairs: data.market_type !== 'spot' && tickers?.filter(t => t?.contract_type === 'futures').length,
    number_of_tokens: data.market_type === 'spot' && _.uniqBy(tickers || [], 'base').length,
    number_of_pairs: data.market_type === 'spot' && tickers?.length,
  }
  const { market_type, large, thumb, url, centralized, exchange_type, trade_volume_24h_btc } = { ..._data }

  const headMeta = meta(asPath, _data)

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
          <div className="flex items-center space-x-3">
            {(large || thumb) && (
              <Image
                src={large || thumb}
                alt=""
                width={36}
                height={36}
              />
            )}
            <h1 className="text-xl font-bold">
              {_data?.name}
            </h1>
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-max bg-blue-500 hover:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 shadow-lg rounded-lg uppercase text-white text-xs font-bold py-1.5 px-2"
            >
              Start Trading
            </a>
          )}
        </div>
        <div className="flex items-center justify-between space-x-4">
          <h2 className="text-base font-bold">
            {name(market_type)} Exchange
          </h2>
          {_data && (
            <span className="text-slate-400 dark:text-slate-600 text-xs font-medium">
              {name(typeof centralized === 'boolean' ?
                centralized ? 'centralized' : 'decentralized' :
                exchange_type
              )}
            </span>
          )}
        </div>
        <div className="space-y-5">
          <Summary
            data={_data}
            tickers={tickers}
          />
          {tickers ?
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
                  Header: 'Token',
                  accessor: 'name',
                  sortType: (a, b) => a.original.name > b.original.name ? 1 : -1,
                  Cell: props => (
                    <Link
                      href={`/token${props.row.original.token_id ? `/${props.row.original.token_id}` : 's'}`}
                    >
                    <a
                      className="flex flex-col items-start space-y-1 -mt-0.5 mb-2"
                      style={{ maxWidth: '15rem' }}
                    >
                      <div className="token-column flex items-center space-x-2">
                        {props.row.original.token_data?.image && (
                          <Image
                            src={props.row.original.token_data.image}
                            alt=""
                            width={24}
                            height={24}
                          />
                        )}
                        <span className="flex items-start space-x-2">
                          <span className="whitespace-nowrap text-blue-600 dark:text-blue-400 text-sm font-bold">
                            {props.value}
                          </span>
                          {props.row.original.token_data?.symbol && (
                            <span className={`${props.row.original.token_data.symbol.length > 6 ? 'break-all' : ''} uppercase text-slate-400 dark:text-slate-500 text-sm font-semibold`}>
                              {props.row.original.token_data.symbol}
                            </span>
                          )}
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
                        {props.row.original.trade_url || url ?
                          <a
                            href={props.row.original.trade_url || url}
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
                        {market_type === 'spot' && props.row.original.trust_score > -1 && (
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
                  Header: '24h',
                  accessor: 'h24_percentage_change',
                  sortType: (a, b) => a.original.h24_percentage_change > b.original.h24_percentage_change ? 1 : -1,
                  Cell: props => (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                      <span className={`${props.value < 0 ? 'text-red-600 dark:text-red-400' : props.value > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} text-xs font-medium`}>
                        {props.value > Number.MIN_SAFE_INTEGER ?
                          `${number_format(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%` : '-'
                        }
                      </span>
                    </div>
                  ),
                  headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
                },
                {
                  Header: 'Index Price',
                  accessor: 'index',
                  sortType: (a, b) => a.original.index > b.original.index ? 1 : -1,
                  Cell: props => (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                      <span className="font-semibold">
                        {props.value > -1 ? number_format(props.value, '0,0.00000000') : '-'}
                      </span>
                    </div>
                  ),
                  headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                },
                {
                  Header: 'Basis',
                  accessor: 'index_basis_percentage',
                  sortType: (a, b) => a.original.index_basis_percentage > b.original.index_basis_percentage ? 1 : -1,
                  Cell: props => (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">
                        {props.value > Number.MIN_SAFE_INTEGER ? `${number_format(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%` : '-'}
                      </span>
                    </div>
                  ),
                  headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
                },
                {
                  Header: 'Spread',
                  accessor: market_type === 'spot' ? 'bid_ask_spread_percentage' : 'bid_ask_spread',
                  sortType: (a, b) => a.original[market_type === 'spot' ? 'bid_ask_spread_percentage' : 'bid_ask_spread'] > b.original[market_type === 'spot' ? 'bid_ask_spread_percentage' : 'bid_ask_spread'] ? 1 : -1,
                  Cell: props => (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">
                        {props.value > -1 ? `${number_format(props.value * (market_type !== 'spot' ? 100 : 1), `0,0.000${Math.abs(props.value * (market_type !== 'spot' ? 100 : 1)) < 0.001 ? '000' : ''}`)}%` : '-'}
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
                  Header: 'Funding Rate',
                  accessor: 'funding_rate',
                  sortType: (a, b) => a.original.funding_rate > b.original.funding_rate ? 1 : -1,
                  Cell: props => (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">
                        {props.value > Number.MIN_SAFE_INTEGER ? `${number_format(props.value, `0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%` : '-'}
                      </span>
                    </div>
                  ),
                  headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                },
                {
                  Header: 'Open Interest',
                  accessor: 'open_interest_usd',
                  sortType: (a, b) => a.original.open_interest_usd > b.original.open_interest_usd ? 1 : -1,
                  Cell: props => (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                      <div className="flex items-center font-semibold space-x-1">
                        <span>
                          {currency_symbol}
                          {props.value > -1 ? number_format(props.value, '0,0.000000') : '-'}
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
              ].filter(c => !((market_type !== 'spot' ? ['bid_ask_spread_percentage', 'up_depth', 'down_depth', 'volume_percentage', 'trust_score'] : ['h24_percentage_change', 'index', 'index_basis_percentage', 'bid_ask_spread', 'funding_rate', 'open_interest_usd']).includes(c?.accessor)))}
              data={tickers.map((t, i) => {
                const { base, target, coin_id, target_coin_id, converted_volume } = { ...t }
                const token_data = cryptos_data?.coins?.find(_t => market_type !== 'spot' ?
                  base && (equals_ignore_case(_t.symbol, base) || equals_ignore_case(_t.id, base) || equals_ignore_case(_t.name, base)) :
                  _t.id === coin_id
                )
                return {
                  ...t,
                  token_id: coin_id || token_data?.id,
                  token_data: {
                    ...token_data,
                    image: token_data?.large,
                  },
                  name: token_data?.name ?
                    token_data.name :
                    base?.toLowerCase().startsWith('0x') ?
                      coin_id ?
                        cryptos_data?.coins?.find(_t => _t.id === coin_id)?.name || name(coin_id) :
                        ellipse(base, 6) :
                      base,
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
                  volume_percentage: trade_volume_24h_btc && converted_volume?.[currency_btc] > -1 ?
                    converted_volume[currency_btc] / trade_volume_24h_btc : -1,
                }
              })}
              noPagination={tickers.length <= 10}
              defaultPageSize={per_page}
              className="no-border striped"
            /> :
            <TailSpin
              color={loader_color(theme)}
              width="32"
              height="32"
            />
          }
        </div>
      </div>
    </>
  )
}