import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import Ticker from 'react-ticker'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

import Image from '../image'
import NumberDisplay from '../number'
import { toArray } from '../../lib/utils'

export default ({ data }) => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { page_visible } = { ...preferences }

  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }

  const is_widget = widget === 'price-marquee'

  return toArray(data).length > 0 && page_visible && (
    <Ticker>
      {({ index }) => (
        <>
          {[data[index % data.length]].map(d => {
            const { id, image, name, symbol, current_price, price_change_percentage_24h, market_cap_rank } = { ...d }
            return (
              <Link
                key={index}
                href={`/token${id ? `/${id}` : 's'}`}
                target={is_widget ? '_blank' : '_self'}
                rel={is_widget ? 'noopener noreferrer' : ''}
              >
                <div className={`w-full h-6 flex items-center justify-between space-x-2 ${index && index % data.length === 0 ? 'pl-4 md:pl-8 pr-2 md:pr-3' : 'px-2 md:px-3'}`}>
                  <div className="flex items-center space-x-1">
                    {image && (
                      <Image
                        src={image}
                        width={16}
                        height={16}
                      />
                    )}
                    <span className="uppercase text-xs font-bold">
                      {symbol}
                    </span>
                  </div>
                  <NumberDisplay
                    value={current_price}
                    format="0,0.00000000"
                    prefix="$"
                    noTooltip={true}
                    className={`${price_change_percentage_24h < 0 ? 'text-red-500 dark:text-red-400' : price_change_percentage_24h > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} text-xs font-semibold`}
                  />
                </div>
                <div className={`w-full flex items-center justify-between text-2xs space-x-2 ${index && index % data.length === 0 ? 'pl-4 md:pl-8 pr-2 md:pr-3' : 'px-2 md:px-3'}`}>
                  <div className="flex items-center space-x-1">
                    <NumberDisplay
                      value={market_cap_rank}
                      format="0,0"
                      prefix="#"
                      className="font-semibold"
                    />
                    <span className="text-slate-600 dark:text-slate-400">
                      {name}
                    </span>
                  </div>
                  <div className={`flex items-center ${price_change_percentage_24h < 0 ? 'text-red-500 dark:text-red-400' : price_change_percentage_24h > 0 ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'} space-x-0.5`}>
                    <NumberDisplay
                      value={price_change_percentage_24h}
                      maxDecimals={2}
                      prefix={price_change_percentage_24h < 0 ? '' : '+'}
                      suffix="%"
                      noTooltip={true}
                      className="font-medium"
                    />
                    {price_change_percentage_24h < 0 ? <FiArrowDown size={10} /> : price_change_percentage_24h > 0 ? <FiArrowUp size={10} /> : null}
                  </div>
                </div>
              </Link>
            )
          })}
        </>
      )}
    </Ticker>
  )
}