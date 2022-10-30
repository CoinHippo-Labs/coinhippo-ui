import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'

import Image from '../../image'

export default ({
  inputSearch = '',
  onClick,
}) => {
  const { cryptos, trending } = useSelector(state => ({ cryptos: state.cryptos, trending: state.trending }), shallowEqual)
  const { cryptos_data } = { ...cryptos }
  const { trending_data } = { ...trending }

  const _crypto_data = _.cloneDeep(cryptos_data)
  Object.entries({ ..._crypto_data }).forEach(([k, v]) => {
    _crypto_data[k] = _.slice(_.orderBy(v?.filter(_v => _v && inputSearch).map(_v => {
      const { market_cap_rank } = { ..._v }
      return {
        ..._v,
        scores: ['symbol', 'name', 'id'].map(f => typeof _v?.[f] === 'string' && _v[f].toLowerCase().includes(inputSearch.toLowerCase()) ? inputSearch.length > 1 ? (typeof market_cap_rank === 'number' ? market_cap_rank <= 10 ? 10 : market_cap_rank <= 20 ? 4 : market_cap_rank <= 50 ? 2 : 1 : 1) * (inputSearch.length / _v[f].length) : .5 : -1),
      }
    }).map(_v => {
      const { scores } = { ..._v }
      return {
        ..._v,
        max_score: _.max(scores),
      }
    }).filter(_v => _v.max_score > 3 / 10) || [], ['max_score', 'market_cap_rank'], ['desc', 'asc']), 0, 100)
    if (_crypto_data[k].length < 1) {
      delete _crypto_data[k]
    }
  })
  const data = Object.values({ ..._crypto_data }).findIndex(v => v?.length > 0) < 0 && trending_data?.length > 0 ?
    { trending: trending_data.map(d => d?.item) } :
    { ..._crypto_data }

  return (
    <div className="max-h-80 overflow-y-scroll rounded-lg">
      {Object.entries({ ...data }).map(([k, v]) => (
        <div key={k}>
          <div
            className={`dropdown-title ${k === 'trending' ? 'dropdown-title-trending' : ''} flex items-center space-x-2`}
            style={{ padding: '.5rem .75rem 0' }}
          >
            {k === 'trending' && (
              <span className="text-lg">
                🔥
              </span>
            )}
            <span className="capitalize font-semibold">
              {k}
            </span>
          </div>
          {
            (v || [])
              .filter(_v => _v)
              .map((_v, i) => (
                <Link
                  key={i}
                  href={`/${k === 'exchanges' ? 'exchange' : k === 'categories' ? 'tokens' : 'token'}/${k === 'categories' && _v.category_id ? _v.category_id : _v.id}`}
                >
                <a
                  onClick={onClick}
                  className="dropdown-item w-full flex items-center justify-start space-x-2 py-2 px-3"
                >
                  {_v.large && (
                    <Image
                      src={_v.large}
                      alt=""
                      width={24}
                      height={24}
                    />
                  )}
                  <div className="w-full flex items-center justify-between space-x-2">
                    <div className="flex items-center text-xs space-x-1.5">
                      <span className="font-semibold">
                        {_v.name}
                      </span>
                      {_v.symbol && (
                        <span className="uppercase text-slate-400 dark:text-slate-500 font-medium">
                          {_v.symbol}
                        </span>
                      )}
                    </div>
                    <span className="uppercase text-slate-400 dark:text-slate-500 text-xs font-semibold">
                      {typeof _v.market_cap_rank === 'number' ?
                        `#${_v.market_cap_rank}` :
                        _v.market_type
                      }
                    </span>
                  </div>
                </a>
                </Link>
              ))
          }
        </div>
      ))}
    </div>
  )
}