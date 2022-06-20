import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import moment from 'moment'
import { currency } from '../../lib/object/currency'
import { numberFormat } from '../../lib/utils'

export default ({ coinData }) => {
  return (
    <>
      {coinData && (
        <>
          <div className="text-gray-800 dark:text-gray-200 text-base font-semibold mt-8 mb-2">Price Change</div>
          <div className="w-full grid grid-flow-row grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-2">
            {['price_change_percentage_1h_in_currency',
              'price_change_percentage_24h_in_currency',
              'price_change_percentage_7d_in_currency',
              //'price_change_percentage_14d_in_currency',
              'price_change_percentage_30d_in_currency',
              //'price_change_percentage_60d_in_currency',
              'price_change_percentage_200d_in_currency',
              'price_change_percentage_1y_in_currency'
            ].map((field, i) => (
              <div key={i} className="flex flex-col items-center justify-center space-y-1.5 p-2">
                <span className="uppercase text-gray-700 dark:text-gray-300 font-semibold">{field.split('_')[3]}</span>
                {coinData.market_data[field][currency.id] > Number.MIN_SAFE_INTEGER ?
                  <span className={`flex items-center ${coinData.market_data[field][currency.id] < 0 ? 'text-red-500 dark:text-red-400' : coinData.market_data[field][currency.id] > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-sm font-bold space-x-0.5`}>
                    <span>{numberFormat(coinData.market_data[field][currency.id], '+0,0.000')}%</span>
                    {coinData.market_data[field][currency.id] < 0 ? <FiArrowDown size={14} className="ml-0.5 mb-0.5" /> : coinData.market_data[field][currency.id] > 0 ? <FiArrowUp size={14} className="ml-0.5 mb-0.5" /> : null}
                  </span>
                  :
                  <span className="text-gray-400 dark:text-gray-600">-</span>
                }
              </div>
            ))}
            {['atl', 'ath'].map((field, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded p-2">
                <div className="flex flex-col items-start">
                  <span className="uppercase text-gray-700 dark:text-gray-300 font-semibold">{field}</span>
                  <div className="flex flex-wrap items-center space-x-1">
                    {coinData.market_data[field][currency.id] > -1 ?
                      <span className="flex items-center text-gray-500 dark:text-gray-300 text-sm font-medium">
                        {numberFormat(coinData.market_data[field][currency.id], '0,0.00000000')}
                      </span>
                      :
                      <span className="text-gray-400 dark:text-gray-600">-</span>
                    }
                    {coinData.market_data[`${field}_change_percentage`][currency.id] > Number.MIN_SAFE_INTEGER && (
                      <div className={`h-4 flex items-center ${coinData.market_data[`${field}_change_percentage`][currency.id] < 0 ? 'text-red-500 dark:text-red-400' : coinData.market_data[`${field}_change_percentage`][currency.id] > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-xs font-bold`}>
                        {numberFormat(coinData.market_data[`${field}_change_percentage`][currency.id], '+0,0.000')}%
                      </div>
                    )}
                  </div>
                  <div className="text-gray-400 dark:text-gray-600 font-normal" style={{ fontSize: '.65rem' }}>
                    {coinData.market_data[`${field}_date`] && coinData.market_data[`${field}_date`][currency.id] ?
                      moment(coinData.market_data[`${field}_date`][currency.id]).fromNow()
                      :
                      '-'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}