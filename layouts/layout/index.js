import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import Navbar from '../../components/navbar'
import Sidebar from '../../components/sidebar'
import Footer from '../../components/footer'
import meta from '../../lib/meta'
import { THEME, COLLAPSED } from '../../reducers/types'

export default ({
  children,
  noSiderbar = false,
  noNavbar = false,
  noFooter = false,
  customTheme = '',
}) => {
  const dispatch = useDispatch()
  const {
    preferences,
  } = useSelector(state =>
    (
      {
        preferences: state.preferences,
      },
    ),
    shallowEqual,
  )
  const {
    theme,
    collapsed,
  } = { ...preferences }

  const router = useRouter()
  const {
    asPath,
  } = { ...router }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (
        localStorage.getItem(THEME) &&
        localStorage.getItem(THEME) !== theme
      ) {
        dispatch(
          {
            type: THEME,
            value: localStorage.getItem(THEME),
          }
        )
      }

      if (localStorage.getItem(COLLAPSED)) {
        const _collapsed = localStorage.getItem(COLLAPSED) === 'true'

        if (_collapsed !== collapsed) {
          dispatch(
            {
              type: COLLAPSED,
              value: _collapsed,
            }
          )
        }
      }
    }
  }, [theme, collapsed])

  const headMeta =
    meta(
      asPath,
    )

  const {
    title,
    description,
    image,
    url,
  } = { ...headMeta }

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
      <div
        data-layout="layout"
        data-collapsed={collapsed}
        data-background={
          customTheme ||
          theme
        }
        data-navbar={
          customTheme ||
          theme
        }
        data-sidebar={
          customTheme ||
          theme
        }
        className={`antialiased disable-scrollbars font-sans text-sm ${customTheme || theme}`}
      >
        <div className="wrapper">
          {
            !noSiderbar &&
            (
              <Sidebar />
            )
          }
          <div
            className="main w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-white"
            style={{
              minHeight: 'calc(100vh - 44px)',
            }}
          >
            {
              !noNavbar &&
              (
                <Navbar
                  noSiderbar={noSiderbar}
                />
              )
            }
            <div className="w-full px-2 sm:px-4">
              {children}
            </div>
          </div>
        </div>
        {
          !noFooter &&
          (
            <Footer />
          )
        }
      </div>
    </>
  )
}