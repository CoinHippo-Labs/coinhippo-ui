import Copy from '../../../../copy'
import { toArray } from '../../../../../lib/utils'

export default ({ data }) => {
  return (
    <div className="flex flex-wrap">
      {toArray(data).map((d, i) => {
        const { title, icon, text, value } = { ...d }
        return (
          <div key={i} className="dropdown-item w-full flex flex-col p-2">
            {title}
            <div className="flex items-center justify-start space-x-2">
              {icon}
              <Copy
                value={text}
                title={value}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}