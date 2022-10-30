import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'

import Image from '../image'
import Datatable from '../datatable'
import { exchanges } from '../../lib/api/coingecko'
import { currency, currency_symbol, currency_btc } from '../../lib/object/currency'
import { name, number_format, loader_color } from '../../lib/utils'

const per_page = 10

export default ({
  exchange_type,
  title,
  icon,
}) => {
  const { preferences, rates } = useSelector(state => ({ preferences: state.preferences, rates: state.rates }), shallowEqual)
  const { theme } = { ...preferences }
  const { rates_data } = { ...rates }

  const [data, setData] = useState(null)

  useEffect(() => {
    const getData = async () => {
      let data
      for (let i = 0; i < 10; i++) {
        const response = await exchanges({
          per_page: 100,
          page: i + 1,
        })
        if (Array.isArray(response)) {
          data = _.orderBy(
            _.uniqBy(_.concat(data || [], response), 'id')
            .filter(e => !exchange_type || e.exchange_type === exchange_type || (e.exchange_type === 'decentralized' && exchange_type === 'dex'))
            .map(e => {
              const { trade_volume_24h_btc, trust_score, open_interest_btc } = { ...e }
              return {
                ...e,
                trade_volume_24h_btc: typeof trade_volume_24h_btc === 'string' ? Number(trade_volume_24h_btc) : typeof trade_volume_24h_btc === 'number' ? trade_volume_24h_btc : -1,
                trust_score: typeof trust_score === 'string' ? Number(trust_score) : typeof trust_score === 'number' ? trust_score : -1,
                open_interest_btc: typeof open_interest_btc === 'string' ? Number(open_interest_btc) : typeof open_interest_btc === 'number' ? open_interest_btc : -1,
              }
            }),
            [exchange_type ? 'trade_volume_24h_btc' : 'trust_score'], ['desc']
          )
          data = data.map(e => {
            const { trade_volume_24h_btc } = { ...e }
            return {
              ...e,
              market_share: trade_volume_24h_btc > -1 ? trade_volume_24h_btc / _.sumBy(data.filter(_e => _e?.trade_volume_24h_btc > 0), 'trade_volume_24h_btc') : -1,
            }
          })
          if (response.length < 100 || !exchange_type) {
            break
          }
        }
      }
      setData(_.slice(data || [], 0, per_page))
    }
    getData()
    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg space-y-2 p-4">
      <div className="flex items-center justify-between space-x-2 -mt-1">
        <Link
          href={`/exchanges${exchange_type ? `/${exchange_type}` : ''}`}
        >
        <a
          className="uppercase text-slate-600 dark:text-slate-400 text-xs font-bold"
        >
          {
            title ||
            name(exchange_type)
          }
        </a>
        </Link>
        {icon}
      </div>
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
                  className="flex flex-col items-start space-y-1 mb-2"
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
                    <span className="text-xs font-semibold">
                      {props.value}
                    </span>
                  </div>
                </a>
                </Link>
              ),
            },
            {
              Header: 'Volume 24h',
              accessor: 'trade_volume_24h_btc',
              sortType: (a, b) => a.original.trade_volume_24h_btc > b.original.trade_volume_24h_btc ? 1 : -1,
              Cell: props => (
                <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                  <div className="flex items-center uppercase text-xs font-semibold space-x-1">
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
                      Trade
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
          ]}
          data={data}
          noPagination={data.length <= 10}
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
  )
}