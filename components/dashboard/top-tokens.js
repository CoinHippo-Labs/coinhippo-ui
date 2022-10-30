import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'

import Image from '../image'
import Datatable from '../datatable'
import { tokens_markets } from '../../lib/api/coingecko'
import { currency, currency_symbol } from '../../lib/object/currency'
import { name, number_format, loader_color } from '../../lib/utils'

const per_page = 10

export default ({
  category,
  title,
  icon,
}) => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const [data, setData] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await tokens_markets({
        vs_currency: currency,
        category,
        order: 'market_cap_desc',
        per_page,
        page: 1,
        price_change_percentage: '24h,7d,30d',
      })
      if (Array.isArray(response)) {
        setData(_.slice(_.orderBy(_.uniqBy(response, 'id'), ['market_cap_rank'], ['asc']).map(d => {          
          const { market_cap_rank, current_price, price_change_percentage_24h_in_currency, price_change_percentage_7d_in_currency, price_change_percentage_30d_in_currency, roi, atl, market_cap, fully_diluted_valuation, total_volume, circulating_supply, total_supply, max_supply } = { ...d }
          return {
            ...d,
            market_cap_rank: typeof market_cap_rank === 'string' ? Number(market_cap_rank) : typeof market_cap_rank === 'number' ? market_cap_rank : Number.MAX_SAFE_INTEGER,
            current_price: typeof current_price === 'string' ? Number(current_price) : typeof current_price === 'number' ? current_price : -1,
            price_change_percentage_24h_in_currency: typeof price_change_percentage_24h_in_currency === 'string' ? Number(price_change_percentage_24h_in_currency) : typeof price_change_percentage_24h_in_currency === 'number' ? price_change_percentage_24h_in_currency : Number.MIN_SAFE_INTEGER,
            price_change_percentage_7d_in_currency: typeof price_change_percentage_7d_in_currency === 'string' ? Number(price_change_percentage_7d_in_currency) : typeof price_change_percentage_7d_in_currency === 'number' ? price_change_percentage_7d_in_currency : Number.MIN_SAFE_INTEGER,
            price_change_percentage_30d_in_currency: typeof price_change_percentage_30d_in_currency === 'string' ? Number(price_change_percentage_30d_in_currency) : typeof price_change_percentage_30d_in_currency === 'number' ? price_change_percentage_30d_in_currency : Number.MIN_SAFE_INTEGER,
            roi: {
              ...roi,
              times: roi ? roi.times : atl > 0 ? (current_price - atl) / atl : null,
              currency: roi?.currency ? roi.currency : currency,
              percentage: roi ? roi.percentage : atl > 0 ? (current_price - atl) * 100 / atl : null,
              from: !roi ? 'atl' : null,
            },
            market_cap: typeof market_cap === 'string' ? Number(market_cap) : typeof market_cap === 'number' ? market_cap : -1,
            fully_diluted_valuation: typeof fully_diluted_valuation === 'string' ? Number(fully_diluted_valuation) : typeof fully_diluted_valuation === 'number' ? fully_diluted_valuation : (current_price * (max_supply || total_supply || circulating_supply)) || -1,
            circulating_supply: typeof circulating_supply === 'string' ? Number(circulating_supply) : typeof circulating_supply === 'number' ? circulating_supply : -1,
            total_volume: typeof total_volume === 'string' ? Number(total_volume) : typeof total_volume === 'number' ? total_volume : -1,
          }
        }), 0, per_page))
      }
    }
    getData()
    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [category])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg space-y-2 p-4">
      <div className="flex items-center justify-between space-x-2 -mt-1">
        <Link
          href={`/tokens${category ? `/${category}` : ''}`}
        >
        <a
          className="uppercase text-slate-600 dark:text-slate-400 text-xs font-bold"
        >
          {
            title ||
            name(category)
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
              accessor: 'market_cap_rank',
              sortType: (a, b) => a.original.market_cap_rank > b.original.market_cap_rank ? 1 : -1,
              Cell: props => (
                <span className="font-mono font-semibold">
                  {props.value < Number.MAX_SAFE_INTEGER ?
                    number_format(props.value, '0,0') : '-'
                  }
                </span>
              ),
            },
            {
              Header: 'Token',
              accessor: 'name',
              sortType: (a, b) => a.original.name > b.original.name ? 1 : -1,
              Cell: props => (
                <Link
                  href={`/token${props.row.original.id ? `/${props.row.original.id}` : 's'}`}
                >
                <a
                  className="flex flex-col items-start space-y-1 mb-2"
                >
                  <div className="token-column flex items-center space-x-1.5">
                    {props.row.original.image && (
                      <Image
                        src={props.row.original.image}
                        alt=""
                        width={24}
                        height={24}
                      />
                    )}
                    <span className="flex items-center space-x-1">
                      <span className="whitespace-pre-wrap text-blue-600 dark:text-blue-400 text-xs font-bold">
                        {props.value}
                      </span>
                      {props.row.original.symbol && (
                        <span className={`${props.row.original.symbol.length > 6 ? 'break-all' : ''} uppercase text-slate-400 dark:text-slate-500 text-2xs font-semibold`}>
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
                  <div className="flex items-center uppercase text-xs font-semibold space-x-1">
                    <span>
                      {currency_symbol}
                      {props.value > -1 ? number_format(props.value, '0,0.00000000') : '-'}
                    </span>
                  </div>
                  <div className={`${props.row.original.price_change_percentage_24h_in_currency < 0 ? 'text-red-600 dark:text-red-400' : props.row.original.price_change_percentage_24h_in_currency > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} text-xs font-semibold`}>
                    {props.row.original.price_change_percentage_24h_in_currency > Number.MIN_SAFE_INTEGER ?
                      `${number_format(props.row.original.price_change_percentage_24h_in_currency, `+0,0.000${Math.abs(props.row.original.price_change_percentage_24h_in_currency) < 0.001 ? '000' : ''}`)}%` : '-'
                    }
                  </div>
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
                  <div className="flex items-center uppercase text-xs font-bold space-x-1">
                    <span>
                      {currency_symbol}
                      {props.value > -1 ? number_format(props.value, '0,0') : '-'}
                    </span>
                  </div>
                </div>
              ),
              headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
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