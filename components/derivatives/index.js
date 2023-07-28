import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import Summary from './summary'
import Spinner from '../spinner'
import Image from '../image'
import NumberDisplay from '../number'
import Datatable from '../datatable'
import { getDerivatives } from '../../lib/api/coingecko'
import { toArray, getTitle, equalsIgnoreCase } from '../../lib/utils'

const MIN_OPEN_INTEREST = 1000000
const PAGE_SIZE = 50

export default () => {
  const { cryptos } = useSelector(state => ({ cryptos: state.cryptos }), shallowEqual)
  const { cryptos_data } = { ...cryptos }

  const router = useRouter()
  const { pathname, query } = { ...router }
  const { type } = { ...query }

  const [data, setData] = useState(null)

  useEffect(
    () => {
      const getData = async () => {
        if (!pathname.endsWith('/[type]') || type) {
          const response = await getDerivatives({ derivative_type: 'unexpired' })
          setData(
            toArray(response).filter(d => (!type || d.contract_type === type) && d.open_interest > MIN_OPEN_INTEREST).map(d => {
              const { price, index, basis, spread, funding_rate, open_interest, volume_24h } = { ...d }
              return {
                ...d,
                price: ['number', 'string'].includes(typeof price) ? Number(price) : -1,
                index: ['number', 'string'].includes(typeof index) ? Number(index) : -1,
                basis: ['number', 'string'].includes(typeof basis) ? Number(basis) : Number.MIN_SAFE_INTEGER,
                spread: ['number', 'string'].includes(typeof spread) ? Number(spread) : -1,
                funding_rate: ['number', 'string'].includes(typeof funding_rate) ? Number(funding_rate) : Number.MIN_SAFE_INTEGER,
                open_interest: ['number', 'string'].includes(typeof open_interest) ? Number(open_interest) : -1,
                volume_24h: ['number', 'string'].includes(typeof volume_24h) ? Number(volume_24h) : -1,
              }
            })
          )
        }
      }
      getData()
    },
    [type],
  )

  return (
    <div className="children">
      {data ?
        <div className="space-y-2 sm:space-y-4 mt-4 sm:mt-6 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 space-x-0 sm:space-x-3 px-3">
            <div className="text-lg font-bold">
              Top {getTitle(type || 'perpetuals')} Contract by Open Interest
            </div>
          </div>
          <Summary data={data} />
          <div className="px-3">
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
                  accessor: 'market',
                  sortType: (a, b) => a.original.market > b.original.market ? 1 : -1,
                  Cell: props => {
                    const { value } = { ...props }
                    const { exchanges } = { ...cryptos_data }
                    const exchange_data = toArray(exchanges).find(d => equalsIgnoreCase(d.name, value))
                    const { id, name, large, exchange_type } = { ...exchange_data }
                    return (
                      <Link
                        href={`/exchange${id ? `/${id}` : 's/derivatives'}`}
                        className="flex flex-col mb-6"
                      >
                        <div className="flex items-center space-x-2">
                          {large && (
                            <Image
                              src={large}
                              width={24}
                              height={24}
                            />
                          )}
                          <span className="font-semibold">
                            {name || value}
                          </span>
                        </div>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">
                          {getTitle(exchange_type)}
                        </span>
                      </Link>
                    )
                  },
                },
                {
                  Header: 'Pairs',
                  accessor: 'symbol',
                  sortType: (a, b) => a.original.symbol > b.original.symbol ? 1 : -1,
                  Cell: props => (
                    <div className="text-black dark:text-white font-semibold">
                      {props.value}
                    </div>
                  ),
                },
                {
                  Header: 'Price',
                  accessor: 'price',
                  sortType: (a, b) => a.original.price > b.original.price ? 1 : -1,
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
                  accessor: 'price_percentage_change_24h',
                  sortType: (a, b) => a.original.price_percentage_change_24h > b.original.price_percentage_change_24h ? 1 : -1,
                  Cell: props => {
                    const { value } = { ...props }
                    return (
                      <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                        <NumberDisplay
                          value={value}
                          format="0,0.00"
                          maxDecimals={2}
                          prefix={value < 0 ? '' : '+'}
                          suffix="%"
                          noTooltip={true}
                          className={`whitespace-nowrap ${value < 0 ? 'text-red-500 dark:text-red-400' : value > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} text-sm font-medium`}
                        />
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
                  accessor: 'basis',
                  sortType: (a, b) => a.original.basis > b.original.basis ? 1 : -1,
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
                  accessor: 'spread',
                  sortType: (a, b) => a.original.spread > b.original.spread ? 1 : -1,
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
                  Header: 'Open Interest 24h',
                  accessor: 'open_interest',
                  sortType: (a, b) => a.original.open_interest > b.original.open_interest ? 1 : -1,
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
                  accessor: 'volume_24h',
                  sortType: (a, b) => a.original.volume_24h > b.original.volume_24h ? 1 : -1,
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
              ].filter(c => !(type === 'futures' ? ['funding_rate'] : []).includes(c.accessor))}
              data={data}
              defaultPageSize={PAGE_SIZE}
              noPagination={data.length <= 10}
              className="no-border no-shadow striped"
            />
          </div>
        </div> :
        <div className="loading">
          <Spinner name="Blocks" />
        </div>
      }
    </div>
  )
}