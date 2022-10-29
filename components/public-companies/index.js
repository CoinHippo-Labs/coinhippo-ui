import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'

import Summary from './summary'
import Image from '../image'
import Datatable from '../datatable'
import { ProgressBar } from '../progress-bars'
import { public_companies } from '../../lib/api/coingecko'
import { currency_symbol } from '../../lib/object/currency'
import { number_format, equals_ignore_case, loader_color } from '../../lib/utils'

export default () => {
  const { preferences, cryptos } = useSelector(state => ({ preferences: state.preferences, cryptos: state.cryptos }), shallowEqual)
  const { theme } = { ...preferences }
  const { cryptos_data } = { ...cryptos }

  const router = useRouter()
  const { pathname, query } = { ...router }
  const { token_id } = { ...query }

  const [data, setData] = useState(null)

  useEffect(() => {
    if (pathname === '/public-companies') {
      router.push(`${pathname}/bitcoin`)
    }
  }, [pathname])

  useEffect(() => {
    const getData = async () => {
      if (token_id) {
        const response = await public_companies(token_id)
        setData(response || [])
      }
    }
    getData()
  }, [token_id])

  const token_data = cryptos_data?.coins?.find(t => equals_ignore_case(t?.id, token_id))

  return (
    <div className="space-y-2 my-4 mx-2">
      <div className="flex items-center justify-between sm:justify-start space-x-4">
        <h1 className="text-xl font-bold">
          Public Companies
        </h1>
        {token_data && (
          <div className="flex items-center space-x-2">
            {token_data.large && (
              <Image
                src={token_data.large}
                alt=""
                width={32}
                height={32}
              />
            )}
            <span className="text-lg font-semibold">
              {token_data.name}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-5">
        <Summary data={data} />
        {data ?
          <Datatable
            columns={[
              {
                Header: '#',
                accessor: 'i',
                disableSortBy: true,
                Cell: props => (
                  <span className="font-mono font-semibold">
                    {number_format((props.flatRows?.indexOf(props.row) > -1 ?
                      props.flatRows.indexOf(props.row) : props.value
                    ) + 1, '0,0')}
                  </span>
                ),
              },
              {
                Header: 'Company',
                accessor: 'name',
                disableSortBy: true,
                Cell: props => (
                  <div className="flex flex-col items-start space-y-1 -mt-0.5 mb-2">
                    <span className="font-bold">
                      {props.value}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-500 dark:bg-blue-600 rounded-lg text-white font-semibold py-0.5 px-2">
                        {props.row.original.country}
                      </div>
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                        {props.row.original.symbol}
                      </span>
                    </div>
                  </div>
                ),
              },
              {
                Header: 'Total Holdings',
                accessor: 'total_holdings',
                disableSortBy: true,
                Cell: props => (
                  <div className="flex items-center justify-start sm:justify-end text-left sm:text-right space-x-1.5">
                    <span className="font-bold">
                      {number_format(props.value, '0,0')}
                    </span>
                    {token_data?.symbol && (
                      <span className="uppercase font-bold">
                        {token_data.symbol}
                      </span>
                    )}
                  </div>
                ),
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: 'Entry Value (USD)',
                accessor: 'total_entry_value_usd',
                disableSortBy: true,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <span className="font-semibold">
                      {currency_symbol}
                      {props.value ? number_format(props.value, '0,0') : '-'}
                    </span>
                    <span className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-bold space-x-1">
                      {props.value && props.row.original.total_holdings ?
                        <>
                          <span>
                            ~
                          </span>
                          <span>
                            {currency_symbol}
                            {number_format(props.value / props.row.original.total_holdings, '0,0')}
                          </span>
                          {token_data?.symbol && (
                            <span className="uppercase">
                              / {token_data.symbol}
                            </span>
                          )}
                        </>
                        :
                        <span>
                          -
                        </span>
                      }
                    </span>
                  </div>
                ),
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: 'Current Value (USD)',
                accessor: 'total_current_value_usd',
                disableSortBy: true,
                Cell: props => (
                  <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                    <span className="font-semibold">
                      {currency_symbol}
                      {props.value ? number_format(props.value, '0,0') : '-'}
                    </span>
                    <span className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-bold space-x-1">
                      {props.value && props.row.original.total_entry_value_usd ?
                        <span className={`${props.value > props.row.original.total_entry_value_usd ? 'text-green-400 dark:text-green-600' : props.value < props.row.original.total_entry_value_usd ? 'text-red-400 dark:text-red-600' : 'text-slate-400 dark:text-slate-500'}`}>
                          {number_format((props.value - props.row.original.total_entry_value_usd) * 100 / props.row.original.total_entry_value_usd, '+0,0.00')}%
                        </span>
                        :
                        <span>
                          -
                        </span>
                      }
                    </span>
                  </div>
                ),
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: '% of Total Supply',
                accessor: 'percentage_of_total_supply',
                disableSortBy: true,
                Cell: props => (
                  <div className="flex flex-col space-y-2.5">
                    <span className="font-semibold">
                      {props.value ? number_format(props.value, '0,0.000') : '-'}%
                    </span>
                    <ProgressBar
                      width={props.value * 100 / (data.market_cap_dominance || _.sumBy(data.companies, 'percentage_of_total_supply'))}
                      color="bg-yellow-500"
                      className="h-1.5 rounded-lg"
                    />
                  </div>
                ),
                headerClassName: 'whitespace-nowrap',
              }
            ]}
            data={data.companies || []}
            noPagination={data.companies?.length <= 10}
            defaultPageSize={10}
            className="no-border striped"
          /> :
          <TailSpin
            color={loader_color(theme)}
            width="32"
            height="32"
          />
        }
      </div>
    </div>
  )
}