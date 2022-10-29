import { exchange_type, affiliate_links, trade_url } from '../../object/exchange'

const _module = 'coingecko'

const request = async (
  path,
  params,
) => {
  params = {
    ...params,
    path,
    module: _module,
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL,
    {
      method: 'POST',
      body: JSON.stringify(params),
    },
  ).catch(error => { return null })

  return response &&
    await response.json()
}

export const cryptos = async params => {
  const response = await request(
    '/search',
    {
      ...params,
      cache: true,
      cache_timeout: 15,
    },
  )

  const {
    exchanges,
  } = { ...response }

  if (Array.isArray(exchanges)) {
    response.exchanges = exchanges
      .map(e => {
        const {
          id,
        } = { ...e }

        return {
          ...e,
          exchange_type: exchange_type(id),
        }
      })
  }

  return response
}

export const categories = async params =>
  await request(
    '/coins/categories/list',
    {
      ...params,
      cache: true,
      cache_timeout: 15,
    },
  )

export const trending_search = async params =>
  await request(
    '/search/trending',
    {
      ...params,
      cache: true,
      cache_timeout: 5,
    },
  )

export const exchange_rates = async params =>
  await request(
    '/exchange_rates',
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

export const _global = async params =>
  await request(
    '/global',
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

export const defi_global = async params =>
  await request(
    '/global/decentralized_finance_defi',
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

export const simple_price = async params =>
  await request(
    '/simple/price',
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

export const tokens_markets = async params =>
  await request(
    '/coins/markets',
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

export const categories_markets = async params =>
  await request(
    '/coins/categories',
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

export const token = async (
  id,
  params,
) =>
  await request(
    `/coins/${id}`,
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

export const token_tickers = async (
  id,
  params,
) => {
  const response = await request(
    `/coins/${id}/tickers`,
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

  const {
    tickers,
  } = { ...response }

  if (Array.isArray(tickers)) {
    response.tickers = tickers
      .map(t => {
        return {
          ...t,
          trade_url:
            affiliate_links(
              trade_url(t)
            ),
        }
      })
  }

  return response
}

export const derivatives = async params =>
  await request(
    '/derivatives',
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

export const exchanges = async params => {
  let response = await request(
    '/exchanges',
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

  if (Array.isArray(response)) {
    response = response
      .map(e => {
        const {
          id,
          url,
        } = { ...e }

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
  let response = await request(
    '/derivatives/exchanges',
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

  if (Array.isArray(response)) {
    response = response
      .map(e => {
        const {
          id,
          url,
        } = { ...e }

        return {
          ...e,
          exchange_type: exchange_type(id),
          url: affiliate_links(url),
        }
      })
  }

  return response
}

export const exchange = async (
  id,
  params,
) => {
  let response = await request(
    `/exchanges/${id}`,
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

  if (
    response &&
    !response.error
  ) {
    const {
      id,
      url,
      tickers,
    } = { ...response }

    response = {
      ...response,
      exchange_type: exchange_type(id),
      url: affiliate_links(url),
      tickers: (tickers || [])
        .map(t => {
          return {
            ...t,
            trade_url:
              affiliate_links(
                trade_url(t)
              ),
          }
        })
    }
  }

  return response
}

export const derivatives_exchange = async (
  id,
  params,
) => {
  let response = await request(
    `/derivatives/exchanges/${id}`,
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

  if (
    response &&
    !response.error
  ) {
    const {
      id,
      url,
      tickers,
    } = { ...response }

    response = {
      ...response,
      exchange_type: exchange_type(id),
      url: affiliate_links(url),
      tickers: (tickers || [])
        .map(t => {
          return {
            ...t,
            trade_url:
              affiliate_links(
                trade_url(t)
              ),
          }
        })
    }
  }

  return response
}

export const exchange_tickers = async (
  id,
  params,
) => {
  const response = await request(
    `/exchanges/${id}/tickers`,
    {
      ...params,
      cache: true,
      cache_timeout: 1,
    },
  )

  const {
    tickers,
  } = { ...response }

  if (Array.isArray(tickers)) {
    response.tickers = tickers
      .map(t => {
        return {
          ...t,
          trade_url:
            affiliate_links(
              trade_url(t)
            ),
        }
      })
  }

  return response
}

export const public_companies = async (
  id,
  params,
) =>
  await request(
    `/companies/public_treasury/${id}`,
    {
      ...params,
      cache: true,
      cache_timeout: 15,
    },
  )