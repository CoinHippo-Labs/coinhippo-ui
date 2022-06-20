import { combineReducers } from 'redux'

import preferences from './preferences'
import cryptos from './cryptos'
import status from './status'
import trending from './trending'
import rates from './rates'
import chains from './chains'

export default combineReducers({
  preferences,
  cryptos,
  status,
  trending,
  rates,
  chains,
})