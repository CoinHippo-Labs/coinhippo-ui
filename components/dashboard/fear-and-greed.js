import { useState, useEffect } from 'react'
import Circle from '../circle'
import { VscDashboard } from 'react-icons/vsc'
import { FaBitcoin, FaRegGrinSquintTears, FaRegGrinSquint, FaRegGrinBeamSweat, FaRegGrin, FaRegGrinWink, FaRegGrinBeam, FaRegGrinStars } from 'react-icons/fa'
import moment from 'moment'

const low_threshold = 20
const high_threshold = 75

const days = [
  { day: 0, title: 'Today' },
  { day: 1, title: 'Yesterday' },
  { day: 7, title: 'Last Week' },
  { day: 30, title: 'Last Month' },
]

export default ({ data, noBorder }) => {
  const [dayData, setDayData] = useState(null)
  const [day, setDay] = useState(0)

  useEffect(() => {
    const getDayData = () => {
      if (data) {
        setDayData(data[day])
      }
    }

    getDayData()
  }, [data, day])

  let color, progressColor, icon

  if (dayData) {
    dayData.value = Number(dayData.value)

    color = dayData.value <= low_threshold ? 'red-600' :
      dayData.value >= high_threshold ? 'green-500' :
      dayData.value < 50 ?
        dayData.value <= (50 - low_threshold) / 2 ? 'red-500' : 'yellow-600' :
        dayData.value > 50 ? dayData.value >= 50 + ((high_threshold - 50) / 2) ? 'green-400' : 'yellow-400' :
      'yellow-500'

    progressColor = color === 'red-600' ? '#dc2626' :
      color === 'green-500' ? '#22c55e' :
      color === 'red-500' ? '#ef4444' :
      color === 'yellow-600' ? '#ca8a04' :
      color ===  'green-400' ? '#4ade80' :
      color ===  'yellow-400' ? '#facc15' :
      '#eab308'

    icon = dayData.value <= low_threshold ? <FaRegGrinSquintTears size={36} /> :
      dayData.value >= high_threshold ? <FaRegGrinStars size={36} /> :
      dayData.value < 50 ?
        dayData.value <= (50 - low_threshold) / 2 ? <FaRegGrinSquint size={36} /> : <FaRegGrinBeamSweat size={36} /> :
        dayData.value > 50 ? dayData.value >= 50 + ((high_threshold - 50) / 2) ? <FaRegGrinBeam size={36} /> : <FaRegGrinWink size={36} /> :
      <FaRegGrin size={36} />
  }

  return (
    <div
      title={<span className="uppercase flex items-center">
        <FaBitcoin size={24} className="text-yellow-500 mb-0.5 mr-2" />
        Fear & Greed Index
        <VscDashboard size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
      </span>}
      description={<div className="mt-9 mb-6">
        {dayData ?
          <div className="my-1.5 mx-4 md:mx-8 lg:mx-8 xl:mx-4">
            <div className="flex items-center">
              <Circle size="lg" progress={dayData.value} color={progressColor} />
              <div className={`flex flex-col items-end text-${color} ml-auto`}>
                <span className="text-lg font-medium text-right">{dayData.value_classification}</span>
                {icon}
                <span className="text-gray-400 text-xs font-normal text-right mt-4">{moment(dayData.timestamp * 1000).format('MMM D, YYYY')}</span>
              </div>
            </div>
            <div className="flex items-center justify-center mt-5">
              {days.map((_day, i) => (
                <button
                  key={i}
                  onClick={() => setDay(_day.day)}
                  className={`btn btn-raised btn-sm min-w-max btn-rounded ${_day.day === day ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white' : 'bg-transparent hover:bg-gray-50 text-gray-500 hover:text-gray-700 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200'} mr-${i < days.length - 1 ? 2 : 0}`}
                  style={{ fontSize: '.5rem' }}
                >
                  {_day.title}
                </button>
              ))}
            </div>
          </div>
          :
          <div className="my-1.5 mx-4 md:mx-8 lg:mx-8 xl:mx-8">
            <div className="flex items-center">
              <Circle size="lg" progress={0} color="transparent" />
              <div className="flex flex-col items-end ml-auto">
                <div className="skeleton w-14 h-4 rounded" />
                <div className="skeleton w-10 h-10 rounded-full mt-2" />
                <div className="skeleton w-16 h-3 rounded mt-4" />
              </div>
            </div>
            <div className="flex items-center justify-center mt-4">
              {[...Array(4).keys()].map(i => (
                <div key={i} className={`skeleton w-16 h-6 rounded my-1 mr-${i < 4 - 1 ? 2 : 0}`} />
              ))}
            </div>
          </div>
        }
      </div>}
      className={`${noBorder ? 'border-0' : ''}`}
    />
  )
}