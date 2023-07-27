import { useState, useEffect, useRef } from 'react'
import { HiSearch } from 'react-icons/hi'

import Items from './items'
import { toArray } from '../../../../../lib/utils'

export default ({ data }) => {
  const [hidden, setHidden] = useState(true)

  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(
    () => {
      const handleClickOutside = e => {
        if (hidden || buttonRef.current.contains(e.target) || dropdownRef.current.contains(e.target)) return false
        setHidden(!hidden)
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    },
    [hidden, buttonRef, dropdownRef],
  )

  const onClick = () => {
    if (hidden) {
      setHidden(!hidden)
    }
  }

  return toArray(data).length > 0 && (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={onClick}
        className="btn btn-raised btn-rounded btn-icon min-w-max bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center text-slate-400 dark:text-slate-200 space-x-1.5 ml-0 sm:ml-2 mr-2 sm:mr-0 p-2"
      >
        <HiSearch size={16} />
        <span className="hidden lg:block text-xs font-semibold">
          Explorers
        </span>
      </button>
      <div
        ref={dropdownRef} 
        className={`dropdown ${hidden ? '' : 'open'} absolute top-0 left-0 sm:left-auto right-0 mt-8`}
      >
        <div className="dropdown-content w-40 sm:w-48 bottom-start">
          <Items data={data} onClick={onClick} />
        </div>
      </div>
    </div>
  )
}