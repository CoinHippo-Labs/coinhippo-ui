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
import routes from '../navbar/navigations/routes'
import { getGlobal, getSimplePrice, getTokensMarkets } from '../../lib/api/coingecko'
import { getFearAndGreed } from '../../lib/api'
import { split } from '../../lib/utils'
import { GLOBAL_DATA } from '../../reducers/types'

export default () => {
  const dispatch = useDispatch()

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }

  const ecosystems = routes.filter(d => d.is_ecosystem).map(d => {
    const { path } = { ...d }
    return {
      ...d,
      id: _.last(split(path, 'normal', '/')),
    }
  })

  const [bitcoin, setBitcoin] = useState(null)
  const [fearAndGreed, setFearAndGreed] = useState(null)
  const [tokens, setTokens] = useState(null)
  const [ecosystem, setEcosystem] = useState(_.head(ecosystems)?.id)

  useEffect(
    () => {
      const getData = async () => {
        if (!widget) {
          const { bitcoin } = { ...await getSimplePrice({ ids: 'bitcoin', vs_currencies: 'usd', include_market_cap: true, include_24hr_change: true }) }
          if (bitcoin) {
            setBitcoin(bitcoin)
          }
        }
      }

      getData()
      const interval = setInterval(() => getData(), 3 * 60 * 1000)
      return () => clearInterval(interval)
    },
    [],
  )

  useEffect(
    () => {
      const getData = async () => {
        if (!widget || widget === 'fear-and-greed') {
          const { data } = { ...await getFearAndGreed() }
          if (data) {
            setFearAndGreed(data)
          }
        }
      }
      getData()
    },
    [widget],
  )

  useEffect(
    () => {
      const getData = async () => {
        if (!widget || widget === 'dominance') {
          const { data } = { ...await getGlobal() }
          if (data) {
            dispatch({ type: GLOBAL_DATA, value: data })
          }
        }
      }

      getData()
      const interval = setInterval(() => getData(), 3 * 60 * 1000)
      return () => clearInterval(interval)
    },
    [widget],
  )

  useEffect(
    () => {
      const getData = async () => {
        if (widget === 'price-marquee') {
          const response = await getTokensMarkets({ vs_currency: 'usd', order: 'market_cap_desc', per_page: 10, page: 1, price_change_percentage: '24h', ...query })
          const { error } = { ...response }
          if (!error) {
            setTokens(response)
          }
        }
      }

      getData()
      const interval = setInterval(() => getData(), 3 * 60 * 1000)
      return () => clearInterval(interval)
    },
    [widget],
  )

  return (
    <div className="mx-3">
      {!widget && (
        <div className="flex items-center my-2">
          <span className="text-xl font-bold">
            Overview
          </span>
        </div>
      )}
      {!widget && <Global bitcoin={bitcoin} />}
      {(!widget || ['price-marquee', 'fear-and-greed', 'dominance', 'top-movers', 'trending'].includes(widget)) && (
        <div className={`w-full grid grid-cols-1 ${widget !== 'price-marquee' ? 'sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4' : ''} gap-4 lg:gap-2 xl:gap-4 my-4 lg:my-2 xl:my-4`}>
          {widget === 'price-marquee' && <MargueeTokens data={tokens} />}
          {(!widget || widget === 'fear-and-greed') && <FearAndGreed data={fearAndGreed} />}
          {(!widget || widget === 'dominance') && <Dominance />}
          {(!widget || widget === 'top-movers') && <TopMovers />}
          {(!widget || widget === 'trending') && <Trending />}
        </div>
      )}
      {!widget && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-2 xl:gap-4 mb-4 lg:mb-2 xl:mb-4">
          <TopTokens title="Top Market Cap" />
          <TopExchages title="Top Exchanges by Confidence" />
          <TopTokens category="non-fungible-tokens-nft" title="Top NFTs" />
          <TopTokens category="decentralized-finance-defi" title="Top DeFi" icon={<RiSeedlingLine size={20} />} />
          <TopExchages exchange_type="dex" title="Top DEX by Volume" icon={<RiPlantLine size={20} />} />
          <TopTokens
            category={ecosystem}
            title={
              <span className="whitespace-nowrap uppercase text-blue-400 dark:text-blue-500 text-base">
                {ecosystems.find(d => d.id === ecosystem)?.title}
              </span>
            }
            icon={
              ecosystems.length > 0 && (
                <div className="flex flex-wrap items-center space-x-1.5">
                  {ecosystems.map((d, i) => {
                    const { id, image } = { ...d }
                    return (
                      <div
                        key={i}
                        onClick={() => setEcosystem(id)}
                        className={`w-6 h-6 rounded-full cursor-pointer ${id === ecosystem ? 'bg-blue-50 dark:bg-slate-800' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900'} p-1`}
                      >
                        <Image
                          src={image}
                          width={16}
                          height={16}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            }
          />
        </div>
      )}
    </div>
  )
}