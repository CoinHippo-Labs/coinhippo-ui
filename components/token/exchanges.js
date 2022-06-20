import Image from '../image'
import { getName } from '../../lib/utils'

export default ({ data, handleDropdownClick }) => {
  return (
    <>
      <div className="dropdown-title">Others</div>
      <div className="flex flex-wrap pb-1">
        {data && data.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleDropdownClick()}
            className="dropdown-item exchange-mini-column w-full sm:w-1/2 flex items-center justify-start text-sm space-x-2 p-2"
          >
            {item.exchange && item.exchange.large && (
              <Image
                src={item.exchange.large}
                alt=""
                width={16}
                height={16}
                className="rounded"
              />
            )}
            <span>{item.exchange.name || getName(item.exchange.id)}</span>
          </a>
        ))}
      </div>
    </>
  )
}