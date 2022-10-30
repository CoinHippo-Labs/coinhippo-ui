import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'

import Summary from './summary'
import Image from '../image'
import Datatable from '../datatable'
import { derivatives as getDerivatives } from '../../lib/api/coingecko'
import { currency_symbol } from '../../lib/object/currency'
import { name, number_format, equals_ignore_case, loader_color } from '../../lib/utils'

const min_open_interest = 1000000

export default () => {
  const { preferences, cryptos } = useSelector(state => ({ preferences: state.preferences, cryptos: state.cryptos }), shallowEqual)
  const { theme } = { ...preferences }
  const { cryptos_data } = { ...cryptos }

  const router = useRouter()
  const { pathname, query } = { ...router }
  const { derivative_type } = { ...query }

  const [data, setData] = useState(null)

  useEffect(() => {
    const getData = async () => {
      if (!pathname.endsWith('/[derivative_type]') || derivative_type) {
        const response = await getDerivatives({ derivative_type: 'unexpired' })
        if (Array.isArray(response)) {
          setData(response.filter(d => (!derivative_type || d.contract_type === derivative_type) && d.open_interest > min_open_interest)
            .map(d => {
              const { price, index, basis, spread, funding_rate, open_interest, volume_24h } = { ...d }
              return {
                ...d,
                price: typeof price === 'string' ? Number(price) : typeof price === 'number' ? price : -1,
                index: typeof index === 'string' ? Number(index) : typeof index === 'number' ? index : -1,
                basis: typeof basis === 'string' ? Number(basis) : typeof basis === 'number' ? basis : Number.MIN_SAFE_INTEGER,
                spread: typeof spread === 'string' ? Number(spread) : typeof spread === 'number' ? spread : -1,
                funding_rate: typeof funding_rate === 'string' ? Number(funding_rate) : typeof funding_rate === 'number' ? funding_rate : Number.MIN_SAFE_INTEGER,
                open_interest: typeof open_interest === 'string' ? Number(open_interest) : typeof open_interest === 'number' ? open_interest : -1,
                volume_24h: typeof volume_24h === 'string' ? Number(volume_24h) : typeof volume_24h === 'number' ? volume_24h : -1,
              }
            })
          )
        }
      }
    }
    getData()
  }, [derivative_type])

  return (
    <div className="space-y-2 my-4 mx-2">
      <div className="flex items-center justify-between sm:justify-start space-x-4">
        <h1 className="text-xl font-bold">
          Top {name(derivative_type || 'perpetuals')} Contract by Open Interest
        </h1>
      </div>
      <div className="space-y-5">
        <Summary data={data} />
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
                accessor: 'market',
                sortType: (a, b) => a.original.market > b.original.market ? 1 : -1,
                Cell: props => {
                  const exchange_data = cryptos_data?.exchanges?.find(e => equals_ignore_case(e?.name, props.value))
                  if (exchange_data?.large) {
                    exchange_data.image = exchange_data.large
                  }
                  return (
                    <Link
                      href={`/exchange${exchange_data?.id ? `/${exchange_data.id}` : 's/derivatives'}`}
                    >
                    <a
                      className="flex flex-col items-start space-y-1 -mt-0.5 mb-2"
                    >
                      <div className="flex items-center space-x-2">
                        {exchange_data?.image && (
                          <Image
                            src={exchange_data.image}
                            alt=""
                            width={24}
                            height={24}
                          />
                        )}
                        <span className="font-semibold">
                          {exchange_data?.name || props.value}
                        </span>
                      </div>
                      <span className="text-slate-400 dark:text-slate-600 font-medium">
                        {name(exchange_data?.exchange_type)}
                      </span>
                    </a>
                    </Link>
                  )
                },
              },
              {
                Header: 'Pairs',
                accessor: 'symbol',
                sortType: (a, b) => a.original.symbol > b.original.symbol ? 1 : -1,
                Cell: props => (
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">
                    {props.value}
                  </div>
                ),
              },
              {
                Header: 'Price',
                accessor: 'price',
                sortType: (a, b) => a.original.price > b.original.price ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <div className="flex items-center font-semibold space-x-1">
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
                accessor: 'price_percentage_change_24h',
                sortType: (a, b) => a.original.price_percentage_change_24h > b.original.price_percentage_change_24h ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <span className={`${props.value < 0 ? 'text-red-600 dark:text-red-400' : props.value > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-gray-400'} font-semibold`}>
                      {number_format(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%
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
                accessor: 'basis',
                sortType: (a, b) => a.original.basis > b.original.basis ? 1 : -1,
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
                accessor: 'spread',
                sortType: (a, b) => a.original.spread > b.original.spread ? 1 : -1,
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
                Header: 'Open Interest 24h',
                accessor: 'open_interest',
                sortType: (a, b) => a.original.open_interest > b.original.open_interest ? 1 : -1,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <div className="flex items-center font-semibold space-x-1">
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
                Header: 'Volume 24h',
                accessor: 'volume_24h',
                sortType: (a, b) => a.original.volume_24h > b.original.volume_24h ? 1 : -1,
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
            ].filter(c => !((derivative_type === 'futures' ? ['funding_rate'] : []).includes(c?.accessor)))}
            data={data}
            noPagination={data.length <= 10}
            defaultPageSize={50}
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
  )
}