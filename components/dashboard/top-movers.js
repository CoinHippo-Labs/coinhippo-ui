import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { IoTrendingUp, IoTrendingDown } from 'react-icons/io5'

import Image from '../image'
import { tokens_markets } from '../../lib/api/coingecko'
import { currency, currency_symbol } from '../../lib/object/currency'
import { number_format, loader_color } from '../../lib/utils'

const directions = [
  { direction: 'desc', title: 'Gainers' },
  { direction: 'asc', title: 'Losers' },
]

export default () => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }
  let { n } = { ...query }
  n = Number(n) > 2 ? Number(n) > 25 ? 25 : Number(n) : 5

  const [data, setData] = useState(null)
  const [direction, setDirection] = useState('desc')

  useEffect(() => {
    const getData = async () => {
      const response = await tokens_markets({
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: 250,
        page: 1,
        price_change_percentage: '24h',
      })
      if (Array.isArray(response)) {
        setData(response)
      }
    }
    getData()
    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const is_widget = ['top-movers'].includes(widget)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg space-y-2 p-4">
      <div className="flex items-center justify-between space-x-2 -mt-1">
        <div className="flex items-center space-x-2">
          <span className="uppercase text-slate-600 dark:text-slate-400 text-xs font-bold">
            Top
          </span>
          <div className="flex items-center space-x-0.5">
            {directions.map((d, i) => (
              <button
                key={i}
                onClick={() => setDirection(d?.direction)}
                className={`btn btn-raised btn-sm btn-rounded min-w-max ${d.direction === direction ? 'bg-slate-100 dark:bg-slate-800' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200'} text-xs font-semibold ${i < directions.length - 1 ? 'mr-1.5' : 'mr-0'}`}
              >
                {d.title}
              </button>
            ))}
          </div>
        </div>
        {direction === 'desc' ?
          <IoTrendingUp size={20} className="text-slate-500 dark:text-slate-400" /> :
          <IoTrendingDown size={20} className="text-slate-500 dark:text-slate-400" />
        }
      </div>
      {data ?
        _.slice(_.orderBy(data, ['price_change_percentage_24h_in_currency'], [direction]), 0, n).map((d, i) => {
          return (
            <div
              key={i}
              className={`${i < 3 ? `bg-${direction === 'desc' ? 'green' : 'red'}-${i < 1 ? 300 : i < 2 ? 200 : 100} dark:bg-${direction === 'desc' ? 'green' : 'red'}-${i < 1 ? 700 : i < 2 ? 800 : 900} rounded-lg pt-1 px-1` : ''} ${i > 0 ? i < 3 ? 'mt-1' : 'mt-2' : 'mt-0'}`}
            >
              <div className="flex items-center justify-between space-x-2">
                <Link
                  href={`/token${d ? `/${d.id}` : 's'}`}
                >
                <a
                  target={is_widget ? '_blank' : '_self'}
                  rel={is_widget ? 'noopener noreferrer' : ''}
                  className="flex items-center space-x-2"
                >
                  {d?.image && (
                    <Image
                      src={d.image}
                      alt=""
                      width={20}
                      height={20}
                    />
                  )}
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold">
                      {d?.name}
                    </span>
                    <span className="uppercase text-slate-400 dark:text-slate-500 font-medium">
                      {d?.symbol}
                    </span>
                  </div>
                </a>
                </Link>
                <span className={`${d?.price_change_percentage_24h_in_currency < 0 ? 'text-red-600 dark:text-red-400' : d?.price_change_percentage_24h_in_currency > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} text-xs font-semibold text-right space-x-1`}>
                  {currency_symbol}
                  {number_format(
                    d?.current_price,
                    '0,0.00000000',
                  )}
                </span>
              </div>
              <div className="w-full flex items-center justify-between text-2xs font-medium space-x-2 ml-0.5">
                <div className="flex items-center space-x-1">
                  <span className="text-slate-600 dark:text-slate-400 font-bold">
                    #{number_format(d?.market_cap_rank, '0,0')}
                  </span>
                  <span className="text-slate-400 dark:text-slate-200 font-semibold">
                    MCap:
                  </span>
                  <span className="text-slate-400 dark:text-slate-400 font-bold">
                    {currency.symbol}
                    {number_format(d?.market_cap, '0,0.00')}
                  </span>
                </div>
                <div className={`flex items-center ${d?.price_change_percentage_24h_in_currency < 0 ? 'text-red-600 dark:text-red-400' : d?.price_change_percentage_24h_in_currency > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} font-bold`}>
                  {number_format(d?.price_change_percentage_24h_in_currency / 100, '+0,0.00%')}
                  {d?.price_change_percentage_24h_in_currency < 0 ?
                    <FiArrowDown size={10} /> :
                    d?.price_change_percentage_24h_in_currency > 0 ?
                      <FiArrowUp size={10} /> :
                      null
                  }
                </div>
              </div>
            </div>
          )
        }) :
        <TailSpin
          color={loader_color(theme)}
          width="32"
          height="32"
        />
      }
    </div>
  )
}