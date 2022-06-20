import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from '../image'
import _ from 'lodash'

export default ({ data, navigationItemData, inputSearch, handleSelect }) => {
  const router = useRouter()
  const { query } = { ...router }
  const { category } = { ...query }

  let categoriesData

  if (data && Array.isArray(data)) {
    categoriesData =  _.orderBy(data.filter(item => inputSearch && item).map(item => {
      return { ...item, scores: ['name', 'id'].map(field => item[field] && item[field].toLowerCase().includes(inputSearch.toLowerCase()) ? inputSearch.length > 1 ? inputSearch.length / item[field].length : (item[field].length - item[field].indexOf(inputSearch)) / item[field].length : -1) }
    }).map(item => { return { ...item, max_score: _.max(item.scores) } }).filter(item => item.max_score > -1), ['max_score'], ['desc']).filter((item, i) => i < 100)
  }

  if (!inputSearch && (!categoriesData || categoriesData.length < 1)) {
    categoriesData = data
  }

  return (
    <div className="max-h-96 overflow-y-scroll">
      {categoriesData && categoriesData.map((item, i) => (
        <div key={i}>
          <Link href={`/tokens/${item && item.category_id ? item.category_id : 'categories'}`}>
            <a
              onClick={handleSelect}
              className={`w-full flex items-center justify-start ${item && item.category_id === category ? 'bg-indigo-600 text-white' : 'bg-transparent hover:bg-indigo-50 text-indigo-500 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:text-white dark:hover:text-gray-200'} text-xs space-x-2 p-2`}
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded"
                />
              )}
              <span className="font-medium">{item.name}</span>
            </a>
          </Link>
        </div>
      ))}
    </div>
  )
}