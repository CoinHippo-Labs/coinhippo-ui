import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import PageVisibility from 'react-page-visibility'
import Ticker from 'react-ticker'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

import Image from '../image'
import { currency_symbol } from '../../lib/object/currency'
import { number_format } from '../../lib/utils'

export default ({ data }) => {
  const router = useRouter()
  const { query } = { ...router }
  const { widget } = { ...query }

  const [visible, setVisible] = useState(true)

  const is_widget = ['price-marquee'].includes(widget)

  return data?.length > 0 && (
    <PageVisibility onChange={v => setVisible(v)}>
      {visible && (
        <Ticker>
          {({ index }) => (
            <>
              {[data[index % data.length]]
                .map(t => {
                  const {
                    id,
                    image,
                    name,
                    symbol,
                    current_price,
                    price_change_percentage_24h,
                    market_cap_rank,
                  } = { ...t }

                  return (
                    <Link
                      key={index}
                      href={`/token${id ? `/${id}` : 's'}`}
                    >
                    <a
                      target={is_widget ? '_blank' : '_self'}
                      rel={is_widget ? 'noopener noreferrer' : ''}
                    >
                      <div className={`w-full h-6 flex items-center justify-between space-x-2 ${index && index % data.length === 0 ? 'pl-4 md:pl-8 pr-2 md:pr-3' : 'px-2 md:px-3'}`}>
                        <div className="flex items-center space-x-1">
                          {image && (
                            <Image
                              src={image}
                              alt=""
                              width={16}
                              height={16}
                            />
                          )}
                          <span className="uppercase text-xs font-bold">
                            {symbol}
                          </span>
                        </div>
                        <span className={`${price_change_percentage_24h < 0 ? 'text-red-600 dark:text-red-400' : price_change_percentage_24h > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} text-xs font-semibold`}>
                          {currency_symbol}{number_format(current_price, '0,0.00000000')}
                        </span>
                      </div>
                      <div
                        className={`w-full flex items-center justify-between space-x-2 ${index && index % data.length === 0 ? 'pl-4 md:pl-8 pr-2 md:pr-3' : 'px-2 md:px-3'}`}
                        style={{ fontSize: '.65rem' }}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="font-semibold">
                            #{number_format(market_cap_rank, '0,0')}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {name}
                          </span>
                        </div>
                        <div className={`flex items-center ${price_change_percentage_24h < 0 ? 'text-red-600 dark:text-red-400' : price_change_percentage_24h > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} space-x-0.5`}>
                          <span className="font-medium">
                            {number_format(price_change_percentage_24h / 100, '+0,0.00%')}
                          </span>
                          {price_change_percentage_24h < 0 ?
                            <FiArrowDown size={10} /> :
                            price_change_percentage_24h > 0 ?
                              <FiArrowUp size={10} /> :
                              null
                          }
                        </div>
                      </div>
                    </a>
                    </Link>
                  )
                })
              }
            </>
          )}
        </Ticker>
      )}
    </PageVisibility>
  )
}