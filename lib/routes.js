const routes = [
  { pathname: '/' },
  { pathname: '/tokens' },
  { pathname: '/tokens/high-volume' },
  { pathname: '/tokens/categories' },
  { pathname: '/tokens/[category]' },
  { pathname: '/token/[token_id]' },
  { pathname: '/derivatives' },
  { pathname: '/derivatives/[derivative_type]' },
  { pathname: '/exchanges' },
  { pathname: '/exchanges/[exchange_type]' },
  { pathname: '/exchange/[exchange_id]' },
  { pathname: '/public-companies' },
  { pathname: '/public-companies/[token_id]' },
  { pathname: '/widgets' },
  { pathname: '/transfer' },
  { pathname: '/bridge' },
  { pathname: '/swap' },
]

export const is_route_exist = pathname =>
  routes.findIndex((r, i) => {
    if (r.pathname === pathname)
      return true

    if (
      r.pathname
        .split('/')
        .filter(p => p)
        .length ===
      pathname
        .split('/')
        .filter(p => p)
        .length
    ) {
      const route_paths = r.pathname
        .split('/')
        .filter(p => p)

      const paths = pathname
        .split('/')
        .filter(p => p)

      return !(
        route_paths.findIndex((p, j) =>
          !(
            p.startsWith('[') &&
              p.endsWith(']')
          ) &&
          p !== paths[j]
        ) > -1
      )
    }

    return false
  }) > -1