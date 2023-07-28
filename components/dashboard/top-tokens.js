import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Card, CardBody } from '@material-tailwind/react'
import _ from 'lodash'

import Spinner from '../spinner'
import Image from '../image'
import NumberDisplay from '../number'
import Datatable from '../datatable'
import { getTokensMarkets } from '../../lib/api/coingecko'
import { toArray, getTitle } from '../../lib/utils'

const PAGE_SIZE = 10

export default ({ category, title, icon }) => {
  const [data, setData] = useState(null)

  useEffect(
    () => {
      const getData = async () => {
        const response = await getTokensMarkets({ vs_currency: 'usd', category, order: 'market_cap_desc', per_page: PAGE_SIZE, page: 1, price_change_percentage: '24h,7d,30d' })
        setData(
          _.slice(
            _.orderBy(_.uniqBy(toArray(response), 'id'), ['market_cap_rank'], ['asc']).map(d => {
              const { market_cap_rank, current_price, price_change_percentage_24h_in_currency, price_change_percentage_7d_in_currency, price_change_percentage_30d_in_currency, roi, atl, market_cap, fully_diluted_valuation, total_volume, circulating_supply, total_supply, max_supply } = { ...d }
              return {
                ...d,
                market_cap_rank: ['number', 'string'].includes(typeof market_cap_rank) ? Number(market_cap_rank) : Number.MAX_SAFE_INTEGER,
                current_price: ['number', 'string'].includes(typeof current_price) ? Number(current_price) : -1,
                price_change_percentage_24h_in_currency: ['number', 'string'].includes(typeof price_change_percentage_24h_in_currency) ? Number(price_change_percentage_24h_in_currency) : Number.MIN_SAFE_INTEGER,
                price_change_percentage_7d_in_currency: ['number', 'string'].includes(typeof price_change_percentage_7d_in_currency) ? Number(price_change_percentage_7d_in_currency) : Number.MIN_SAFE_INTEGER,
                price_change_percentage_30d_in_currency: ['number', 'string'].includes(typeof price_change_percentage_30d_in_currency) ? Number(price_change_percentage_30d_in_currency) : Number.MIN_SAFE_INTEGER,
                roi: {
                  ...roi,
                  times: roi ? roi.times : atl > 0 ? (current_price - atl) / atl : null,
                  currency: roi?.currency ? roi.currency : 'usd',
                  percentage: roi ? roi.percentage : atl > 0 ? (current_price - atl) * 100 / atl : null,
                  from: !roi ? 'atl' : null,
                },
                market_cap: ['number', 'string'].includes(typeof market_cap) ? Number(market_cap) : -1,
                fully_diluted_valuation: ['number', 'string'].includes(typeof fully_diluted_valuation) ? Number(fully_diluted_valuation) : (current_price * (max_supply || total_supply || circulating_supply)) || -1,
                circulating_supply: ['number', 'string'].includes(typeof circulating_supply) ? Number(circulating_supply) : -1,
                total_volume: ['number', 'string'].includes(typeof total_volume) ? Number(total_volume) : -1,
              }
            }),
            0, PAGE_SIZE,
          )
        )
      }

      getData()
      const interval = setInterval(() => getData(), 3 * 60 * 1000)
      return () => clearInterval(interval)
    },
    [category],
  )

  return (
    <Card className="card">
      <CardBody className="space-y-3 pt-4 2xl:pt-6 pb-3 2xl:pb-5 px-4 2xl:px-6">
        <div className="flex items-center justify-between space-x-2">
          <Link
            href={`/tokens${category ? `/${category}` : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <span className="whitespace-nowrap uppercase text-blue-400 dark:text-blue-500 text-base">
              {title || getTitle(category)}
            </span>
          </Link>
          {icon}
        </div>
        {data ?
          <Datatable
            columns={[
              {
                Header: '#',
                accessor: 'market_cap_rank',
                sortType: (a, b) => a.original.market_cap_rank > b.original.market_cap_rank ? 1 : -1,
                Cell: props => {
                  const { value } = { ...props }
                  return (
                    value < Number.MAX_SAFE_INTEGER ?
                      <NumberDisplay value={value} className="text-black dark:text-white font-medium" /> :
                      <span className="text-black dark:text-white font-medium">
                        -
                      </span>
                  )
                },
              },
              {
                Header: 'Token',
                accessor: 'name',
                sortType: (a, b) => a.original.name > b.original.name ? 1 : -1,
                Cell: props => {
                  const { value, row } = { ...props }
                  const { id, symbol, image } = { ...row.original }
                  return (
                    <Link
                      href={`/token${id ? `/${id}` : 's'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col mb-6"
                    >
                      <div className="token-column flex items-center space-x-2">
                        {image && (
                          <Image
                            src={image}
                            width={24}
                            height={24}
                          />
                        )}
                        <span className="flex items-start space-x-2">
                          <span className="whitespace-pre-wrap text-blue-400 dark:text-blue-500 text-xs font-bold">
                            {value}
                          </span>
                          {symbol && (
                            <span className={`${symbol.length > 6 ? 'break-all' : ''} uppercase text-slate-400 dark:text-slate-500 text-xs font-semibold`}>
                              {symbol}
                            </span>
                          )}
                        </span>
                      </div>
                    </Link>
                  )
                },
              },
              {
                Header: 'Price',
                accessor: 'current_price',
                sortType: (a, b) => a.original.price_change_percentage_24h_in_currency > b.original.price_change_percentage_24h_in_currency ? 1 : -1,
                Cell: props => {
                  const { value, row } = { ...props }
                  const { price_change_percentage_24h_in_currency } = { ...row.original }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      {value > -1 && (
                        <>
                          <NumberDisplay
                            value={value}
                            format="0,0.00000000"
                            prefix="$"
                            noTooltip={true}
                            className="whitespace-nowrap text-black dark:text-white text-xs font-semibold"
                          />
                          {value > Number.MIN_SAFE_INTEGER && (
                            <NumberDisplay
                              value={price_change_percentage_24h_in_currency}
                              format="0,0.00"
                              maxDecimals={2}
                              prefix={price_change_percentage_24h_in_currency < 0 ? '' : '+'}
                              suffix="%"
                              noTooltip={true}
                              className={`whitespace-nowrap ${price_change_percentage_24h_in_currency < 0 ? 'text-red-500 dark:text-red-400' : price_change_percentage_24h_in_currency > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} text-xs font-medium`}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )
                },
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
              {
                Header: 'Market Cap',
                accessor: 'market_cap',
                sortType: (a, b) => a.original.market_cap > b.original.market_cap ? 1 : -1,
                Cell: props => {
                  const { value } = { ...props }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      {value > -1 && (
                        <NumberDisplay
                          value={value}
                          format="0,0"
                          prefix="$"
                          noTooltip={true}
                          className="whitespace-nowrap text-black dark:text-white text-xs font-semibold"
                        />
                      )}
                    </div>
                  )
                },
                headerClassName: 'whitespace-nowrap justify-start sm:justify-end text-left sm:text-right',
              },
            ]}
            data={data}
            defaultPageSize={PAGE_SIZE}
            noPagination={data.length <= 10}
            className="no-border no-shadow striped"
          /> :
          <Spinner name="ProgressBar" width={36} height={36} />
        }
      </CardBody>
    </Card>
  )
}