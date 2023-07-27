import _ from 'lodash'

import { toArray, equalsIgnoreCase, normalizeQuote } from './utils'

export const PROJECT_ASSET = 'uaxl'

export const getChainKey = (chain, chains_data, exact = false) => {
  let key
  if (chain) {
    chain = normalizeQuote(chain, 'lower')
    key = _.head(
      toArray(chains_data)
        .filter(c => {
          const { id, name, chain_type } = { ...c }
          return toArray([id, name]).findIndex(s => equalsIgnoreCase(chain, s) || (chain_type !== 'evm' && chain.startsWith(s))) > -1
        })
        .map(c => c.id)
    )
    key = key || chain
  }
  return key
}

export const getChainData = (chain, chains_data, exact = true) => chain && toArray(chains_data).find(c => c.id === getChainKey(chain, chains_data, exact))