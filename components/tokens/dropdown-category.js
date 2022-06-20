import { useState, useEffect, useRef } from 'react'
import Categories from './categories'

export default function DropdownCategory({ data }) {
  const [hidden, setHidden] = useState(true)
  const [inputSearch, setInputSearch] = useState('')

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
      setInputSearch('')
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [hidden, buttonRef, dropdownRef])

  const handleDropdownClick = () => {
    if (hidden) {
      setHidden(!hidden)
    }
  }

  const handleSelect = () => {
    setHidden(true)
    setInputSearch('')
  }

  return (
    <div className="relative">
      <input
        ref={buttonRef}
        value={inputSearch}
        onClick={handleDropdownClick}
        onChange={event => {
          setInputSearch(event.target.value)
          if (hidden) {
            setHidden(false)
          }
        }}
        placeholder={hidden ? 'Others' : 'Search...'}
        className={`btn btn-raised btn-rounded w-${hidden ? 16 : 40} ${hidden ? 'cursor-pointer' : ''} flex items-center border-0 outline-none bg-transparent text-indigo-500 dark:text-white ${hidden ? 'placeholder-indigo-500 dark:placeholder-white' : 'placeholder-gray-400 dark:placeholder-gray-600'} text-xs space-x-1.5 my-1 p-2`}
        style={{ textTransform: hidden ? 'uppercase' : 'none', fontWeight: hidden ? 600 : 500 }}
      />
      <div
        ref={dropdownRef} 
        className={`dropdown ${hidden ? '' : 'open'} absolute top-0 right-0 mt-10`}
      >
        <div className="dropdown-content w-48 bottom-start">
          <Categories data={data} inputSearch={inputSearch} handleSelect={handleSelect} />
        </div>
      </div>
    </div>
  )
}