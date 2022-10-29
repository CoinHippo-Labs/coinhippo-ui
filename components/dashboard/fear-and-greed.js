import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import moment from 'moment'
import { TailSpin } from 'react-loader-spinner'
import { FaBitcoin, FaRegGrinSquintTears, FaRegGrinSquint, FaRegGrinBeamSweat, FaRegGrin, FaRegGrinWink, FaRegGrinBeam, FaRegGrinStars } from 'react-icons/fa'

import Circle from '../circle'
import { loader_color } from '../../lib/utils'

const low_threshold = 20
const high_threshold = 75

const days = [
  { day: 0, title: 'Today' },
  { day: 1, title: 'Yesterday' },
  { day: 7, title: 'Last Week' },
  { day: 30, title: 'Last Month' },
]

export default ({ data }) => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const [dayData, setDayData] = useState(null)
  const [day, setDay] = useState(0)

  useEffect(() => {
    if (data) {
      setDayData(data[day])
    }
  }, [data, day])

  const { value_classification, timestamp } = { ...dayData }
  let { value } = { ...dayData }
  let color, progressColor, icon
  if (dayData) {
    value = Number(value)
    color = value <= low_threshold ?
      'red-600' :
      value >= high_threshold ?
        'green-500' :
        value < 50 ?
          value <= (50 - low_threshold) / 2 ?
            'red-500' : 'yellow-600' :
          value > 50 ?
            value >= 50 + ((high_threshold - 50) / 2) ?
              'green-400' : 'yellow-400' :
          'yellow-500'
    progressColor = color === 'red-600' ? '#dc2626' :
      color === 'green-500' ? '#22c55e' :
      color === 'red-500' ? '#ef4444' :
      color === 'yellow-600' ? '#ca8a04' :
      color ===  'green-400' ? '#4ade80' :
      color ===  'yellow-400' ? '#facc15' :
      '#eab308'
    icon = value <= low_threshold ?
      <FaRegGrinSquintTears size={36} /> :
      value >= high_threshold ?
        <FaRegGrinStars size={36} /> :
        value < 50 ?
          value <= (50 - low_threshold) / 2 ?
            <FaRegGrinSquint size={36} /> :
            <FaRegGrinBeamSweat size={36} /> :
          value > 50 ?
            value >= 50 + ((high_threshold - 50) / 2) ?
              <FaRegGrinBeam size={36} /> :
              <FaRegGrinWink size={36} /> :
          <FaRegGrin size={36} />
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg space-y-2 p-4">
      <div className="flex items-center space-x-2">
        <FaBitcoin size={24} className="text-yellow-500" />
        <span className="uppercase text-slate-600 dark:text-slate-400 text-xs font-bold">
          Fear & Greed Index
        </span>
      </div>
      {dayData ?
        <>
          <div className="flex items-center justify-between space-x-2 py-6">
            <Circle
              size="lg"
              progress={value}
              color={progressColor}
            />
            <div className={`flex flex-col items-end text-${color}`}>
              <span className="text-lg font-semibold text-right">
                {value_classification}
              </span>
              {icon}
              <span className="text-slate-400 dark:text-slate-500 text-xs font-medium text-right mt-2">
                {
                  moment(timestamp * 1000)
                    .format('MMM D, YYYY')
                }
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center pt-2">
            {days.map((d, i) => (
              <button
                key={i}
                onClick={() => setDay(d.day)}
                className={`btn btn-raised btn-sm btn-rounded min-w-max ${d.day === day ? 'bg-slate-100 dark:bg-slate-800' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200'} ${i < days.length - 1 ? 'mr-1.5' : 'mr-0'}`}
                style={{ fontSize: '.6rem' }}
              >
                {d.title}
              </button>
            ))}
          </div>
        </> :
        <TailSpin
          color={loader_color(theme)}
          width="32"
          height="32"
        />
      }
    </div>
  )
}