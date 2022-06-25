import { Fragment, useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import Logo from './logo'
import Item from './item'
import Tooltip from '../tooltip'
import menus from './menus'

export default () => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { collapsed } = { ...preferences }

  const [hiddenItem, setHiddenItem] = useState(null)
  const [openItem, setOpenItem] = useState(null)

  useEffect(() => {
    if (hiddenItem) {
      setHiddenItem(null)
    }
  }, [hiddenItem])

  useEffect(() => {
    if (openItem) {
      setOpenItem(null)
    }
  }, [openItem])

  return (
    <div className="sidebar sidebar-1 inline-table md:block">
      <Logo />
      {menus.map((m, i) => (
        <Fragment key={i}>
          <div className="sidebar-title">
            <span className="font-bold">
              {m.title}
            </span>
          </div>
          <ul>
            {m.items?.map((l0, a) => (
              <li
                key={a}
                className="l0"
              >
                {collapsed ?
                  <Tooltip
                    placement="top"
                    content={<span className="title whitespace-nowrap text-xs">
                      {l0.title}
                    </span>}
                  >
                    <Item
                      {...l0}
                      hiddenItem={hiddenItem}
                      openItem={openItem}
                      openItems={() => setOpenItem(l0)}
                    />
                  </Tooltip>
                  :
                  <Item
                    {...l0}
                    hiddenItem={hiddenItem}
                    openItem={openItem}
                    openItems={() => setOpenItem(l0)}
                  />
                }
                <ul className={l0.itemsClassName || 'max-h-60'}>
                  {l0.items?.map((l1, b) => (
                    <li
                      key={b}
                      className="l1"
                    >
                      <Item
                        {...l1}
                        hiddenItem={hiddenItem}
                        hiddenItems={() => setHiddenItem(l0)}
                        openItem={openItem}
                        openItems={() => setOpenItem(l1)}
                      />
                      <ul>
                        {l1.items?.map((l2, c) => (
                          <li
                            key={c}
                            className="l2"
                          >
                            <Item
                              {...l2}
                              hiddenItem={hiddenItem}
                              hiddenItems={() => setHiddenItem(l1)}
                              openItem={openItem}
                              openItems={() => setOpenItem(l2)}
                            />
                            <ul>
                              {l2.items?.map((l3, d) => (
                                <li
                                  key={d}
                                  className="l3"
                                >
                                  <Item
                                    {...l3}
                                    hiddenItem={hiddenItem}
                                    hiddenItems={() => setHiddenItem(l2)}
                                    openItem={openItem}
                                    openItems={() => setOpenItem(l3)}
                                  />
                                  <ul>
                                    {l3.items?.map((l4, e) => (
                                      <li
                                        key={e}
                                        className="l4"
                                      >
                                        <Item
                                          {...l4}
                                          hiddenItem={hiddenItem}
                                          hiddenItems={() => setHiddenItem(l3)}
                                          openItem={openItem}
                                          openItems={() => setOpenItem(l4)}
                                        />
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </div>
  )
}