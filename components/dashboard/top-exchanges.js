import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Card, CardBody } from '@material-tailwind/react'
import _ from 'lodash'

import Spinner from '../spinner'
import Image from '../image'
import NumberDisplay from '../number'
import Datatable from '../datatable'
import { getExchanges } from '../../lib/api/coingecko'
import { toArray, getTitle } from '../../lib/utils'

const PAGE_SIZE = 10

export default ({ exchange_type, title, icon }) => {
  const { rates } = useSelector(state => ({ rates: state.rates }), shallowEqual)
  const { rates_data } = { ...rates }

  const [data, setData] = useState(null)

  useEffect(
    () => {
      const getData = async () => {
        let data
        for (let i = 0; i < 10; i++) {
          const response = await getExchanges({ per_page: 100, page: i + 1 })
          data = _.orderBy(
            _.uniqBy(toArray(_.concat(data, response)), 'id').filter(d => !exchange_type || d.exchange_type === exchange_type || (d.exchange_type === 'decentralized' && exchange_type === 'dex')).map(d => {
              const { trade_volume_24h_btc, trust_score, open_interest_btc } = { ...d }
              return {
                ...d,
                trade_volume_24h_btc: ['number', 'string'].includes(typeof trade_volume_24h_btc) ? Number(trade_volume_24h_btc) : -1,
                trust_score: ['number', 'string'].includes(typeof trust_score) ? Number(trust_score) : -1,
                open_interest_btc: ['number', 'string'].includes(typeof open_interest_btc) ? Number(open_interest_btc) : -1,
              }
            }),
            [exchange_type ? 'trade_volume_24h_btc' : 'trust_score'], ['desc'],
          )
          data = data.map(d => {
            const { trade_volume_24h_btc } = { ...d }
            return {
              ...d,
              market_share: trade_volume_24h_btc > -1 ? trade_volume_24h_btc / _.sumBy(data.filter(_d => _d.trade_volume_24h_btc > 0), 'trade_volume_24h_btc') : -1,
            }
          })
          if (response.length < 100 || !exchange_type) {
            break
          }
        }
        setData(_.slice(toArray(data), 0, PAGE_SIZE))
      }

      getData()
      const interval = setInterval(() => getData(), 3 * 60 * 1000)
      return () => clearInterval(interval)
    },
    [],
  )

  return (
    <Card className="card">
      <CardBody className="space-y-3 pt-4 2xl:pt-6 pb-3 2xl:pb-5 px-4 2xl:px-6">
        <div className="flex items-center justify-between space-x-2">
          <Link
            href={`/exchanges${exchange_type ? `/${exchange_type}` : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <span className="whitespace-nowrap uppercase text-blue-400 dark:text-blue-500 text-base">
              {title || getTitle(exchange_type)}
            </span>
          </Link>
          {icon}
        </div>
        {data ?
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
                Header: 'Exchange',
                accessor: 'name',
                sortType: (a, b) => a.original.name > b.original.name ? 1 : -1,
                Cell: props => {
                  const { value, row } = { ...props }
                  const { id, image } = { ...row.original }
                  return (
                    <Link
                      href={`/exchange${id ? `/${id}` : 's'}`}
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
                        </span>
                      </div>
                    </Link>
                  )
                },
              },
              {
                Header: 'Volume 24h',
                accessor: 'trade_volume_24h_btc',
                sortType: (a, b) => a.original.trade_volume_24h_btc > b.original.trade_volume_24h_btc ? 1 : -1,
                Cell: props => {
                  const { value } = { ...props }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                      {value > -1 && (
                        <>
                          <NumberDisplay
                            value={value * (rates_data ? rates_data.usd?.value / rates_data.btc?.value : 1)}
                            format="0,0"
                            prefix={rates_data && '$'}
                            suffix={!rates_data ? ' BTC' : ''}
                            noTooltip={true}
                            className="whitespace-nowrap text-black dark:text-white font-semibold"
                          />
                          {rates_data && (
                            <NumberDisplay
                              value={value}
                              format="0,0"
                              suffix=" BTC"
                              noTooltip={true}
                              className="whitespace-nowrap text-slate-400 dark:text-slate-500 text-sm font-semibold"
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
                Header: 'Action',
                accessor: 'url',
                disableSortBy: true,
                Cell: props => {
                  const { value, row } = { ...props }
                  const { id } = { ...row.original }
                  return (
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
                      {value ?
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-w-max bg-blue-400 dark:bg-blue-500 shadow-lg rounded-lg uppercase text-white text-xs font-bold py-1.5 px-2"
                        >
                          Trade
                        </a> :
                        <Link
                          href={`/exchange${id ? `/${id}` : 's'}`}
                          className="min-w-max bg-slate-50 dark:bg-black rounded-lg text-xs font-semibold py-1.5 px-2"
                        >
                          See More
                        </Link>
                      }
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