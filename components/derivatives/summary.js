import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'

import { currency_symbol } from '../../lib/object/currency'
import { number_format, loader_color } from '../../lib/utils'

export default ({ data }) => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const router = useRouter()
  const { query } = { ...router }
  const { derivative_type } = { ...query }

  const metricClassName = 'bg-white dark:bg-black border hover:border-transparent dark:border-slate-900 hover:dark:border-transparent shadow hover:shadow-lg dark:shadow-slate-400 rounded-lg space-y-0.5 py-4 px-5'

  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className={`${metricClassName}`}>
        <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
          Contracts
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
          Number of derivatives contracts
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
                {currency_symbol}
                {number_format(_.sumBy(data.filter(d => d?.open_interest > 0), 'open_interest'), '0,0')}
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
          Total 24h open interest in USD
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
    </div>
  )
}