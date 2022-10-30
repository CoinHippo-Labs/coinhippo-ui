import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { AiOutlineFire } from 'react-icons/ai'

import Image from '../image'
import { tokens_markets } from '../../lib/api/coingecko'
import { currency, currency_symbol } from '../../lib/object/currency'
import { number_format, loader_color } from '../../lib/utils'

export default () => {
  const { preferences, trending } = useSelector(state => ({ preferences: state.preferences, trending: state.trending }), shallowEqual)
  const { theme } = { ...preferences }
  const { trending_data } = { ...trending }

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }
  let { n } = { ...query }
  n = Number(n) > 2 ? Number(n) > 7 ? 7 : Number(n) : 5

  const [data, setData] = useState(null)

  useEffect(() => {
    const getData = async () => {
      if (trending_data) {
        const response = await tokens_markets({
          vs_currency: currency,
          ids: trending_data.map(t => t?.item?.id).join(','),
          price_change_percentage: '24h',
        })
        setData(trending_data.map(t => {
          const { id } = { ...t?.item }
          return {
            ...t?.item,
            ...(Array.isArray(response) ?
              response.find(_t => _t?.id === id) :
              null
            ),
          }
        }))
      }
    }
    getData()
    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [trending_data])

  const is_widget = ['trending'].includes(widget)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg space-y-2 p-4">
      <div className="flex items-center justify-between space-x-2 -mt-1">
        <a
          href="https://coingecko.com/discover"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2"
        >
          <Image
            src="/logos/externals/coingecko.png"
            alt=""
            width={20}
            height={20}
          />
          <span className="uppercase text-slate-600 dark:text-slate-400 text-xs font-bold">
            Trending Search
          </span>
        </a>
        <AiOutlineFire size={20} className="text-slate-500 dark:text-slate-400" />
      </div>
      {data ?
        _.slice(data, 0, n).map((d, i) => {
          return (
            <div
              key={i}
              className={`${i < 3 ? `bg-yellow-${i < 1 ? 200 : i < 2 ? 100 : 50} dark:bg-blue-${i < 1 ? 700 : i < 2 ? 800 : 900} rounded-lg pt-1 px-1` : ''} ${i > 0 ? i < 3 ? 'mt-1' : 'mt-2' : 'mt-0'}`}
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
                  {d?.large && (
                    <Image
                      src={d.large}
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
                <span className={`${d?.price_change_percentage_24h < 0 ? 'text-red-600 dark:text-red-400' : d?.price_change_percentage_24h > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} text-xs font-semibold text-right space-x-1`}>
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
                <div className={`flex items-center ${d?.price_change_percentage_24h < 0 ? 'text-red-600 dark:text-red-400' : d?.price_change_percentage_24h > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} font-bold`}>
                  {number_format(d?.price_change_percentage_24h / 100, '+0,0.00%')}
                  {d?.price_change_percentage_24h < 0 ?
                    <FiArrowDown size={10} /> :
                    d?.price_change_percentage_24h > 0 ?
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