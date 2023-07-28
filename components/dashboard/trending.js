import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Card, CardBody } from '@material-tailwind/react'
import _ from 'lodash'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { AiOutlineFire } from 'react-icons/ai'

import Spinner from '../spinner'
import Image from '../image'
import NumberDisplay from '../number'
import { getTokensMarkets } from '../../lib/api/coingecko'
import { toArray, ellipse } from '../../lib/utils'

export default () => {
  const { trending } = useSelector(state => ({ trending: state.trending }), shallowEqual)
  const { trending_data } = { ...trending }

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }
  let { n } = { ...query }
  n = Number(n) > 2 ? Number(n) > 7 ? 7 : Number(n) : 5

  const [data, setData] = useState(null)

  useEffect(
    () => {
      const getData = async () => {
        if (trending_data) {
          const response = await getTokensMarkets({ vs_currency: 'usd', ids: toArray(trending_data).map(d => d.item?.id).join(','), price_change_percentage: '24h' })
          setData(
            toArray(trending_data).map(d => {
              const { item } = { ...d }
              const { id } = { ...item }
              return {
                ...item,
                ...toArray(response).find(_d => _d.id === id),
              }
            })
          )
        }
      }

      getData()
      const interval = setInterval(() => getData(), 3 * 60 * 1000)
      return () => clearInterval(interval)
    },
    [trending_data],
  )

  const is_widget = widget === 'trending'

  return (
    <Card className="card">
      <CardBody className="space-y-3 pt-4 2xl:pt-6 pb-3 2xl:pb-5 px-4 2xl:px-6">
        <div className="flex items-center justify-between space-x-2">
          <a
            href="https://coingecko.com/discover"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2"
          >
            <Image
              src="/logos/others/coingecko.png"
              width={20}
              height={20}
            />
            <span className="whitespace-nowrap text-blue-400 dark:text-blue-500 text-base">
              Trending Search
            </span>
          </a>
          <AiOutlineFire size={20} className="text-slate-500 dark:text-slate-400" />
        </div>
        {data ?
          _.slice(data, 0, n).map((d, i) => {
            const { id, name, symbol, large, current_price, price_change_percentage_24h, market_cap_rank, market_cap } = { ...d }
            const textColor = price_change_percentage_24h < 0 ? 'text-red-500 dark:text-red-400' : price_change_percentage_24h > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'
            return (
              <div key={i} className={`${i < 3 ? `bg-yellow-${i < 1 ? 200 : i < 2 ? 100 : 50} dark:bg-blue-${i < 1 ? 700 : i < 2 ? 800 : 900} rounded-lg pt-0 px-0` : ''} ${i > 0 ? i < 3 ? 'mt-1' : 'mt-2' : 'mt-0'}`}>
                <div className="flex items-center justify-between space-x-2">
                  <Link
                    href={`/token${id ? `/${id}` : 's'}`}
                    target={is_widget ? '_blank' : '_self'}
                    rel={is_widget ? 'noopener noreferrer' : ''}
                    className="flex items-center space-x-2"
                  >
                    {large && (
                      <Image
                        src={large}
                        width={20}
                        height={20}
                      />
                    )}
                    <div className="flex items-center space-x-1.5">
                      <span className="text-black dark:text-white font-bold">
                        {ellipse(name, 8)}
                      </span>
                      <span className="uppercase text-slate-400 dark:text-slate-500 font-medium">
                        {symbol}
                      </span>
                    </div>
                  </Link>
                  <NumberDisplay
                    value={current_price}
                    format="0,0.00000000"
                    prefix="$"
                    noTooltip={true}
                    className={`whitespace-nowrap ${price_change_percentage_24h < 0 ? 'text-red-500 dark:text-red-400' : price_change_percentage_24h > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} text-xs font-semibold`}
                  />
                </div>
                <div className="w-full flex items-center justify-between text-2xs font-medium space-x-2 ml-0.5">
                  <div className="flex items-center space-x-1">
                    <NumberDisplay
                      value={market_cap_rank}
                      format="0,0"
                      prefix="#"
                      className="whitespace-nowrap text-slate-500 dark:text-slate-400 font-bold"
                    />
                    <NumberDisplay
                      value={market_cap}
                      format="0,0"
                      prefix="MCap: $"
                      noTooltip={true}
                      className="whitespace-nowrap text-slate-400 dark:text-slate-500 font-semibold"
                    />
                  </div>
                  <div className={`flex items-center ${textColor} space-x-1`}>
                    <NumberDisplay
                      value={price_change_percentage_24h}
                      format="0,0.00"
                      maxDecimals={2}
                      prefix={price_change_percentage_24h < 0 ? '' : '+'}
                      suffix="%"
                      noTooltip={true}
                      className={`whitespace-nowrap ${textColor} font-bold`}
                    />
                    {price_change_percentage_24h !== 0 && (price_change_percentage_24h < 0 ? <FiArrowDown size={10} /> : <FiArrowUp size={10} />)}
                  </div>
                </div>
              </div>
            )
          }) :
          <Spinner name="ProgressBar" width={36} height={36} />
        }
      </CardBody>
    </Card>
  )
}