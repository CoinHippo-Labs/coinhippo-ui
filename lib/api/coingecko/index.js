import { getCoingecko } from '../'
import { exchange_type, affiliate_links, trade_url } from '../../exchange'
import { toArray } from '../../utils'

export const getCryptos = async params => {
  const response = await getCoingecko({ ...params, path: '/search' })
  const { exchanges } = { ...response }
  if (response) {
    response.exchanges = toArray(exchanges).map(d => {
      const { id } = { ...d }
      return { ...d, exchange_type: exchange_type(id) }
    })
  }
  return response
}
export const getCategories = async params => await getCoingecko({ ...params, path: '/coins/categories/list' })
export const getTrendingSearch = async params => await getCoingecko({ ...params, path: '/search/trending' })
export const getExchangeRates = async params => await getCoingecko({ ...params, path: '/exchange_rates' })
export const getGlobal = async params => await getCoingecko({ ...params, path: '/global' })
export const getDefiGlobal = async params => await getCoingecko({ ...params, path: '/global/decentralized_finance_defi' })
export const getSimplePrice = async params => await getCoingecko({ ...params, path: '/simple/price' })
export const getTokensMarkets = async params => await getCoingecko({ ...params, path: '/coins/markets' })
export const getCategoriesMarkets = async params => await getCoingecko({ ...params, path: '/coins/categories' })
export const getToken = async (id, params) => await getCoingecko({ ...params, path: `/coins/${id}` })
export const getTokenTickers = async (id, params) => {
  const response = await getCoingecko({ ...params, path: `/coins/${id}/tickers` })
  const { tickers } = { ...response }
  if (response) {
    response.tickers = toArray(tickers).map(d => { return { ...d, trade_url: affiliate_links(trade_url(d)) } })
  }
  return response
}
export const getDerivatives = async params => await getCoingecko({ ...params, path: '/derivatives' })
export const getExchanges = async params => {
  let response = await getCoingecko({ ...params, path: '/exchanges' })
  response = toArray(response).map(d => {
    const { id, url } = { ...d }
    return { ...d, exchange_type: exchange_type(id), url: affiliate_links(url) }
  })
  return response
}
export const getDerivativesExchanges = async params => {
  let response = await getCoingecko({ ...params, path: '/derivatives/exchanges' })
  response = toArray(response).map(d => {
    const { id, url } = { ...d }
    return { ...d, exchange_type: exchange_type(id), url: affiliate_links(url) }
  })
  return response
}
export const getExchange = async (id, params) => {
  let response = await getCoingecko({ ...params, path: `/exchanges/${id}` })
  if (response) {
    const { id, url, tickers } = { ...response }
    response = {
      ...response,
      exchange_type: exchange_type(id),
      url: affiliate_links(url),
      tickers: toArray(tickers).map(d => { return { ...d, trade_url: affiliate_links(trade_url(d)) } })
    }
  }
  return response
}
export const getDerivativesExchange = async (id, params) => {
  let response = await getCoingecko({ ...params, path: `/derivatives/exchanges/${id}` })
  if (response) {
    const { id, url, tickers } = { ...response }
    response = {
      ...response,
      exchange_type: exchange_type(id),
      url: affiliate_links(url),
      tickers: toArray(tickers).map(d => { return { ...d, trade_url: affiliate_links(trade_url(d)) } })
    }
  }
  return response
}
export const getExchangeTickers = async (id, params) => {
  const response = await getCoingecko({ ...params, path: `/exchanges/${id}/tickers` })
  const { tickers } = { ...response }
  if (response) {
    response.tickers = toArray(tickers).map(d => { return { ...d, trade_url: affiliate_links(trade_url(d)) } })
  }
  return response
}
export const getPublicCompanies = async (id, params) => getCoingecko({ ...params, path: `/companies/public_treasury/${id}` })