import { useState, useEffect, useRef } from 'react'
import Exchanges from './exchanges'
import { HiOutlineDotsVertical } from 'react-icons/hi'

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
        className="btn btn-raised btn-circle"
      >
        <HiOutlineDotsVertical size={16} className="text-indigo-600 dark:text-gray-100" />
      </button>
      <div
        ref={dropdownRef} 
        className={`dropdown ${hidden ? '' : 'open'} absolute top-0 right-0 mt-8`}
      >
        <div className="dropdown-content w-40 sm:w-64 bottom-start">
          <Exchanges data={data} handleDropdownClick={handleDropdownClick} />
        </div>
      </div>
    </div>
  )
}