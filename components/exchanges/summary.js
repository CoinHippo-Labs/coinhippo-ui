import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'

import { currency, currency_symbol, currency_btc } from '../../lib/object/currency'
import { number_format, loader_color } from '../../lib/utils'

export default ({ data }) => {
  const { preferences, rates } = useSelector(state => ({ preferences: state.preferences, rates: state.rates }), shallowEqual)
  const { theme } = { ...preferences }
  const { rates_data } = { ...rates }

  const router = useRouter()
  const { query } = { ...router }
  const { exchange_type } = { ...query }

  const metricClassName = 'bg-white dark:bg-black border hover:border-transparent dark:border-slate-900 hover:dark:border-transparent shadow hover:shadow-lg dark:shadow-slate-400 rounded-lg space-y-0.5 py-4 px-5'

  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className={`${metricClassName}`}>
        <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
          Exchanges
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
          Number of exchanges
        </span>
      </div>
      {exchange_type === 'derivatives' && (
        <>
          <div className={`${metricClassName}`}>
            <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
              Open Interest 24h
            </span>
            <div className="text-3xl font-bold">
              {data ?
                <div className="flex items-center uppercase font-semibold space-x-2">
                  <span>
                    {rates_data && currency_symbol}
                    {number_format(_.sumBy(data.filter(d => d?.open_interest_btc > 0), 'open_interest_btc') * (rates_data ? rates_data[currency]?.value / rates_data[currency_btc]?.value : 1), '0,0')}
                  </span>
                  {!rates_data && (
                    <span>
                      {currency_btc}
                    </span>
                  )}
                </div> :
                <TailSpin
                  color={loader_color(theme)}
                  width="36"
                  height="36"
                />
              }
            </div>
            <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
              Total 24h open interest in USD
            </span>
          </div>
          <div className={`${metricClassName}`}>
            <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
              Open Interest 24h
            </span>
            <div className="text-3xl font-bold">
              {data ?
                <div className="flex items-center uppercase font-semibold space-x-2">
                  <span>
                    {number_format(_.sumBy(data.filter(d => d?.open_interest_btc > 0), 'open_interest_btc'), '0,0')}
                  </span>
                  <span>
                    {currency_btc}
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
              Total 24h open interest in BTC
            </span>
          </div>
        </>
      )}
      <div className={`${metricClassName}`}>
        <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
          Volume 24h
        </span>
        <div className="text-3xl font-bold">
          {data ?
            <div className="flex items-center uppercase font-semibold space-x-2">
              <span>
                {rates_data && currency_symbol}
                {number_format(_.sumBy(data.filter(d => d?.trade_volume_24h_btc > 0), 'trade_volume_24h_btc') * (rates_data ? rates_data[currency]?.value / rates_data[currency_btc]?.value : 1), '0,0')}
              </span>
              {!rates_data && (
                <span>
                  {currency_btc}
                </span>
              )}
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
    </div>
  )
}