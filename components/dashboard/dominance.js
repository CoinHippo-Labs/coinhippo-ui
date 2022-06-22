import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import Image from '../image'
import { ProgressBar } from '../progress-bars'
import { AiOutlinePieChart } from 'react-icons/ai'
import { BiPieChartAlt } from 'react-icons/bi'
import _ from 'lodash'
import { number_format } from '../../lib/utils'

export default ({ noBorder }) => {
  const { tokens, status } = useSelector(state => ({ tokens: state.tokens, status: state.status }), shallowEqual)
  const { cryptos_data } = { ...tokens }
  const { status_data } = { ...status }

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }

  const isWidget = ['dominance'].includes(widget)

  return (
    <div
      title={<span className="uppercase flex items-center">
        Dominance
        <AiOutlinePieChart size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
      </span>}
      description={<div className="mt-3.5">
        {status_data && cryptos_data ?
          [...Array(1).keys()].map(index => {
            const dominancesData = _.slice(_.orderBy(Object.keys(status_data.market_cap_percentage).map(symbol => {
              return {
                symbol,
                color: symbol === 'bnb' ? 'bg-yellow-400' : symbol === 'usdt' ? 'bg-green-500' : undefined,
                dominance: status_data.market_cap_percentage[symbol],
                ...(cryptos_data.coins[cryptos_data.coins.findIndex((coinData, i) => i < 25 && coinData.symbol && coinData.symbol.toLowerCase() === symbol)])
              }
            }), ['dominance'], ['desc']), 0, 5)

            dominancesData.push({ name: 'Others', dominance: 100 - _.sumBy(dominancesData, 'dominance') })

            return dominancesData.map((coinData, i) => (
              <div key={i} className={`mt-${i > 0 ? 2 : 0}`}>
                <div className="flex items-center">
                  <Link href={`/token${coinData ? `/${coinData.id}` : 's'}`}>
                    <a target={isWidget ? '_blank' : '_self'} rel={isWidget ? 'noopener noreferrer' : ''} className="flex items-center space-x-2">
                      {!coinData.large && coinData.name === 'Others' ?
                        <BiPieChartAlt size={24} className="stroke-current text-gray-400" />
                        :
                        <Image
                          src={coinData.large}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded"
                        />
                      }
                      <div>
                        <span className="text-gray-900 dark:text-gray-100">{coinData.name}</span>
                        <span className="text-gray-400 font-normal ml-1.5">{coinData.symbol}</span>
                      </div>
                    </a>
                  </Link>
                  <span className="text-gray-500 dark:text-gray-300 text-xs font-normal ml-auto">
                    {number_format(coinData.dominance / 100, '0,0.00%')}
                  </span>
                </div>
                <div className="mt-1">
                  <ProgressBar width={coinData.dominance} color={`${coinData.color || ['bg-yellow-500', 'bg-blue-400', 'bg-green-500', 'bg-yellow-400', 'bg-indigo-500'][i % 5]} rounded`} />
                </div>
              </div>
            ))
          })
          :
          [...Array(6).keys()].map(i => (
            <div key={i} className={`mt-${i > 0 ? 2 : 0}`}>
              <div className="flex items-center">
                <div className="skeleton w-6 h-6 rounded mr-2.5" />
                <div className="skeleton w-16 h-3 rounded" />
                <span className="ml-auto">
                  <div className="skeleton w-8 h-3.5 rounded" />
                </span>
              </div>
              <div className={`skeleton w-${5 - i || 3}/12 h-1 rounded mt-1`} />
            </div>
          ))
        }
      </div>}
      className={`${noBorder ? 'border-0' : ''}`}
    />
  )
}