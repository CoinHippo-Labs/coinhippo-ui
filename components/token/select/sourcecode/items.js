import { name } from '../../../../lib/utils'

export default ({
  data,
  onClick,
}) => {
  return (
    <div className="flex flex-wrap">
      {data?.map((item, i) => (
        <a
          key={i}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onClick()}
          className="dropdown-item w-full flex items-center justify-start space-x-2 p-2"
        >
          {item.icon}
          {item.value}
        </a>
      ))}
    </div>
  )
}