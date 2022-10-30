import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'

import Image from '../../image'

export default ({
  inputSearch = '',
  onClick,
}) => {
  const { cryptos } = useSelector(state => ({ cryptos: state.cryptos }), shallowEqual)
  const { cryptos_data } = { ...cryptos }

  const data = _.slice(_.orderBy(cryptos_data?.categories?.filter(_v => _v).map(_v => {
    return {
      ..._v,
      scores: ['name', 'id'].map(f => typeof _v?.[f] === 'string' && _v[f].toLowerCase().includes(inputSearch.toLowerCase()) ? inputSearch.length > 1 ? inputSearch.length / _v[f].length : .5 : -1),
    }
  }).map(_v => {
    const { scores } = { ..._v }
    return {
      ..._v,
      max_score: _.max(scores),
    }
  }).filter(_v => _v.max_score > 3 / 10) || [], ['max_score'], ['desc']), 0, 100)

  return (
    <div className="max-h-80 overflow-y-scroll rounded-lg">
      {data?.filter(_v => _v).map((_v, i) => (
        <Link
          key={i}
          href={`/tokens/${_v.category_id || _v.id}`}
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
            </div>
          </div>
        </a>
        </Link>
      ))}
    </div>
  )
}