import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Summary from './summary'
import Datatable from '../../components/datatable'
import Image from '../../components/image'
import { ProgressBar } from '../../components/progress-bars'
import Copy from '../../components/copy'
import { IoInformationCircleSharp } from 'react-icons/io5'
import { HiShieldCheck, HiShieldExclamation } from 'react-icons/hi'
import _ from 'lodash'
import { exchangeTickers } from '../../lib/api/coingecko'
import { currency, currency_btc } from '../../lib/object/currency'
import { getName, numberFormat, ellipseAddress } from '../../lib/utils'

const per_page = 100

export default ({ exchangeData }) => {
  const { tokens, rates } = useSelector(state => ({ tokens: state.tokens, rates: state.rates }), shallowEqual)
  const { cryptos_data } = { ...tokens }
  const { rates_data } = { ...rates }

  const router = useRouter()
  const { query } = { ...router }
  const { exchange_id } = { ...query }

  const [derivativeType, setDerivativeType] = useState('perpetual')
  const [tickersData, setTickersData] = useState(null)

  const marketType = (exchangeData && exchangeData.market_type) || 'spot'

  useEffect(() => {
    const getTickers = async () => {
      let _tickersData

      for (let i = 0; i < (marketType !== 'spot' ? 1 : 20); i++) {
        const response = marketType !== 'spot' ?
          { ...exchangeData }
          :
          await exchangeTickers(exchangeData.id, { page: i + 1, order: 'trust_score_desc', depth: true })

        if (response && response.tickers) {
          _tickersData = (
            _.orderBy(
              _.concat(_tickersData || [], response.tickers)
              .map(tickerData => {
                return {
                  ...tickerData,
                  converted_last: tickerData.converted_last && Object.fromEntries(new Map(Object.entries(tickerData.converted_last).map(([key, value]) => [key, typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : -1]))),
                  h24_percentage_change: typeof tickerData.h24_percentage_change === 'string' ? Number(tickerData.h24_percentage_change) : typeof tickerData.h24_percentage_change === 'number' ? tickerData.h24_percentage_change : Number.MIN_SAFE_INTEGER,
                  index: tickerData.index === 'string' ? Number(tickerData.index) : typeof tickerData.index === 'number' ? tickerData.index : -1,
                  index_basis_percentage: tickerData.index_basis_percentage === 'string' ? Number(tickerData.index_basis_percentage) : typeof tickerData.index_basis_percentage === 'number' ? tickerData.index_basis_percentage : Number.MIN_SAFE_INTEGER,
                  bid_ask_spread_percentage: typeof tickerData.bid_ask_spread_percentage === 'string' ? Number(tickerData.bid_ask_spread_percentage) : typeof tickerData.bid_ask_spread_percentage === 'number' ? tickerData.bid_ask_spread_percentage : -1,
                  bid_ask_spread: typeof tickerData.bid_ask_spread === 'string' ? Number(tickerData.bid_ask_spread) : typeof tickerData.bid_ask_spread === 'number' ? tickerData.bid_ask_spread : -1,
                  up_depth: typeof tickerData.cost_to_move_up_usd === 'string' ? Number(tickerData.cost_to_move_up_usd) : typeof tickerData.cost_to_move_up_usd === 'number' ? tickerData.cost_to_move_up_usd : -1,
                  down_depth: typeof tickerData.cost_to_move_down_usd === 'string' ? Number(tickerData.cost_to_move_down_usd) : typeof tickerData.cost_to_move_down_usd === 'number' ? tickerData.cost_to_move_down_usd : -1,
                  funding_rate: tickerData.funding_rate === 'string' ? Number(tickerData.funding_rate) : typeof tickerData.funding_rate === 'number' ? tickerData.funding_rate : Number.MIN_SAFE_INTEGER,
                  open_interest_usd: typeof tickerData.open_interest_usd === 'string' ? Number(tickerData.open_interest_usd) : typeof tickerData.open_interest_usd === 'number' ? tickerData.open_interest_usd : -1,
                  converted_volume: tickerData.converted_volume && Object.fromEntries(new Map(Object.entries(tickerData.converted_volume).map(([key, value]) => [key, typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : -1]))),
                  trust_score: typeof tickerData.trust_score === 'number' ? tickerData.trust_score : tickerData.trust_score === 'green' ? 1 : tickerData.trust_score === 'yellow' ? 0.5 : 0,
                }
              }),
              [marketType !== 'spot' ? 'open_interest_usd' : 'trust_score'], ['desc']
            )
          )

          if (_tickersData) {
            if (marketType !== 'spot') {
              exchangeData.number_of_perpetual_pairs = _tickersData.filter(tickerData => tickerData.contract_type === 'perpetual').length
              exchangeData.number_of_futures_pairs = _tickersData.filter(tickerData => tickerData.contract_type === 'futures').length
            }
            else {
              exchangeData.number_of_coins = _.uniqBy(_tickersData, 'base').length
              exchangeData.number_of_pairs = _tickersData.length
            }
            setTickersData({ data: _tickersData, exchange_id: exchangeData.id })
          }

          if (response.tickers.length < per_page) {
            break
          }
        }
      }
    }

    if (exchangeData) {
      getTickers()
    }
  }, [exchangeData, marketType])

  return (
    <div className="mx-1">
      <Summary
        exchangeData={exchangeData && exchange_id === exchangeData.id && exchangeData}
        tickersData={tickersData && exchange_id === tickersData.exchange_id && tickersData.data && tickersData.data.filter(tickerData => marketType === 'spot' || tickerData.contract_type === derivativeType)}
        derivativeType={derivativeType}
        selectDerivativeType={derivativeType => setDerivativeType(derivativeType)}
      />
      <Datatable
        columns={[
          {
            Header: '#',
            accessor: 'i',
            sortType: 'number',
            Cell: props => (
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                {!props.row.original.skeleton ?
                  numberFormat(props.value + 1, '0,0')
                  :
                  <div className="skeleton w-4 h-3 rounded" />
                }
              </div>
            ),
            headerClassName: 'justify-center',
          },
          {
            Header: 'Coin',
            accessor: 'coin_name',
            Cell: props => (
              !props.row.original.skeleton ?
                <Link href={`/token${props.row.original.token_id ? `/${props.row.original.token_id}` : 's'}`}>
                  <a className="flex flex-col whitespace-pre-wrap font-medium" style={{ maxWidth: '10rem' }}>
                    <div className="coin-column flex items-center space-x-2">
                      <Image
                        useImg={tickersData.data.filter(tickerData => marketType === 'spot' || tickerData.contract_type === derivativeType).length > per_page}
                        src={props.row.original.coin && props.row.original.coin.image}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded"
                      />
                      <span className="space-x-1">
                        <span>{props.value}</span>
                        {props.row.original.coin && props.row.original.coin.symbol && (<span className={`uppercase text-gray-400 font-normal ${props.row.original.coin.symbol.length > 6 ? 'break-all' : ''}`}>{props.row.original.coin.symbol}</span>)}
                      </span>
                    </div>
                  </a>
                </Link>
                :
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="skeleton w-6 h-6 rounded mr-2" />
                    <div className="skeleton w-24 h-4 rounded" />
                    <div className="skeleton w-8 h-4 rounded ml-1.5" />
                  </div>
                </div>
            ),
          },
          {
            Header: 'Pair',
            accessor: 'pair',
            Cell: props => (
              <div className="text-gray-800 dark:text-gray-200 font-semibold">
                {!props.row.original.skeleton ?
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-0.5">
                      {props.row.original.trade_url || (exchangeData && exchangeData.url) ?
                        <a href={props.row.original.trade_url || (exchangeData && exchangeData.url)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400">
                          {props.value}
                        </a>
                        :
                        <span>{props.value}</span>
                      }
                      {props.row.original.token_info_url && (
                        <a href={props.row.original.token_info_url} target="_blank" rel="noopener noreferrer">
                          <IoInformationCircleSharp size={18} className="text-gray-300 dark:text-gray-600 mb-0.5" />
                        </a>
                      )}
                      {marketType === 'spot' && props.row.original.trust_score > -1 && (
                        <>
                          {!props.row.original.trust_score ?
                            <HiShieldExclamation size={18} className="text-red-400 dark:text-red-600 mb-0.5" />
                            :
                            <HiShieldCheck size={18} className={`text-${props.row.original.trust_score === 1 ? 'green' : 'yellow'}-400 dark:text-${props.row.original.trust_score === 1 ? 'green' : 'yellow'}-600 mb-0.5`} />
                          }
                        </>
                      )}
                    </div>
                    {props.row.original.base && props.row.original.base.startsWith('0X') && (
                      <span className="flex items-center text-gray-400 dark:text-gray-600 font-normal space-x-1" style={{ fontSize: '.65rem' }}>
                        <span>{ellipseAddress(props.row.original.base, 6)}</span>
                        <Copy text={props.row.original.base} size={14} className="mb-0.5" />
                      </span>
                    )}
                    {props.row.original.target && props.row.original.target.startsWith('0X') && (
                      <span className="flex items-center text-gray-400 dark:text-gray-600 font-normal space-x-1" style={{ fontSize: '.65rem' }}>
                        <span>/</span>
                        <span>{ellipseAddress(props.row.original.target, 6)}</span>
                        <Copy text={props.row.original.target} size={14} className="mb-0.5" />
                      </span>
                    )}
                  </div>
                  :
                  <div className="skeleton w-20 h-4 rounded" />
                }
              </div>
            ),
          },
          {
            Header: 'Price',
            accessor: `converted_last.${[currencyUSD.id]}`,
            sortType: (rowA, rowB) => rowA.original.converted_last[currencyUSD.id] > rowB.original.converted_last[currencyUSD.id] ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-right ml-auto mr-2" style={{ minWidth: '7.5rem' }}>
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {currencyUSD.symbol}
                        <span>{numberFormat(props.value, '0,0.00000000')}</span>
                        {!currencyUSD.symbol && (<span className="uppercase">{currencyUSD.id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {rates_data && currency.id !== currencyUSD.id && (
                      <span className="text-gray-400 font-medium space-x-1" style={{ fontSize: '.65rem' }}>
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value * (rates_data ? rates_data[currency.id].value / rates_data[currencyUSD.id].value : 1), `0,0.00${Math.abs(props.value * (rates_data ? rates_data[currency.id].value / rates_data[currencyUSD.id].value : 1)) < 0.01 ? '0000' : ''}`)}</span>
                            <span className="uppercase">{currency.id}</span>
                          </>
                          :
                          '-'
                        }
                      </span>
                    )}
                    {props.row.original.target && !([currency.id, currencyUSD.id].includes(props.row.original.target.toLowerCase())) && typeof props.row.original.last === 'number' && (
                      <span className="text-gray-400 font-medium space-x-1" style={{ fontSize: '.65rem' }}>
                        <span>{numberFormat(props.row.original.last, `0,0.00${props.row.original.last < 0.01 ? '0000' : ''}`)}</span>
                        <span className="uppercase">
                          {props.row.original.target.startsWith('0X') ?
                            props.row.original.target_coin_id && cryptos_data && cryptos_data.coins && cryptos_data.coins.findIndex(coinData => coinData.id === props.row.original.target_coin_id) > -1 ?
                              cryptos_data.coins[cryptos_data.coins.findIndex(coinData => coinData.id === props.row.original.target_coin_id)].symbol
                              :
                              ellipseAddress(props.row.original.target, 4)
                            :
                            props.row.original.target
                          }
                        </span>
                      </span>
                    )}
                  </>
                  :
                  <>
                    <div className="skeleton w-28 h-4 rounded ml-auto" />
                    <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: '24h',
            accessor: 'h24_percentage_change',
            sortType: (rowA, rowB) => rowA.original.h24_percentage_change > rowB.original.h24_percentage_change ? 1 : -1,
            Cell: props => (
              <div className={`${props.value < 0 ? 'text-red-500 dark:text-red-400' : props.value > 0 ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} text-xs font-medium text-right`}>
                {!props.row.original.skeleton ?
                  props.value > Number.MIN_SAFE_INTEGER ?
                    `${numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%`
                    :
                    '-'
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'Index Price',
            accessor: 'index',
            sortType: (rowA, rowB) => rowA.original.index > rowB.original.index ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-right mr-2">
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      numberFormat(props.value, '0,0.00000000')
                      :
                      '-'
                    }
                  </>
                  :
                  <div className="skeleton w-28 h-4 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: 'Basis',
            accessor: 'index_basis_percentage',
            sortType: (rowA, rowB) => rowA.original.index_basis_percentage > rowB.original.index_basis_percentage ? 1 : -1,
            Cell: props => (
              <div className="text-gray-400 dark:text-gray-500 font-normal text-right mr-2">
                {!props.row.original.skeleton ?
                  props.value > Number.MIN_SAFE_INTEGER ? `${numberFormat(props.value, `+0,0.000${Math.abs(props.value) < 0.001 ? '000' : ''}`)}%` : '-'
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: 'Spread',
            accessor: marketType === 'spot' ? 'bid_ask_spread_percentage' : 'bid_ask_spread',
            sortType: (rowA, rowB) => rowA.original[marketType === 'spot' ? 'bid_ask_spread_percentage' : 'bid_ask_spread'] > rowB.original[marketType === 'spot' ? 'bid_ask_spread_percentage' : 'bid_ask_spread'] ? 1 : -1,
            Cell: props => (
              <div className="text-gray-400 dark:text-gray-500 font-normal text-right mr-2">
                {!props.row.original.skeleton ?
                  props.value > -1 ? `${numberFormat(props.value * (marketType !== 'spot' ? 100 : 1), `0,0.000${Math.abs(props.value * (marketType !== 'spot' ? 100 : 1)) < 0.001 ? '000' : ''}`)}%` : '-'
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: '+2% Depth',
            accessor: 'up_depth',
            sortType: (rowA, rowB) => rowA.original.up_depth > rowB.original.up_depth ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-right mr-2" style={{ minWidth: '7.5rem' }}>
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {currencyUSD.symbol}
                        <span>{numberFormat(props.value, '0,0.00000000')}</span>
                        {!currencyUSD.symbol && (<span className="uppercase">{currencyUSD.id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {rates_data && currency.id !== currencyUSD.id && (
                      <span className="text-gray-400 font-medium space-x-1" style={{ fontSize: '.65rem' }}>
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value * (rates_data ? rates_data[currency.id].value / rates_data[currencyUSD.id].value : 1), `0,0.00${Math.abs(props.value * (rates_data ? rates_data[currency.id].value / rates_data[currencyUSD.id].value : 1)) < 0.01 ? '0000' : ''}`)}</span>
                            <span className="uppercase">{currency.id}</span>
                          </>
                          :
                          '-'
                        }
                      </span>
                    )}
                  </>
                  :
                  <>
                    <div className="skeleton w-28 h-4 rounded ml-auto" />
                    <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: '-2% Depth',
            accessor: 'down_depth',
            sortType: (rowA, rowB) => rowA.original.down_depth > rowB.original.down_depth ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-right mr-2" style={{ minWidth: '7.5rem' }}>
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {currencyUSD.symbol}
                        <span>{numberFormat(props.value, '0,0.00000000')}</span>
                        {!currencyUSD.symbol && (<span className="uppercase">{currencyUSD.id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {rates_data && currency.id !== currencyUSD.id && (
                      <span className="text-gray-400 font-medium space-x-1" style={{ fontSize: '.65rem' }}>
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value * (rates_data ? rates_data[currency.id].value / rates_data[currencyUSD.id].value : 1), `0,0.00${Math.abs(props.value * (rates_data ? rates_data[currency.id].value / rates_data[currencyUSD.id].value : 1)) < 0.01 ? '0000' : ''}`)}</span>
                            <span className="uppercase">{currency.id}</span>
                          </>
                          :
                          '-'
                        }
                      </span>
                    )}
                  </>
                  :
                  <>
                    <div className="skeleton w-28 h-4 rounded ml-auto" />
                    <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: (<span style={{ fontSize: '.65rem' }}>Funding Rate</span>),
            accessor: 'funding_rate',
            sortType: (rowA, rowB) => rowA.original.funding_rate > rowB.original.funding_rate ? 1 : -1,
            Cell: props => (
              <div className="text-gray-400 dark:text-gray-500 font-normal text-right mr-2">
                {!props.row.original.skeleton ?
                  props.value > Number.MIN_SAFE_INTEGER ? `${numberFormat(props.value * 100, `0,0.000${Math.abs(props.value * 100) < 0.001 ? '000' : ''}`)}%` : '-'
                  :
                  <div className="skeleton w-10 h-3 rounded ml-auto" />
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: (<span style={{ fontSize: '.65rem' }}>Open Interest</span>),
            accessor: 'open_interest_usd',
            sortType: (rowA, rowB) => rowA.original.open_interest_usd > rowB.original.open_interest_usd ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-right mr-2">
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {(rates_data ? currency : currencyUSD).symbol}
                        <span>{numberFormat(props.value * (rates_data ? rates_data[currency.id].value / rates_data[currencyUSD.id].value : 1), `0,0${Math.abs(props.value * (rates_data ? rates_data[currency.id].value / rates_data[currencyUSD.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                        {!((rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(rates_data ? currency : currencyUSD).id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {rates_data && currency.id !== currencyUSD.id && (
                      <span className="text-gray-400 text-xs font-medium space-x-1">
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value, `0,0${Math.abs(props.value) < 1 ? '.000' : ''}`)}</span>
                            <span className="uppercase">{currencyUSD.id}</span>
                          </>
                          :
                          '-'
                        }
                      </span>
                    )}
                  </>
                  :
                  <>
                    <div className="skeleton w-28 h-4 rounded ml-auto" />
                    <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: '24 Volume',
            accessor: `converted_volume.${[currencyUSD.id]}`,
            sortType: (rowA, rowB) => rowA.original.converted_volume[currencyUSD.id] > rowB.original.converted_volume[currencyUSD.id] ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col font-semibold text-right ml-auto mr-2" style={{ minWidth: '7.5rem' }}>
                {!props.row.original.skeleton ?
                  <>
                    {props.value > -1 ?
                      <span className="space-x-1">
                        {currencyUSD.symbol}
                        <span>{numberFormat(props.value, '0,0')}</span>
                        {!currencyUSD.symbol && (<span className="uppercase">{currencyUSD.id}</span>)}
                      </span>
                      :
                      '-'
                    }
                    {rates_data && currency.id !== currencyUSD.id && (
                      <span className="text-gray-400 font-medium space-x-1" style={{ fontSize: '.65rem' }}>
                        {props.value > -1 ?
                          <>
                            <span>{numberFormat(props.value * (rates_data ? rates_data[currency.id].value / rates_data[currencyUSD.id].value : 1), `0,0.00${Math.abs(props.value * (rates_data ? rates_data[currency.id].value / rates_data[currencyUSD.id].value : 1)) < 0.01 ? '0000' : ''}`)}</span>
                            <span className="uppercase">{currency.id}</span>
                          </>
                          :
                          '-'
                        }
                      </span>
                    )}
                    {props.row.original.target && !([currency.id, currencyUSD.id].includes(props.row.original.target.toLowerCase())) && (typeof props.row.original.volume === 'number' || typeof props.row.original.h24_volume === 'number') && (
                      <span className="text-gray-400 font-medium space-x-1" style={{ fontSize: '.65rem' }}>
                        <span>{numberFormat(typeof props.row.original.volume === 'number' ? props.row.original.volume : props.row.original.h24_volume, `0,0.00${typeof props.row.original.volume === 'number' ? props.row.original.volume : props.row.original.h24_volume < 0.01 ? '0000' : ''}`)}</span>
                        <span className="uppercase">
                          {props.row.original.target.startsWith('0X') ?
                            props.row.original.target_coin_id && cryptos_data && cryptos_data.coins && cryptos_data.coins.findIndex(coinData => coinData.id === props.row.original.target_coin_id) > -1 ?
                              cryptos_data.coins[cryptos_data.coins.findIndex(coinData => coinData.id === props.row.original.target_coin_id)].symbol
                              :
                              ellipseAddress(props.row.original.target, 4)
                            :
                            props.row.original.target
                          }
                        </span>
                      </span>
                    )}
                  </>
                  :
                  <>
                    <div className="skeleton w-28 h-4 rounded ml-auto" />
                    <div className="skeleton w-16 h-3.5 rounded mt-2 ml-auto" />
                  </>
                }
              </div>
            ),
            headerClassName: 'justify-end text-right mr-2',
          },
          {
            Header: 'Market Share',
            accessor: 'volume_percentage',
            sortType: (rowA, rowB) => rowA.original.volume_percentage > rowB.original.volume_percentage ? 1 : -1,
            Cell: props => (
              <div className="flex flex-col text-gray-600 dark:text-gray-400 font-normal">
                {!props.row.original.skeleton ?
                  <>
                    <span>{props.value > -1 ? `${numberFormat(props.value * 100, `0,0.000${Math.abs(props.value * 100) < 0.001 ? '000' : ''}`)}%` : '-'}</span>
                    <ProgressBar width={props.value > -1 ? props.value * 100 : 0} color="bg-yellow-500" className="h-1" />
                  </>
                  :
                  <>
                    <div className="skeleton w-10 h-3 rounded" />
                    <div className={`skeleton w-${Math.floor((12 - props.row.original.i) / 3)}/12 h-1 rounded mt-1.5`} />
                  </>
                }
              </div>
            ),
          },
        ].filter(column => !((marketType !== 'spot' ? ['bid_ask_spread_percentage', 'up_depth', 'down_depth', 'volume_percentage', 'trust_score'] : ['h24_percentage_change', 'index', 'index_basis_percentage', 'bid_ask_spread', 'funding_rate', 'open_interest_usd']).includes(column.accessor)))}
        data={tickersData && exchange_id === tickersData.exchange_id ?
          tickersData.data.filter(tickerData => marketType === 'spot' || tickerData.contract_type === derivativeType).map((tickerData, i) => {
            const coinIndex = cryptos_data && cryptos_data.coins ?
              cryptos_data.coins.findIndex(coinData => marketType !== 'spot' ?
                tickerData.base && (
                  (coinData.symbol && coinData.symbol.toLowerCase() === tickerData.base.toLowerCase()) ||
                  (coinData.id && coinData.id.toLowerCase() === tickerData.base.toLowerCase()) ||
                  (coinData.name && coinData.name.toLowerCase() === tickerData.base.toLowerCase())
                )
                :
                coinData.id === tickerData.token_id
              )
              :
              -1

            if (coinIndex > -1) {
              tickerData.coin = { ...cryptos_data.coins[coinIndex], image: cryptos_data.coins[coinIndex].large }
              tickerData.token_id = tickerData.token_id || tickerData.coin.id
            }

            return {
              ...tickerData,
              i,
              coin_name: tickerData.coin && tickerData.coin.name ?
                tickerData.coin.name
                :
                tickerData.base && tickerData.base.startsWith('0X') ?
                  tickerData.token_id ?
                    cryptos_data && cryptos_data.coins && cryptos_data.coins.findIndex(coinData => coinData.id === tickerData.token_id) > -1 ?
                      cryptos_data.coins[cryptos_data.coins.findIndex(coinData => coinData.id === tickerData.token_id)].name
                      :
                      getName(tickerData.token_id)
                    :
                    ellipseAddress(tickerData.base, 6)
                  :
                  tickerData.base,
              pair: `
                ${tickerData.base && tickerData.base.startsWith('0X') ?
                  tickerData.token_id ?
                    cryptos_data && cryptos_data.coins && cryptos_data.coins.findIndex(coinData => coinData.id === tickerData.token_id) > -1 ?
                      cryptos_data.coins[cryptos_data.coins.findIndex(coinData => coinData.id === tickerData.token_id)].symbol
                      :
                      getName(tickerData.token_id)
                    :
                    ellipseAddress(tickerData.base, 6)
                  :
                  tickerData.base
                }/${tickerData.target && tickerData.target.startsWith('0X') ?
                  tickerData.target_token_id ?
                    cryptos_data && cryptos_data.coins && cryptos_data.coins.findIndex(coinData => coinData.id === tickerData.target_token_id) > -1 ?
                      cryptos_data.coins[cryptos_data.coins.findIndex(coinData => coinData.id === tickerData.target_token_id)].symbol
                      :
                      getName(tickerData.target_token_id)
                    :
                    ellipseAddress(tickerData.target, 6)
                  :
                  tickerData.target
                }
              `,
              volume_percentage: exchangeData && exchangeData.trade_volume_24h_btc && tickerData.converted_volume && tickerData.converted_volume[currencyBTC.id] > -1 ? tickerData.converted_volume[currencyBTC.id] / exchangeData.trade_volume_24h_btc : -1,
            }
          })
          :
          [...Array(10).keys()].map(i => { return { i, skeleton: true } })
        }
        defaultPageSize={per_page}
      />
    </div>
  )
}