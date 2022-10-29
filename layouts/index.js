import { useRouter } from 'next/router'

import Empty from './empty'
import Layout from './layout'

export default ({
  children,
}) => {
  const router = useRouter()
  const {
    pathname,
    query,
  } = { ...router }
  const {
    view,
    widget,
    theme,
  } = { ...query }

  if (
    [
      'widget',
    ].includes(view) ||
    widget
  ) {
    if (
      [
        'dark',
      ].includes(theme)
    ) {
      return (
        <Layout
          noSiderbar={true}
          noNavbar={true}
          noFooter={true}
          customTheme={theme}
        >
          {children}
        </Layout>
      )
    }

    return (
      <Empty>
        {children}
      </Empty>
    )
  }
  else {
    return (
      <Layout>
        {children}
      </Layout>
    )
  }
}