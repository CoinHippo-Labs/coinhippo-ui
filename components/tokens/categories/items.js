import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'

import Image from '../../image'
import { toArray } from '../../../lib/utils'

export default ({ inputSearch = '', onClick }) => {
  const { cryptos } = useSelector(state => ({ cryptos: state.cryptos }), shallowEqual)
  const { cryptos_data } = { ...cryptos }

  const { categories } = { ...cryptos_data }
  const data = _.slice(
    _.orderBy(
      toArray(categories)
        .map(d => { return { ...d, scores: ['name', 'id'].map(f => typeof d[f] === 'string' && d[f].toLowerCase().includes(inputSearch.toLowerCase()) ? inputSearch.length > 1 ? inputSearch.length / d[f].length : .5 : -1) } })
        .map(d => {
          const { scores } = { ...d }
          return { ...d, max_score: _.max(scores) }
        })
        .filter(d => d.max_score > 3 / 10),
      ['max_score'], ['desc'],
    ),
    0, 100,
  )

  return (
    <div className="max-h-80 overflow-y-scroll rounded-lg">
      {data.map((d, i) => {
        const { id, category_id, name, large } = { ...d }
        return (
          <Link
            key={i}
            href={`/tokens/${category_id || id}`}
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
                  {name}
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}