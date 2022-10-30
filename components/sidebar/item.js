import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { FiChevronRight } from 'react-icons/fi'

import { COLLAPSED } from '../../reducers/types'

export default ({
  title,
  url,
  is_external = false,
  icon,
  items,
  hiddenItem,
  hiddenItems,
  openItem,
  openItems,
}) => {
  const dispatch = useDispatch()
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { collapsed } = { ...preferences }

  const router = useRouter()
  const { asPath } = { ...router }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (!hidden && items?.length > 0 && hiddenItem) {
      setHidden(true)
    }
  }, [url, items, hiddenItem])

  useEffect(() => {
    if (!hidden && items?.length > 0 && openItem && openItem.url !== url) {
      setHidden(true)
    }
  }, [url, items, openItem])

  const active = url === _asPath || items?.findIndex(i => i?.url === _asPath && !i?.is_shortcut) > -1

  if (!(items?.length > 0)) {
    return (
      <Link
        href={url}
      >
      <a
        target={is_external ? '_blank' : '_self'}
        rel={is_external ? 'noopener noreferrer' : ''}
        onClick={() => {
          if (!collapsed) {
            dispatch({
              type: COLLAPSED,
              value: !collapsed,
            })
          }
          else if (hiddenItems) {
            hiddenItems()
          }
        }}
        className={`sidebar-item ${active ? 'active' : ''}`}
      >
        {icon}
        <span className="title flex flex-col">
          <span className="font-semibold">
            {title}
          </span>
          {is_external && (
            <span className="text-blue-400 dark:text-blue-600">
              {new URL(url).hostname}
            </span>
          )}
        </span>
      </a>
      </Link>
    )
  }

  return (
    <div
      onClick={() => {
        if (hidden && openItems) {
          openItems()
        }
        setHidden(!hidden)
      }}
      className={`sidebar-item ${active ? 'active' : ''} ${hidden ? 'hidden-sibling' : 'open-sibling'} cursor-pointer`}
    >
      {icon}
      <span className="title font-semibold">
        {title}
      </span>
      <FiChevronRight className="arrow ml-auto" />
    </div>
  )
}