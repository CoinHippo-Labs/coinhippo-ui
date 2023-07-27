import { useSelector, shallowEqual } from 'react-redux'
import { Card, CardBody, CardFooter, Tooltip } from '@material-tailwind/react'
import _ from 'lodash'

import Categories from './categories'
import Spinner from '../spinner'
import NumberDisplay from '../number'
import { toArray } from '../../lib/utils'

const METRICS = ['tokens', 'market_cap', 'volume', 'category']

export default ({ data }) => {
  const { cryptos } = useSelector(state => ({ cryptos: state.cryptos }), shallowEqual)
  const { cryptos_data } = { ...cryptos }

  const render = id => {
    const valueClassName = 'text-black dark:text-white text-3xl lg:text-2xl 2xl:text-3xl font-semibold'
    const titleClassName = 'whitespace-nowrap text-blue-400 dark:text-blue-500 text-base'

    let title
    let loading
    let tooltip
    let component

    switch (id) {
      case 'tokens':
        title = 'Tokens'
        loading = !data
        tooltip = 'Number of tokens'
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
      case 'market_cap':
        title = 'Market Cap'
        loading = !data
        tooltip = 'Total market cap in USD'
        component = (
          <div>
            <NumberDisplay
              value={_.sumBy(toArray(data).filter(d => d.market_cap > 0), 'market_cap')}
              format="0,0"
              prefix="$"
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
              value={_.sumBy(toArray(data).filter(d => d.volume_24h > 0), 'volume_24h')}
              format="0,0"
              prefix="$"
              noTooltip={true}
              className={valueClassName}
            />
          </div>
        )
        break
      case 'category':
        title = 'Select category'
        loading = !categories
        component = <Categories />
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

  const { categories } = { ...cryptos_data }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map(m => render(m))}
    </div>
  )
}