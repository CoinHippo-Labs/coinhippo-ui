import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import { Card, CardBody, CardFooter, Tooltip } from '@material-tailwind/react'
import _ from 'lodash'

import Spinner from '../spinner'
import NumberDisplay from '../number'
import { toArray } from '../../lib/utils'

const METRICS = ['exchanges', 'open_interest_usd', 'open_interest_btc', 'volume']

export default ({ data }) => {
  const { rates } = useSelector(state => ({ rates: state.rates }), shallowEqual)
  const { rates_data } = { ...rates }

  const router = useRouter()
  const { query } = { ...router }
  const { type } = { ...query }

  const render = id => {
    const valueClassName = 'text-black dark:text-white text-3xl lg:text-2xl 2xl:text-3xl font-semibold'
    const titleClassName = 'whitespace-nowrap text-blue-400 dark:text-blue-500 text-base'

    let title
    let loading
    let tooltip
    let component

    switch (id) {
      case 'exchanges':
        title = 'Exchanges'
        loading = !data
        tooltip = 'Number of exchanges'
        component = (
          <div>
            <NumberDisplay
              value={data.length}
              format="0,0"
              className={valueClassName}
            />
          </div>
        )
        break
      case 'open_interest_usd':
        title = 'Open Interest 24h (USD)'
        loading = !data
        tooltip = 'Total 24h open interest in USD'
        component = (
          <div>
            <NumberDisplay
              value={_.sumBy(toArray(data).filter(d => d.open_interest_btc > 0), 'open_interest_btc') * (rates_data ? rates_data.usd?.value / rates_data.btc?.value : 1)}
              format="0,0"
              prefix={rates_data && '$'}
              suffix={!rates_data ? ' BTC' : ''}
              noTooltip={true}
              className={valueClassName}
            />
          </div>
        )
        break
      case 'open_interest_btc':
        title = 'Open Interest 24h (BTC)'
        loading = !data
        tooltip = 'Total 24h open interest in BTC'
        component = (
          <div>
            <NumberDisplay
              value={_.sumBy(toArray(data).filter(d => d.open_interest_btc > 0), 'open_interest_btc')}
              format="0,0"
              suffix=" BTC"
              noTooltip={true}
              className={valueClassName}
            />
          </div>
        )
        break
      case 'volume':
        title = 'Volume 24h'
        loading = !data
        tooltip = 'Total 24h volume in USD'
        component = (
          <div>
            <NumberDisplay
              value={_.sumBy(toArray(data).filter(d => d.trade_volume_24h_btc > 0), 'trade_volume_24h_btc') * (rates_data ? rates_data.usd?.value / rates_data.btc?.value : 1)}
              format="0,0"
              prefix={rates_data && '$'}
              suffix={!rates_data ? ' BTC' : ''}
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
      <Card key={id} className="card">
        <CardBody className="mt-0.5 pt-4 2xl:pt-6 pb-1 2xl:pb-2 px-4 2xl:px-6">
          {!loading ?
            tooltip ?
              <Tooltip placement="top-start" content={tooltip}>
                {component}
              </Tooltip> :
              component :
            <Spinner name="ProgressBar" width={36} height={36} />
          }
        </CardBody>
        <CardFooter className="card-footer pb-4 2xl:pb-6 px-4 2xl:px-6">
          <span className={titleClassName}>
            {title}
          </span>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.filter(m => type === 'derivatives' || !['open_interest_usd', 'open_interest_btc'].includes(m)).map(m => render(m))}
    </div>
  )
}