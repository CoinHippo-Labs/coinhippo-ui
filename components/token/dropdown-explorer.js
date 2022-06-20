import { useState, useEffect, useRef } from 'react'
import Explorers from './explorers'
import { HiSearch } from 'react-icons/hi'

export default ({ data }) => {
  const [hidden, setHidden] = useState(true)

  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        hidden ||
        buttonRef.current.contains(event.target) ||
        dropdownRef.current.contains(event.target)
      ) {
        return false
      }
      setHidden(!hidden)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [hidden, buttonRef, dropdownRef])

  const handleDropdownClick = () => setHidden(!hidden)

  return data && data.length > 0 && (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleDropdownClick}
        className="btn min-w-max btn-raised btn-rounded btn-icon flex items-center bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-800 dark:hover:bg-gray-800 dark:text-white dark:hover:text-gray-200 text-xs space-x-1.5 ml-0 sm:ml-2 mr-2 sm:mr-0 p-2"
      >
        <HiSearch size={16} className="stroke-current" />
        <span className="hidden lg:block">Explorers</span>
      </button>
      <div
        ref={dropdownRef} 
        className={`dropdown ${hidden ? '' : 'open'} absolute top-0 left-0 sm:left-auto right-0 mt-8`}
      >
        <div className="dropdown-content w-40 sm:w-60 bottom-start">
          <Explorers data={data} handleDropdownClick={handleDropdownClick} />
        </div>
      </div>
    </div>
  )
}