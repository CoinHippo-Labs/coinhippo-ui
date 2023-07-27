import { combineReducers } from 'redux'

import preferences from './preferences'
import chains from './chains'
import cryptos from './cryptos'
import global from './global'
import trending from './trending'
import rates from './rates'

export default combineReducers({
  preferences,
  chains,
  cryptos,
  global,
  trending,
  rates,
})