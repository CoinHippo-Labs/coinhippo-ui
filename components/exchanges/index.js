import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'

import Summary from './summary'
import Image from '../image'
import Datatable from '../datatable'
import { ProgressBar } from '../progress-bars'
import { exchanges as getExchanges, derivatives_exchanges as getDerivativesExchanges } from '../../lib/api/coingecko'
import { currency, currency_symbol, currency_btc } from '../../lib/object/currency'
import { name, number_format, loader_color } from '../../lib/utils'

const per_page = 100
const low_threshold = 2
const high_threshold = 8

export default () => {
  const { preferences, rates } = useSelector(state => ({ preferences: state.preferences, rates: state.rates }), shallowEqual)
  const { theme } = { ...preferences }
  const { rates_data } = { ...rates }

  const router = useRouter()
  const { pathname, query } = { ...router }
  const { exchange_type, view, n } = { ...query }

  const [data, setData] = useState(null)

  useEffect(() => {
    const getData = async () => {
      if (!pathname.endsWith('/[exchange_type]') || exchange_type) {
        let data
        for (let i = 0; i < 10; i++) {
          const response = await (exchange_type === 'derivatives' ?
            getDerivativesExchanges({
              per_page,
              page: i + 1,
            }) :
            getExchanges({
              per_page,
              page: i + 1,
            })
          )
          if (Array.isArray(response)) {
            data = _.orderBy(
              _.uniqBy(_.concat(data || [], response), 'id')
              .filter(e => !exchange_type || e.exchange_type === exchange_type || (e.exchange_type === 'decentralized' && exchange_type === 'dex') || exchange_type === 'derivatives')
              .map(e => {
                const { trade_volume_24h_btc, trust_score, open_interest_btc } = { ...e }
                return {
                  ...e,
                  trade_volume_24h_btc: typeof trade_volume_24h_btc === 'string' ?
                    Number(trade_volume_24h_btc) :
                    typeof trade_volume_24h_btc === 'number' ?
                      trade_volume_24h_btc : -1,
                  trust_score: typeof trust_score === 'string' ?
                    Number(trust_score) :
                    typeof trust_score === 'number' ?
                      trust_score : -1,
                  open_interest_btc: typeof open_interest_btc === 'string' ?
                    Number(open_interest_btc) :
                    typeof open_interest_btc === 'number' ?
                    open_interest_btc : -1,
                }
              }),
              [exchange_type ? 'trade_volume_24h_btc' : 'trust_score'], ['desc']
            )
            data = data.map(e => {
              const { trade_volume_24h_btc } = { ...e }
              return {
                ...e,
                market_share: trade_volume_24h_btc > -1 ?
                  trade_volume_24h_btc / _.sumBy(data.filter(_e => _e?.trade_volume_24h_btc > 0), 'trade_volume_24h_btc') : -1,
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
  }, [exchange_type])

  const is_widget = ['widget'].includes(view)

  return (
    <div className={`${is_widget ? 'max-w-xl' : 'space-y-2 my-4 mx-2'}`}>
      {!is_widget && (
        <div className="flex items-center justify-between sm:justify-start space-x-4">
          <h1 className="text-xl font-bold">
            Top Exchanges by {exchange_type ? 'Trading Volume' : 'Confidence'}
          </h1>
        </div>
      )}
      <div className="space-y-5">
        {!is_widget && (
          <Summary data={data} />
        )}
        {data ?
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
                accessor: 'name',
                sortType: (a, b) => a.original.name > b.original.name ? 1 : -1,
                Cell: props => (
                  <Link
                    href={`/exchange${props.row.original.id ? `/${props.row.original.id}` : 's'}`}
                  >
                  <a
                    target={is_widget ? '_blank' : '_self'}
                    rel={is_widget ? 'noopener noreferrer' : ''}
                    className="flex flex-col items-start space-y-1 -mt-0.5 mb-2"
                  >
                    <div className="flex items-center space-x-2">
                      {props.row.original.image && (
                        <Image
                          src={props.row.original.image}
                          alt=""
                          width={24}
                          height={24}
                        />
                      )}
                      <span className="font-semibold">
                        {props.value}
                      </span>
                    </div>
                    <span className="text-slate-400 dark:text-slate-600 font-medium">
                      {name(props.row.original.exchange_type)}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {props.row.original.country && (
                        <div className="bg-blue-500 dark:bg-blue-600 rounded-lg text-xs text-white font-semibold py-0.5 px-2">
                          {props.row.original.country}
                        </div>
                      )}
                      {props.row.original.year_established && (
                        <div className="bg-slate-200 dark:bg-slate-600 rounded-lg text-xs font-medium py-0.5 px-2">
                          {props.row.original.year_established}
                        </div>
                      )}
                    </div>
                  </a>
                  </Link>
                ),
              },
              {
                Header: 'Open Interest 24h',
                accessor: 'open_interest_btc',
                sortType: (a, b) => a.original.open_interest_btc > b.original.open_interest_btc ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <div className="flex items-center uppercase font-semibold space-x-1">
                      <span>
                        {rates_data && currency_symbol}
                        {props.value > -1 ? number_format(props.value * (rates_data ? rates_data[currency]?.value / rates_data[currency_btc]?.value : 1), '0,0') : '-'}
                      </span>
                      {!rates_data && (
                        <span>
                          {currency_btc}
                        </span>
                      )}
                    </div>
                    {props.value > -1 && rates_data && (
                      <span className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-bold space-x-1">
                        <span>
                          {number_format(props.value, '0,0')}
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
                Header: 'Volume 24h',
                accessor: 'trade_volume_24h_btc',
                sortType: (a, b) => a.original.trade_volume_24h_btc > b.original.trade_volume_24h_btc ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <div className="flex items-center uppercase font-semibold space-x-1">
                      <span>
                        {rates_data && currency_symbol}
                        {props.value > -1 ? number_format(props.value * (rates_data ? rates_data[currency]?.value / rates_data[currency_btc]?.value : 1), '0,0') : '-'}
                      </span>
                      {!rates_data && (
                        <span>
                          {currency_btc}
                        </span>
                      )}
                    </div>
                    {props.value > -1 && rates_data && (
                      <span className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-bold space-x-1">
                        <span>
                          {number_format(props.value, '0,0')}
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
                sortType: (a, b) => a.original.trade_volume_24h_btc > b.original.trade_volume_24h_btc ? 1 : -1,
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
                Header: 'Perpetual Pairs',
                accessor: 'number_of_perpetual_pairs',
                sortType: (a, b) => a.original.number_of_perpetual_pairs > b.original.number_of_perpetual_pairs ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <span className="font-semibold">
                      {number_format(props.value, '0,0')}
                    </span>
                  </div>
                ),
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: 'Futures Pairs',
                accessor: 'number_of_futures_pairs',
                sortType: (a, b) => a.original.number_of_futures_pairs > b.original.number_of_futures_pairs ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <span className="font-semibold">
                      {number_format(props.value, '0,0')}
                    </span>
                  </div>
                ),
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: 'Confidence',
                accessor: 'trust_score',
                sortType: (a, b) => a.original.trust_score > b.original.trust_score ? 1 : -1,
                Cell: props => {
                  const color = props.value <= low_threshold ?
                    'red-600' :
                    props.value >= high_threshold ?
                      'green-400' :
                      props.value < 5 ?
                        props.value <= (5 - low_threshold) / 2 ?
                          'red-400' : 'yellow-600' :
                        props.value > 5 ?
                          props.value >= 5 + ((high_threshold - 5) / 2) ?
                          'green-400' : 'yellow-400' :
                        'yellow-500'
                  return (
                    <div className={`flex flex-col text-${color} space-y-2.5`}>
                      <span className="font-semibold">
                        {props.value > -1 ? number_format(props.value, '0,0') : '-'}
                      </span>
                      <ProgressBar
                        width={(props.value > -1 ? props.value : 0) * 100 / 10}
                        color={`bg-${color}`}
                        className="h-1.5 rounded-lg"
                      />
                    </div>
                  )
                },
              },
              {
                Header: 'Action',
                accessor: 'url',
                disableSortBy: true,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    {props.value ?
                      <a
                        href={props.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-max bg-blue-500 hover:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 shadow-lg rounded-lg uppercase text-white text-xs font-bold py-1.5 px-2"
                      >
                        Start Trading
                      </a> :
                      <Link
                        href={`/exchange${props.row.original.id ? `/${props.row.original.id}` : 's'}`}
                      >
                      <a
                        className="min-w-max bg-slate-50 hover:bg-slate-100 dark:bg-black dark:hover:bg-slate-900 rounded-lg text-xs font-semibold py-1.5 px-2"
                      >
                        See More
                      </a>
                      </Link>
                    }
                  </div>
                ),
                headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
              },
            ].filter(c => !((exchange_type === 'derivatives' ? ['trust_score'] : ['open_interest_btc', 'number_of_perpetual_pairs', 'number_of_futures_pairs']).includes(c?.accessor)))
              .filter(c => is_widget ? ['i', 'name', 'trade_volume_24h_btc', 'url'].includes(c?.accessor) : true)
            }
            data={_.slice(data, 0, n ? Number(n) : undefined)}
            noPagination={_.slice(data, 0, n ? Number(n) : undefined).length <= 10}
            defaultPageSize={[10, 25, 50, 100].includes(Number(n)) ? Number(n) : 50}
            className={`no-border ${!is_widget ? 'striped' : ''}`}
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