import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { currencies } from '../../lib/menus'
import { numberFormat } from '../../lib/utils'

export default ({ coinsData, page }) => {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { exchange_rates_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyBTC = currencies[currencies.findIndex(c => c.id === 'btc')]

  const router = useRouter()
  const { query } = { ...router }
  const { category } = { ...query }

  return (
    <div className="flex flex-col sm:flex-row items-start space-y-1 sm:space-y-0 space-x-0 sm:space-x-4 mb-2 ml-0.5">
      {coinsData && coinsData.vs_currency === vs_currency && category === coinsData.category && page === coinsData.page ?
        <>
          <span className="flex items-center space-x-1">
            <span className="text-gray-400 dark:text-gray-600 font-normal">Coins:</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">{numberFormat(coinsData.data.length, '0,0')}</span>
          </span>
          <span className="flex flex-wrap items-center justify-start sm:justify-end space-x-1">
            <span className="text-gray-400 dark:text-gray-600 font-normal">Market Cap:</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium space-x-1">
              {(exchange_rates_data ? currency : currencyBTC).symbol}
              <span>{numberFormat(_.sumBy(coinsData.data.filter(coinData => coinData.market_cap > 0), 'market_cap'), '0,0')}</span>
              {!((exchange_rates_data ? currency : currencyBTC).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyBTC).id}</span>)}
            </span>
            {exchange_rates_data && currency.id !== currencyBTC.id && (
              <div className="text-gray-400 dark:text-gray-600 text-xs font-medium space-x-1">
                (
                <span>{numberFormat(_.sumBy(coinsData.data.filter(coinData => coinData.market_cap > 0), 'market_cap') * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[currency.id].value : 1), '0,0')}</span>
                <span className="uppercase">{currencyBTC.id}</span>
                )
              </div>
            )}
          </span>
          <span className="flex flex-wrap items-center justify-start sm:justify-end space-x-1">
            <span className="text-gray-400 dark:text-gray-600 font-normal">24h Vol:</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium space-x-1">
              {(exchange_rates_data ? currency : currencyBTC).symbol}
              <span>{numberFormat(_.sumBy(coinsData.data.filter(coinData => coinData.total_volume > 0), 'total_volume'), '0,0')}</span>
              {!((exchange_rates_data ? currency : currencyBTC).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyBTC).id}</span>)}
            </span>
            {exchange_rates_data && currency.id !== currencyBTC.id && (
              <div className="text-gray-400 dark:text-gray-600 text-xs font-medium space-x-1">
                (
                <span>{numberFormat(_.sumBy(coinsData.data.filter(coinData => coinData.total_volume > 0), 'total_volume') * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[currency.id].value : 1), '0,0')}</span>
                <span className="uppercase">{currencyBTC.id}</span>
                )
              </div>
            )}
          </span>
        </>
        :
        <>
          <div className="skeleton w-24 h-4 rounded mr-0 sm:mr-2 mb-0.5" />
          <div className="skeleton w-48 h-4 rounded mb-0.5" />
        </>
      }
    </div>
  )
}