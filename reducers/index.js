import { combineReducers } from 'redux'

import preferences from './preferences'
import cryptos from './cryptos'
import status from './status'
import trending from './trending'
import rates from './rates'
import chains from './chains'
import ens from './ens'
import wallet from './wallet'
import chain_id from './chain-id'
import balances from './balances'

export default combineReducers(
  {
    preferences,
    cryptos,
    status,
    trending,
    rates,
    chains,
    ens,
    wallet,
    chain_id,
    balances,
  }
)