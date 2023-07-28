import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Chip } from '@material-tailwind/react'
import _ from 'lodash'

import Summary from './summary'
import Spinner from '../spinner'
import Image from '../image'
import NumberDisplay from '../number'
import Datatable from '../datatable'
import { ProgressBar } from '../progress-bars'
import { getExchanges, getDerivativesExchanges } from '../../lib/api/coingecko'
import { toArray, getTitle } from '../../lib/utils'

const LOW_THRESHOLD = 2
const HIGH_THRESHOLD = 8
const PAGE_SIZE = 100

export default () => {
  const { rates } = useSelector(state => ({ rates: state.rates }), shallowEqual)
  const { rates_data } = { ...rates }

  const router = useRouter()
  const { pathname, query } = { ...router }
  const { type, view, n } = { ...query }

  const [data, setData] = useState(null)

  useEffect(
    () => {
      const getData = async () => {
        if (!pathname.endsWith('/[type]') || type) {
          let data
          for (let i = 0; i < 10; i++) {
            const response = await (type === 'derivatives' ? getDerivativesExchanges({ per_page: PAGE_SIZE, page: i + 1 }) : getExchanges({ per_page: PAGE_SIZE, page: i + 1 }))
            if (Array.isArray(response)) {
              data = _.orderBy(
                _.uniqBy(toArray(_.concat(data, response)), 'id')
                .filter(d => !type || d.exchange_type === type || (d.exchange_type === 'decentralized' && type === 'dex') || type === 'derivatives')
                .map(d => {
                  const { trade_volume_24h_btc, trust_score, open_interest_btc } = { ...d }
                  return {
                    ...d,
                    trade_volume_24h_btc: ['number', 'string'].includes(typeof trade_volume_24h_btc) ? Number(trade_volume_24h_btc) : -1,
                    trust_score: ['number', 'string'].includes(typeof trust_score) ? Number(trust_score) : -1,
                    open_interest_btc: ['number', 'string'].includes(typeof open_interest_btc) ? Number(open_interest_btc) : -1,
                  }
                }),
                [type ? 'trade_volume_24h_btc' : 'trust_score'], ['desc'],
              )
              data = data.map(d => {
                const { trade_volume_24h_btc } = { ...d }
                return {
                  ...d,
                  market_share: trade_volume_24h_btc > -1 ? trade_volume_24h_btc / _.sumBy(data.filter(_d => _d.trade_volume_24h_btc > 0), 'trade_volume_24h_btc') : -1,
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
    },
    [type],
  )

  const is_widget = view === 'widget'

  return (
    <div className="children">
      {data ?
        <div className="space-y-2 sm:space-y-4 mt-4 sm:mt-6 mx-auto">
          {!is_widget && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 space-x-0 sm:space-x-3 px-3">
                <div className="text-lg font-bold">
                  Top Exchanges by {type ? 'Trading Volume' : 'Confidence'}
                </div>
              </div>
              <Summary data={data} />
            </>
          )}
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
                Header: 'Exchange',
                accessor: 'name',
                sortType: (a, b) => a.original.name > b.original.name ? 1 : -1,
                Cell: props => {
                  const { value, row } = { ...props }
                  const { id, image, exchange_type, country, year_established } = { ...row.original }
                  return (
                    <Link
                      href={`/exchange${id ? `/${id}` : 's'}`}
                      target={is_widget ? '_blank' : '_self'}
                      rel={is_widget ? 'noopener noreferrer' : ''}
                      className="flex flex-col mb-6"
                    >
                      <div className="flex items-center space-x-2">
                        {image && (
                          <Image
                            src={image}
                            width={24}
                            height={24}
                          />
                        )}
                        <span className="font-semibold">
                          {value}
                        </span>
                      </div>
                      <span className="text-slate-400 dark:text-slate-500 font-medium">
                        {getTitle(exchange_type)}
                      </span>
                      {(country || year_established) && (
                        <div className="flex items-center space-x-2">
                          {country && (
                            <Chip
                              color="blue"
                              value={country}
                              className="chip text-xs font-medium py-1 px-2.5"
                            />
                          )}
                          {year_established && (
                            <Chip
                              color="teal"
                              value={year_established}
                              className="chip text-xs font-medium py-1 px-2.5"
                            />
                          )}
                        </div>
                      )}
                    </Link>
                  )
                },
              },
              {
                Header: 'Open Interest 24h',
                accessor: 'open_interest_btc',
                sortType: (a, b) => a.original.open_interest_btc > b.original.open_interest_btc ? 1 : -1,
                Cell: props => {
                  const { value } = { ...props }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      {value > -1 && (
                        <>
                          <NumberDisplay
                            value={value * (rates_data ? rates_data.usd?.value / rates_data.btc?.value : 1)}
                            format="0,0"
                            prefix={rates_data && '$'}
                            suffix={!rates_data ? ' BTC' : ''}
                            noTooltip={true}
                          />
                          {rates_data && (
                            <NumberDisplay
                              value={value}
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
                Header: 'Volume 24h',
                accessor: 'trade_volume_24h_btc',
                sortType: (a, b) => a.original.trade_volume_24h_btc > b.original.trade_volume_24h_btc ? 1 : -1,
                Cell: props => {
                  const { value } = { ...props }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      {value > -1 && (
                        <>
                          <NumberDisplay
                            value={value * (rates_data ? rates_data.usd?.value / rates_data.btc?.value : 1)}
                            format="0,0"
                            prefix={rates_data && '$'}
                            suffix={!rates_data ? ' BTC' : ''}
                            noTooltip={true}
                          />
                          {rates_data && (
                            <NumberDisplay
                              value={value}
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
                sortType: (a, b) => a.original.trade_volume_24h_btc > b.original.trade_volume_24h_btc ? 1 : -1,
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
                Header: 'Perpetual Pairs',
                accessor: 'number_of_perpetual_pairs',
                sortType: (a, b) => a.original.number_of_perpetual_pairs > b.original.number_of_perpetual_pairs ? 1 : -1,
                Cell: props => {
                  const { value } = { ...props }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      <NumberDisplay
                        value={value}
                        format="0,0"
                      />
                    </div>
                  )
                },
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: 'Futures Pairs',
                accessor: 'number_of_futures_pairs',
                sortType: (a, b) => a.original.number_of_futures_pairs > b.original.number_of_futures_pairs ? 1 : -1,
                Cell: props => {
                  const { value } = { ...props }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      <NumberDisplay
                        value={value}
                        format="0,0"
                      />
                    </div>
                  )
                },
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: 'Confidence',
                accessor: 'trust_score',
                sortType: (a, b) => a.original.trust_score > b.original.trust_score ? 1 : -1,
                Cell: props => {
                  const { value } = { ...props }
                  const color = value <= LOW_THRESHOLD ? 'red-500' : value >= HIGH_THRESHOLD ? 'green-400' : value < 5 ? value <= (5 - LOW_THRESHOLD) / 2 ? 'red-400' : 'yellow-600' : value > 5 ? value >= 5 + ((HIGH_THRESHOLD - 5) / 2) ? 'green-400' : 'yellow-400' : 'yellow-500'
                  return (
                    <div className="flex flex-col space-y-2">
                      {value > -1 && (
                        <>
                          <NumberDisplay
                            value={value}
                            format="0,0"
                            className={`whitespace-nowrap text-${color} text-sm font-semibold`}
                          />
                          <ProgressBar
                            width={value * 100 / 10}
                            color={`bg-${color}`}
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
                Header: 'Action',
                accessor: 'url',
                disableSortBy: true,
                Cell: props => {
                  const { value, row } = { ...props }
                  const { id } = { ...row.original }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                      {value ?
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-w-max bg-blue-400 dark:bg-blue-500 shadow-lg rounded-lg uppercase text-white text-xs font-bold py-1.5 px-2"
                        >
                          Start Trading
                        </a> :
                        <Link
                          href={`/exchange${id ? `/${id}` : 's'}`}
                          className="min-w-max bg-slate-50 dark:bg-black rounded-lg text-xs font-semibold py-1.5 px-2"
                        >
                          See More
                        </Link>
                      }
                    </div>
                  )
                },
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
            ].filter(c => !(type === 'derivatives' ? ['trust_score'] : ['open_interest_btc', 'number_of_perpetual_pairs', 'number_of_futures_pairs']).includes(c.accessor)).filter(c => is_widget ? ['i', 'name', 'trade_volume_24h_btc', 'url'].includes(c.accessor) : true)}
            data={_.slice(data, 0, n ? Number(n) : undefined)}
            defaultPageSize={[10, 25, 50, 100].includes(Number(n)) ? Number(n) : 50}
            noPagination={_.slice(data, 0, n ? Number(n) : undefined).length <= 10}
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