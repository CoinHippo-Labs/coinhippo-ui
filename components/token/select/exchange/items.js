import Image from '../../../image'
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
          className="dropdown-item exchange-mini-column w-full sm:w-1/2 flex items-center justify-start space-x-2 p-2"
        >
          {item.exchange?.large && (
            <Image
              src={item.exchange.large}
              alt=""
              width={16}
              height={16}
            />
          )}
          <span className="text-sm font-medium">
            {item.exchange?.name || name(item.exchange?.id)}
          </span>
        </a>
      ))}
    </div>
  )
}