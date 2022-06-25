import moment from 'moment'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

import { currency } from '../../lib/object/currency'
import { number_format } from '../../lib/utils'

export default ({ data }) => {
  const { market_data } = { ...data } 
  return data && (
    <div className="space-y-2">
      <div className="text-base font-bold">
        Price Change
      </div>
      <div className="w-full grid grid-flow-row grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-2">
        {['price_change_percentage_1h_in_currency',
          'price_change_percentage_24h_in_currency',
          'price_change_percentage_7d_in_currency',
          //'price_change_percentage_14d_in_currency',
          'price_change_percentage_30d_in_currency',
          //'price_change_percentage_60d_in_currency',
          'price_change_percentage_200d_in_currency',
          'price_change_percentage_1y_in_currency'
        ].map((f, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center space-y-1.5 p-2"
          >
            <span className="uppercase text-gray-600 dark:text-gray-400 font-semibold">
              {f.split('_')[3]}
            </span>
            {market_data?.[f]?.[currency] > Number.MIN_SAFE_INTEGER ?
              <div className={`flex items-center ${market_data[f][currency] < 0 ? 'text-red-600 dark:text-red-400' : market_data[f][currency] > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} space-x-0.5`}>
                <span className="text-sm font-bold">
                  {number_format(market_data[f][currency], '+0,0.000')}%
                </span>
                {market_data[f][currency] < 0 ?
                  <FiArrowDown size={14} className="ml-0.5 mb-0.5" /> :
                  market_data[f][currency] > 0 ?
                    <FiArrowUp size={14} className="ml-0.5 mb-0.5" /> : null
                }
              </div>
              :
              <span className="text-slate-400 dark:text-slate-600">
                -
              </span>
            }
          </div>
        ))}
        {['atl', 'ath'].map((f, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-lg p-2"
          >
            <div className="flex flex-col items-start space-y-0.5">
              <span className="uppercase text-slate-600 dark:text-slate-400 font-semibold">
                {f}
              </span>
              <div className="flex flex-wrap items-center space-x-1">
                {market_data?.[f]?.[currency] > -1 ?
                  <span className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-medium">
                    {number_format(market_data[f][currency], '0,0.00000000')}
                  </span>
                  :
                  <span className="text-gray-400 dark:text-gray-600">
                    -
                  </span>
                }
                {market_data?.[`${f}_change_percentage`]?.[currency] > Number.MIN_SAFE_INTEGER && (
                  <div className={`h-4 flex items-center ${market_data[`${f}_change_percentage`][currency] < 0 ? 'text-red-600 dark:text-red-400' : market_data[`${f}_change_percentage`][currency] > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} text-2xs font-bold`}>
                    {number_format(market_data[`${f}_change_percentage`][currency], '+0,0.000')}%
                  </div>
                )}
              </div>
              <div className="text-slate-400 dark:text-slate-600 text-2xs font-medium">
                {market_data?.[`${f}_date`]?.[currency] ?
                  moment(market_data[`${f}_date`][currency]).fromNow() :
                  <span>
                    -
                  </span>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}