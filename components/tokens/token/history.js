import moment from 'moment'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

import NumberDisplay from '../../number'
import TimeAgo from '../../time/timeAgo'
import { split } from '../../../lib/utils'

export default ({ data }) => {
  const { market_data } = { ...data } 
  return data && (
    <div className="space-y-2">
      <div className="text-base font-semibold">
        Price Change
      </div>
      <div className="w-full grid grid-flow-row grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-2">
        {['price_change_percentage_1h_in_currency', 'price_change_percentage_24h_in_currency', 'price_change_percentage_7d_in_currency', 'price_change_percentage_30d_in_currency', 'price_change_percentage_200d_in_currency', 'price_change_percentage_1y_in_currency'].map((f, i) => {
          const time = split(f, 'lower', '_')[3]
          const value = market_data?.[f]?.usd
          return (
            <div key={i} className="flex flex-col items-center justify-center space-y-1.5 p-2">
              <span className="uppercase text-slate-500 dark:text-slate-400 font-medium">
                {time}
              </span>
              {value > Number.MIN_SAFE_INTEGER ?
                <div className={`flex items-center ${value < 0 ? 'text-red-500 dark:text-red-400' : value > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} space-x-0.5`}>
                  <NumberDisplay
                    value={value}
                    format="0,0.00"
                    maxDecimals={2}
                    prefix={value < 0 ? '' : '+'}
                    suffix="%"
                    noTooltip={true}
                  />
                  {value !== 0 && (value < 0 ? <FiArrowDown size={14} className="ml-0.5 mb-0.5" /> : <FiArrowUp size={14} className="ml-0.5 mb-0.5" />)}
                </div> :
                <span className="text-slate-400 dark:text-slate-500">-</span>
              }
            </div>
          )
        })}
        {['atl', 'ath'].map((f, i) => {
          const value = market_data?.[f]?.usd
          const percent = market_data?.[`${f}_change_percentage`]?.usd
          const time = market_data?.[`${f}_date`]?.usd
          return (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-lg p-2">
              <div className="flex flex-col items-start space-y-0.5">
                <span className="uppercase text-slate-500 dark:text-slate-400 font-medium">
                  {f}
                </span>
                <div className="flex flex-wrap items-center space-x-1">
                  {value > -1 ?
                    <NumberDisplay
                      value={value}
                      format="0,0.00000000"
                      noTooltip={true}
                      className="whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs font-medium"
                    /> :
                    <span className="text-slate-400 dark:text-slate-500">-</span>
                  }
                  {percent > Number.MIN_SAFE_INTEGER && (
                    <div className="h-4 flex items-center">
                      <NumberDisplay
                        value={percent}
                        format="0,0.00"
                        maxDecimals={2}
                        prefix={percent < 0 ? '' : '+'}
                        suffix="%"
                        noTooltip={true}
                        className={`whitespace-nowrap ${percent < 0 ? 'text-red-500 dark:text-red-400' : percent > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} text-2xs font-semibold`}
                      />
                    </div>
                  )}
                </div>
                {time && <TimeAgo time={moment(time).unix()} className="text-slate-400 dark:text-slate-500 text-2xs font-medium" />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}