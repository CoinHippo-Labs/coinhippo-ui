import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { FiMenu } from 'react-icons/fi'

import Logo from '../sidebar/logo'
import Search from './search'
import MargueeTokens from '../marquee-tokens'
import Gas from './gas'
import Theme from './theme'
import { tokens_markets } from '../../lib/api/coingecko'
import { chains as getChains } from '../../lib/api/data'
import { currency } from '../../lib/object/currency'
import { COLLAPSED, CHAINS_DATA } from '../../reducers/types'

export default ({
  noSiderbar = false,
}) => {
  const dispatch = useDispatch()
  const {
    preferences,
  } = useSelector(state =>
    (
      {
        preferences: state.preferences,
      }
    ),
    shallowEqual,
  )
  const {
    collapsed,
  } = { ...preferences }

  const [tokens, setTokens] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await getChains()

      dispatch(
        {
          type: CHAINS_DATA,
          value: response,
        }
      )
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const response = await tokens_markets(
        {
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          price_change_percentage: '24h',
        },
      )

      if (!response?.error) {
        setTokens(response)
      }
    }
    getData()
  }, [])

  return (
    <div className="navbar border-b">
      <div className="navbar-inner w-full flex items-center justify-start">
        {!noSiderbar ?
          <button
            onClick={() => {
              dispatch(
                {
                  type: COLLAPSED,
                  value: !collapsed,
                }
              )
            }}
            className="mx-4"
          >
            <FiMenu
              size={20}
            />
          </button> :
          <Logo
            noSiderbar={noSiderbar}
            className="mx-4"
          />
        }
        <Search />
        <div className="hidden sm:block w-full ml-2 mr-4">
          <MargueeTokens
            data={
              _.slice(
                tokens ||
                [],
                0,
                10,
              )
            }
          />
        </div>
        <span className="ml-auto" />
        <Gas />
        <Theme />
      </div>
    </div>
  )
}