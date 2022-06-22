import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Datatable from '../datatable'
import Image from '../image'
import _ from 'lodash'
import { exchanges } from '../../lib/api/coingecko'
import { currency, currency_btc } from '../../lib/object/currency'
import { getName, number_format } from '../../lib/utils'

const per_page = 10

export default function TopExchanges({ exchange_type, title, icon, noBorder }) {
  const { rates } = useSelector(state => ({ rates: rates }), shallowEqual)
  const { rates_data } = { ...rates }

  const [exchangesData, setExchangesData] = useState(null)

  useEffect(() => {
    const getExchanges = async () => {
      let data

      for (let i = 0; i < 10; i++) {
        const response = await exchanges({ per_page: 100, page: i + 1 })

        if (Array.isArray(response)) {
          data = (
            _.orderBy(
              _.uniqBy(_.concat(data || [], response), 'id')
              .filter(exchangeData => !exchange_type || exchangeData.exchange_type === exchange_type || (exchangeData.exchange_type === 'decentralized' && exchange_type === 'dex'))
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
          }

          if (response.length < 100 || !exchange_type) {
            break
          }
        }
      }
      setExchangesData({ data: _.slice(data, 0, per_page), exchange_type })
    }

    getExchanges()

    const interval = setInterval(() => getExchanges(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      title={<span className="h-8 uppercase flex items-center">
        <Link href={`/exchanges${exchange_type ? `/${exchange_type}` : ''}`}>
          <a className="font-semibold">{title || getName(exchange_type)}</a>
        </Link>
        {icon && (
          <div className="ml-auto">
            {icon}
          </div>
        )}
      </span>}
      description={<div className="mt-3.5">
        <Datatable
          columns={[
            {
              Header: '#',
              accessor: 'i',
              sortType: 'number',
              Cell: props => (
                <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                  {!props.row.original.skeleton ?
                    number_format(props.value + 1, '0,0')
                    :
                    <div className="skeleton w-4 h-3 rounded" />
                  }
                </div>
              ),
              headerClassName: 'justify-center',
              className: 'nopadding-right-column'
            },
            {
              Header: 'Exchange',
              accessor: 'name',
              Cell: props => (
                !props.row.original.skeleton ?
                  <Link href={`/exchange${props.row.original.id ? `/${props.row.original.id}` : 's'}`}>
                    <a className="flex flex-col whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-semibold" style={{ maxWidth: '5rem' }}>
                      <div className="coin-column flex items-center space-x-2" style={{ fontSize: '.65rem' }}>
                        <Image
                          useImg={exchangesData.data.length > per_page}
                          src={props.row.original.image}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <span className={`${props.value && props.value.length > 15 ? '' : 'whitespace-pre'}`}>{props.value}</span>
                      </div>
                    </a>
                  </Link>
                  :
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <div className="skeleton w-6 h-6 rounded mr-2" />
                      <div className="skeleton w-16 h-4 rounded" />
                    </div>
                  </div>
              ),
              className: 'nopadding-right-column'
            },
            {
              Header: '24h Volume',
              accessor: 'trade_volume_24h_btc',
              sortType: (rowA, rowB) => rowA.original.trade_volume_24h_btc > rowB.original.trade_volume_24h_btc ? 1 : -1,
              Cell: props => (
                <div className="flex flex-col font-semibold text-right" style={{ fontSize: '.65rem' }}>
                  {!props.row.original.skeleton ?
                    <>
                      {props.value > -1 ?
                        <span className="space-x-1">
                          {(rates_data ? currency : currencyBTC).symbol}
                          <span>{number_format(props.value * (rates_data ? rates_data[currency.id].value / rates_data[currencyBTC.id].value : 1), `0,0${Math.abs(props.value * (rates_data ? rates_data[currency.id].value / rates_data[currencyBTC.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                          {!((rates_data ? currency : currencyBTC).symbol) && (<span className="uppercase">{(rates_data ? currency : currencyBTC).id}</span>)}
                        </span>
                        :
                        '-'
                      }
                      {rates_data && currency.id !== currencyBTC.id && (
                        <span className="text-gray-400 font-medium space-x-1">
                          {props.value > -1 ?
                            <>
                              <span>{number_format(props.value, `0,0${Math.abs(props.value) < 1 ? '.000' : ''}`)}</span>
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
                      <div className="skeleton w-20 h-4 rounded ml-auto" />
                      <div className="skeleton w-12 h-3.5 rounded mt-1.5 ml-auto" />
                    </>
                  }
                </div>
              ),
              headerClassName: 'justify-end text-right',
            },
            {
              Header: 'Action',
              accessor: 'url',
              disableSortBy: true,
              Cell: props => (
                <div className="flex items-center justify-end">
                  {!props.row.original.skeleton ?
                    props.value ?
                      <a href={props.value} target="_blank" rel="noopener noreferrer" className="btn btn-raised min-w-max btn-rounded bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-xs py-1.5 px-2">
                        Trade
                      </a>
                      :
                      <Link href={`/exchange${props.row.original.id ? `/${props.row.original.id}` : 's'}`}>
                        <a className="btn btn-raised min-w-max btn-rounded bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-gray-100 text-xs py-1.5 px-2">
                          See More
                        </a>
                      </Link>
                    :
                    <div className="skeleton w-12 h-6 rounded" />
                  }
                </div>
              ),
              headerClassName: 'justify-end text-right',
            },
          ]}
          data={exchangesData && exchange_type === exchangesData.exchange_type ? exchangesData.data.map((exchangeData, i) => { return { ...exchangeData, i } }) : [...Array(10).keys()].map(i => { return { i, skeleton: true } })}
          defaultPageSize={10}
          pagination={!(exchangesData && exchangesData.data.length > 10) ? <></> : null}
          className="inline-table"
        />
      </div>}
      className={`${noBorder ? 'border-0' : ''}`}
    />
  )
}