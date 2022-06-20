import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Datatable from '../datatable'
import Image from '../image'
import _ from 'lodash'
import { coinsMarkets } from '../../lib/api/coingecko'
import { currency, currency_btc } from '../../lib/object/currency'
import { getName, numberFormat } from '../../lib/utils'

const per_page = 10

export default function TopCoins({ category, title, icon, noBorder }) {
  const { rates } = useSelector(state => ({ rates: rates }), shallowEqual)
  const { rates_data } = { ...rates }

  const [coinsData, setCoinsData] = useState(null)

  useEffect(() => {
    const getCoins = async () => {
      let data

      const response = await coinsMarkets({
        vs_currency,
        category,
        order: 'market_cap_desc',
        per_page,
        page: 1,
        price_change_percentage: '24h,7d,30d',
      })

      if (Array.isArray(response)) {
        data = (
          _.orderBy(
            _.uniqBy(_.concat(data || [], response), 'id')
            .map(coinData => {
              return {
                ...coinData,
                market_cap_rank: typeof coinData.market_cap_rank === 'string' ? Number(coinData.market_cap_rank) : typeof coinData.market_cap_rank === 'number' ? coinData.market_cap_rank : Number.MAX_SAFE_INTEGER,
                current_price: typeof coinData.current_price === 'string' ? Number(coinData.current_price) : typeof coinData.current_price === 'number' ? coinData.current_price : -1,
                price_change_percentage_24h_in_currency: typeof coinData.price_change_percentage_24h_in_currency === 'string' ? Number(coinData.price_change_percentage_24h_in_currency) : typeof coinData.price_change_percentage_24h_in_currency === 'number' ? coinData.price_change_percentage_24h_in_currency : Number.MIN_SAFE_INTEGER,
                price_change_percentage_7d_in_currency: typeof coinData.price_change_percentage_7d_in_currency === 'string' ? Number(coinData.price_change_percentage_7d_in_currency) : typeof coinData.price_change_percentage_7d_in_currency === 'number' ? coinData.price_change_percentage_7d_in_currency : Number.MIN_SAFE_INTEGER,
                price_change_percentage_30d_in_currency: typeof coinData.price_change_percentage_30d_in_currency === 'string' ? Number(coinData.price_change_percentage_30d_in_currency) : typeof coinData.price_change_percentage_30d_in_currency === 'number' ? coinData.price_change_percentage_30d_in_currency : Number.MIN_SAFE_INTEGER,
                roi: {
                  ...coinData.roi,
                  times: coinData.roi ? coinData.roi.times : coinData.atl > 0 ? (coinData.current_price - coinData.atl) / coinData.atl : null,
                  currency: coinData.roi && coinData.roi.currency ? coinData.roi.currency : vs_currency,
                  percentage: coinData.roi ? coinData.roi.percentage : coinData.atl > 0 ? (coinData.current_price - coinData.atl) * 100 / coinData.atl : null,
                  from: !coinData.roi ? 'atl' : null,
                },
                market_cap: typeof coinData.market_cap === 'string' ? Number(coinData.market_cap) : typeof coinData.market_cap === 'number' ? coinData.market_cap : -1,
                fully_diluted_valuation: typeof coinData.fully_diluted_valuation === 'string' ? Number(coinData.fully_diluted_valuation) : typeof coinData.fully_diluted_valuation === 'number' ? coinData.fully_diluted_valuation : (coinData.current_price * (coinData.max_supply || coinData.total_supply || coinData.circulating_supply)) || -1,
                circulating_supply: typeof coinData.circulating_supply === 'string' ? Number(coinData.circulating_supply) : typeof coinData.circulating_supply === 'number' ? coinData.circulating_supply : -1,
                total_volume: typeof coinData.total_volume === 'string' ? Number(coinData.total_volume) : typeof coinData.total_volume === 'number' ? coinData.total_volume : -1,
              }
            }),
            ['market_cap_rank'], ['asc']
          )
        )

        if (data) {
          setCoinsData({ data: _.slice(data, 0, per_page), category, vs_currency })
        }
      }
    }

    getCoins()

    const interval = setInterval(() => getCoins(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [category, vs_currency])

  return (
    <div
      title={<span className="h-8 uppercase flex items-center">
        <Link href={`/tokens${category ? `/${category}` : ''}`}>
          <a className="font-semibold">{title || getName(category)}</a>
        </Link>
        {icon && (
          <div className="ml-auto">
            {icon}
          </div>
        )}
      </span>}
      description={<div className="mt-3.5">
        <Datatable
          columns={[
            {
              Header: '#',
              accessor: 'market_cap_rank',
              sortType: (rowA, rowB) => rowA.original.market_cap_rank > rowB.original.market_cap_rank ? 1 : -1,
              Cell: props => (
                <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                  {!props.row.original.skeleton ?
                    props.value < Number.MAX_SAFE_INTEGER ?
                      numberFormat(props.value, '0,0')
                      :
                      '-'
                    :
                    <div className="skeleton w-4 h-3 rounded" />
                  }
                </div>
              ),
              headerClassName: 'justify-center',
              className: 'nopadding-right-column'
            },
            {
              Header: 'Coin',
              accessor: 'name',
              Cell: props => (
                !props.row.original.skeleton ?
                  <Link href={`/token${props.row.original.id ? `/${props.row.original.id}` : 's'}`}>
                    <a className="flex flex-col whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-semibold" style={{ maxWidth: '5rem' }}>
                      <div className="coin-column flex items-center space-x-1" style={{ fontSize: '.65rem' }}>
                        <Image
                          useImg={coinsData.data.length > per_page}
                          src={props.row.original.image}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <span className="space-x-1">
                          <span className={`${props.value && props.value.length > 15 ? '' : 'whitespace-pre'}`}>{props.value}</span>
                          {props.row.original.symbol && (<span className={`uppercase text-gray-400 font-normal ${props.row.original.symbol.length > 6 ? 'break-all' : ''}`}>{props.row.original.symbol}</span>)}
                        </span>
                      </div>
                    </a>
                  </Link>
                  :
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <div className="skeleton w-6 h-6 rounded mr-1" />
                      <div className="skeleton w-16 h-4 rounded" />
                      <div className="skeleton w-6 h-4 rounded ml-1" />
                    </div>
                  </div>
              ),
              className: 'nopadding-right-column'
            },
            {
              Header: 'Price',
              accessor: 'current_price',
              sortType: (rowA, rowB) => rowA.original.price_change_percentage_24h_in_currency > rowB.original.price_change_percentage_24h_in_currency ? 1 : -1,
              Cell: props => (
                <div className="flex flex-col font-semibold text-right ml-auto" style={{ fontSize: '.65rem' }}>
                  {!props.row.original.skeleton ?
                    <>
                      {props.value > -1 ?
                        <span className="space-x-1">
                          {currency.symbol}
                          <span>{numberFormat(props.value, '0,0.00000000')}</span>
                          {!(currency.symbol) && (<span className="uppercase">{currency.id}</span>)}
                        </span>
                        :
                        '-'
                      }
                      <div className={`${props.row.original.price_change_percentage_24h_in_currency < 0 ? 'text-red-500 dark:text-red-400' : props.row.original.price_change_percentage_24h_in_currency > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-medium text-right`}>
                        {props.row.original.price_change_percentage_24h_in_currency > Number.MIN_SAFE_INTEGER ?
                          `${numberFormat(props.row.original.price_change_percentage_24h_in_currency, `+0,0.000${Math.abs(props.row.original.price_change_percentage_24h_in_currency) < 0.001 ? '000' : ''}`)}%`
                          :
                          '-'
                        }
                      </div>
                    </>
                    :
                    <>
                      <div className="skeleton w-12 h-4 rounded ml-auto" />
                      <div className="skeleton w-6 h-3 rounded mt-1.5 ml-auto" />
                    </>
                  }
                </div>
              ),
              headerClassName: 'justify-end text-right',
              className: 'nopadding-right-column'
            },
            {
              Header: 'Market Cap',
              accessor: 'market_cap',
              sortType: (rowA, rowB) => rowA.original.market_cap > rowB.original.market_cap ? 1 : -1,
              Cell: props => (
                <div className="flex flex-col font-semibold text-right" style={{ fontSize: '.65rem' }}>
                  {!props.row.original.skeleton ?
                    <>
                      {props.value > -1 ?
                        <span className="space-x-1">
                          {currency.symbol}
                          <span>{numberFormat(props.value, `0,0${Math.abs(props.value) < 1 ? '.000' : ''}`)}</span>
                          {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                        </span>
                        :
                        '-'
                      }
                      {rates_data && currency.id !== currencyBTC.id && (
                        <span className="text-gray-400 font-medium space-x-1">
                          {props.value > -1 ?
                            <>
                              <span>{numberFormat(props.value * (rates_data ? rates_data[currencyBTC.id].value / rates_data[currency.id].value : 1), `0,0${Math.abs(props.value * (rates_data ? rates_data[currencyBTC.id].value / rates_data[currency.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                              <span className="uppercase">{currencyBTC.id}</span>
                            </>
                            :
                            '-'
                          }
                        </span>
                      )}
                    </>
                    :
                    <>
                      <div className="skeleton w-20 h-4 rounded ml-auto" />
                      <div className="skeleton w-12 h-3.5 rounded mt-1.5 ml-auto" />
                    </>
                  }
                </div>
              ),
              headerClassName: 'justify-end text-right',
            },
          ]}
          data={coinsData && coinsData.category === category && coinsData.vs_currency === vs_currency ? coinsData.data.map((coinData, i) => { return { ...coinData, i } }) : [...Array(10).keys()].map(i => { return { i, skeleton: true } })}
          defaultPageSize={10}
          pagination={!(coinsData && coinsData.data.length > 10) ? <></> : null}
          className="inline-table"
        />
      </div>}
      className={`${noBorder ? 'border-0' : ''}`}
    />
  )
}