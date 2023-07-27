import { Card, CardBody, CardFooter, Tooltip } from '@material-tailwind/react'
import _ from 'lodash'

import Spinner from '../spinner'
import NumberDisplay from '../number'

const METRICS = ['contracts', 'open_interest', 'volume']

export default ({ data }) => {
  const render = id => {
    const valueClassName = 'text-black dark:text-white text-3xl lg:text-2xl 2xl:text-3xl font-semibold'
    const titleClassName = 'whitespace-nowrap text-blue-400 dark:text-blue-500 text-base'

    let title
    let loading
    let tooltip
    let component

    switch (id) {
      case 'contracts':
        title = 'Contracts'
        loading = !data
        tooltip = 'Number of derivatives contracts'
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
      case 'open_interest':
        title = 'Open Interest 24h'
        loading = !data
        tooltip = 'Total 24h open interest in USD'
        component = (
          <div>
            <NumberDisplay
              value={_.sumBy(data.filter(d => d.open_interest > 0), 'open_interest')}
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
              value={_.sumBy(data.filter(d => d.volume_24h > 0), 'volume_24h')}
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
    <div className="grid grid-cols-3 gap-4">
      {METRICS.map(m => render(m))}
    </div>
  )
}