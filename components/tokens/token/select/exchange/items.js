import Image from '../../../../image'
import { toArray, getTitle } from '../../../../../lib/utils'

export default ({ data, onClick }) => {
  return (
    <div className="flex flex-wrap">
      {toArray(data).map((d, i) => {
        const { url, exchange } = { ...d }
        const { id, name, large } = { ...exchange }
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onClick()}
            className="dropdown-item exchange-mini-column w-full sm:w-1/2 flex items-center justify-start space-x-2 p-2"
          >
            {large && (
              <Image
                src={large}
                width={16}
                height={16}
              />
            )}
            <span className="text-sm font-medium">
              {name || getTitle(id)}
            </span>
          </a>
        )
      })}
    </div>
  )
}