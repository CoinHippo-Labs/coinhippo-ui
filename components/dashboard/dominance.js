import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import { Card, CardBody } from '@material-tailwind/react'
import _ from 'lodash'
import { BiPieChartAlt } from 'react-icons/bi'

import Spinner from '../spinner'
import Image from '../image'
import NumberDisplay from '../number'
import { ProgressBar } from '../progress-bars'
import { toArray, equalsIgnoreCase } from '../../lib/utils'

export default () => {
  const { cryptos, _global } = useSelector(state => ({ cryptos: state.cryptos, _global: state.global }), shallowEqual)
  const { cryptos_data } = { ...cryptos }
  const { global_data } = { ..._global }

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }

  const { coins } = { ...cryptos_data }
  const { market_cap_percentage } = { ...global_data }
  const is_widget = widget === 'dominance'

  return (
    <Card className="card">
      <CardBody className="space-y-3 pt-4 2xl:pt-6 pb-3 2xl:pb-5 px-4 2xl:px-6">
        <span className="whitespace-nowrap text-blue-400 dark:text-blue-500 text-base">
          Dominance
        </span>
        {cryptos_data && global_data ?
          <div className="flex flex-col space-y-2">
            {_.range(1).map(i => {
              const data = _.slice(
                _.orderBy(
                  Object.keys({ ...market_cap_percentage }).map(s => {
                    let color
                    switch (s) {
                      case 'bnb':
                        color = 'bg-yellow-400'
                        break
                      case 'usdt':
                        color = 'bg-green-500'
                        break
                      case 'usdc':
                        color = 'bg-blue-500'
                        break
                      default:
                        break
                    }
                    return {
                      symbol: s,
                      color,
                      dominance: market_cap_percentage?.[s],
                      ...toArray(coins).find((d, i) => i < 25 && equalsIgnoreCase(d.symbol, s)),
                    }
                  }),
                  ['dominance'], ['desc'],
                ),
                0, 5,
              )
              data.push({ name: 'Others', dominance: 100 - _.sumBy(data, 'dominance') })
              return (
                data.map((d, i) => {
                  const { id, name, symbol, large, dominance, color } = { ...d }
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between space-x-2">
                        <Link
                          href={`/token${id ? `/${id}` : 's'}`}
                          target={is_widget ? '_blank' : '_self'}
                          rel={is_widget ? 'noopener noreferrer' : ''}
                          className="flex items-center space-x-2"
                        >
                          {!large && name === 'Others' ?
                            <BiPieChartAlt size={24} className="text-slate-400" /> :
                            large && (
                              <Image
                                src={large}
                                width={24}
                                height={24}
                              />
                            )
                          }
                          <div className="flex items-center space-x-1.5">
                            <span className="text-black dark:text-white font-bold">
                              {name}
                            </span>
                            <span className="uppercase text-slate-400 dark:text-slate-500 font-medium">
                              {symbol}
                            </span>
                          </div>
                        </Link>
                        <NumberDisplay
                          value={dominance}
                          format="0,0.00"
                          suffix="%"
                          noTooltip={true}
                          className="whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs font-medium"
                        />
                      </div>
                      <ProgressBar
                        width={dominance}
                        color={`${color || ['bg-yellow-500', 'bg-blue-400', 'bg-green-500', 'bg-yellow-400', 'bg-blue-500'][i % 5]}`}
                        className="h-1.5 rounded-lg"
                      />
                    </div>
                  )
                })
              )
            })}
          </div> :
          <Spinner name="ProgressBar" width={36} height={36} />
        }
      </CardBody>
    </Card>
  )
}