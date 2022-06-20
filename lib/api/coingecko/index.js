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
  return await request(path, params)
}

export const trending_search = async params => {
  const path = '/search/trending'
  return await request(path, params)
}

export const exchange_rates = async params => {
  const path = '/exchange_rates'
  return await request(path, params)
}

export const _global = async params => {
  const path = '/global'
  return await request(path, params)
}

export const defi_global = async params => {
  const path = '/global/decentralized_finance_defi'
  return await request(path, params)
}

export const simple_price = async params => {
  const path = '/simple/price'
  return await request(path, params)
}

export const tokens_markets = async params => {
  const path = '/coins/markets'
  return await request(path, params)
}

export const categories_markets = async params => {
  const path = '/coins/categories'
  return await request(path, params)
}

export const token = async (id, params) => {
  const path = `/coins/${id}`
  return await request(path, params)
}

export const token_tickers = async (id, params) => {
  const path = `/coins/${id}/tickers`
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
  return await request(path, params)
}

export const exchanges = async params => {
  const path = '/exchanges'
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

export const derivatives_xchange = async (id, params) => {
  const path = `/derivatives/exchanges/${id}`
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
  return await request(path, params)
}