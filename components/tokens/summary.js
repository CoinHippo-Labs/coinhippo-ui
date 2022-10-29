import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'

import Categories from './categories'
import { currency, currency_symbol, currency_btc } from '../../lib/object/currency'
import { number_format, loader_color } from '../../lib/utils'

export default ({ data }) => {
  const { preferences, cryptos } = useSelector(state => ({ preferences: state.preferences, cryptos: state.cryptos }), shallowEqual)
  const { theme } = { ...preferences }
  const { cryptos_data } = { ...cryptos }

  const metricClassName = 'bg-white dark:bg-black border hover:border-transparent dark:border-slate-900 hover:dark:border-transparent shadow hover:shadow-lg dark:shadow-slate-400 rounded-lg space-y-0.5 py-4 px-5'

  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className={`${metricClassName}`}>
        <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
          Tokens
        </span>
        <div className="text-3xl font-bold">
          {data ?
            number_format(data.length, '0,0') :
            <TailSpin
              color={loader_color(theme)}
              width="36"
              height="36"
            />
          }
        </div>
        <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
          Number of tokens
        </span>
      </div>
      <div className={`${metricClassName}`}>
        <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
          Market Cap
        </span>
        <div className="text-3xl font-bold">
          {data ?
            <div className="flex items-center uppercase font-semibold space-x-2">
              <span>
                {currency_symbol}
                {number_format(_.sumBy(data.filter(d => d?.market_cap > 0), 'market_cap'), '0,0')}
              </span>
            </div> :
            <TailSpin
              color={loader_color(theme)}
              width="36"
              height="36"
            />
          }
        </div>
        <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
          Total market cap in USD
        </span>
      </div>
      <div className={`${metricClassName}`}>
        <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
          Volume 24h
        </span>
        <div className="text-3xl font-bold">
          {data ?
            <div className="flex items-center uppercase font-semibold space-x-2">
              <span>
                {currency_symbol}
                {number_format(_.sumBy(data.filter(d => d?.volume_24h > 0), 'volume_24h'), '0,0')}
              </span>
            </div> :
            <TailSpin
              color={loader_color(theme)}
              width="36"
              height="36"
            />
          }
        </div>
        <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
          Total 24h volume in USD
        </span>
      </div>
      <div className={`${metricClassName}`}>
        <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
          Select category
        </span>
        <div className="text-3xl font-bold">
          {cryptos_data?.categories ?
            <div className="-mt-1">
              <Categories />
            </div> :
            <TailSpin
              color={loader_color(theme)}
              width="36"
              height="36"
            />
          }
        </div>
        <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
          Categories
        </span>
      </div>
    </div>
  )
}