import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Image from '../image'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { IoTrendingUp, IoTrendingDown } from 'react-icons/io5'
import _ from 'lodash'
import { coinsMarkets } from '../../lib/api/coingecko'
import { currency } from '../../lib/object/currency'
import { numberFormat } from '../../lib/utils'

const sortDirections = [
  { direction: 'desc', title: 'Gainers' },
  { direction: 'asc', title: 'Losers' },
]

export default ({ noBorder }) => {
  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }
  let { n } = { ...query }
  n = Number(n) > 2 ? Number(n) > 25 ? 25 : Number(n) : 5

  const [coinsData, setCoinsData] = useState(null)
  const [sortDirection, setSortDirection] = useState('desc')

  useEffect(() => {
    const getCoinsMarkets = async () => {
      const response = await coinsMarkets({ vs_currency: currency, order: 'market_cap_desc', per_page: 250, page: 1, price_change_percentage: '24h' })

      if (response && Array.isArray(response)) {
        setCoinsData(response.map(coinData => { return { ...coinData, vs_currency: currency } }))
      }
    }

    getCoinsMarkets()

    const interval = setInterval(() => getCoinsMarkets(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [vs_currency])

  const isWidget = ['top-movers'].includes(widget)

  return (
    <div
      title={<span className="uppercase flex items-center">
        <span className="mr-1.5">Top</span>
        {sortDirections.map((_sortDirection, i) => (
          <button
            key={i}
            onClick={() => setSortDirection(_sortDirection.direction)}
            className={`btn btn-raised btn-sm min-w-max btn-rounded ${_sortDirection.direction === sortDirection ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white' : 'bg-transparent hover:bg-gray-50 text-gray-500 hover:text-gray-700 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200'} text-xs mb-0.5 mr-${i < sortDirections.length - 1 ? 1.5 : 0}`}
          >
            {_sortDirection.title}
          </button>
        ))}
        {sortDirection === 'desc' ?
          <IoTrendingUp size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
          :
          <IoTrendingDown size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
        }
      </span>}
      description={<div className="mt-3.5">
        {coinsData ?
          _.slice(_.orderBy(coinsData, ['price_change_percentage_24h_in_currency'], [sortDirection]), 0, n).map((coinData, i) => {
            const currency = currencies[currencies.findIndex(c => c.id === coinData.vs_currency)] || currencies[0]
            return (
              <div key={i} className={`${i < 3 ? `bg-${sortDirection === 'desc' ? 'green' : 'red'}-${i < 1 ? 200 : i < 2 ? 100 : 50} dark:bg-${sortDirection === 'desc' ? 'green' : 'red'}-${i < 1 ? 700 : i < 2 ? 800 : 900} rounded pt-1 px-1` : ''} mt-${i > 0 ? i < 3 ? 1 : 2 : 0}`}>
                <div className="flex items-center text-sm">
                  <Link href={`/token${coinData ? `/${coinData.id}` : 's'}`}>
                    <a target={isWidget ? '_blank' : '_self'} rel={isWidget ? 'noopener noreferrer' : ''} className="flex items-center space-x-1 mr-2">
                      <Image
                        src={coinData.image}
                        alt=""
                        width={20}
                        height={20}
                        className="rounded"
                      />
                      <div>
                        <span className="text-gray-900 dark:text-gray-100">{coinData.name}</span>
                        <span className="uppercase text-gray-400 font-normal ml-1">{coinData.symbol}</span>
                      </div>
                    </a>
                  </Link>
                  <span className={`${coinData.price_change_percentage_24h_in_currency < 0 ? 'text-red-500 dark:text-red-400' : coinData.price_change_percentage_24h_in_currency > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-xs font-medium text-right space-x-1 ml-auto`}>
                    {currency.symbol}
                    <span>{numberFormat(coinData.current_price, '0,0.00000000')}</span>
                    {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                  </span>
                </div>
                <div className="w-full flex items-center font-normal ml-0.5" style={{ fontSize: '.65rem' }}>
                  <div className="text-gray-600 dark:text-gray-400 mr-2">
                    <span className="text-gray-600 dark:text-gray-400 font-semibold mr-1">#{numberFormat(coinData.market_cap_rank, '0,0')}</span>
                    <span className="text-gray-500 dark:text-gray-300 font-medium mr-1">MCap:</span>
                    <span className="space-x-1">
                      {currency.symbol}
                      <span>{numberFormat(coinData.market_cap, '0,0.00000000')}</span>
                      {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                    </span>
                  </div>
                  <div className={`flex items-center ${coinData.price_change_percentage_24h_in_currency < 0 ? 'text-red-500 dark:text-red-400' : coinData.price_change_percentage_24h_in_currency > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-extrabold ml-auto`}>
                    {numberFormat(coinData.price_change_percentage_24h_in_currency / 100, '+0,0.00%')}
                    {coinData.price_change_percentage_24h_in_currency < 0 ? <FiArrowDown size={10} className="mb-0.5" /> : coinData.price_change_percentage_24h_in_currency > 0 ? <FiArrowUp size={10} className="mb-0.5" /> : null}
                  </div>
                </div>
              </div>
            )
          })
          :
          [...Array(n).keys()].map(i => (
            <div key={i} className={`mt-${i > 0 ? 3 : 0}`}>
              <div className="flex items-center">
                <div className="skeleton w-5 h-5 rounded mr-1.5" />
                <div className="skeleton w-28 h-3.5 rounded" />
                <span className="ml-auto">
                  <div className="skeleton w-12 h-3.5 rounded" />
                </span>
              </div>
              <div className="flex items-center mt-1 ml-0.5">
                <div className="skeleton w-4 h-3 rounded mr-1.5" />
                <div className="skeleton w-20 h-3 rounded" />
                <span className="ml-auto">
                  <div className="skeleton w-8 h-3 rounded" />
                </span>
              </div>
            </div>
          ))
        }
      </div>}
      className={`${noBorder ? 'border-0' : ''}`}
    />
  )
}