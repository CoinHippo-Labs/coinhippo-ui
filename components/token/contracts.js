import Copy from '../../components/copy'
import { getName } from '../../lib/utils'

export default ({ data }) => {
  return (
    <>
      <div className="dropdown-title">Contracts</div>
      <div className="flex flex-wrap pb-1">
        {data && data.map((item, i) => (
          <div key={i} className="dropdown-item w-full flex flex-col text-sm mx-1 py-1 px-2">
            {item.title}
            <div className="flex items-center justify-start space-x-2">
              {item.icon}
              <span className="flex items-center space-x-1">{item.value}<Copy text={item.text} size={16} className="mb-0.5" /></span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}