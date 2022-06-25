import { useState, useEffect, useRef } from 'react'
import { HiOutlineDotsVertical } from 'react-icons/hi'

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
        className="btn btn-raised btn-circle"
      >
        <HiOutlineDotsVertical size={16} className="text-blue-600 dark:text-white" />
      </button>
      <div
        ref={dropdownRef} 
        className={`dropdown ${hidden ? '' : 'open'} absolute top-0 right-0 mt-8`}
      >
        <div className="dropdown-content w-40 sm:w-64 bottom-start">
          <Items
            data={data}
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  )
}