import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Chip } from '@material-tailwind/react'
import _ from 'lodash'

import Summary from './summary'
import Spinner from '../spinner'
import Image from '../image'
import NumberDisplay from '../number'
import Datatable from '../datatable'
import { ProgressBar } from '../progress-bars'
import { getPublicCompanies } from '../../lib/api/coingecko'
import { toArray, equalsIgnoreCase } from '../../lib/utils'

const PAGE_SIZE = 10

export default () => {
  const { cryptos } = useSelector(state => ({ cryptos: state.cryptos }), shallowEqual)
  const { cryptos_data } = { ...cryptos }

  const router = useRouter()
  const { pathname, query } = { ...router }
  const { id } = { ...query }

  const [data, setData] = useState(null)

  useEffect(
    () => {
      if (pathname === '/public-companies') {
        router.push(`${pathname}/bitcoin`)
      }
    },
    [pathname],
  )

  useEffect(
    () => {
      const getData = async () => {
        if (id) {
          setData(await getPublicCompanies(id))
        }
      }
      getData()
    },
    [id],
  )

  const { coins } = { ...cryptos_data }
  const token_data = toArray(coins).find(d => equalsIgnoreCase(d.id, id))
  const { name, symbol, large } = { ...token_data }
  const { market_cap_dominance } = { ...data }
  let { companies } = { ...data }
  companies = toArray(companies)

  return (
    <div className="children">
      {data ?
        <div className="space-y-2 sm:space-y-4 mt-4 sm:mt-6 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 space-x-0 sm:space-x-3 px-3">
            <div className="space-y-0.5">
              <div className="text-lg font-bold">
                Public Companies
              </div>
              {token_data && (
                <div className="flex items-center space-x-2">
                  {large && (
                    <Image
                      src={large}
                      width={32}
                      height={32}
                    />
                  )}
                  <span className="text-lg font-semibold">
                    {name}
                  </span>
                </div>
              )}
            </div>
          </div>
          <Summary data={data} />
          <div className="px-3">
            <Datatable
              columns={[
                {
                  Header: '#',
                  accessor: 'i',
                  disableSortBy: true,
                  Cell: props => (
                    <span className="text-black dark:text-white font-medium">
                      {props.flatRows?.indexOf(props.row) + 1}
                    </span>
                  ),
                },
                {
                  Header: 'Company',
                  accessor: 'name',
                  disableSortBy: true,
                  Cell: props => {
                    const { value, row } = { ...props }
                    const { symbol, country } = { ...row.original }
                    return (
                      <div className="flex flex-col mb-6">
                        <span className="font-bold">
                          {value}
                        </span>
                        {(country || symbol) && (
                          <div className="flex items-center space-x-2">
                            {country && (
                              <Chip
                                color="blue"
                                value={country}
                                className="chip text-xs font-medium py-1 px-2.5"
                              />
                            )}
                            {symbol && (
                              <Chip
                                color="teal"
                                value={symbol}
                                className="chip text-xs font-medium py-1 px-2.5"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )
                  },
                },
                {
                  Header: 'Total Holdings',
                  accessor: 'total_holdings',
                  disableSortBy: true,
                  Cell: props => {
                    const { value } = { ...props }
                    return (
                      <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                        <NumberDisplay
                          value={value}
                          format="0,0"
                          suffix={symbol ? ` ${symbol.toUpperCase()}` : ''}
                          noTooltip={true}
                          className="font-bold"
                        />
                      </div>
                    )
                  },
                  headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                },
                {
                  Header: 'Entry Value (USD)',
                  accessor: 'total_entry_value_usd',
                  disableSortBy: true,
                  Cell: props => {
                    const { value, row } = { ...props }
                    const { total_holdings } = { ...row.original }
                    return (
                      <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                        <NumberDisplay
                          value={value}
                          format="0,0"
                          prefix="$"
                          noTooltip={true}
                          className="font-semibold"
                        />
                        {value > 0 && total_holdings > 0 && (
                          <NumberDisplay
                            value={value / total_holdings}
                            format="0,0"
                            prefix="~ $"
                            suffix={symbol ? ` / ${symbol.toUpperCase()}` : ''}
                            noTooltip={true}
                            className="whitespace-nowrap text-sm font-medium"
                          />
                        )}
                      </div>
                    )
                  },
                  headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                },
                {
                  Header: 'Current Value (USD)',
                  accessor: 'total_current_value_usd',
                  disableSortBy: true,
                  Cell: props => {
                    const { value, row } = { ...props }
                    const { total_entry_value_usd } = { ...row.original }
                    return (
                      <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                        <NumberDisplay
                          value={value}
                          format="0,0"
                          prefix="$"
                          noTooltip={true}
                          className="font-semibold"
                        />
                        {value > 0 && total_entry_value_usd > 0 && (
                          <NumberDisplay
                            value={(value - total_entry_value_usd) * 100 / total_entry_value_usd}
                            format="0,0.00"
                            maxDecimals={2}
                            prefix={value < total_entry_value_usd ? '' : '+'}
                            suffix="%"
                            noTooltip={true}
                            className={`whitespace-nowrap ${value < total_entry_value_usd ? 'text-red-500 dark:text-red-400' : value > total_entry_value_usd ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} text-sm font-medium`}
                          />
                        )}
                      </div>
                    )
                  },
                  headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
                },
                {
                  Header: '% of Total Supply',
                  accessor: 'percentage_of_total_supply',
                  disableSortBy: true,
                  Cell: props => {
                    const { value } = { ...props }
                    return (
                      <div className="flex flex-col space-y-2">
                        <NumberDisplay
                          value={value}
                          format="0,0.00"
                          suffix="%"
                          noTooltip={true}
                        />
                        <ProgressBar
                          width={value * 100 / (market_cap_dominance || _.sumBy(companies, 'percentage_of_total_supply'))}
                          color="bg-yellow-500"
                          className="h-1.5 rounded-lg"
                        />
                      </div>
                    )
                  },
                  headerClassName: 'whitespace-nowrap',
                },
              ]}
              data={companies}
              defaultPageSize={PAGE_SIZE}
              noPagination={companies.length <= PAGE_SIZE}
              className="no-border no-shadow striped"
            />
          </div>
        </div> :
        <div className="loading">
          <Spinner name="Blocks" />
        </div>
      }
    </div>
  )
}