import { getName } from '../../lib/utils'

export default ({ data, handleDropdownClick }) => {
  return (
    <>
      <div className="dropdown-title">Source codes</div>
      <div className="flex flex-wrap pb-1">
        {data && data.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleDropdownClick()}
            className="dropdown-item w-full sm:w-1/2 flex items-center justify-start text-sm space-x-2 p-2"
          >
            {item.icon}
            <span>{item.value}</span>
          </a>
        ))}
      </div>
    </>
  )
}