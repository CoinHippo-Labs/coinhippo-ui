import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Summary from './summary'
import Datatable from '../../components/datatable'
import Image from '../../components/image'
import { ProgressBar } from '../../components/progress-bars'
import _ from 'lodash'
import { exchanges, derivativesExchanges } from '../../lib/api/coingecko'
import { navigations } from '../../lib/menus'
import { currency, currency_btc } from '../../lib/object/currency'
import { getName, numberFormat } from '../../lib/utils'

const per_page = 100
const low_threshold = 2
const high_threshold = 8

export default ({ navigationData, navigationItemData }) => {
  const { rates } = useSelector(state => ({ rates: state.rates }), shallowEqual)
  const { rates_data } = { ...rates }

  const router = useRouter()
  const { query, pathname, asPath } = { ...router }
  const { exchange_type, view, n } = { ...query }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  const [exchangesData, setExchangesData] = useState(null)

  useEffect(() => {
    const getExchanges = async () => {
      let data

      for (let i = 0; i < 10; i++) {
        const response = await (exchange_type === 'derivatives' ? derivativesExchanges({ per_page, page: i + 1 }) : exchanges({ per_page, page: i + 1 }))

        if (Array.isArray(response)) {
          data = (
            _.orderBy(
              _.uniqBy(_.concat(data || [], response), 'id')
              .filter(exchangeData => !exchange_type || exchangeData.exchange_type === exchange_type || (exchangeData.exchange_type === 'decentralized' && exchange_type === 'dex') || exchange_type === 'derivatives')
              .map(exchangeData => {
                return {
                  ...exchangeData,
                  trade_volume_24h_btc: typeof exchangeData.trade_volume_24h_btc === 'string' ? Number(exchangeData.trade_volume_24h_btc) : typeof exchangeData.trade_volume_24h_btc === 'number' ? exchangeData.trade_volume_24h_btc : -1,
                  trust_score: typeof exchangeData.trust_score === 'string' ? Number(exchangeData.trust_score) : typeof exchangeData.trust_score === 'number' ? exchangeData.trust_score : -1,
                  open_interest_btc: typeof exchangeData.open_interest_btc === 'string' ? Number(exchangeData.open_interest_btc) : typeof exchangeData.open_interest_btc === 'number' ? exchangeData.open_interest_btc : -1,
                }
              }),
              [exchange_type ? 'trade_volume_24h_btc' : 'trust_score'], ['desc']
            )
          )

          if (data) {
            data = data.map(exchangeData => {
              return { ...exchangeData, market_share: exchangeData.trade_volume_24h_btc > -1 ? exchangeData.trade_volume_24h_btc / _.sumBy(data.filter(_exchangeData => _exchangeData.trade_volume_24h_btc > 0), 'trade_volume_24h_btc') : -1 }
            })
            setExchangesData({ data, exchange_type })
          }

          if (response.length < per_page) {
            break
          }
        }
      }
    }

    if (!pathname.endsWith('/[exchange_type]') || (exchange_type && navigationData.items.findIndex(item => item.url === _asPath) > -1)) {
      getExchanges()
    }
  }, [exchange_type])

  if (!navigationData) {
    navigations.forEach(nav => {
      if (nav.url === '/exchanges') navigationData = nav
      else if (nav.items) {
        nav.items.forEach(nav_1 => {
          if (nav_1.url === '/exchanges') navigationData = nav_1
        })
      }
    })
  }

  if (typeof window !== 'undefined' && navigationData && navigationData.items && navigationData.items[0] &&
    pathname.endsWith('/[exchange_type]') && exchange_type && navigationData.items.findIndex(item => item.url === _asPath) < 0) {
    router.push(navigationData.items[0].url)
  }

  const isWidget = ['widget'].includes(view)

  return (
    <div className={`${isWidget ? 'max-w-xl' : ''} mx-1`}>
      {!isWidget && (
        <Summary exchangesData={exchangesData} />
      )}
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
            accessor: 'name',
            Cell: props => (
              !props.row.original.skeleton ?
                <Link href={`/exchange${props.row.original.id ? `/${props.row.original.id}` : 's'}`}>
                  <a target={isWidget ? '_blank' : '_self'} rel={isWidget ? 'noopener noreferrer' : ''} className="flex flex-col font-semibold">
                    <div className="flex items-center space-x-2">
                      <Image
                        useImg={exchangesData.data.length > per_page}
                        src={props.row.original.image}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded"
                      />
                      <span>{props.value}</span>
                    </div>
                    <span className="text-gray-400 text-xs font-normal">
                      {getName(props.row.original.exchange_type)}
                    </span>
                    <span className="mt-1">
                      {props.row.original.country && (
                        <div size="sm" rounded color="bg-blue-500 text-gray-100 dark:bg-blue-700 mr-1.5">{props.row.original.country}</div>
                      )}
                      {props.row.original.year_established && (
                        <div size="sm" rounded color="bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200">{props.row.original.year_established}</div>
                      )}
                    </span>
                  </a>
                </Link>
                :
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="skeleton w-6 h-6 rounded mr-2" />
                    <div className="skeleton w-24 h-4 rounded" />
                  </div>
                  <div className="skeleton w-20 h-3 rounded mt-1" />
                  <span className="flex items-center mt-2">
                    <div className="skeleton w-24 h-3.5 rounded mr-1.5" />
                    <div className="skeleton w-10 h-3.5 rounded" />
                  </span>
                </div>
            ),
          },
          {
            Header: '24h Open Interest',
            accessor: 'open_interest_btc',
            sortType: (rowA, rowB) => rowA.original.open_interest_btc > rowB.original.open_interest_btc ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-right mr-2 lg:mr-4 xl:mr-8">
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyBTC).symbol}
                        <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyBTC.id].value : 1), `0,0${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyBTC.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                        {!((exchange_rates_data ? currency : currencyBTC).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyBTC).id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {exchange_rates_data && currency.id !== currencyBTC.id && (
                      <span className="text-gray-400 text-xs font-medium space-x-1">
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value, `0,0${Math.abs(props.value) < 1 ? '.000' : ''}`)}</span>
                            <span className="uppercase">{currencyBTC.id}</span>
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
            headerClassName: 'justify-end text-right mr-2 lg:mr-4 xl:mr-8',
          },
          {
            Header: '24h Volume',
            accessor: 'trade_volume_24h_btc',
            sortType: (rowA, rowB) => rowA.original.trade_volume_24h_btc > rowB.original.trade_volume_24h_btc ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-right mr-2 lg:mr-4 xl:mr-8">
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {(exchange_rates_data ? currency : currencyBTC).symbol}
                        <span>{numberFormat(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyBTC.id].value : 1), `0,0${Math.abs(props.value * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyBTC.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                        {!((exchange_rates_data ? currency : currencyBTC).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyBTC).id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {exchange_rates_data && currency.id !== currencyBTC.id && (
                      <span className="text-gray-400 text-xs font-medium space-x-1">
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value, `0,0${Math.abs(props.value) < 1 ? '.000' : ''}`)}</span>
                            <span className="uppercase">{currencyBTC.id}</span>
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
            headerClassName: 'justify-end text-right mr-2 lg:mr-4 xl:mr-8',
          },
          {
            Header: 'Market Share',
            accessor: 'market_share',
            sortType: (rowA, rowB) => rowA.original.trade_volume_24h_btc > rowB.original.trade_volume_24h_btc ? 1 : -1,
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
                    <div className={`skeleton w-${Math.floor((10 - props.row.original.i) / 3)}/12 h-1 rounded mt-1.5`} />
                  </>
                }
              </div>
            ),
          },
          {
            Header: 'Perpetual Pairs',
            accessor: 'number_of_perpetual_pairs',
            sortType: (rowA, rowB) => rowA.original.number_of_perpetual_pairs > rowB.original.number_of_perpetual_pairs ? 1 : -1,
            Cell: props => (
              <div className="text-gray-700 dark:text-gray-300 font-medium text-right mr-2 lg:mr-4 xl:mr-8">
                {!props.row.original.skeleton ?
                  numberFormat(props.value, '0,0')
                  :
                  <div className="skeleton w-4 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2 lg:mr-4 xl:mr-8',
          },
          {
            Header: 'Futures Pairs',
            accessor: 'number_of_futures_pairs',
            sortType: (rowA, rowB) => rowA.original.number_of_futures_pairs > rowB.original.number_of_futures_pairs ? 1 : -1,
            Cell: props => (
              <div className="text-gray-700 dark:text-gray-300 font-medium text-right mr-2 lg:mr-4 xl:mr-8">
                {!props.row.original.skeleton ?
                  numberFormat(props.value, '0,0')
                  :
                  <div className="skeleton w-4 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2 lg:mr-4 xl:mr-8',
          },
          {
            Header: 'Confidence',
            accessor: 'trust_score',
            sortType: (rowA, rowB) => rowA.original.trust_score > rowB.original.trust_score ? 1 : -1,
            Cell: props => {
              const color = props.value <= low_threshold ? 'red-600' :
                props.value >= high_threshold ? 'green-500' :
                props.value < 5 ?
                  props.value <= (5 - low_threshold) / 2 ? 'red-500' : 'yellow-600' :
                  props.value > 5 ? props.value >= 5 + ((high_threshold - 5) / 2) ? 'green-400' : 'yellow-400' :
                'yellow-500'

              return (
                <div className={`flex flex-col text-${color} font-medium`}>
                  {!props.row.original.skeleton ?
                    <>
                      <span>{props.value > -1 ? numberFormat(props.value, '0,0') : '-'}</span>
                      <ProgressBar width={props.value > -1 ? props.value * 100 / 10 : 0} color={`bg-${color}`} className="h-1" />
                    </>
                    :
                    <>
                      <div className="skeleton w-4 h-3 rounded" />
                      <div className={`skeleton w-${Math.floor(12 - (props.row.original.i / 10))}/12 h-1 rounded mt-1.5`} />
                    </>
                  }
                </div>
              )
            },
          },
          {
            Header: 'Action',
            accessor: 'url',
            disableSortBy: true,
            Cell: props => (
              <div className="flex items-center justify-end mr-2 lg:mr-4 xl:mr-8">
                {!props.row.original.skeleton ?
                  props.value ?
                    <a href={props.value} target="_blank" rel="noopener noreferrer" className="btn btn-raised min-w-max btn-rounded bg-indigo-600 hover:bg-indigo-700 text-white hover:text-gray-50 text-xs my-1 p-2">
                      Start Trading
                    </a>
                    :
                    <Link href={`/exchange${props.row.original.id ? `/${props.row.original.id}` : 's'}`}>
                      <a className="btn btn-raised min-w-max btn-rounded bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-gray-100 text-xs my-1 p-2">
                        See More
                      </a>
                    </Link>
                  :
                  <div className="skeleton w-28 h-8 rounded" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2 lg:mr-4 xl:mr-8',
          },
        ].filter(column => !((exchange_type === 'derivatives' ? ['trust_score'] : ['open_interest_btc', 'number_of_perpetual_pairs', 'number_of_futures_pairs']).includes(column.accessor)))
        .filter(column => isWidget ? ['i', 'name', 'trade_volume_24h_btc', 'url'].includes(column.accessor) : true)}
        data={exchangesData && exchange_type === exchangesData.exchange_type ? exchangesData.data.map((exchangeData, i) => { return { ...exchangeData, i } }) : [...Array(10).keys()].map(i => { return { i, skeleton: true } })}
        defaultPageSize={[10, 25, 50, 100].includes(Number(n)) ? Number(n) : pathname.endsWith('/[exchange_type]') ? 50 : 100}
        className="striped"
      />
    </div>
  )
}