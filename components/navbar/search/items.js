import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'

import Image from '../../image'
import NumberDisplay from '../../number'
import { toArray, ellipse } from '../../../lib/utils'

export default ({ inputSearch = '', onClick }) => {
  const { cryptos, trending } = useSelector(state => ({ cryptos: state.cryptos, trending: state.trending }), shallowEqual)
  const { cryptos_data } = { ...cryptos }
  const { trending_data } = { ...trending }

  const _crypto_data = _.cloneDeep(cryptos_data)
  Object.entries({ ..._crypto_data }).filter(([k, v]) => Array.isArray(v)).forEach(([k, v]) => {
    _crypto_data[k] = _.slice(
      _.orderBy(
        toArray(v).filter(d => inputSearch)
          .map(d => {
            const { market_cap_rank } = { ...d }
            return { ...d, scores: ['symbol', 'name', 'id'].map(f => typeof d[f] === 'string' && d[f].toLowerCase().includes(inputSearch.toLowerCase()) ? inputSearch.length > 1 ? (typeof market_cap_rank === 'number' ? market_cap_rank <= 10 ? 10 : market_cap_rank <= 20 ? 4 : market_cap_rank <= 50 ? 2 : 1 : 1) * (inputSearch.length / d[f].length) : .5 : -1) }
          })
          .map(d => {
            const { scores } = { ...d }
            return { ...d, max_score: _.max(scores) }
          })
          .filter(d => d.max_score > 3 / 10),
        ['max_score', 'market_cap_rank'], ['desc', 'asc'],
      ),
      0, 100,
    )
    if (_crypto_data[k].length < 1) {
      delete _crypto_data[k]
    }
  })
  const data = Object.values({ ..._crypto_data }).findIndex(v => toArray(v).length > 0) < 0 && toArray(trending_data).length > 0 ? { trending: toArray(trending_data).map(d => d.item) } : { ..._crypto_data }

  return (
    <div className="max-h-80 overflow-y-scroll rounded-lg">
      {Object.entries({ ...data }).map(([k, v]) => (
        <div key={k}>
          <div className={`dropdown-title ${k === 'trending' ? 'dropdown-title-trending' : ''} flex items-center space-x-2`} style={{ padding: '.5rem .75rem 0' }}>
            {k === 'trending' && <span className="text-lg">🔥</span>}
            <span className="capitalize font-semibold">{k}</span>
          </div>
          {toArray(v).map((d, i) => {
            const { id, category_id, name, symbol, large, market_cap_rank, market_type } = { ...d }
            return (
              <Link
                key={i}
                href={`/${k === 'exchanges' ? 'exchange' : k === 'categories' ? 'tokens' : 'token'}/${k === 'categories' && category_id ? category_id : id}`}
                onClick={onClick}
                className="dropdown-item w-full flex items-center justify-start space-x-2 py-2 px-3"
              >
                {large && (
                  <Image
                    src={large}
                    width={24}
                    height={24}
                  />
                )}
                <div className="w-full flex items-center justify-between space-x-2">
                  <div className="flex items-center text-xs space-x-1.5">
                    <span className="font-semibold">
                      {ellipse(name, 8)}
                    </span>
                    {symbol && (
                      <span className="uppercase text-slate-400 dark:text-slate-500 font-medium">
                        {symbol}
                      </span>
                    )}
                  </div>
                  <span className="uppercase text-slate-400 dark:text-slate-500 text-xs font-semibold">
                    {typeof market_cap_rank === 'number' ? `#${market_cap_rank}` : market_type}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      ))}
    </div>
  )
}