import { toArray } from '../../../../../lib/utils'

export default ({ data, onClick }) => {
  return (
    <div className="flex flex-wrap">
      {toArray(data).map((d, i) => {
        const { url, icon, value } = { ...d }
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onClick()}
            className="dropdown-item w-full flex items-center justify-start space-x-2 p-2"
          >
            {icon}
            {value}
          </a>
        )
      })}
    </div>
  )
}