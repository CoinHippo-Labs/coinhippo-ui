import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'

import { currency_symbol } from '../../lib/object/currency'
import { number_format, equals_ignore_case, loader_color } from '../../lib/utils'

export default ({ data }) => {
  const { preferences, cryptos } = useSelector(state => ({ preferences: state.preferences, cryptos: state.cryptos }), shallowEqual)
  const { theme } = { ...preferences }
  const { cryptos_data } = { ...cryptos }

  const router = useRouter()
  const { query } = { ...router }
  const { token_id } = { ...query }

  const token_data = cryptos_data?.coins?.find(t => equals_ignore_case(t?.id, token_id))
  const metricClassName = 'bg-white dark:bg-black border hover:border-transparent dark:border-slate-900 hover:dark:border-transparent shadow hover:shadow-lg dark:shadow-slate-400 rounded-lg space-y-0.5 py-4 px-5'

  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className={`${metricClassName}`}>
        <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
          Companies
        </span>
        <div className="text-3xl font-bold">
          {data ?
            number_format(data.companies?.length || 0, '0,0') :
            <TailSpin
              color={loader_color(theme)}
              width="36"
              height="36"
            />
          }
        </div>
        <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
          Number of companies
        </span>
      </div>
      <div className={`${metricClassName}`}>
        <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
          Total Holdings
        </span>
        <div className="text-3xl font-bold">
          {data ?
            number_format(data.total_holdings, '0,0') :
            <TailSpin
              color={loader_color(theme)}
              width="36"
              height="36"
            />
          }
        </div>
        <span className="uppercase text-slate-400 dark:text-slate-600 text-sm font-medium">
          {token_data?.symbol}
        </span>
      </div>
      <div className={`${metricClassName}`}>
        <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
          Total Value
        </span>
        <div className="text-3xl font-bold">
          {data ?
            `${currency_symbol}${number_format(data.total_value_usd, '0,0')}` :
            <TailSpin
              color={loader_color(theme)}
              width="36"
              height="36"
            />
          }
        </div>
        <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
          Total value in USD
        </span>
      </div>
      <div className={`${metricClassName}`}>
        <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
          Dominance
        </span>
        <div className="text-3xl font-bold">
          {data ?
            `${number_format(data.market_cap_dominance || _.sumBy(data.companies, 'percentage_of_total_supply'), '0,0.00')}%` :
            <TailSpin
              color={loader_color(theme)}
              width="36"
              height="36"
            />
          }
        </div>
        <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
          from total supply
        </span>
      </div>
    </div>
  )
}