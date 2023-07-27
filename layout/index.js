import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import PageVisibility from 'react-page-visibility'
import _ from 'lodash'

import Navbar from '../components/navbar'
import Footer from '../components/footer'
import meta from '../lib/meta'
import { getChains } from '../lib/api'
import { getCryptos, getCategories, getGlobal, getTrendingSearch, getExchangeRates } from '../lib/api/coingecko'
import { toArray, equalsIgnoreCase } from '../lib/utils'
import { THEME, PAGE_VISIBLE, CHAINS_DATA, CRYPTOS_DATA, GLOBAL_DATA, TRENDING_DATA, RATES_DATA } from '../reducers/types'

export default ({ children }) => {
  const dispatch = useDispatch()
  const { preferences, chains, _global, trending, rates } = useSelector(state => ({ preferences: state.preferences, chains: state.chains, _global: state.global, trending: state.trending, rates: state.rates }), shallowEqual)
  const { chains_data } = { ...chains }
  const { global_data } = { ..._global }
  const { trending_data } = { ...trending }
  const { rates_data } = { ...rates }

  const router = useRouter()
  const { asPath, query } = { ...router }
  const { widget } = { ...query }
  let { theme } = { ...query }
  theme = theme || preferences?.theme

  useEffect(
    () => {
      if (typeof window !== 'undefined') {
        const _theme = localStorage.getItem(THEME)
        if (_theme && _theme !== theme) {
          dispatch({ type: THEME, value: _theme })
        }
      }
    },
    [theme],
  )

  // chains
  useEffect(
    () => {
      const getData = async () => {
        const response = await getChains()
        dispatch({ type: CHAINS_DATA, value: toArray(response || chains_data) })
      }
      getData()
    },
    [],
  )

  // cryptos
  useEffect(
    () => {
      const getData = async () => {
        const response = await getCryptos()
        let { categories } = { ...response }
        if (response) {
          categories = toArray(categories)
          if (categories.length > 0) {
            const _response = await getCategories()
            if (toArray(_response).length > 0) {
              categories = categories.map(d => {
                const { name } = { ...d }
                let { category_id } = { ...d }
                category_id = toArray(_response).find(_d => equalsIgnoreCase(_d.name, name))?.category_id || category_id
                return { ...d, category_id }
              }).filter(c => c.category_id)
            }
            response.categories = categories
          }
          delete response.time_spent
          dispatch({ type: CRYPTOS_DATA, value: response })
        }
      }
      getData()
    },
    [],
  )

  // global
  useEffect(
    () => {
      const getData = async () => {
        if (!widget || widget === 'dominance') {
          const response = await getGlobal()
          const { data } = { ...response }
          dispatch({ type: GLOBAL_DATA, value: data || global_data })
        }
      }

      getData()
      const interval = setInterval(() => getData(), 3 * 60 * 1000)
      return () => clearInterval(interval)
    },
    [widget],
  )

  // trending
  useEffect(
    () => {
      const getData = async () => {
        const response = await getTrendingSearch()
        const { coins } = { ...response }
        dispatch({ type: TRENDING_DATA, value: toArray(coins || trending_data) })
      }

      getData()
      const interval = setInterval(() => getData(), 5 * 60 * 1000)
      return () => clearInterval(interval)
    },
    [],
  )

  // rates
  useEffect(
    () => {
      const getData = async () => {
        const response = await getExchangeRates()
        const { rates } = { ...response }
        dispatch({ type: RATES_DATA, value: { ...(rates || rates_data) } })
      }

      getData()
      const interval = setInterval(() => getData(), 5 * 60 * 1000)
      return () => clearInterval(interval)
    },
    [],
  )

  const { title, description, image, url } = { ...meta(asPath) }

  return (
    <>
      <Head>
        <title>
          {title}
        </title>
        <meta
          name="og:site_name"
          property="og:site_name"
          content={title}
        />
        <meta
          name="og:title"
          property="og:title"
          content={title}
        />
        <meta
          itemProp="name"
          content={title}
        />
        <meta
          itemProp="headline"
          content={title}
        />
        <meta
          itemProp="publisher"
          content={title}
        />
        <meta
          name="twitter:title"
          content={title}
        />

        <meta
          name="description"
          content={description}
        />
        <meta
          name="og:description"
          property="og:description"
          content={description}
        />
        <meta
          itemProp="description"
          content={description}
        />
        <meta
          name="twitter:description"
          content={description}
        />

        <meta
          name="og:image"
          property="og:image"
          content={image}
        />
        <meta
          itemProp="thumbnailUrl"
          content={image}
        />
        <meta
          itemProp="image"
          content={image}
        />
        <meta
          name="twitter:image"
          content={image}
        />
        <link
          rel="image_src"
          href={image}
        />

        <meta
          name="og:url"
          property="og:url"
          content={url}
        />
        <meta
          itemProp="url"
          content={url}
        />
        <meta
          name="twitter:url"
          content={url}
        />
        <link
          rel="canonical"
          href={url}
        />
      </Head>
      <PageVisibility onChange={v => dispatch({ type: PAGE_VISIBLE, value: v })}>
        <div
          data-layout="layout"
          data-background={theme}
          data-navbar={theme}
          className={`min-h-screen antialiased disable-scrollbars text-sm ${theme}`}
        >
          <div className="wrapper">
            <div className="main w-full bg-white dark:bg-black">
              <Navbar />
              <div className="w-full">
                {children}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </PageVisibility>
    </>
  )
}