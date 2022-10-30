import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { FaBitcoin } from 'react-icons/fa'

import { currency, currency_symbol } from '../../lib/object/currency'
import { number_format } from '../../lib/utils'

export default ({ bitcoin }) => {
  const { cryptos, status } = useSelector(state => ({ cryptos: state.cryptos, status: state.status }), shallowEqual)
  const { cryptos_data } = { ...cryptos }
  const { status_data } = { ...status }

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }

  const { exchanges } = { ...cryptos_data }
  const { active_cryptocurrencies, market_cap_change_percentage_24h_usd, total_market_cap, total_volume } = { ...status_data }

  return (
    <div className="w-full grid grid-flow-row grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
      {!widget && (
        <>
          <Link
            href="/token/bitcoin"
          >
          <a
            className="bg-white dark:bg-slate-900 rounded-lg space-y-0.5 p-4"
          >
            <div className="flex items-center space-x-2">
              <FaBitcoin size={24} className="text-yellow-500" />
              <span className="uppercase text-slate-600 dark:text-slate-400 text-xs font-bold">
                Bitcoin
              </span>
            </div>
            <div className={`flex items-center ${bitcoin?.[`${currency}_24h_change`] < 0 ? 'text-red-600 dark:text-red-400' : bitcoin?.[`${currency}_24h_change`] > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} text-sm font-bold space-x-1`}>
              {
                bitcoin &&
                (
                  <>
                    {currency_symbol}
                    {number_format(
                      bitcoin[currency],
                      '0,0',
                    )}
                    {bitcoin[`${currency}_24h_change`] < 0 ?
                      <FiArrowDown
                        size={12}
                        className="ml-0.5"
                      /> :
                      bitcoin[`${currency}_24h_change`] > 0 ?
                      <FiArrowUp
                        size={12}
                        className="ml-0.5"
                      /> :
                      null
                    }
                  </>
                )
              }
            </div>
          </a>
          </Link>
          <Link
            href="/tokens"
          >
          <a
            className="bg-white dark:bg-slate-900 rounded-lg space-y-2 p-4"
          >
            <div className="uppercase text-slate-500 dark:text-slate-300 text-xs font-bold">
              Cryptos
            </div>
            <div className="text-sm font-bold">
              {
                status_data &&
                (
                  number_format(
                    active_cryptocurrencies,
                    '0,0',
                  )
                )
              }
            </div>
          </a>
          </Link>
          <Link
            href="/exchanges"
          >
          <a
            className="bg-white dark:bg-slate-900 rounded-lg space-y-2 p-4"
          >
            <div className="uppercase text-slate-500 dark:text-slate-300 text-xs font-bold">
              Exchanges
            </div>
            <div className="text-sm font-bold">
              {
                exchanges &&
                (
                  number_format(
                    exchanges.length,
                    '0,0',
                  )
                )
              }
            </div>
          </a>
          </Link>
          <Link
            href="/tokens"
          >
          <a
            className="bg-white dark:bg-slate-900 rounded-lg space-y-2 p-4"
          >
            <div className="flex items-center space-x-2">
              <span className="uppercase text-slate-500 dark:text-slate-300 text-xs font-bold">
                Market Cap
              </span>
              {
                status_data &&
                (
                  <div className={`flex items-center ${market_cap_change_percentage_24h_usd < 0 ? 'text-red-600 dark:text-red-400' : market_cap_change_percentage_24h_usd > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-gray-400'} text-xs font-medium ml-1`}>
                    {number_format(
                      market_cap_change_percentage_24h_usd,
                      '+0,0.000',
                    )}%
                    {market_cap_change_percentage_24h_usd < 0 ?
                      <FiArrowDown
                        size={12}
                        className="ml-0.5"
                      /> :
                      market_cap_change_percentage_24h_usd > 0 ?
                      <FiArrowUp
                        size={12}
                        className="ml-0.5"
                      /> :
                      null
                    }
                  </div>
                )
              }
            </div>
            <div className="text-sm font-bold">
              {
                status_data &&
                (
                  <>
                    {currency_symbol}
                    {number_format(
                      total_market_cap?.[currency],
                      '0,0',
                    )}
                  </>
                )
              }
            </div>
          </a>
          </Link>
          <Link
            href="/tokens/high-volume"
          >
          <a
            className="bg-white dark:bg-slate-900 rounded-lg space-y-2 p-4"
          >
            <div className="uppercase text-slate-500 dark:text-slate-300 text-xs font-bold">
              Volume 24h
            </div>
            <div className="text-sm font-bold">
              {status_data && (
                <>
                  {currency_symbol}
                  {number_format(
                    total_volume?.[currency],
                    '0,0',
                  )}
                </>
              )}
            </div>
          </a>
          </Link>
        </>
      )}
    </div>
  )
}