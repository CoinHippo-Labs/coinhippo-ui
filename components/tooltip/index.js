import { useState, useRef } from 'react'
import { usePopper } from 'react-popper'

export default ({
  placement = 'top',
  title = '',
  content = '',
  children,
}) => {
  const [hidden, setHidden] = useState(true)

  const buttonRef = useRef(null)
  const tooltipRef = useRef(null)

  const { styles, attributes } = usePopper(
    buttonRef.current,
    tooltipRef.current,
    {
      placement,
      modifiers: [
        {
          name: 'offset',
          enabled: true,
          options: {
            offset: [0, 0],
          },
        },
      ],
    }
  )

  const showTooltip = () => setHidden(false)
  const hideTooltip = () => setHidden(true)

  return (
    <div className="flex">
      <button
        ref={buttonRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="btn btn-default btn-rounded"
        style={{ padding: 0 }}
      >
        {children}
      </button>
      <div
        ref={tooltipRef}
        { ...attributes.popper }
        style={styles.popper}
      >
        <div
          className={`w-min max-w-xs ${hidden ? 'hidden' : 'block'} bg-white dark:bg-slate-900 border-0 border-slate-100 dark:border-slate-800 rounded-lg shadow-lg z-10 no-underline break-words text-sm font-semibold`}
          style={styles.offset}
        >
          <div className="p-2">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}