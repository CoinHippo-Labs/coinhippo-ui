import { useState, useEffect, useRef } from 'react'
import { BsFileEarmarkCode } from 'react-icons/bs'

import Items from './items'

export default ({ data }) => {
  const [hidden, setHidden] = useState(true)

  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = e => {
      if (hidden || buttonRef.current.contains(e.target) || dropdownRef.current.contains(e.target)) return false
      setHidden(!hidden)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [hidden, buttonRef, dropdownRef])

  const onClick = () => setHidden(!hidden)

  return data?.length > 0 && (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={onClick}
        className="btn btn-raised btn-rounded btn-icon min-w-max bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-200 dark:hover:text-white space-x-1.5 ml-0 sm:ml-2 mr-2 sm:mr-0 p-2"
      >
        <BsFileEarmarkCode size={16} className="stroke-current" />
        <span className="hidden lg:block text-xs font-semibold">
          Contracts
        </span>
      </button>
      <div
        ref={dropdownRef} 
        className={`dropdown ${hidden ? '' : 'open'} absolute top-0 left-0 sm:left-auto right-0 mt-8`}
      >
        <div className="dropdown-content w-64 sm:w-56 bottom-start">
          <Items data={data} />
        </div>
      </div>
    </div>
  )
}