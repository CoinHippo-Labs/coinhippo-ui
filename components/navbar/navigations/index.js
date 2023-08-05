import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Menu, MenuHandler, MenuList } from '@material-tailwind/react'
import Swing from 'react-reveal/Swing'

import routes from './routes'
import { toArray, getTitle } from '../../../lib/utils'

const Group = ({ title, items, pathname, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Menu
      open={isOpen}
      handler={setIsOpen}
      placement="bottom"
      allowHover={true}
      offset={{ mainAxis: 12 }}
    >
      <MenuHandler>
        <div className={className}>
          <span className="whitespace-nowrap tracking-wider">
            {title}
          </span>
        </div>
      </MenuHandler>
      <MenuList className="w-56 bg-light dark:bg-slate-900 p-4">
        <div className="flex flex-col space-y-4">
          {toArray(items).map((d, i) => {
            const { disabled, title, path, others_paths } = { ...d }
            const external = !path?.startsWith('/')
            const selected = !external && (pathname === path || toArray(others_paths).includes(pathname))
            const item = (
              <span className="whitespace-nowrap tracking-wider">
                {title}
              </span>
            )
            const className = `${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center uppercase custom-font ${selected ? 'text-blue-600 dark:text-white text-sm font-extrabold' : 'text-slate-700 hover:text-blue-400 dark:text-slate-200 dark:hover:text-slate-100 text-sm font-medium'} space-x-1.5`
            return (
              external ?
                <a
                  key={i}
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {item}
                </a> :
                <Link key={i} href={path}>
                  <div className={className}>
                    {item}
                  </div>
                </Link>
            )
          })}
        </div>
      </MenuList>
    </Menu>
  )
}

export default () => {
  const router = useRouter()
  const { pathname } = { ...router }

  return (
    <div className="hidden xl:flex items-center xl:space-x-6 mx-auto">
      {routes.map((d, i) => {
        const { disabled, title, path, others_paths, icon, group, highlight } = { ...d }
        const is_group = group && i === routes.findIndex(d => d.group === group)
        const external = !path?.startsWith('/')
        const items = routes.filter(d => d.group === group)
        const selected = (!external && (pathname === path || toArray(others_paths).includes(pathname))) || (is_group && items.findIndex(d => pathname === d.path || toArray(d.others_paths).includes(pathname)) > -1)
        const item = (
          <>
            {icon}
            <span className="whitespace-nowrap tracking-wider">
              {title}
            </span>
          </>
        )
        const className = `${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center uppercase ${selected ? 'text-blue-600 dark:text-white text-sm font-extrabold' : 'text-slate-700 hover:text-blue-400 dark:text-slate-200 dark:hover:text-slate-100 text-sm font-medium'} space-x-2`
        let component = (
          external ?
            <a
              key={i}
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {item}
            </a> :
            <Link key={i} href={path}>
              <div className={className}>
                {item}
              </div>
            </Link>
        )
        if (highlight && !selected) {
          component = (
            <Swing key={i} duration={1500} forever>
              {component}
            </Swing>
          )
        }
        return (!group || is_group) && (
          is_group ?
            <Group
              key={i}
              title={getTitle(group)}
              items={items}
              pathname={pathname}
              className={className}
            /> :
            component
        )
      })}
    </div>
  )
}