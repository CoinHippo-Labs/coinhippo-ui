import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'
import { MdArrowDropUp } from 'react-icons/md'

import Summary from './summary'
import Image from '../image'
import Datatable from '../datatable'
import { ProgressBar, ProgressBarWithText } from '../progress-bars'
import { Pagination } from '../paginations'
import { tokens_markets, categories_markets } from '../../lib/api/coingecko'
import { currency, currency_symbol, currency_btc } from '../../lib/object/currency'
import { name, number_format, loader_color } from '../../lib/utils'

export default () => {
  const { preferences, cryptos, rates } = useSelector(state => ({ preferences: state.preferences, cryptos: state.cryptos, rates: state.rates }), shallowEqual)
  const { theme } = { ...preferences }
  const { cryptos_data } = { ...cryptos }
  const { rates_data } = { ...rates }

  const router = useRouter()
  const { pathname, query } = { ...router }
  const { category, view, n } = { ...query }
  let { page } = { ...query }
  page = !['/tokens/categories'].includes(pathname) ?
    !isNaN(page) && Number(page) > 0 ?
      Number(page) :
      typeof page === 'undefined' ?
        1 : -1 : -1

  const per_page = category ?
    Number(n) > 0 ?
      Number(n) < 10 ?
        10 :
        Number(n) > 50 ?
          50 : Number(n) : 50 :
          Number(n) > 0 ?
            Number(n) < 10 ?
              10 :
              Number(n) > 100 ?
                100 : Number(n) : 100

  const [data, setData] = useState(null)

  useEffect(() => {
    const getData = async () => {
      if (cryptos_data && (['/tokens/categories'].includes(pathname) || page > -1)) {
        let data
        for (let i = 0; i < (category ? 10 : 1); i++) {
          const response = await (['/tokens/categories'].includes(pathname) ?
            categories_markets() :
            tokens_markets({
              vs_currency: currency,
              category,
              order: ['/tokens/high-volume'].includes(pathname) ?
                'volume_desc' : 'market_cap_desc',
              per_page,
              page: category ?
                i + 1 : page,
              price_change_percentage: '24h,7d,30d',
            })
          )
          if (Array.isArray(response)) {
            data = _.orderBy(
              _.uniqBy(_.concat(data || [], response), 'id')
              .map(d => {
                const { market_cap_rank, current_price, price_change_percentage_24h_in_currency, price_change_percentage_7d_in_currency, price_change_percentage_30d_in_currency, roi, atl, market_cap, market_cap_change_24h, fully_diluted_valuation, max_supply, total_supply, circulating_supply, total_volume, volume_24h } = { ...d }
                const { times, percentage } = { ...roi }
                return {
                  ...d,
                  market_cap_rank: typeof market_cap_rank === 'string' ? Number(market_cap_rank) : typeof market_cap_rank === 'number' ? market_cap_rank : Number.MAX_SAFE_INTEGER,
                  current_price: typeof current_price === 'string' ? Number(current_price) : typeof current_price === 'number' ? current_price : -1,
                  price_change_percentage_24h_in_currency: typeof price_change_percentage_24h_in_currency === 'string' ? Number(price_change_percentage_24h_in_currency) : typeof price_change_percentage_24h_in_currency === 'number' ? price_change_percentage_24h_in_currency : Number.MIN_SAFE_INTEGER,
                  price_change_percentage_7d_in_currency: typeof price_change_percentage_7d_in_currency === 'string' ? Number(price_change_percentage_7d_in_currency) : typeof price_change_percentage_7d_in_currency === 'number' ? price_change_percentage_7d_in_currency : Number.MIN_SAFE_INTEGER,
                  price_change_percentage_30d_in_currency: typeof price_change_percentage_30d_in_currency === 'string' ? Number(price_change_percentage_30d_in_currency) : typeof price_change_percentage_30d_in_currency === 'number' ? price_change_percentage_30d_in_currency : Number.MIN_SAFE_INTEGER,
                  roi: {
                    ...roi,
                    times: roi ? times : atl > 0 ? (current_price - atl) / atl : null,
                    currency: roi?.currency ? roi.currency : currency,
                    percentage: roi ? percentage : atl > 0 ? (current_price - atl) * 100 / atl : null,
                    from: !roi ? 'atl' : null,
                  },
                  market_cap: typeof market_cap === 'string' ? Number(market_cap) : typeof market_cap === 'number' ? market_cap : -1,
                  market_cap_change_24h: typeof market_cap_change_24h === 'string' ? Number(market_cap_change_24h) : typeof market_cap_change_24h === 'number' ? market_cap_change_24h : Number.MIN_SAFE_INTEGER,
                  fully_diluted_valuation: typeof fully_diluted_valuation === 'string' ? Number(fully_diluted_valuation) : typeof fully_diluted_valuation === 'number' ? fully_diluted_valuation : (current_price * (max_supply || total_supply || circulating_supply)) || -1,
                  circulating_supply: typeof circulating_supply === 'string' ? Number(circulating_supply) : typeof circulating_supply === 'number' ? circulating_supply : -1,
                  total_volume: typeof total_volume === 'string' ? Number(total_volume) : typeof total_volume === 'number' ? total_volume : -1,
                  volume_24h: typeof volume_24h === 'string' ? Number(volume_24h) : typeof volume_24h === 'number' ? volume_24h : -1,
                }
              }),
              [['/tokens/high-volume'].includes(pathname) ? 'total_volume' : ['/tokens/categories'].includes(pathname) ? 'market_cap' : 'market_cap_rank'], [['/tokens/high-volume', '/tokens/categories'].includes(pathname) ? 'desc' : 'asc']
            )
            data = data.map(d => {
              const { volume_24h } = { ...d }
              return {
                ...d,
                market_share: volume_24h > -1 ?
                  volume_24h / _.sumBy(data.filter(_d => _d?.volume_24h > 0), 'volume_24h') : -1,
              }
            })
            setData(data)
            if (response.length < per_page) {
              break
            }
          }
        }
      }
    }
    getData()
    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [cryptos_data, pathname, category, page])

  const is_widget = ['widget'].includes(view)

  return (
    <div className={`${is_widget ? 'max-w-2xl' : 'space-y-2 my-4 mx-2'}`}>
      {!is_widget && (
        <div className="flex items-center justify-between sm:justify-start space-x-4">
          <h1 className="text-xl font-bold">
            Top {category ? name(category) : ['/tokens/categories'].includes(pathname) ? 'Cryptocurrency Categories' : 'Cryptocurrency Prices'} by {['/tokens/high-volume'].includes(pathname) ? 'Volume' : 'Market Capitalization'}
          </h1>
        </div>
      )}
      <div className="space-y-5">
        {!is_widget && ['/tokens/categories'].includes(pathname) && (
          <Summary data={data} />
        )}
        {data ?
          <Datatable
            columns={[
              {
                Header: '#',
                accessor: ['/tokens/categories'].includes(pathname) ? 'i' : 'market_cap_rank',
                sortType: (a, b) => a.original[['/tokens/categories'].includes(pathname) ? 'i' : 'market_cap_rank'] > b.original[['/tokens/categories'].includes(pathname) ? 'i' : 'market_cap_rank'] ? 1 : -1,
                Cell: props => (
                  <span className="font-mono font-semibold">
                    {['/tokens/categories'].includes(pathname) ?
                      props.value > -1 || !props.value ?
                        number_format((props.flatRows?.indexOf(props.row) > -1 ?
                          props.flatRows.indexOf(props.row) : props.value
                        ) + 1, '0,0') : '-' :
                        props.value < Number.MAX_SAFE_INTEGER ?
                          number_format(props.value, '0,0') : '-'
                    }
                  </span>
                ),
              },
              {
                Header: ['/tokens/categories'].includes(pathname) ? 'Category' : 'Token',
                accessor: 'name',
                sortType: (a, b) => a.original.name > b.original.name ? 1 : -1,
                Cell: props => (
                  <Link
                    href={`/token${props.row.original.id ? `${['/tokens/categories'].includes(pathname) ? 's' : ''}/${props.row.original.id}` : 's'}`}
                  >
                  <a
                    target={is_widget ? '_blank' : '_self'}
                    rel={is_widget ? 'noopener noreferrer' : ''}
                    className="flex flex-col items-start space-y-1 -mt-0.5 mb-2"
                    style={{
                      maxWidth: ['/tokens/categories'].includes(pathname) ?
                        'unset' :
                        '10rem',
                    }}
                  >
                    <div className="token-column flex items-center space-x-2">
                      {!['/tokens/categories'].includes(pathname) && props.row.original.image && (
                        <Image
                          src={props.row.original.image}
                          alt=""
                          width={24}
                          height={24}
                        />
                      )}
                      <span className="flex items-start space-x-2">
                        <span className="whitespace-pre-wrap text-blue-600 dark:text-blue-400 text-xs font-bold">
                          {props.value}
                        </span>
                        {props.row.original.symbol && (
                          <span className={`${props.row.original.symbol.length > 6 ? 'break-all' : ''} uppercase text-slate-400 dark:text-slate-500 text-xs font-semibold`}>
                            {props.row.original.symbol}
                          </span>
                        )}
                      </span>
                    </div>
                  </a>
                  </Link>
                ),
              },
              {
                Header: 'Price',
                accessor: 'current_price',
                sortType: (a, b) => a.original.price_change_percentage_24h_in_currency > b.original.price_change_percentage_24h_in_currency ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-0">
                    <div className="flex items-center uppercase font-semibold space-x-1">
                      <span>
                        {currency_symbol}
                        {props.value > -1 ? number_format(props.value, '0,0.00000000') : '-'}
                      </span>
                    </div>
                    {props.value > -1 && (
                      <>
                        <div className="w-full flex items-center justify-between space-x-2">
                          <div className="flex items-center uppercase text-2xs font-medium space-x-1">
                            <span>
                              {currency_symbol}
                              {number_format(props.row.original.low_24h, '0,0.00000000')}
                            </span>
                          </div>
                          <div className="flex items-center uppercase text-2xs font-medium space-x-1">
                            <span>
                              {currency_symbol}
                              {number_format(props.row.original.high_24h, '0,0.00000000')}
                            </span>
                          </div>
                        </div>
                        <ProgressBarWithText
                          width={props.row.original.high_24h - props.row.original.low_24h > 0 ? (props.value - props.row.original.low_24h) * 100 / (props.row.original.high_24h - props.row.original.low_24h) : 0}
                          color="bg-slate-200 dark:bg-slate-600 rounded-lg"
                          text={props.row.original.high_24h - props.row.original.low_24h > 0 && (
                            <MdArrowDropUp
                              size={24}
                              className="text-slate-200 dark:text-slate-600 mt-0.5 ml-auto"
                              style={((props.value - props.row.original.low_24h) * 100 / (props.row.original.high_24h - props.row.original.low_24h)) <= 5 ?
                                { marginLeft: '-.5rem' } :
                                { marginRight: '-.5rem' }
                              }
                            />
                          )}
                          className="h-2 rounded-lg"
                          backgroundClassName="h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                        />
                      </>
                    )}
                  </div>
                ),
                headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: '24h',
                accessor: 'price_change_percentage_24h_in_currency',
                sortType: (a, b) => a.original.price_change_percentage_24h_in_currency > b.original.price_change_percentage_24h_in_currency ? 1 : -1,
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
                Header: '7d',
                accessor: 'price_change_percentage_7d_in_currency',
                sortType: (a, b) => a.original.price_change_percentage_7d_in_currency > b.original.price_change_percentage_7d_in_currency ? 1 : -1,
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
                Header: '30d',
                accessor: 'price_change_percentage_30d_in_currency',
                sortType: (a, b) => a.original.price_change_percentage_30d_in_currency > b.original.price_change_percentage_30d_in_currency ? 1 : -1,
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
                Header: 'ROI',
                accessor: 'roi.times',
                sortType: (a, b) => a.original.roi?.times > b.original.roi?.times ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <span className={`${props.value < 0 ? 'text-red-600 dark:text-red-400' : props.value > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {typeof props.value === 'number' ?
                        <>
                          <span className="text-xs font-semibold">
                            {number_format(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}x
                          </span>
                          <div className="text-slate-400 dark:text-slate-600 text-2xs font-medium">
                            {props.row.original.roi.from ?
                              <>
                                from <span className="uppercase font-semibold">
                                  {props.row.original.roi.from}
                                </span>
                              </>:
                              <>
                                in <span className="uppercase font-semibold">
                                  {props.row.original.roi.currency}
                                </span>
                              </>
                            }
                          </div>
                        </>
                        :
                        <span className="text-xs font-semibold">
                          -
                        </span>
                      }
                    </span>
                  </div>
                ),
                headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: 'Market Cap',
                accessor: 'market_cap',
                sortType: (a, b) => a.original.market_cap > b.original.market_cap ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <div className={`flex items-center uppercase ${['/tokens/high-volume'].includes(pathname) ? 'font-semibold' : 'font-bold'} space-x-1`}>
                      <span>
                        {currency_symbol}
                        {props.value > -1 ? number_format(props.value, '0,0') : '-'}
                      </span>
                    </div>
                    {props.value > -1 && rates_data && (
                      <span className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-bold space-x-1">
                        <span>
                          {number_format(props.value * rates_data[currency_btc]?.value / rates_data[currency]?.value, '0,0')}
                        </span>
                        <span className="uppercase">
                          {currency_btc}
                        </span>
                      </span>
                    )}
                  </div>
                ),
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: '24h',
                accessor: 'market_cap_change_24h',
                sortType: (a, b) => a.original.market_cap_change_24h > b.original.market_cap_change_24h ? 1 : -1,
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
                Header: 'Fully Diluted MCap',
                accessor: 'fully_diluted_valuation',
                sortType: (a, b) => a.original.fully_diluted_valuation > b.original.fully_diluted_valuation ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <div className={`flex items-center uppercase ${['/tokens/high-volume'].includes(pathname) ? 'font-semibold' : 'font-bold'} space-x-1`}>
                      <span>
                        {currency_symbol}
                        {props.value > -1 ? number_format(props.value, '0,0') : '-'}
                      </span>
                    </div>
                    {props.value > -1 && rates_data && (
                      <span className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-bold space-x-1">
                        <span>
                          {number_format(props.value * rates_data[currency_btc]?.value / rates_data[currency]?.value, '0,0')}
                        </span>
                        <span className="uppercase">
                          {currency_btc}
                        </span>
                      </span>
                    )}
                  </div>
                ),
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: '24h Volume',
                accessor: ['/tokens/categories'].includes(pathname) ? 'volume_24h' : 'total_volume',
                sortType: (a, b) => a.original[['/tokens/categories'].includes(pathname) ? 'volume_24h' : 'total_volume'] > b.original[['/tokens/categories'].includes(pathname) ? 'volume_24h' : 'total_volume'] ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <div className={`flex items-center uppercase ${['/tokens/high-volume', '/tokens/categories'].includes(pathname) ? 'font-bold' : 'font-semibold'} space-x-1`}>
                      <span>
                        {currency_symbol}
                        {props.value > -1 ? number_format(props.value, '0,0') : '-'}
                      </span>
                    </div>
                    {props.value > -1 && rates_data && (
                      <span className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-bold space-x-1">
                        <span>
                          {number_format(props.value * rates_data[currency_btc]?.value / rates_data[currency]?.value, '0,0')}
                        </span>
                        <span className="uppercase">
                          {currency_btc}
                        </span>
                      </span>
                    )}
                  </div>
                ),
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: 'Market Share',
                accessor: 'market_share',
                sortType: (a, b) => a.original.volume_24h > b.original.volume_24h ? 1 : -1,
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
              {
                Header: 'Circulating Supply',
                accessor: 'circulating_supply',
                sortType: (a, b) => a.original.circulating_supply > b.original.circulating_supply ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    {props.value > -1 ?
                      <>
                        <span className="text-xs font-semibold">
                          {number_format(props.value, '0,0')}
                        </span>
                        {props.row.original.max_supply && (
                          <>
                            <ProgressBarWithText
                              width={props.value * 100 / props.row.original.max_supply}
                              color="bg-slate-200 dark:bg-slate-600 rounded-lg"
                              text={<div
                                className="text-slate-600 dark:text-slate-400 font-medium mx-1"
                                style={{
                                  fontSize: props.value * 100 / props.row.original.max_supply < 25 ?
                                    '.45rem' : '.55rem',
                                }}
                              >
                                {number_format(props.value * 100 / props.row.original.max_supply, `0,0.000${Math.abs(props.value * 100 / props.row.original.max_supply) < 0.001 ? '000' : ''}`)}%
                              </div>}
                              className={`h-3 flex items-center justify-${props.value * 100 / props.row.original.max_supply < 25 ? 'start' : 'end'}`}
                              backgroundClassName="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
                            />
                            <div className="flex items-center justify-start sm:justify-end space-x-1.5">
                              <span className="text-2xs font-medium">
                                Max:
                              </span>
                              <span className="text-slate-400 dark:text-slate-500 text-2xs font-semibold">
                                {number_format(props.row.original.max_supply, '0,0')}
                              </span>
                            </div>
                          </>
                        )}
                      </>
                      :
                      <span>
                        -
                      </span>
                    }
                  </div>
                ),
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
            ].filter(c => !(['/tokens/categories'].includes(pathname) ? ['current_price', 'price_change_percentage_1h_in_currency', 'price_change_percentage_24h_in_currency', 'price_change_percentage_7d_in_currency', 'price_change_percentage_30d_in_currency', 'roi.times', 'fully_diluted_valuation', 'total_volume', 'circulating_supply'] : ['market_cap_change_24h', 'volume_24h', 'market_share'].concat(['/tokens/high-volume'].includes(pathname) ? ['roi.times'] : ['roi.times'])).includes(c?.accessor))
              .filter(c => is_widget ? ['i', 'market_cap_rank', 'name', 'current_price', 'price_change_percentage_24h_in_currency', 'market_cap'].includes(c?.accessor) : true)
            }
            data={_.slice(data, 0, n ? Number(n) : undefined)}
            noPagination={_.slice(data, 0, n ? Number(n) : undefined).length <= 10}
            defaultPageSize={per_page}
            pagination={!category && (
              <div className="flex flex-col sm:flex-row items-center justify-center my-4">
                <Pagination
                  active={page}
                  items={[...Array(Math.ceil((cryptos_data?.coins?.length || 10000) / per_page)).keys()]}
                  onClick={p => router.push(`${pathname}?page=${p}`)}
                />
              </div>
            )}
            className={`no-border ${!is_widget && ['/tokens/categories'].includes(pathname) ? 'striped' : ''}`}
          /> :
          <TailSpin
            color={loader_color(theme)}
            width="32"
            height="32"
          />
        }
      </div>
    </div>
  )
}