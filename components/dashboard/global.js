import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import { Card, CardBody, CardFooter, Tooltip } from '@material-tailwind/react'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { FaBitcoin } from 'react-icons/fa'

import Spinner from '../spinner'
import NumberDisplay from '../number'
import { toArray } from '../../lib/utils'

const METRICS = ['bitcoin', 'cryptos', 'exchanges', 'market_cap', 'volume']

export default ({ bitcoin }) => {
  const { cryptos, _global } = useSelector(state => ({ cryptos: state.cryptos, _global: state.global }), shallowEqual)
  const { cryptos_data } = { ...cryptos }
  const { global_data } = { ..._global }

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }

  const { exchanges } = { ...cryptos_data }
  const { active_cryptocurrencies, market_cap_change_percentage_24h_usd, total_market_cap, total_volume } = { ...global_data }

  const render = id => {
    const valueClassName = 'text-black dark:text-white text-lg font-semibold'
    const titleClassName = 'whitespace-nowrap text-blue-400 dark:text-blue-500 text-base'

    let title
    let url
    let loading
    let tooltip
    let component
    let change
    let textColor

    switch (id) {
      case 'bitcoin':
        title = (
          <div className="flex items-center space-x-2">
            <FaBitcoin size={24} className="text-yellow-500" />
            <span>Bitcoin</span>
          </div>
        )
        url = '/token/bitcoin'
        loading = !bitcoin
        change = bitcoin?.usd_24h_change
        textColor = change < 0 ? 'text-red-500 dark:text-red-400' : change > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'
        component = (
          <div className={`flex items-center ${textColor} space-x-1`}>
            <NumberDisplay
              value={bitcoin?.usd}
              format="0,0"
              prefix="$"
              noTooltip={true}
              className={`${valueClassName} ${textColor}`}
            />
            {change !== 0 && (change < 0 ? <FiArrowDown size={16} /> : <FiArrowUp size={16} />)}
          </div>
        )
        break
      case 'cryptos':
        title = 'Cryptos'
        url = '/tokens'
        loading = !global_data
        component = (
          <div>
            <NumberDisplay
              value={active_cryptocurrencies}
              format="0,0"
              className={valueClassName}
            />
          </div>
        )
        break
      case 'exchanges':
        title = 'Exchanges'
        url = '/exchanges'
        loading = !exchanges
        component = (
          <div>
            <NumberDisplay
              value={toArray(exchanges).length}
              format="0,0"
              className={valueClassName}
            />
          </div>
        )
        break
      case 'market_cap':
        title = 'Market Cap'
        url = '/tokens'
        loading = !global_data
        change = market_cap_change_percentage_24h_usd
        textColor = change < 0 ? 'text-red-500 dark:text-red-400' : change > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'
        component = (
          <div className="flex items-center space-x-2">
            <NumberDisplay
              value={total_market_cap?.usd}
              format="0,0"
              prefix="$"
              noTooltip={true}
              className={valueClassName}
            />
            <div className={`flex items-center ${textColor} space-x-1`}>
              <NumberDisplay
                value={change}
                format="0,0.00"
                maxDecimals={2}
                prefix={change < 0 ? '' : '+'}
                suffix="%"
                noTooltip={true}
                className={`${valueClassName} ${textColor} text-xs`}
              />
              {change !== 0 && (change < 0 ? <FiArrowDown size={14} /> : <FiArrowUp size={14} />)}
            </div>
          </div>
        )
        break
      case 'volume':
        title = 'Volume 24h'
        url = '/tokens/high-volume'
        loading = !global_data
        component = (
          <div>
            <NumberDisplay
              value={total_volume?.usd}
              format="0,0"
              prefix="$"
              noTooltip={true}
              className={valueClassName}
            />
          </div>
        )
        break
      default:
        break
    }

    return (
      <Link key={id} href={url}>
        <Card className="card">
          <CardBody className="mt-0.5 pt-4 2xl:pt-6 pb-1 2xl:pb-2 px-4 2xl:px-6">
            {!loading ?
              tooltip ?
                <Tooltip placement="top-start" content={tooltip}>
                  {component}
                </Tooltip> :
                component :
              <Spinner name="ProgressBar" width={28} height={28} />
            }
          </CardBody>
          <CardFooter className="card-footer pb-4 2xl:pb-6 px-4 2xl:px-6">
            <span className={titleClassName}>
              {title}
            </span>
          </CardFooter>
        </Card>
      </Link>
    )
  }

  return !widget && (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {METRICS.map(m => render(m))}
    </div>
  )
}