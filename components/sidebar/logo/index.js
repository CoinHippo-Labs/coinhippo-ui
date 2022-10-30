import Link from 'next/link'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { FiMenu } from 'react-icons/fi'
import { COLLAPSED } from '../../../reducers/types'

export default ({
  noSiderbar = false,
  className = '',
}) => {
  const dispatch = useDispatch()
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { collapsed } = { ...preferences }

  return (
    <div className={`logo truncate ${className}`}>
      <Link
        href="/"
      >
      <a
        onClick={() => {
          if (!collapsed) {
            dispatch({
              type: COLLAPSED,
              value: !collapsed,
            })
          }
        }}
        className="w-full flex items-center justify-start space-x-3"
      >
        <div className="min-w-max">
          <div className="flex dark:hidden items-center">
            <img
              src="/logos/logo.png"
              alt=""
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>
          <div className="hidden dark:flex items-center">
            <img
              src="/logos/logo_white.png"
              alt=""
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>
        </div>
        {!noSiderbar && (
          <span className="normal-case text-blue-600 dark:text-white text-lg font-bold">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </span>
        )}
      </a>
      </Link>
      {!noSiderbar && (
        <button
          onClick={() => {
            dispatch({
              type: COLLAPSED,
              value: !collapsed,
            })
          }}
          className="block md:hidden ml-auto mr-4">
          <FiMenu size={20} />
        </button>
      )}
    </div>
  )
}