import { exchange_type, affiliate_links, trade_url } from '../../object/exchange'

const request = async (path, params) => {
  params = { ...params, path, method: 'coingecko' }
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL, { method: 'POST', body: JSON.stringify(params) }).catch(error => { return null })
  return response && await response.json()
}

export const cryptos = async params => {
  const response = await request('/search', params)
  const { exchanges } = { ...response }
  if (Array.isArray(exchanges)) {
    response.exchanges = exchanges.map(e => {
      const { id } = { ...e }
      return {
        ...e,
        exchange_type: exchange_type(id),
      }
    })
  }
  return response
}
export const categories = async params => await request('/coins/categories/list', params)
export const trending_search = async params => await request('/search/trending', params)
export const exchange_rates = async params => await request('/exchange_rates', params)
export const _global = async params => await request('/global', params)
export const defi_global = async params => await request('/global/decentralized_finance_defi', params)
export const simple_price = async params => await request('/simple/price', params)
export const tokens_markets = async params => await request('/coins/markets', params)
export const categories_markets = async params => await request('/coins/categories', params)
export const token = async (id, params) => await request(`/coins/${id}`, params)
export const token_tickers = async (id, params) => {
  const response = await request(`/coins/${id}/tickers`, params)
  const { tickers } = { ...response }
  if (Array.isArray(tickers)) {
    response.tickers = tickers.map(t => {
      return {
        ...t,
        trade_url: affiliate_links(trade_url(t)),
      }
    })
  }
  return response
}
export const derivatives = async params => await request('/derivatives', params)
export const exchanges = async params => {
  let response = await request('/exchanges', params)
  if (Array.isArray(response)) {
    response = response.map(e => {
      const { id, url } = { ...e }
      return {
        ...e,
        exchange_type: exchange_type(id),
        url: affiliate_links(url),
      }
    })
  }
  return response
}
export const derivatives_exchanges = async params => {
  let response = await request('/derivatives/exchanges', params)
  if (Array.isArray(response)) {
    response = response.map(e => {
      const { id, url } = { ...e }
      return {
        ...e,
        exchange_type: exchange_type(id),
        url: affiliate_links(url),
      }
    })
  }
  return response
}

export const exchange = async (id, params) => {
  let response = await request(`/exchanges/${id}`, params)
  if (response) {
    const { id, url, tickers } = { ...response }
    response = {
      ...response,
      exchange_type: exchange_type(id),
      url: affiliate_links(url),
      tickers: (tickers || []).map(t => {
        return {
          ...t,
          trade_url: affiliate_links(trade_url(t)),
        }
      })
    }
  }
  return response
}

export const derivatives_exchange = async (d, params) => {
  let response = await request(`/derivatives/exchanges/${id}`, params)
  if (response) {
    const { id, url, tickers } = { ...response }
    response = {
      ...response,
      exchange_type: exchange_type(id),
      url: affiliate_links(url),
      tickers: (tickers || []).map(t => {
        return {
          ...t,
          trade_url: affiliate_links(trade_url(t)),
        }
      })
    }
  }
  return response
}

export const exchange_tickers = async (id, params) => {
  const response = await request(`/exchanges/${id}/tickers`, params)
  const { tickers } = { ...response }
  if (Array.isArray(tickers)) {
    response.tickers = tickers.map(t => {
      return {
        ...t,
        trade_url: affiliate_links(trade_url(t)),
      }
    })
  }
  return response
}

export const public_companies = async (id, params) => await request(`/companies/public_treasury/${id}`, params)