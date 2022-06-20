import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import Global from '../components/dashboard/global'
import CoinPrices from '../components/navbar/coin-prices'
import FearAndGreed from '../components/dashboard/fear-and-greed'
import Dominance from '../components/dashboard/dominance'
import TopMovers from '../components/dashboard/top-movers'
import Trending from '../components/dashboard/trending'
import TopCoins from '../components/dashboard/top-coins'
import TopExchages from '../components/dashboard/top-exchanges'
import Image from '../components/image'
import { TiArrowRight } from 'react-icons/ti'
import { BiCoinStack, BiTransferAlt } from 'react-icons/bi'
import { IoGameControllerOutline } from 'react-icons/io5'
import { RiSeedlingLine, RiPlantLine } from 'react-icons/ri'
import _ from 'lodash'
import { cryptoGlobal, simplePrice } from '../lib/api/coingecko'
import { fear_and_greed as getFG } from '../lib/api/fear-and-greed'
import { navigations } from '../lib/menus'
import { is_route_exist } from '../lib/routes'
import { getName } from '../lib/utils'
import { GLOBAL_DATA } from '../reducers/types'

export default function Index() {
  const dispatch = useDispatch()
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }

  const router = useRouter()
  const { query, pathname, asPath } = { ...router }
  const { widget } = { ...query }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  const [bitcoin, setBitcoin] = useState(null)
  const [fearAndGreedData, setFearAndGreedData] = useState(null)

  const ecosystems = navigations.filter(navigation => navigation.title === 'Cryptocurrencies').flatMap(navigation => navigation.items.filter(item => item.title === 'Categories')).flatMap(item => item.items.filter(_item => _item.isEcosystem).map(_item => { return { ..._item, id: _.last(_item.url.split('/').filter(path => path)) } }))
  const [ecosystem, setEcosystem] = useState(ecosystems[0].id)

  useEffect(() => {
    const getBitcoin = async () => {
      const response = await simplePrice({ ids: 'bitcoin', vs_currencies: vs_currency, include_market_cap: true, include_24hr_change: true })

      if (response && response.bitcoin) {
        setBitcoin(response.bitcoin)
      }
    }

    if ((query && Object.keys(query).length > 0 && !widget) || _asPath === asPath) {
      getBitcoin()
    }

    const interval = setInterval(() => getBitcoin(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [vs_currency, query, widget])

  useEffect(() => {
    const getCryptoGlobal = async () => {
      const response = await cryptoGlobal()

      if (response && response.data) {
        dispatch({
          type: GLOBAL_DATA,
          value: response.data
        })
      }
    }

    if ((query && Object.keys(query).length > 0 && (!widget || ['dominance'].includes(widget))) || _asPath === asPath) {
      getCryptoGlobal()
    }

    const interval = setInterval(() => getCryptoGlobal(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [query, widget])

  useEffect(() => {
    const getFearAndGreed = async () => {
      const response = await getFG()
      if (response && response.data) {
        if (mountedRef.current) {
          setFearAndGreedData(response.data)
        }
      }
    }

    if ((query && Object.keys(query).length > 0 && (!widget || ['fear-and-greed'].includes(widget))) || _asPath === asPath) {
      getFearAndGreed()
    }
  }, [query, widget])

  if (typeof window !== 'undefined' && pathname !== _asPath) {
    router.push(is_route_exist(_asPath) ? asPath : '/404')
  }

  if (typeof window === 'undefined' || pathname !== _asPath) {
    return (
      <span className="min-h-screen" />
    )
  }

  return (
    <>
      {!widget && (
        <div
          title="Overview"
          subtitle="Dashboard"
          right={<div className="flex flex-wrap items-center ml-0 sm:ml-4">
            {navigations.filter(item => item.index_shortcut || item.items.findIndex(_item => _item.index_shortcut || _item.items.findIndex(__item => __item.index_shortcut) > -1) > -1)
              .flatMap(item => item.index_shortcut ? item : item.items.flatMap(_item => _item.index_shortcut ? _item : _item.items.filter(__item => __item.index_shortcut)))
              .map((navigationItemData, i) => (
                <Link key={i} href={navigationItemData.url}>
                  <a>
                    <div size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium mt-1 mr-1 py-1 pl-1.5 pr-1">
                      {navigationItemData.index_shortcut}
                      <TiArrowRight size={16} className="transform -rotate-45" />
                    </div>
                  </a>
                </Link>
              ))
            }
            {process.env.NEXT_PUBLIC_BRIDGE_URL && (
              <a
                href={process.env.NEXT_PUBLIC_BRIDGE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div size="sm" rounded color="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-0 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 font-medium mt-1 mr-1 py-1 pl-1.5 pr-1">
                  Bridge
                  <TiArrowRight size={16} className="transform -rotate-45" />
                </div>
              </a>
            )}
          </div>}
          className="flex-col sm:flex-row items-start sm:items-center mx-1"
        />
      )}
      {(!widget || ['market_status'].includes(widget)) && (
        <Global bitcoin={bitcoin} />
      )}
      {(!widget || ['price-marquee', 'fear-and-greed', 'dominance', 'top-movers', 'trending'].includes(widget)) && (
        <div className={`w-full grid grid-flow-row grid-cols-1 ${!(['price-marquee'].includes(widget)) ? 'sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4' : ''} gap-4 lg:gap-2 xl:gap-4 mb-4 lg:mb-2 xl:mb-4 ${query.theme === 'dark' && widget ? '-mt-4 -ml-4' : ''}`}>
          {['price-marquee'].includes(widget) && (
            <CoinPrices />
          )}
          {(!widget || ['fear-and-greed'].includes(widget)) && (
            <FearAndGreed data={fearAndGreedData} noBorder={['fear-and-greed'].includes(widget)} />
          )}
          {(!widget || ['dominance'].includes(widget)) && (
            <Dominance noBorder={['dominance'].includes(widget)} />
          )}
          {(!widget || ['top-movers'].includes(widget)) && (
            <TopMovers noBorder={['top-movers'].includes(widget)} />
          )}
          {(!widget || ['trending'].includes(widget)) && (
            <Trending noBorder={['trending'].includes(widget)} />
          )}
        </div>
      )}
      {!widget && (
        <div className={`w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-2 xl:gap-4 mb-4 lg:mb-2 xl:mb-4 ${query.theme === 'dark' && widget ? '-mt-4 -ml-4' : ''}`}>
          <TopCoins
            title="Top Market Cap"
            icon={<BiCoinStack size={28} />}
          />
          <TopExchages
            title="Top Exchanges by Confidence"
            icon={<BiTransferAlt size={28} />}
          />
          <TopCoins
            category="non-fungible-tokens-nft"
            title="Top NFTs"
            icon={<IoGameControllerOutline size={28} />}
          />
          <TopCoins
            category="decentralized-finance-defi"
            title="Top DeFi"
            icon={<RiSeedlingLine size={28} />}
          />
          <TopExchages
            exchange_type="dex"
            title="Top DEX by Volume"
            icon={<RiPlantLine size={28} />}
          />
          <TopCoins
            category={ecosystem}
            title={<>
              <div className="h-4 text-xs">{ecosystems[ecosystems.findIndex(_ecosystem => _ecosystem.id === ecosystem)].title}</div>
              <div className="h-4 normal-case text-gray-400 dark:text-gray-600 font-light" style={{ fontSize: '.65rem' }}>Ecosystem</div>
            </>}
            icon={ecosystems && ecosystems.length > 0 && (
              <div className="flex flex-wrap items-center space-x-1">
                {ecosystems.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setEcosystem(item.id)}
                    className={`btn btn-raised btn-circle cursor-pointer ${item.id === ecosystem ? 'bg-indigo-50 dark:bg-gray-700' : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800'} p-2`}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      width={16}
                      height={16}
                      className="rounded"
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