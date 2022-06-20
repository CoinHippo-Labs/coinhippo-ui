const routes = [
  { pathname: '/' },
  { pathname: '/tokens' },
  { pathname: '/tokens/high-volume' },
  { pathname: '/tokens/categories' },
  { pathname: '/tokens/[category]' },
  { pathname: '/token' },
  { pathname: '/token/[token_id]' },
  { pathname: '/derivatives' },
  { pathname: '/derivatives/[derivative_type]' },
  { pathname: '/exchanges' },
  { pathname: '/exchanges/[exchange_type]' },
  { pathname: '/exchange' },
  { pathname: '/exchange/[exchange_id]' },
  { pathname: '/public-companies' },
  { pathname: '/public-companies/[token_id]' },
  { pathname: '/widgets' },
]

export const is_route_exist = pathname => routes.findIndex((route, i) => {
  if (route.pathname === pathname) return true
  if (route.pathname.split('/').filter(p => p).length === pathname.split('/').filter(p => p).length) {
    const routePathnameSplit = route.pathname.split('/').filter(p => p)
    const pathnameSplit = pathname.split('/').filter(p => p)
    return !(routePathnameSplit.findIndex((p, j) => !(p.startsWith('[') && p.endsWith(']')) && p !== pathnameSplit[j]) > -1)
  }
  return false
}) > -1