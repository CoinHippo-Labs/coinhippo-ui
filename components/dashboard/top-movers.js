import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Card, CardBody } from '@material-tailwind/react'
import _ from 'lodash'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { IoTrendingUp, IoTrendingDown } from 'react-icons/io5'

import Spinner from '../spinner'
import Image from '../image'
import NumberDisplay from '../number'
import { getTokensMarkets } from '../../lib/api/coingecko'
import { toArray, ellipse } from '../../lib/utils'

const DIRECTIONS = [
  { direction: 'desc', title: 'Gainers' },
  { direction: 'asc', title: 'Losers' },
]

export default () => {
  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }
  let { n } = { ...query }
  n = Number(n) > 2 ? Number(n) > 25 ? 25 : Number(n) : 5

  const [data, setData] = useState(null)
  const [direction, setDirection] = useState(_.head(DIRECTIONS)?.direction)

  useEffect(
    () => {
      const getData = async () => {
        const response = await getTokensMarkets({ vs_currency: 'usd', order: 'market_cap_desc', per_page: 250, page: 1, price_change_percentage: '24h' })
        setData(toArray(response))
      }

      getData()
      const interval = setInterval(() => getData(), 3 * 60 * 1000)
      return () => clearInterval(interval)
    },
    [],
  )

  const is_widget = widget === 'top-movers'

  return (
    <Card className="card">
      
      <CardBody className="space-y-3 pt-4 2xl:pt-6 pb-3 2xl:pb-5 px-4 2xl:px-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <span className="uppercase text-slate-500 dark:text-slate-400 text-xs font-semibold">
              Top
            </span>
            <div className="flex items-center space-x-0.5">
              {DIRECTIONS.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setDirection(d.direction)}
                  className={`btn btn-raised btn-sm btn-rounded min-w-max ${d.direction === direction ? 'bg-slate-100 dark:bg-slate-800 text-black dark:text-white' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200'} text-xs font-medium ${i < DIRECTIONS.length - 1 ? 'mr-1.5' : 'mr-0'}`}
                >
                  {d.title}
                </button>
              ))}
            </div>
          </div>
          {direction === 'desc' ? <IoTrendingUp size={20} className="text-slate-500 dark:text-slate-400" /> : <IoTrendingDown size={20} className="text-slate-500 dark:text-slate-400" />}
        </div>
        {data ?
          _.slice(_.orderBy(data.filter(d => typeof d.price_change_percentage_24h_in_currency === 'number'), ['price_change_percentage_24h_in_currency'], [direction]), 0, n).map((d, i) => {
            const { id, name, symbol, image, current_price, price_change_percentage_24h_in_currency, market_cap_rank, market_cap } = { ...d }
            const textColor = price_change_percentage_24h_in_currency < 0 ? 'text-red-500 dark:text-red-400' : price_change_percentage_24h_in_currency > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'
            return (
              <div key={i} className={`${i < 3 ? `bg-${direction === 'desc' ? 'green' : 'red'}-${i < 1 ? 300 : i < 2 ? 200 : 100} dark:bg-${direction === 'desc' ? 'green' : 'red'}-${i < 1 ? 700 : i < 2 ? 800 : 900} rounded-lg pt-0 px-0` : ''} ${i > 0 ? i < 3 ? 'mt-1' : 'mt-2' : 'mt-0'}`}>
                <div className="flex items-center justify-between space-x-2">
                  <Link
                    href={`/token${id ? `/${id}` : 's'}`}
                    target={is_widget ? '_blank' : '_self'}
                    rel={is_widget ? 'noopener noreferrer' : ''}
                    className="flex items-center space-x-2"
                  >
                    {image && (
                      <Image
                        src={image}
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
                    className={`whitespace-nowrap ${price_change_percentage_24h_in_currency < 0 ? 'text-red-500 dark:text-red-400' : price_change_percentage_24h_in_currency > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} text-xs font-semibold`}
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
                      value={price_change_percentage_24h_in_currency}
                      format="0,0.00"
                      maxDecimals={2}
                      prefix={price_change_percentage_24h_in_currency < 0 ? '' : '+'}
                      suffix="%"
                      noTooltip={true}
                      className={`whitespace-nowrap ${textColor} font-bold`}
                    />
                    {price_change_percentage_24h_in_currency !== 0 && (price_change_percentage_24h_in_currency < 0 ? <FiArrowDown size={10} /> : <FiArrowUp size={10} />)}
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