import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import Items from './items'
import { cryptos as getCryptos, categories as getCategories, trending_search as getTrendingSearch, exchange_rates as getExchangeRates } from '../../../lib/api/coingecko'
import { equals_ignore_case } from '../../../lib/utils'
import { CRYPTOS_DATA, TRENDING_DATA, RATES_DATA } from '../../../reducers/types'

export default () => {
  const dispatch = useDispatch()
  const { cryptos, trending, rates } = useSelector(state => ({ cryptos: state.cryptos, trending: state.trending, rates: state.rates }), shallowEqual)
  const { cryptos_data } = { ...cryptos }
  const { trending_data } = { ...trending }
  const { rates_data } = { ...rates }

  const [hidden, setHidden] = useState(true)
  const [inputSearch, setInputSearch] = useState('')

  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = e => {
      if (hidden || buttonRef.current.contains(e.target) || dropdownRef.current.contains(e.target)) return false
      setHidden(!hidden)
      setInputSearch('')
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [hidden, buttonRef, dropdownRef])

  const onClick = () => {
    if (hidden) {
      setHidden(!hidden)
    }
  }

  const onSelect = () => {
    setHidden(!hidden)
    setInputSearch('')
  }

  useEffect(() => {
    const getData = async () => {
      const response = await getCryptos()
      if (response) {
        if (response.categories?.length > 0) {
          const _response = await getCategories()
          if (_response?.length > 0) {
            response.categories.forEach((c, i) => {
              if (c) {
                c.category_id = _response.find(_c => equals_ignore_case(_c?.name, c?.name))?.category_id || c.category_id
                response.categories[i] = c
              }
            })
          }
          response.categories = response.categories.filter(c => c?.category_id)
        }
        dispatch({
          type: CRYPTOS_DATA,
          value: response,
        })
      }
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const response = await getTrendingSearch()
      dispatch({
        type: TRENDING_DATA,
        value: response?.coins || trending_data || [],
      })
    }
    getData()
    const interval = setInterval(() => getData(), 5 * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const getData = async () => {
      const response = await getExchangeRates()
      dispatch({
        type: RATES_DATA,
        value: response?.rates || rates_data || {},
      })
    }
    getData()
    const interval = setInterval(() => getData(), 5 * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="navbar-search w-full max-w-xs mr-3">
      <div className="relative">
        <input
          ref={buttonRef}
          type="search"
          placeholder={hidden ? 'Search' : 'What are you looking for?'}
          value={inputSearch}
          onClick={() => onClick()}
          onChange={e => {
            setInputSearch(e.target.value)
            onClick()
          }}
          className="w-full h-10 appearance-none focus:ring-0 rounded-xl text-sm px-3"
        />
        <div
          ref={dropdownRef} 
          className={`dropdown ${hidden ? '' : 'open'} absolute top-0 left-0 mt-12`}
        >
          <div className="dropdown-content w-80 bottom-start">
            <Items
              inputSearch={inputSearch}
              onClick={onSelect}
            />
          </div>
        </div>
      </div>
    </div>
  )
}