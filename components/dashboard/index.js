import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import _ from 'lodash'
import { RiSeedlingLine, RiPlantLine } from 'react-icons/ri'

import Global from './global'
import MargueeTokens from '../marquee-tokens'
import FearAndGreed from './fear-and-greed'
import Dominance from './dominance'
import TopMovers from './top-movers'
import Trending from './trending'
import TopTokens from './top-tokens'
import TopExchages from './top-exchanges'
import Image from '../image'
import { _global, simple_price, tokens_markets } from '../../lib/api/coingecko'
import { fear_and_greed } from '../../lib/api/fear-and-greed'
import { currency } from '../../lib/object/currency'
import menus from '../sidebar/menus'
import { name } from '../../lib/utils'
import { STATUS_DATA } from '../../reducers/types'

export default () => {
  const dispatch = useDispatch()

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }

  const ecosystems = menus?.find(m => m?.title === 'Cryptocurrencies')?.items?.find(m => m?.title === 'Categories')?.items?.filter(m => m?.is_ecosystem).map(m => {
    return {
      ...m,
      id: _.last(m?.url.split('/').filter(p => p)),
    }
  })
  const [bitcoin, setBitcoin] = useState(null)
  const [fearAndGreed, setFearAndGreed] = useState(null)
  const [tokens, setTokens] = useState(null)
  const [ecosystem, setEcosystem] = useState(_.head(ecosystems)?.id)

  useEffect(() => {
    const getData = async () => {
      if (!widget) {
        const response = await simple_price({
          ids: 'bitcoin',
          vs_currencies: currency,
          include_market_cap: true,
          include_24hr_change: true,
        })
        if (response?.bitcoin) {
          setBitcoin(response.bitcoin)
        }
      }
    }
    getData()
    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const getData = async () => {
      if (!widget || ['fear-and-greed'].includes(widget)) {
        const response = await fear_and_greed()
        if (response?.data) {
          setFearAndGreed(response.data)
        }
      }
    }
    getData()
  }, [widget])

  useEffect(() => {
    const getData = async () => {
      if (!widget || ['dominance'].includes(widget)) {
        const response = await _global()
        if (response?.data) {
          dispatch({
            type: STATUS_DATA,
            value: response.data,
          })
        }
      }
    }
    getData()
    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [widget])

  useEffect(() => {
    const getData = async () => {
      if (['price-marquee'].includes(widget)) {
        const response = await tokens_markets({
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          price_change_percentage: '24h',
          ...query,
        })
        if (!response?.error) {
          setTokens(response)
        }
      }
    }
    getData()
    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [widget])

  return (
    <>
      {!widget && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-x-4 my-2">
          <span className="text-xl font-bold">
            Overview
          </span>
          <div className="flex items-center space-x-2">
            {menus.filter(m => m?.index_shortcut || m?.items?.findIndex(_m => _m?.index_shortcut || _m?.items?.findIndex(__m => __m?.index_shortcut) > -1) > -1)
              .flatMap(m => m?.index_shortcut ? m : m?.items.flatMap(_m => _m?.index_shortcut ? _m : _m?.items?.filter(__m => __m?.index_shortcut)))
              .map((m, i) => (
                <Link
                  key={i}
                  href={m.url}
                >
                <a
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg text-blue-500 hover:text-blue-600 dark:text-slate-200 dark:hover:text-white font-semibold mt-1 mr-1 py-1 px-2"
                >
                  {m.index_shortcut}
                </a>
                </Link>
              ))
            }
          </div>
        </div>
      )}
      {!widget && (
        <Global bitcoin={bitcoin} />
      )}
      {(!widget || ['price-marquee', 'fear-and-greed', 'dominance', 'top-movers', 'trending'].includes(widget)) && (
        <div className={`w-full grid grid-flow-row grid-cols-1 ${!['price-marquee'].includes(widget) ? 'sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4' : ''} gap-4 lg:gap-2 xl:gap-4 mb-4 lg:mb-2 xl:mb-4`}>
          {['price-marquee'].includes(widget) && (
            <MargueeTokens data={tokens} />
          )}
          {(!widget || ['fear-and-greed'].includes(widget)) && (
            <FearAndGreed data={fearAndGreed} />
          )}
          {(!widget || ['dominance'].includes(widget)) && (
            <Dominance />
          )}
          {(!widget || ['top-movers'].includes(widget)) && (
            <TopMovers />
          )}
          {(!widget || ['trending'].includes(widget)) && (
            <Trending />
          )}
        </div>
      )}
      {!widget && (
        <div className={`w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-2 xl:gap-4 mb-4 lg:mb-2 xl:mb-4`}>
          <TopTokens title="Top Market Cap" />
          <TopExchages title="Top Exchanges by Confidence" />
          <TopTokens
            category="non-fungible-tokens-nft"
            title="Top NFTs"
          />
          <TopTokens
            category="decentralized-finance-defi"
            title="Top DeFi"
            icon={<RiSeedlingLine size={20} />}
          />
          <TopExchages
            exchange_type="dex"
            title="Top DEX by Volume"
            icon={<RiPlantLine size={20} />}
          />
          <TopTokens
            category={ecosystem}
            title={<div className="flex flex-col">
              <div className="text-xs font-semibold">
                {ecosystems?.find(e => e?.id === ecosystem)?.title}
              </div>
            </div>}
            icon={ecosystems?.length > 0 && (
              <div className="flex flex-wrap items-center space-x-1.5">
                {ecosystems.map((e, i) => (
                  <div
                    key={i}
                    onClick={() => setEcosystem(e.id)}
                    className={`w-6 h-6 rounded-full cursor-pointer shadow dark:shadow-slate-400 ${e.id === ecosystem ? 'bg-blue-50 dark:bg-slate-800' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900'} p-1`}
                  >
                    <Image
                      src={e.image}
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      )}
    </>
  )
}