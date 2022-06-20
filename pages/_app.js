import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import NProgress from 'nprogress'

import { useStore } from '../store'
import Layout from '../layouts'
import * as ga from '../lib/api/ga'
import '../styles/globals.css'
import '../styles/animate.css'
import '../styles/layout.css'
import '../styles/tailwind.css'
import '../styles/components/button.css'
import '../styles/components/dropdown.css'
import '../styles/components/sidebar/sm.css'
import '../styles/components/sidebar/lg.css'
import '../styles/components/modals.css'
import '../styles/components/navbar.css'
import '../styles/components/nprogress.css'
import '../styles/components/skeleton.css'
import '../styles/components/table.css'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default ({ Component, pageProps }) => {
  const router = useRouter()
  const store = useStore(pageProps.initialReduxState)

  useEffect(() => {
    const handleRouteChange = url => ga.pageview(url)
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.png" />
        <meta name="msapplication-TileColor" content="#050707" />
        <meta name="msapplication-TileImage" content="/icons/mstile-150x150.png" />
        <meta name="theme-color" content="#050707" />
      </Head>
      <Provider store={store}>
        <Layout>
          <div id="portal" />
          <Component { ...pageProps } />
          <div className="bg-green-400 bg-green-600 text-green-400 text-green-600 bg-red-400 bg-red-600 text-red-400 text-red-600" />
        </Layout>
      </Provider>
    </>
  )
}