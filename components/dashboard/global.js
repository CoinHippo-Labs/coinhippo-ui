import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { FaBitcoin, FaRegHandPointUp, FaRegCommentDots } from 'react-icons/fa'
import { GiCoins, GiChargingBull, GiBearHead, GiCamel } from 'react-icons/gi'
import { BiTransferAlt } from 'react-icons/bi'
import { AiOutlineStock, AiOutlineBarChart } from 'react-icons/ai'
import { currency } from '../../lib/object/currency'
import { number_format } from '../../lib/utils'

export default ({ bitcoin, marketStatus }) => {
  const { tokens, status } = useSelector(state => ({ tokens: state.tokens, status: state.status }), shallowEqual)
  const { cryptos_data } = { ...tokens }
  const { status_data } = { ...status }

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }

  return (
    <div className={`w-full ${['market_status'].includes(widget) ? 'max-w-2xs mt-88 mx-auto' : 'grid grid-flow-row mb-4 lg:mb-2 xl:mb-4'} grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-2 xl:gap-2`}>
      {!widget && (
        <>
          <Link href="/token/bitcoin">
            <a>
              <div
                title={<span className="uppercase text-yellow-500 dark:text-gray-100 font-semibold text-xs">Bitcoin</span>}
                description={<span className="text-base md:text-sm">
                  {bitcoin && currency.id in bitcoin ?
                    <div className={`h-5 flex items-center ${bitcoin[`${currency.id}_24h_change`] < 0 ? 'text-red-500 dark:text-red-400' : bitcoin[`${currency.id}_24h_change`] > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-bold`}>
                      <span className="space-x-1 mr-1.5">
                        {currency.symbol}
                        <span>{number_format(bitcoin[vs_currency], '0,0')}</span>
                        {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                      </span>
                      <span className="text-xs font-normal">{number_format(bitcoin[`${currency.id}_24h_change`], '+0,0.000')}%</span>
                      {bitcoin[`${currency.id}_24h_change`] < 0 ? <FiArrowDown size={12} className="ml-0.5 mb-0.5" /> : bitcoin[`${currency.id}_24h_change`] > 0 ? <FiArrowUp size={12} className="ml-0.5 mb-0.5" /> : null}
                    </div>
                    :
                    <div className="skeleton w-12 h-4 rounded mt-1" />
                  }
                </span>}
                right={<FaBitcoin size={24} className="hidden sm:block stroke-current text-yellow-500" />}
                className="bg-gradient-to-r from-gray-100 to-gray-100 dark:from-gray-800 dark:to-gray-800 p-3 lg:p-2 xl:p-3"
              />
            </a>
          </Link>
          <div className="w-full grid grid-flow-row grid-cols-2 p-0">
            <Link href="/tokens">
              <a>
                <div
                  title={<span className="uppercase text-gray-500 dark:text-gray-300 text-xs">Cryptos</span>}
                  description={<span className="text-gray-900 dark:text-white text-sm xs:text-base md:text-xs">
                    {status_data ?
                      number_format(status_data.active_cryptocurrencies, '0,0')
                      :
                      <div className="skeleton w-10 h-4 rounded mt-1" />
                    }
                  </span>}
                  right={<GiCoins size={24} className="hidden sm:block stroke-current text-gray-500 dark:text-gray-400" />}
                  className="bg-transparent border-0 py-3 px-2 lg:p-2 xl:p-3"
                />
              </a>
            </Link>
            <Link href="/exchanges">
              <a>
                <div
                  title={<span className="uppercase text-gray-500 dark:text-gray-300 text-xs">Exchanges</span>}
                  description={<span className="text-gray-900 dark:text-white text-sm xs:text-base md:text-xs">
                    {cryptos_data ?
                      number_format(cryptos_data.exchanges && cryptos_data.exchanges.length, '0,0')
                      :
                      <div className="skeleton w-10 h-4 rounded mt-1" />
                    }
                  </span>}
                  right={<BiTransferAlt size={24} className="hidden sm:block stroke-current text-gray-500 dark:text-gray-400" />}
                  className="bg-transparent border-0 py-3 pl-0 pr-2 lg:p-2 xl:p-3"
                />
              </a>
            </Link>
          </div>
          <Link href="/tokens">
            <a>
              <div
                title={<div className="h-5 flex items-center uppercase whitespace-nowrap text-gray-500 dark:text-gray-300 text-xs">
                  Market Cap
                  {status_data && (
                    <div className={`flex items-center ${status_data.market_cap_change_percentage_24h_usd < 0 ? 'text-red-500 dark:text-red-400' : status_data.market_cap_change_percentage_24h_usd > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-medium ml-1`}>
                      {number_format(status_data.market_cap_change_percentage_24h_usd, '+0,0.000')}%
                      {status_data.market_cap_change_percentage_24h_usd < 0 ? <FiArrowDown size={12} className="mb-0.5" /> : status_data.market_cap_change_percentage_24h_usd > 0 ? <FiArrowUp size={12} className="mb-0.5" /> : null}
                    </div>
                  )}
                </div>}
                description={<span className="text-sm sm:text-base md:text-xs space-x-1">
                  {status_data ?
                    <>
                      {currency.symbol}
                      <span>{number_format(status_data.total_market_cap && status_data.total_market_cap[vs_currency], '0,0')}</span>
                      {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                    </>
                    :
                    <div className="skeleton w-16 h-4 rounded mt-1" />
                  }
                </span>}
                right={<AiOutlineStock size={24} className="hidden sm:block stroke-current text-gray-500 dark:text-gray-400" />}
                className="p-3 lg:p-2 xl:p-3"
              />
            </a>
          </Link>
          <Link href="/tokens/high-volume">
            <a>
              <div
                title={<span className="uppercase text-gray-500 dark:text-gray-300 text-xs">24h Volume</span>}
                description={<span className="text-sm sm:text-base md:text-xs space-x-1">
                  {status_data ?
                    <>
                      {currency.symbol}
                      <span>{number_format(status_data.total_volume && status_data.total_volume[vs_currency], '0,0')}</span>
                      {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                    </>
                    :
                    <div className="skeleton w-16 h-4 rounded mt-1" />
                  }
                </span>}
                right={<AiOutlineBarChart size={24} className="hidden sm:block stroke-current text-gray-500 dark:text-gray-400" />}
                className="p-3 lg:p-2 xl:p-3"
              />
            </a>
          </Link>
        </>
      )}
      {['market_status'].includes(widget) && (
        <>
          <div className="w-full flex items-center">
            <img
              src="/logos/logo.png"
              alt=""
              className="w-16 h-16 rounded-full mr-2"
            />
            <span className="font-mono text-base font-semibold mr-2">Feeling</span>
            <FaRegCommentDots size={24} />
            <FaRegHandPointUp size={20} className="ml-auto mr-3" />
          </div>
          <div className="w-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-white text-xs font-semibold">
              #{process.env.NEXT_PUBLIC_APP_NAME} #Crypto #Cryptocurrency
            </span>
          </div>
        </>
      )}
    </div>
  )
}