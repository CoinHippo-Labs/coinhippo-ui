import Copy from '../../../copy'
import { name } from '../../../../lib/utils'

export default ({ data }) => {
  return (
    <div className="flex flex-wrap">
      {data?.map((item, i) => (
        <div
          key={i}
          className="dropdown-item w-full flex flex-col p-2"
        >
          {item.title}
          <div className="flex items-center justify-start space-x-2">
            {item.icon}
            <Copy
              value={item.text}
              title={item.value}
            />
          </div>
        </div>
      ))}
    </div>
  )
}