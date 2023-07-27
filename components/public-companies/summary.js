import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import { Card, CardBody, CardFooter, Tooltip } from '@material-tailwind/react'
import _ from 'lodash'

import Spinner from '../spinner'
import NumberDisplay from '../number'
import { toArray, equalsIgnoreCase } from '../../lib/utils'

const METRICS = ['companies', 'total_holdings', 'total_value', 'dominance']

export default ({ data }) => {
  const { cryptos } = useSelector(state => ({ cryptos: state.cryptos }), shallowEqual)
  const { cryptos_data } = { ...cryptos }

  const router = useRouter()
  const { query } = { ...router }
  const { id } = { ...query }

  const { coins } = { ...cryptos_data }
  const { symbol } = { ...toArray(coins).find(d => equalsIgnoreCase(d.id, id)) }
  const { total_holdings, total_value_usd, market_cap_dominance } = { ...data }
  let { companies } = { ...data }
  companies = toArray(companies)

  const render = id => {
    const valueClassName = 'text-black dark:text-white text-3xl lg:text-2xl 2xl:text-3xl font-semibold'
    const titleClassName = 'whitespace-nowrap text-blue-400 dark:text-blue-500 text-base'

    let title
    let loading
    let tooltip
    let component

    switch (id) {
      case 'companies':
        title = 'Companies'
        loading = !data
        tooltip = 'Number of companies'
        component = (
          <div>
            <NumberDisplay
              value={companies.length}
              format="0,0"
              className={valueClassName}
            />
          </div>
        )
        break
      case 'total_holdings':
        title = 'Total Holdings'
        loading = !data
        tooltip = symbol
        component = (
          <div>
            <NumberDisplay
              value={total_holdings}
              format="0,0"
              noTooltip={true}
              className={valueClassName}
            />
          </div>
        )
        break
      case 'total_value':
        title = 'Total Value'
        loading = !data
        tooltip = 'Total value in USD'
        component = (
          <div>
            <NumberDisplay
              value={total_value_usd}
              format="0,0"
              prefix="$"
              noTooltip={true}
              className={valueClassName}
            />
          </div>
        )
        break
      case 'dominance':
        title = 'Dominance'
        loading = !data
        tooltip = 'Dominance from total supply'
        component = (
          <div>
            <NumberDisplay
              value={(market_cap_dominance || _.sumBy(companies, 'percentage_of_total_supply')) * 100}
              format="0,0.00"
              suffix="%"
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
      {METRICS.map(m => render(m))}
    </div>
  )
}