import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { Squid } from '@0xsquid/sdk'

import AddToken from '../add-token'
import Balance from '../add-token'
import Wallet from '../wallet'
import { number_format, equals_ignore_case, loader_color } from '../../lib/utils'

export default ({
  environment = 'testnet',
}) => {
  const dispatch = useDispatch()
  const {
    preferences,
    wallet,
    balances,
  } = useSelector(state =>
    (
      {
        preferences: state.preferences,
        wallet: state.wallet,
        balances: state.balances,
      }
    ),
    shallowEqual,
  )
  const {
    theme,
  } = { ...preferences }
  const {
    wallet_data,
  } = { ...wallet }
  const {
    web3_provider,
  } = { ...wallet_data }
  const {
    balances_data,
  } = { ...balances }

  return (
    <div>
      
    </div>
  )
}