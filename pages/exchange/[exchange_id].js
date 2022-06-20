import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Exchange from '../../components/exchange'
import Image from '../../components/image'
import { exchange, derivativesExchange } from '../../lib/api/coingecko'
import meta from '../../lib/meta'
import { getName } from '../../lib/utils'

export default function ExchangeId() {
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { all_crypto_data } = { ...data }

  const router = useRouter()
  const { query, asPath } = { ...router }
  const { exchange_id } = { ...query }

  const [exchangeData, setExchangeData] = useState(null)

  useEffect(() => {
    const getExchange = async () => {
      const _exchangeData = all_crypto_data.exchanges[all_crypto_data.exchanges.findIndex(exchangeData => exchangeData.id === exchange_id)]

      const response = await (_exchangeData.market_type !== 'spot' ? derivativesExchange(exchange_id, { include_tickers: 'unexpired' }) : exchange(exchange_id))

      if (response && !response.error) {
        setExchangeData({
          ...response,
          ..._exchangeData,
          trust_score_rank: typeof response.trust_score_rank === 'string' ? Number(response.trust_score_rank) : typeof response.trust_score_rank === 'number' ? response.trust_score_rank : -1,
          trust_score: typeof response.trust_score === 'string' ? Number(response.trust_score) : typeof response.trust_score === 'number' ? response.trust_score : -1,
        })
      }
    }

    if (all_crypto_data && all_crypto_data.exchanges && all_crypto_data.exchanges.findIndex(exchangeData => exchangeData.id === exchange_id) > -1) {
      getExchange()
    }

    const interval = setInterval(() => getExchange(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [all_crypto_data, exchange_id])

  const headMeta = meta(asPath, exchangeData)

  return (
    <>
      <Head>
        <title>{headMeta.title}</title>
        <meta name="og:site_name" property="og:site_name" content={headMeta.title} />
        <meta name="og:title" property="og:title" content={headMeta.title} />
        <meta itemProp="name" content={headMeta.title} />
        <meta itemProp="headline" content={headMeta.title} />
        <meta itemProp="publisher" content={headMeta.title} />
        <meta name="twitter:title" content={headMeta.title} />

        <meta name="description" content={headMeta.description} />
        <meta name="og:description" property="og:description" content={headMeta.description} />
        <meta itemProp="description" content={headMeta.description} />
        <meta name="twitter:description" content={headMeta.description} />

        <meta name="og:image" property="og:image" content={headMeta.image} />
        <meta itemProp="thumbnailUrl" content={headMeta.image} />
        <meta itemProp="image" content={headMeta.image} />
        <meta name="twitter:image" content={headMeta.image} />
        <link rel="image_src" href={headMeta.image} />

        <meta name="og:url" property="og:url" content={headMeta.url} />
        <meta itemProp="url" content={headMeta.url} />
        <meta name="twitter:url" content={headMeta.url} />
        <link rel="canonical" href={headMeta.url} />
      </Head>
      <div
        title={<span className="space-x-1">{exchangeData && (<span>{getName(exchangeData.market_type)}</span>)}<span>Exchange</span></span>}
        subtitle={exchangeData ?
          <>
            <div className="flex items-center space-x-2 mt-1.5">
              <Image
                src={exchangeData.large || exchangeData.thumb}
                alt=""
                width={32}
                height={32}
                className="rounded"
              />
              <span>{exchangeData.name}</span>
            </div>
            <span>
              {exchangeData.country && (
                <div size="sm" rounded color="bg-blue-500 text-gray-100 dark:bg-blue-700 mr-1.5">{exchangeData.country}</div>
              )}
              {exchangeData.year_established && (
                <div size="sm" rounded color="bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200">{exchangeData.year_established}</div>
              )}
            </span>
          </>
          :
          getName(exchange_id)
        }
        right={exchangeData ?
          <div className="flex flex-col items-end space-y-0.5">
            {exchangeData.url && (
              <a href={exchangeData.url} target="_blank" rel="noopener noreferrer" className="btn btn-raised min-w-max btn-rounded bg-indigo-600 hover:bg-indigo-700 text-white hover:text-gray-50 text-xs my-1 p-2.5">
                Start Trading
              </a>
            )}
            <span className="text-gray-400 text-xs font-normal">
              {getName(typeof exchangeData.centralized === 'boolean' ? exchangeData.centralized ? 'centralized' : 'decentralized' : exchangeData.exchange_type)}
            </span>
          </div>
          :
          <div className="skeleton w-28 h-10 rounded" />
        }
        className="flex-col sm:flex-row items-start sm:items-center mx-1"
      />
      <Exchange exchangeData={exchangeData} />
    </>
  )
}