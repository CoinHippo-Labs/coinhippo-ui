import { useState, useEffect } from 'react'
import { Card, CardBody } from '@material-tailwind/react'
import moment from 'moment'
import { FaBitcoin, FaRegGrinSquintTears, FaRegGrinSquint, FaRegGrinBeamSweat, FaRegGrin, FaRegGrinWink, FaRegGrinBeam, FaRegGrinStars } from 'react-icons/fa'

import Spinner from '../spinner'
import NumberDisplay from '../number'

const LOW_THRESHOLD = 20
const HIGH_THRESHOLD = 75
const DAYS = [
  { day: 0, title: 'Today' },
  { day: 1, title: 'Yesterday' },
  { day: 7, title: 'Last Week' },
  { day: 30, title: 'Last Month' },
]

export default ({ data }) => {
  const [dayData, setDayData] = useState(null)
  const [day, setDay] = useState(0)

  useEffect(
    () => {
      if (data) {
        setDayData(data[day])
      }
    },
    [data, day],
  )

  const { value_classification, timestamp } = { ...dayData }
  let { value } = { ...dayData }
  let color
  let icon
  if (dayData) {
    value = Number(value)
    if (value <= LOW_THRESHOLD) {
      color = 'red-500'
      icon = <FaRegGrinSquintTears size={36} />
    }
    else if (value >= HIGH_THRESHOLD) {
      color = 'green-500'
      icon = <FaRegGrinStars size={36} />
    }
    else if (value < 50) {
      if (value <= (50 - LOW_THRESHOLD) / 2) {
        color = 'red-400'
        icon = <FaRegGrinSquint size={36} />
      }
      else {
        color = 'yellow-500'
        icon = <FaRegGrinBeamSweat size={36} />
      }
    }
    else if (value > 50) {
      if (value >= 50 + ((HIGH_THRESHOLD - 50) / 2)) {
        color = 'green-400'
        icon = <FaRegGrinBeam size={36} />
      }
      else {
        color = 'yellow-400'
        icon = <FaRegGrinWink size={36} />
      }
    }
    else {
      color = 'yellow-500'
      icon = <FaRegGrin size={36} />
    }
  }

  return (
    <Card className="card">
      <CardBody className="space-y-3 pt-4 2xl:pt-6 pb-3 2xl:pb-5 px-4 2xl:px-6">
        <div className="flex items-center space-x-2">
          <FaBitcoin size={24} className="text-yellow-500" />
          <span className="whitespace-nowrap text-blue-400 dark:text-blue-500 text-base">
            Fear & Greed Index
          </span>
        </div>
        {dayData ?
          <div className={`flex flex-col items-center text-${color} space-y-6 pt-8`}>
            <NumberDisplay
              value={value}
              format="0,0"
              noTooltip={true}
              className="text-5xl font-bold"
            />
            <div className="flex flex-col items-center space-y-1">
              {icon}
              <span className="text-lg font-semibold">
                {value_classification}
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                {moment(timestamp * 1000).format('MMM D, YYYY')}
              </span>
            </div>
            <div className="flex items-center justify-center">
              {DAYS.map((d, i) => {
                const { title } = { ...d }
                return (
                  <button
                    key={i}
                    onClick={() => setDay(d.day)}
                    className={`btn btn-raised btn-sm btn-rounded min-w-max ${d.day === day ? 'bg-slate-100 dark:bg-slate-800 text-black dark:text-white' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500'} text-xs ${i < DAYS.length - 1 ? 'mr-1.5' : 'mr-0'}`}
                  >
                    {title}
                  </button>
                )
              })}
            </div>
          </div> :
          <Spinner name="ProgressBar" width={36} height={36} />
        }
      </CardBody>
    </Card>
  )
}