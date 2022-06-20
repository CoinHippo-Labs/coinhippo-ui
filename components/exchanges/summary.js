import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { currency, currency_btc } from '../../lib/object/currency'
import { numberFormat } from '../../lib/utils'

export default ({ exchangesData }) => {
  const { rates } = useSelector(state => ({ rates: state.rates }), shallowEqual)
  const { rates_data } = { ...rates }

  const router = useRouter()
  const { query } = { ...router }
  const { exchange_type } = { ...query }

  return (
    <div className="flex flex-col sm:flex-row items-start space-y-1 sm:space-y-0 space-x-0 sm:space-x-4 mb-2 ml-0.5">
      {exchangesData && exchange_type === exchangesData.exchange_type ?
        <>
          <span className="flex items-center space-x-1">
            <span className="text-gray-400 dark:text-gray-600 font-normal">Exchanges:</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">{numberFormat(exchangesData.data.length, '0,0')}</span>
          </span>
          {exchange_type === 'derivatives' && (
            <span className="flex flex-wrap items-center justify-start sm:justify-end space-x-1">
              <span className="text-gray-400 dark:text-gray-600 font-normal">Open Interest:</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium space-x-1">
                {(exchange_rates_data ? currency : currencyBTC).symbol}
                <span>{numberFormat(_.sumBy(exchangesData.data.filter(exchangeData => exchangeData.open_interest_btc > 0), 'open_interest_btc') * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyBTC.id].value : 1), '0,0')}</span>
                {!((exchange_rates_data ? currency : currencyBTC).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyBTC).id}</span>)}
              </span>
              {exchange_rates_data && currency.id !== currencyBTC.id && (
                <div className="text-gray-400 dark:text-gray-600 text-xs font-medium space-x-1">
                  (
                  <span>{numberFormat(_.sumBy(exchangesData.data.filter(exchangeData => exchangeData.open_interest_btc > 0), 'open_interest_btc'), '0,0')}</span>
                  <span className="uppercase">{currencyBTC.id}</span>
                  )
                </div>
              )}
            </span>
          )}
          <span className="flex flex-wrap items-center justify-start sm:justify-end space-x-1">
            <span className="text-gray-400 dark:text-gray-600 font-normal">24h Vol:</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium space-x-1">
              {(exchange_rates_data ? currency : currencyBTC).symbol}
              <span>{numberFormat(_.sumBy(exchangesData.data.filter(exchangeData => exchangeData.trade_volume_24h_btc > 0), 'trade_volume_24h_btc') * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyBTC.id].value : 1), '0,0')}</span>
              {!((exchange_rates_data ? currency : currencyBTC).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyBTC).id}</span>)}
            </span>
            {exchange_rates_data && currency.id !== currencyBTC.id && (
              <div className="text-gray-400 dark:text-gray-600 text-xs font-medium space-x-1">
                (
                <span>{numberFormat(_.sumBy(exchangesData.data.filter(exchangeData => exchangeData.trade_volume_24h_btc > 0), 'trade_volume_24h_btc'), '0,0')}</span>
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