import { exchange_type, affiliate_links, trade_url } from '../../object/exchange'

const _module = 'coingecko'

const request = async (path, params) => {
  params = { ...params, path, module: _module }
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: 'POST',
    body: JSON.stringify(params),
  }).catch(error => { return null })
  return res && await res.json()
}

export const cryptos = async params => {
  const path = '/search'
  params = {
    ...params,
    cache: true,
    cache_timeout: 15,
  }
  const response = await request(path, params)
  if (response?.exchanges) {
    response.exchanges = response.exchanges.map(e => {
      return {
        ...e,
        exchange_type: exchange_type(e.id),
      }
    })
  }
  return response
}

export const categories = async params => {
  const path = '/coins/categories/list'
  params = {
    ...params,
    cache: true,
    cache_timeout: 15,
  }
  return await request(path, params)
}

export const trending_search = async params => {
  const path = '/search/trending'
  params = {
    ...params,
    cache: true,
    cache_timeout: 5,
  }
  return await request(path, params)
}

export const exchange_rates = async params => {
  const path = '/exchange_rates'
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  return await request(path, params)
}

export const _global = async params => {
  const path = '/global'
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  return await request(path, params)
}

export const defi_global = async params => {
  const path = '/global/decentralized_finance_defi'
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  return await request(path, params)
}

export const simple_price = async params => {
  const path = '/simple/price'
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  return await request(path, params)
}

export const tokens_markets = async params => {
  const path = '/coins/markets'
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  return await request(path, params)
}

export const categories_markets = async params => {
  const path = '/coins/categories'
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  return await request(path, params)
}

export const token = async (id, params) => {
  const path = `/coins/${id}`
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  return await request(path, params)
}

export const token_tickers = async (id, params) => {
  const path = `/coins/${id}/tickers`
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  const response = await request(path, params)
  if (response?.tickers) {
    response.tickers = response.tickers.map(t => {
      return {
        ...t,
        trade_url: affiliate_links(trade_url(t)),
      }
    })
  }
  return response
}

export const derivatives = async params => {
  const path = '/derivatives'
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  return await request(path, params)
}

export const exchanges = async params => {
  const path = '/exchanges'
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  let response = await request(path, params)
  if (Array.isArray(response)) {
    response = response.map(e => {
      return {
        ...e,
        exchange_type: exchange_type(e.id),
        url: affiliate_links(e.url),
      }
    })
  }
  return response
}

export const derivatives_exchanges = async params => {
  const path = '/derivatives/exchanges'
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  let response = await request(path, params)
  if (Array.isArray(response)) {
    response = response.map(e => {
      return {
        ...e,
        exchange_type: exchange_type(e.id),
        url: affiliate_links(e.url),
      }
    })
  }
  return response
}

export const exchange = async (id, params) => {
  const path = `/exchanges/${id}`
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  let response = await request(path, params)
  if (response && !response.error) {
    const { id, url, tickers } = { ...response }
    response = {
      ...response,
      exchange_type: exchange_type(id),
      url: affiliate_links(url),
      tickers: tickers?.map(t => {
        return {
          ...t,
          trade_url: affiliate_links(trade_url(t)),
        }
      })
    }
  }
  return response
}

export const derivatives_exchange = async (id, params) => {
  const path = `/derivatives/exchanges/${id}`
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  let response = await request(path, params)
  if (response && !response.error) {
    const { id, url, tickers } = { ...response }
    response = {
      ...response,
      exchange_type: exchange_type(id),
      url: affiliate_links(url),
      tickers: tickers?.map(t => {
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
  const path = `/exchanges/${id}/tickers`
  params = {
    ...params,
    cache: true,
    cache_timeout: 1,
  }
  const response = await request(path, params)
  if (response?.tickers) {
    response.tickers = response.tickers.map(t => {
      return {
        ...t,
        trade_url: affiliate_links(trade_url(t)),
      }
    })
  }
  return response
}

export const public_companies = async (id, params) => {
  const path = `/companies/public_treasury/${id}`
  params = {
    ...params,
    cache: true,
    cache_timeout: 15,
  }
  return await request(path, params)
}