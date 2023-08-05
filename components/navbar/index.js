import { useState, useEffect } from 'react'
import _ from 'lodash'

import Logo from './logo'
import DropdownNavigations from './navigations/dropdown'
import Navigations from './navigations'
import Search from './search'
import Gas from './gas'
import Theme from './theme'
import MargueeTokens from '../marquee-tokens'
import { getTokensMarkets } from '../../lib/api/coingecko'
import { toArray } from '../../lib/utils'

export default () => {
  const [tokens, setTokens] = useState(null)

  useEffect(
    () => {
      const getData = async () => {
        const response = await getTokensMarkets({ vs_currency: 'usd', order: 'market_cap_desc', per_page: 10, page: 1, price_change_percentage: '24h' })
        setTokens(_.slice(toArray(response), 0, 10))
      }
      getData()
    },
    [],
  )

  return (
    <>
      <div className="navbar 3xl:pt-6">
        <div className="navbar-inner w-full h-20 flex items-center justify-between sm:space-x-4">
          <div className="flex items-center">
            <Logo />
            <DropdownNavigations />
          </div>
          <div className="flex items-center justify-center">
            <Navigations />
          </div>
          <div className="flex items-center justify-end 3xl:space-x-4">
            <Search />
            <Gas />
            <Theme />
          </div>
        </div>
      </div>
      {toArray(tokens).length > 0 && (
        <div className="pb-3 px-3">
          <MargueeTokens data={tokens} />
        </div>
      )}
    </>
  )
}