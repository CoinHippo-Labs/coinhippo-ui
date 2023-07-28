import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { MdArrowDropUp } from 'react-icons/md'

import Summary from './summary'
import Spinner from '../spinner'
import Image from '../image'
import NumberDisplay from '../number'
import Datatable from '../datatable'
import { ProgressBar, ProgressBarWithText } from '../progress-bars'
import { Pagination } from '../paginations'
import { getTokensMarkets, getCategoriesMarkets } from '../../lib/api/coingecko'
import { toArray, getTitle } from '../../lib/utils'

export default () => {
  const { cryptos, rates } = useSelector(state => ({ cryptos: state.cryptos, rates: state.rates }), shallowEqual)
  const { cryptos_data } = { ...cryptos }
  const { rates_data } = { ...rates }

  const router = useRouter()
  const { pathname, query } = { ...router }
  const { category, view, n } = { ...query }
  let { page } = { ...query }
  const is_categories = pathname === '/tokens/categories'
  page = !is_categories ? !isNaN(page) && Number(page) > 0 ? Number(page) : typeof page === 'undefined' ? 1 : -1 : -1
  const PAGE_SIZE = category ? Number(n) > 0 ? Number(n) < 10 ? 10 : Number(n) > 50 ? 50 : Number(n) : 50 : Number(n) > 0 ? Number(n) < 10 ? 10 : Number(n) > 100 ? 100 : Number(n) : 100

  const [data, setData] = useState(null)

  useEffect(
    () => {
      const getData = async () => {
        if (cryptos_data && (is_categories || page > -1)) {
          let data
          for (let i = 0; i < (category ? 10 : 1); i++) {
            const response = await (is_categories ? getCategoriesMarkets() : getTokensMarkets({ vs_currency: 'usd', category, order: ['/tokens/high-volume'].includes(pathname) ? 'volume_desc' : 'market_cap_desc', per_page: PAGE_SIZE, page: category ? i + 1 : page, price_change_percentage: '24h,7d,30d' }))
            if (Array.isArray(response)) {
              data = _.orderBy(
                _.uniqBy(toArray(_.concat(data, response)), 'id')
                .map(d => {
                  const { market_cap_rank, current_price, price_change_percentage_24h_in_currency, price_change_percentage_7d_in_currency, price_change_percentage_30d_in_currency, roi, atl, market_cap, market_cap_change_24h, fully_diluted_valuation, max_supply, total_supply, circulating_supply, total_volume, volume_24h } = { ...d }
                  const { times, percentage } = { ...roi }
                  return {
                    ...d,
                    market_cap_rank: ['number', 'string'].includes(typeof market_cap_rank) ? Number(market_cap_rank) : Number.MAX_SAFE_INTEGER,
                    current_price: ['number', 'string'].includes(typeof current_price) ? Number(current_price) : -1,
                    price_change_percentage_24h_in_currency: ['number', 'string'].includes(typeof price_change_percentage_24h_in_currency) ? Number(price_change_percentage_24h_in_currency) : Number.MIN_SAFE_INTEGER,
                    price_change_percentage_7d_in_currency: ['number', 'string'].includes(typeof price_change_percentage_7d_in_currency) ? Number(price_change_percentage_7d_in_currency) : Number.MIN_SAFE_INTEGER,
                    price_change_percentage_30d_in_currency: ['number', 'string'].includes(typeof price_change_percentage_30d_in_currency) ? Number(price_change_percentage_30d_in_currency) : Number.MIN_SAFE_INTEGER,
                    roi: {
                      ...roi,
                      times: roi ? times : atl > 0 ? (current_price - atl) / atl : null,
                      currency: roi?.currency || 'usd',
                      percentage: roi ? percentage : atl > 0 ? (current_price - atl) * 100 / atl : null,
                      from: !roi ? 'atl' : null,
                    },
                    market_cap: ['number', 'string'].includes(typeof market_cap) ? Number(market_cap) : -1,
                    market_cap_change_24h: ['number', 'string'].includes(typeof market_cap_change_24h) ? Number(market_cap_change_24h) : Number.MIN_SAFE_INTEGER,
                    fully_diluted_valuation: ['number', 'string'].includes(typeof fully_diluted_valuation) ? Number(fully_diluted_valuation) : (current_price * (max_supply || total_supply || circulating_supply)) || -1,
                    circulating_supply: ['number', 'string'].includes(typeof circulating_supply) ? Number(circulating_supply) : -1,
                    total_volume: ['number', 'string'].includes(typeof total_volume) ? Number(total_volume) : -1,
                    volume_24h: ['number', 'string'].includes(typeof volume_24h) ? Number(volume_24h) : -1,
                  }
                }),
                [['/tokens/high-volume'].includes(pathname) ? 'total_volume' : is_categories ? 'market_cap' : 'market_cap_rank'], [['/tokens/high-volume', '/tokens/categories'].includes(pathname) ? 'desc' : 'asc'],
              )
              data = data.map(d => {
                const { volume_24h } = { ...d }
                return {
                  ...d,
                  market_share: volume_24h > -1 ? volume_24h / _.sumBy(data.filter(_d => _d.volume_24h > 0), 'volume_24h') : -1,
                }
              })
              setData(data)
              if (response.length < PAGE_SIZE) {
                break
              }
            }
          }
        }
      }

      getData()
      const interval = setInterval(() => getData(), 3 * 60 * 1000)
      return () => clearInterval(interval)
    },
    [cryptos_data, pathname, category, page],
  )

  const { coins } = { ...cryptos }
  const is_widget = view === 'widget'

  return (
    <div className="children">
      {data ?
        <div className="space-y-2 sm:space-y-4 mt-4 sm:mt-6 mx-auto">
          {!is_widget && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 space-x-0 sm:space-x-3 px-3">
                <div className="text-lg font-bold">
                  Top {category ? getTitle(category) : is_categories ? 'Cryptocurrency Categories' : 'Cryptocurrency Prices'} by {['/tokens/high-volume'].includes(pathname) ? 'Volume' : 'Market Capitalization'}
                </div>
              </div>
              {is_categories && <Summary data={data} />}
            </>
          )}
          <Datatable
            columns={[
              {
                Header: '#',
                accessor: is_categories ? 'i' : 'market_cap_rank',
                sortType: (a, b) => a.original[is_categories ? 'i' : 'market_cap_rank'] > b.original[is_categories ? 'i' : 'market_cap_rank'] ? 1 : -1,
                Cell: props => {
                  const { value } = { ...props }
                  return (
                    <span className="text-black dark:text-white font-medium">
                      {is_categories ? props.flatRows?.indexOf(props.row) + 1 : value < Number.MAX_SAFE_INTEGER ? value : '-'}
                    </span>
                  )
                },
              },
              {
                Header: is_categories ? 'Category' : 'Token',
                accessor: 'name',
                sortType: (a, b) => a.original.name > b.original.name ? 1 : -1,
                Cell: props => {
                  const { value, row } = { ...props }
                  const { id, symbol, image } = { ...row.original }
                  return (
                    <Link
                      href={`/token${id ? `${is_categories ? 's' : ''}/${id}` : 's'}`}
                      target={is_widget ? '_blank' : '_self'}
                      rel={is_widget ? 'noopener noreferrer' : ''}
                      className="flex flex-col mb-6"
                      style={{ maxWidth: is_categories ? 'unset' : '10rem' }}
                    >
                      <div className="token-column flex items-center space-x-2">
                        {!is_categories && image && (
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
                Header: 'Price',
                accessor: 'current_price',
                sortType: (a, b) => a.original.price_change_percentage_24h_in_currency > b.original.price_change_percentage_24h_in_currency ? 1 : -1,
                Cell: props => {
                  const { value, row } = { ...props }
                  const { low_24h, high_24h } = { ...row.original }
                  const percentage = (value - low_24h) * 100 / (high_24h - low_24h)
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      {value > -1 && (
                        <>
                          <NumberDisplay
                            value={value}
                            format="0,0.00000000"
                            prefix="$"
                            noTooltip={true}
                          />
                          <div className="w-full flex items-center justify-between space-x-2">
                            <NumberDisplay
                              value={low_24h}
                              format="0,0.00000000"
                              prefix="$"
                              noTooltip={true}
                              className="whitespace-nowrap text-2xs font-medium"
                            />
                            <NumberDisplay
                              value={high_24h}
                              format="0,0.00000000"
                              prefix="$"
                              noTooltip={true}
                              className="whitespace-nowrap text-2xs font-medium"
                            />
                          </div>
                          <ProgressBarWithText
                            width={high_24h - low_24h > 0 ? percentage : 0}
                            color="bg-slate-200 dark:bg-slate-600 rounded-lg"
                            text={high_24h - low_24h > 0 && (
                              <MdArrowDropUp
                                size={24}
                                className="text-slate-200 dark:text-slate-600 mt-0.5 ml-auto"
                                style={percentage <= 5 ? { marginLeft: '-.5rem' } : { marginRight: '-.5rem' }}
                              />
                            )}
                            className="h-2 rounded-lg"
                            backgroundClassName="h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                          />
                        </>
                      )}
                    </div>
                  )
                },
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: '24h',
                accessor: 'price_change_percentage_24h_in_currency',
                sortType: (a, b) => a.original.price_change_percentage_24h_in_currency > b.original.price_change_percentage_24h_in_currency ? 1 : -1,
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
                Header: '7d',
                accessor: 'price_change_percentage_7d_in_currency',
                sortType: (a, b) => a.original.price_change_percentage_7d_in_currency > b.original.price_change_percentage_7d_in_currency ? 1 : -1,
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
                Header: '30d',
                accessor: 'price_change_percentage_30d_in_currency',
                sortType: (a, b) => a.original.price_change_percentage_30d_in_currency > b.original.price_change_percentage_30d_in_currency ? 1 : -1,
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
                Header: 'ROI',
                accessor: 'roi.times',
                sortType: (a, b) => a.original.roi?.times > b.original.roi?.times ? 1 : -1,
                Cell: props => {
                  const { value, row } = { ...props }
                  const { roi } = { ...row.original }
                  const { from, currency } = { ...roi }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      {typeof value === 'number' && (
                        <>
                          <NumberDisplay
                            value={value}
                            format="0,0.000000"
                            prefix={value < 0 ? '' : '+'}
                            noTooltip={true}
                            className={`whitespace-nowrap ${value < 0 ? 'text-red-500 dark:text-red-400' : value > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} text-sm font-semibold`}
                          />
                          <span className="whitespace-nowrap text-slate-400 dark:text-slate-500 text-2xs font-medium">
                            {`${from ? 'from' : 'in'} `}
                            <span className="uppercase font-semibold">
                              {from || currency}
                            </span>
                          </span>
                        </>
                      )}
                    </div>
                  )
                },
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: 'Market Cap',
                accessor: 'market_cap',
                sortType: (a, b) => a.original.market_cap > b.original.market_cap ? 1 : -1,
                Cell: props => {
                  const { value } = { ...props }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      {value > -1 && (
                        <>
                          <NumberDisplay
                            value={value}
                            format="0,0"
                            prefix="$"
                            noTooltip={true}
                          />
                          {rates_data && (
                            <NumberDisplay
                              value={value * (rates_data ? rates_data.btc?.value / rates_data.usd?.value : 1)}
                              format="0,0"
                              suffix=" BTC"
                              noTooltip={true}
                              className="whitespace-nowrap text-slate-400 dark:text-slate-500 text-sm font-semibold"
                            />
                          )}
                        </>
                      )}
                    </div>
                  )
                },
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: '24h',
                accessor: 'market_cap_change_24h',
                sortType: (a, b) => a.original.market_cap_change_24h > b.original.market_cap_change_24h ? 1 : -1,
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
                Header: 'Fully Diluted MCap',
                accessor: 'fully_diluted_valuation',
                sortType: (a, b) => a.original.fully_diluted_valuation > b.original.fully_diluted_valuation ? 1 : -1,
                Cell: props => {
                  const { value } = { ...props }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      {value > -1 && (
                        <>
                          <NumberDisplay
                            value={value}
                            format="0,0"
                            prefix="$"
                            noTooltip={true}
                          />
                          {rates_data && (
                            <NumberDisplay
                              value={value * (rates_data ? rates_data.btc?.value / rates_data.usd?.value : 1)}
                              format="0,0"
                              suffix=" BTC"
                              noTooltip={true}
                              className="whitespace-nowrap text-slate-400 dark:text-slate-500 text-sm font-semibold"
                            />
                          )}
                        </>
                      )}
                    </div>
                  )
                },
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: '24h Volume',
                accessor: is_categories ? 'volume_24h' : 'total_volume',
                sortType: (a, b) => a.original[is_categories ? 'volume_24h' : 'total_volume'] > b.original[is_categories ? 'volume_24h' : 'total_volume'] ? 1 : -1,
                Cell: props => {
                  const { value } = { ...props }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      {value > -1 && (
                        <>
                          <NumberDisplay
                            value={value}
                            format="0,0"
                            prefix="$"
                            noTooltip={true}
                          />
                          {rates_data && (
                            <NumberDisplay
                              value={value * (rates_data ? rates_data.btc?.value / rates_data.usd?.value : 1)}
                              format="0,0"
                              suffix=" BTC"
                              noTooltip={true}
                              className="whitespace-nowrap text-slate-400 dark:text-slate-500 text-sm font-semibold"
                            />
                          )}
                        </>
                      )}
                    </div>
                  )
                },
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: 'Market Share',
                accessor: 'market_share',
                sortType: (a, b) => a.original.volume_24h > b.original.volume_24h ? 1 : -1,
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
              {
                Header: 'Circulating Supply',
                accessor: 'circulating_supply',
                sortType: (a, b) => a.original.circulating_supply > b.original.circulating_supply ? 1 : -1,
                Cell: props => {
                  const { value, row } = { ...props }
                  const { max_supply } = { ...row.original }
                  const percentage = max_supply ? value * 100 / max_supply : null
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      {value > -1 && (
                        <>
                          <NumberDisplay
                            value={value}
                            format="0,0"
                            noTooltip={true}
                          />
                          {max_supply > 0 && (
                            <>
                              <ProgressBarWithText
                                width={percentage}
                                color="bg-slate-200 dark:bg-slate-600 rounded-lg"
                                text={
                                  <NumberDisplay
                                    value={percentage}
                                    format="0,0.00"
                                    suffix="%"
                                    noTooltip={true}
                                    className="text-slate-600 dark:text-slate-200 font-medium mx-1"
                                    style={{ fontSize: percentage < 25 ? '.45rem' : '.55rem' }}
                                  />
                                }
                                className={`h-3 flex items-center justify-${percentage < 25 ? 'start' : 'end'}`}
                                backgroundClassName="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
                              />
                              <NumberDisplay
                                value={max_supply}
                                format="0,0"
                                prefix="Max: "
                                noTooltip={true}
                                className="whitespace-nowrap text-2xs font-medium"
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )
                },
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
            ].filter(c => !(is_categories ? ['current_price', 'price_change_percentage_1h_in_currency', 'price_change_percentage_24h_in_currency', 'price_change_percentage_7d_in_currency', 'price_change_percentage_30d_in_currency', 'roi.times', 'fully_diluted_valuation', 'total_volume', 'circulating_supply'] : ['market_cap_change_24h', 'volume_24h', 'market_share'].concat(['/tokens/high-volume'].includes(pathname) ? ['roi.times'] : ['roi.times'])).includes(c.accessor)).filter(c => is_widget ? ['i', 'market_cap_rank', 'name', 'current_price', 'price_change_percentage_24h_in_currency', 'market_cap'].includes(c.accessor) : true)}
            data={_.slice(data, 0, n ? Number(n) : undefined)}
            defaultPageSize={PAGE_SIZE}
            noPagination={_.slice(data, 0, n ? Number(n) : undefined).length <= 10}
            extra={
              !category && (
                <Pagination
                  active={page}
                  items={_.range(Math.ceil((toArray(coins).length || 10000) / PAGE_SIZE))}
                  onClick={p => router.push(`${pathname}?page=${p}`)}
                />
              )
            }
            className={`no-border no-shadow ${!is_widget ? 'striped' : ''}`}
          />
        </div> :
        <div className="loading">
          <Spinner name="Blocks" />
        </div>
      }
    </div>
  )
}