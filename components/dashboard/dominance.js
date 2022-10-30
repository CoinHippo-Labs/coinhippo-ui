import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'

import Image from '../image'
import { ProgressBar } from '../progress-bars'
import { BiPieChartAlt } from 'react-icons/bi'
import { number_format, equals_ignore_case, loader_color } from '../../lib/utils'

export default () => {
  const { preferences, cryptos, status } = useSelector(state => ({ preferences: state.preferences, cryptos: state.cryptos, status: state.status }), shallowEqual)
  const { theme } = { ...preferences }
  const { cryptos_data } = { ...cryptos }
  const { status_data } = { ...status }

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }

  const { coins } = { ...cryptos_data }
  const { market_cap_percentage } = { ...status_data }
  const is_widget = ['dominance'].includes(widget)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg space-y-2 p-4">
      <div className="flex items-center space-x-2">
        <span className="uppercase text-slate-600 dark:text-slate-400 text-xs font-bold">
          Dominance
        </span>
      </div>
      {cryptos_data && status_data ?
        <div className="flex flex-col space-y-2.5">
          {[...Array(1).keys()].map(i => {
            const data = _.slice(_.orderBy(Object.keys({ ...market_cap_percentage }).map(s => {
              return {
                symbol: s,
                color: s === 'bnb' ?
                  'bg-yellow-400' :
                  s === 'usdt' ?
                    'bg-green-500' :
                    s === 'usdc' ?
                      'bg-blue-500' :
                      undefined,
                dominance: market_cap_percentage?.[s],
                ...coins?.find((t, i) => i < 25 && equals_ignore_case(t?.symbol, s)),
              }
            }), ['dominance'], ['desc']), 0, 5)
            data.push({
              name: 'Others',
              dominance: 100 - _.sumBy(data, 'dominance'),
            })
            return data.map((d, i) => (
              <div
                key={i}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between space-x-2">
                  <Link
                    href={`/token${d ? `/${d.id}` : 's'}`}
                  >
                  <a
                    target={is_widget ? '_blank' : '_self'}
                    rel={is_widget ? 'noopener noreferrer' : ''}
                    className="flex items-center space-x-2"
                  >
                    {!d?.large && d?.name === 'Others' ?
                      <BiPieChartAlt size={24} className="stroke-current text-gray-400" /> :
                      d?.large && (
                        <Image
                          src={d.large}
                          alt=""
                          width={24}
                          height={24}
                        />
                      )
                    }
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold">
                        {d?.name}
                      </span>
                      <span className="uppercase text-slate-400 dark:text-slate-500 font-medium">
                        {d?.symbol}
                      </span>
                    </div>
                  </a>
                  </Link>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                    {number_format(
                      d?.dominance / 100,
                      '0,0.00%',
                    )}
                  </span>
                </div>
                <ProgressBar
                  width={d?.dominance}
                  color={`${d?.color || ['bg-yellow-500', 'bg-blue-400', 'bg-green-500', 'bg-yellow-400', 'bg-blue-500'][i % 5]}`}
                  className="h-1.5 rounded-lg"
                />
              </div>
            ))
          })}
        </div> :
        <TailSpin
          color={loader_color(theme)}
          width="32"
          height="32"
        />
      }
    </div>
  )
}