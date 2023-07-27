import { useState, useEffect, useRef } from 'react'

import Items from './items'

export default () => {
  const [hidden, setHidden] = useState(true)
  const [inputSearch, setInputSearch] = useState('')

  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(
    () => {
      const handleClickOutside = e => {
        if (hidden || buttonRef.current.contains(e.target) || dropdownRef.current.contains(e.target)) return false
        setHidden(!hidden)
        setInputSearch('')
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

  const onSelect = () => {
    setHidden(!hidden)
    setInputSearch('')
  }

  return (
    <div className="navbar-search w-full sm:w-80 max-w-xs mr-3">
      <div className="relative">
        <input
          ref={buttonRef}
          type="search"
          placeholder={hidden ? 'Search' : 'What are you looking for?'}
          value={inputSearch}
          onClick={() => onClick()}
          onChange={
            e => {
              setInputSearch(e.target.value)
              onClick()
            }
          }
          className="w-full h-10 appearance-none focus:ring-0 rounded-xl text-sm px-3"
        />
        <div
          ref={dropdownRef} 
          className={`dropdown ${hidden ? '' : 'open'} absolute top-0 right-0 mt-12`}
        >
          <div className="dropdown-content w-80 bottom-start">
            <Items inputSearch={inputSearch} onClick={onSelect} />
          </div>
        </div>
      </div>
    </div>
  )
}