import { useRouter } from 'next/router'
import { useSelector, shallowEqual } from 'react-redux'
import DropdownContract from './dropdown-contract'
import DropdownExplorer from './dropdown-explorer'
import DropdownSourceCode from './dropdown-sourcecode'
import { ProgressBarWithText } from '../progress-bars'
import { FaHome, FaFacebook, FaTwitter, FaTelegram, FaReddit, FaSlack, FaYoutube, FaInstagram, FaGithub, FaBitbucket, FaLinkedin, FaDiscord, FaMedium, FaWeibo, FaCoins } from 'react-icons/fa'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { GoBrowser } from 'react-icons/go'
import { AiOutlineLineChart, AiOutlineAreaChart, AiOutlineLock, AiOutlineBarChart } from 'react-icons/ai'
import _ from 'lodash'
import { currencies } from '../../lib/menus'
import { getName, number_format, ellipseAddress } from '../../lib/utils'

export default ({ coinData }) => {
  const { preferences, data } = useSelector(state => ({ preferences: state.preferences, data: state.data }), shallowEqual)
  const { vs_currency } = { ...preferences }
  const { exchange_rates_data } = { ...data }
  const currency = currencies[currencies.findIndex(c => c.id === vs_currency)] || currencies[0]
  const currencyBTC = currencies[currencies.findIndex(c => c.id === 'btc')]
  const currencyUSD = currencies[currencies.findIndex(c => c.id === 'usd')]

  const router = useRouter()
  const { query } = { ...router }
  const { view } = { ...query }

  const hasTVL = coinData && coinData.market_data && coinData.market_data.total_value_locked && coinData.market_data.total_value_locked[currencyBTC.id] > 0

  const isWidget = ['widget'].includes(view)

  return (
    <>
      {!isWidget && coinData && (
        <div className="flex flex-col sm:flex-row">
          <div className="max-w-sm lg:max-w-4xl flex flex-wrap items-center my-auto">
            {['homepage', 'facebook_username', 'twitter_screen_name', 'telegram_channel_identifier', 'subreddit_url', 'announcement_url', 'official_forum_url', 'bitcointalk_thread_identifier', 'chat_url'].filter(field => coinData.links[field] && (coinData.links[field].length > 0 || typeof coinData.links[field] === 'object'))
            .flatMap(field => {
              if (Array.isArray(coinData.links[field])) {
                coinData.links[field] = coinData.links[field].filter(url => url)
              }
              else if (typeof coinData.links[field] === 'object') {
                coinData.links[field] = Object.entries(coinData.links[field]).flatMap(([_field, value]) => value.filter(url => url))
              }

              const urls = []

              for (let i = 0; i < (Array.isArray(coinData.links[field]) ? coinData.links[field].length : 1); i++) {
                let urlValue = Array.isArray(coinData.links[field]) ? coinData.links[field][i] : coinData.links[field]
                urlValue = (urlValue.startsWith('http') && new URL(urlValue).searchParams.get('url')) || urlValue

                const url = field === 'facebook_username' && !urlValue.startsWith('http') ?
                  `https://facebook.com/${urlValue}`
                  :
                  field === 'twitter_screen_name' && !urlValue.startsWith('http') ?
                    `https://twitter.com/${urlValue}`
                    :
                    field === 'telegram_channel_identifier' && !urlValue.startsWith('http') ?
                      `https://t.me/${urlValue}`
                      :
                      field === 'subreddit_url' && !urlValue.startsWith('http') ?
                        `https://www.reddit.com${urlValue}`
                        :
                        field === 'bitcointalk_thread_identifier' && !urlValue.startsWith('http') ?
                          `https://bitcointalk.org/index.php?topic=${urlValue}`
                          :
                          urlValue

                const urlSplit = url.startsWith('http') && new URL(url).pathname.split('/').filter(path => path)

                const value = urlSplit ? ['reddit.com'].findIndex(hostname => url.includes(hostname)) > -1 ? urlSplit.join('/') : ['youtube.com'].findIndex(hostname => url.includes(hostname)) > -1 ? new URL(url).hostname : (_.last(urlSplit) || new URL(urlValue).hostname) : urlValue

                urls.push({
                  field,
                  value,
                  url,
                })
              }

              return urls
            }).map((urlData, i) => (
              <a key={i} href={urlData.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs space-x-1 my-1 mr-2 sm:mr-4">
                {urlData.field === 'homepage' ?
                  <FaHome size={20} className="text-indigo-500 dark:text-indigo-300" />
                  :
                  new URL(urlData.url).hostname.includes('facebook.com') ?
                    <FaFacebook size={20} className="text-facebook" />
                    :
                    new URL(urlData.url).hostname.includes('twitter.com') ?
                    <FaTwitter size={20} className="text-twitter" />
                    :
                    new URL(urlData.url).hostname.includes('t.me') ?
                      <FaTelegram size={20} className="text-telegram" />
                      :
                      new URL(urlData.url).hostname.includes('reddit.com') ?
                        <FaReddit size={20} className="text-reddit" />
                        :
                        new URL(urlData.url).hostname.includes('slack.com') ?
                          <FaSlack size={20} className="text-slack" />
                          :
                          new URL(urlData.url).hostname.includes('youtube.com') ?
                            <FaYoutube size={20} className="text-youtube" />
                            :
                            new URL(urlData.url).hostname.includes('instagram.com') ?
                              <FaInstagram size={20} className="text-instagram" />
                              :
                              new URL(urlData.url).hostname.includes('github.com') ?
                                <FaGithub size={20} className="text-github dark:text-white" />
                                :
                                new URL(urlData.url).hostname.includes('bitbucket.org') ?
                                  <FaBitbucket size={20} className="text-bitbucket" />
                                  :
                                  new URL(urlData.url).hostname.includes('linkedin.com') ?
                                    <FaLinkedin size={20} className="text-linkedin" />
                                    :
                                    new URL(urlData.url).hostname.includes('discord') ?
                                      <FaDiscord size={20} className="text-discord" />
                                      :
                                      new URL(urlData.url).hostname.includes('medium.com') ?
                                        <FaMedium size={20} className="text-medium dark:text-white" />
                                        :
                                        new URL(urlData.url).hostname.includes('weibo.com') ?
                                          <FaWeibo size={20} className="text-weibo" />
                                          :
                                          new URL(urlData.url).hostname.includes('kakao.com') ?
                                            <RiKakaoTalkFill size={20} className="text-kakao" />
                                            :
                                            <GoBrowser size={20} className="text-google" />
                }
                <span className="hidden sm:block text-blue-500 dark:text-blue-400">{urlData.value}</span>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center mt-3 mb-4 sm:my-0 ml-0 sm:ml-auto">
            <DropdownExplorer
              data={
                ['blockchain_site'].filter(field => coinData.links[field] && coinData.links[field].length > 0)
                .flatMap(field => {
                  if (Array.isArray(coinData.links[field])) {
                    coinData.links[field] = coinData.links[field].filter(url => url)
                  }

                  const urls = []

                  for (let i = 0; i < (Array.isArray(coinData.links[field]) ? coinData.links[field].length : 1); i++) {
                    let urlValue = Array.isArray(coinData.links[field]) ? coinData.links[field][i] : coinData.links[field]
                    urlValue = (urlValue.startsWith('http') && new URL(urlValue).searchParams.get('url')) || urlValue

                    const url = urlValue

                    const urlSplit = url.startsWith('http') && new URL(url).pathname.split('/').filter(path => path)

                    const value = urlSplit ? new URL(urlValue).hostname : urlValue

                    urls.push({
                      field,
                      value,
                      url,
                    })
                  }

                  return urls
                }).map((urlData, i) => {
                  return {
                    ...urlData,
                    icon: (
                      <GoBrowser size={20} className="text-google" />
                    ),
                    value: (
                      <span className="text-blue-500 dark:text-blue-400 text-xs">{urlData.value}</span>
                    ),
                  }
                })
              }
            />
            <DropdownSourceCode
              data={
                ['repos_url'].filter(field => coinData.links[field] && (coinData.links[field].length > 0 || typeof coinData.links[field] === 'object'))
                .flatMap(field => {
                  if (Array.isArray(coinData.links[field])) {
                    coinData.links[field] = coinData.links[field].filter(url => url)
                  }
                  else if (typeof coinData.links[field] === 'object') {
                    coinData.links[field] = Object.entries(coinData.links[field]).flatMap(([_field, value]) => value.filter(url => url))
                  }

                  const urls = []

                  for (let i = 0; i < (Array.isArray(coinData.links[field]) ? coinData.links[field].length : 1); i++) {
                    let urlValue = Array.isArray(coinData.links[field]) ? coinData.links[field][i] : coinData.links[field]
                    urlValue = (urlValue.startsWith('http') && new URL(urlValue).searchParams.get('url')) || urlValue

                    const url = urlValue

                    const urlSplit = url.startsWith('http') && new URL(url).pathname.split('/').filter(path => path)

                    const value = urlSplit ? ['reddit.com'].findIndex(hostname => url.includes(hostname)) > -1 ? urlSplit.join('/') : _.last(urlSplit) || new URL(urlValue).hostname : urlValue

                    urls.push({
                      field,
                      value,
                      url,
                    })
                  }

                  return urls
                }).map((urlData, i) => {
                  return {
                    ...urlData,
                    icon: (
                      new URL(urlData.url).hostname.includes('github.com') ?
                        <FaGithub size={20} className="text-github dark:text-white" />
                        :
                        new URL(urlData.url).hostname.includes('bitbucket.org') ?
                          <FaBitbucket size={20} className="text-bitbucket" />
                          :
                          <GoBrowser size={20} className="text-google" />
                    ),
                    value: (
                      <span className="text-blue-500 dark:text-blue-400 text-xs">{urlData.value}</span>
                    ),
                  }
                })
              }
            />
            <DropdownContract
              data={
                ['platforms'].filter(field => coinData[field])
                .flatMap(field => {
                  if (Array.isArray(coinData[field])) {
                    coinData[field] = coinData[field].filter(contract => contract)
                  }
                  else if (typeof coinData[field] === 'object') {
                    coinData[field] = Object.entries(coinData[field]).filter(([_field, value]) => value && value.length > 5).map(([_field, value]) => {
                      return {
                        chain: _field && getName(_field),
                        address: value,
                      }
                    })
                  }

                  const contracts = []

                  for (let i = 0; i < (Array.isArray(coinData[field]) ? coinData[field].length : 1); i++) {
                    const contract = Array.isArray(coinData[field]) ? coinData[field][i] : coinData[field]

                    contracts.push({
                      ...contract,
                      field,
                    })
                  }

                  return contracts
                }).map((contract, i) => {
                  return {
                    ...contract,
                    text: contract.address,
                    title: (
                      <span className="text-gray-400 dark:text-gray-200" style={{ fontSize: '.65rem' }}>{contract.chain}</span>
                    ),
                    value: (
                      <span className="text-gray-700 dark:text-gray-400 text-xs">{ellipseAddress(contract.address, 10)}</span>
                    ),
                  }
                })
              }
            />
          </div>
        </div>
      )}
      <div className={`w-full ${isWidget ? 'flex flex-col' : `grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-${hasTVL ? 5 : 4}`} gap-${isWidget ? 2 : 4} my-2 md:my-4`}>
        <div
          title={<span className={`uppercase flex items-center ${isWidget ? 'text-xs mt-1' : ''}`}>
            Market Cap
            {!isWidget && (
              <AiOutlineLineChart size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
            )}
          </span>}
          description={<span className={`${isWidget ? 'text-base' : 'text-xl'}`}>
            {coinData ?
              <>
                <span className="space-x-1">
                  {currency.symbol}
                  <span>{coinData.market_data.market_cap[currency.id] > -1 ? number_format(coinData.market_data.market_cap[currency.id], `0,0${Math.abs(coinData.market_data.market_cap[currency.id]) < 1 ? '.000' : ''}`) : '-'}</span>
                  {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                </span>
                {exchange_rates_data && currency.id !== currencyBTC.id && (
                  <div className={`text-gray-400 text-xs font-medium space-x-1 mt-${isWidget ? 0 : 1}`}>
                    {coinData.market_data.market_cap[currency.id] > -1 ?
                      <>
                        <span>{number_format(coinData.market_data.market_cap[currency.id] * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[currency.id].value : 1), `0,0${Math.abs(coinData.market_data.market_cap[currency.id] * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[currency.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                        <span className="uppercase">{currencyBTC.id}</span>
                      </>
                      :
                      '-'
                    }
                  </div>
                )}
              </>
              :
              <>
                <div className="skeleton w-36 h-6 rounded mt-1" />
                <div className={`skeleton w-20 h-4 rounded mt-1.5 ${isWidget ? 'ml-auto' : ''}`} />
              </>
            }
          </span>}
          className={`bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 border-gray-100 dark:border-gray-800 p-0 ${isWidget ? 'sm:border-0 sm:p-0' : 'sm:border sm:p-4'}`}
          contentClassName={`${isWidget ? 'w-72 text-right' : ''}`}
          titleSubTitleClassName={`${isWidget ? 'flex items-start justify-between' : ''}`}
        />
        {!isWidget && (
          <div
            title={<span className="uppercase flex items-center">
              Fully Diluted MCap
              <AiOutlineAreaChart size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
            </span>}
            description={<span className="text-xl">
              {coinData ?
                <>
                  <span className="space-x-1">
                    {currency.symbol}
                    <span>{coinData.market_data.fully_diluted_valuation[currency.id] > -1 ? number_format(coinData.market_data.fully_diluted_valuation[currency.id], `0,0${Math.abs(coinData.market_data.fully_diluted_valuation[currency.id]) < 1 ? '.000' : ''}`) : '-'}</span>
                    {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                  </span>
                  {exchange_rates_data && currency.id !== currencyBTC.id && (
                    <div className="text-gray-400 text-xs font-medium space-x-1 mt-1">
                      {coinData.market_data.fully_diluted_valuation[currency.id] > -1 ?
                        <>
                          <span>{number_format(coinData.market_data.fully_diluted_valuation[currency.id] * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[currency.id].value : 1), `0,0${Math.abs(coinData.market_data.fully_diluted_valuation[currency.id] * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[currency.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                          <span className="uppercase">{currencyBTC.id}</span>
                        </>
                        :
                        '-'
                      }
                    </div>
                  )}
                </>
                :
                <>
                  <div className="skeleton w-36 h-6 rounded mt-1" />
                  <div className="skeleton w-20 h-4 rounded mt-1.5" />
                </>
              }
            </span>}
            className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
          />
        )}
        {hasTVL && (
          <div
            title={<span className={`uppercase flex items-center ${isWidget ? 'text-xs mt-1' : ''}`}>
              Total Value Locked
              {!isWidget && (
                <AiOutlineLock size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
              )}
            </span>}
            description={<span className={`${isWidget ? 'text-base' : 'text-xl'}`}>
              <span className="space-x-1">
                {(exchange_rates_data ? currency : currencyUSD).symbol}
                <span>{number_format(coinData.market_data.total_value_locked[currencyUSD.id] * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1), `0,0${Math.abs(coinData.market_data.total_value_locked[currencyUSD.id] * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyUSD.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                {!((exchange_rates_data ? currency : currencyUSD).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyUSD).id}</span>)}
              </span>
              {currency.id !== currencyBTC.id && (
                <div className={`text-gray-400 text-xs font-medium space-x-1 mt-${isWidget ? 0 : 1}`}>
                  <span>{number_format(coinData.market_data.total_value_locked[currencyBTC.id], `0,0${Math.abs(coinData.market_data.total_value_locked[currencyBTC.id]) < 1 ? '.000' : ''}`)}</span>
                  <span className="uppercase">{currencyBTC.id}</span>
                </div>
              )}
            </span>}
            className={`bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 border-gray-100 dark:border-gray-800 p-0 ${isWidget ? 'sm:border-0 sm:p-0' : 'sm:border sm:p-4'}`}
            contentClassName={`${isWidget ? 'w-72 text-right' : ''}`}
            titleSubTitleClassName={`${isWidget ? 'flex items-start justify-between' : ''}`}
          />
        )}
        <div
          title={<span className={`uppercase flex items-center ${isWidget ? 'text-xs mt-1' : ''}`}>
            24h Volume
            {!isWidget && (
              <AiOutlineBarChart size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
            )}
          </span>}
          description={<span className={`${isWidget ? 'text-base' : 'text-xl'}`}>
            {coinData ?
              <>
                <span className="space-x-1">
                  {currency.symbol}
                  <span>{coinData.market_data.total_volume[currency.id] > -1 ? number_format(coinData.market_data.total_volume[currency.id], `0,0${Math.abs(coinData.market_data.total_volume[currency.id]) < 1 ? '.000' : ''}`) : '-'}</span>
                  {!currency.symbol && (<span className="uppercase">{currency.id}</span>)}
                </span>
                {exchange_rates_data && currency.id !== currencyBTC.id && (
                  <div className={`text-gray-400 text-xs font-medium space-x-1 mt-${isWidget ? 0 : 1}`}>
                    {coinData.market_data.total_volume[currency.id] > -1 ?
                      <>
                        <span>{number_format(coinData.market_data.total_volume[currency.id] * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[currency.id].value : 1), `0,0${Math.abs(coinData.market_data.total_volume[currency.id] * (exchange_rates_data ? exchange_rates_data[currencyBTC.id].value / exchange_rates_data[currency.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                        <span className="uppercase">{currencyBTC.id}</span>
                      </>
                      :
                      '-'
                    }
                  </div>
                )}
              </>
              :
              <>
                <div className="skeleton w-36 h-6 rounded mt-1" />
                <div className={`skeleton w-20 h-4 rounded mt-1.5 ${isWidget ? 'ml-auto' : ''}`} />
              </>
            }
          </span>}
          className={`bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 border-gray-100 dark:border-gray-800 p-0 ${isWidget ? 'sm:border-0 sm:p-0' : 'sm:border sm:p-4'}`}
          contentClassName={`${isWidget ? 'w-72 text-right' : ''}`}
          titleSubTitleClassName={`${isWidget ? 'flex items-start justify-between' : ''}`}
        />
        {!isWidget && (
          <div
            title={<span className="uppercase flex items-center">
              Circulating Supply
              <FaCoins size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
            </span>}
            description={<span className="text-xl">
              {coinData ?
                coinData.market_data.circulating_supply > -1 ?
                  <>
                    <span>{number_format(coinData.market_data.circulating_supply, '0,0')}</span>
                    {coinData.market_data.max_supply > 0 ?
                      <>
                        <div className="flex items-center text-xs space-x-1.5 mt-1">
                          <ProgressBarWithText
                            width={coinData.market_data.circulating_supply * 100 / coinData.market_data.max_supply}
                            text={<div className="text-gray-600 dark:text-gray-400 font-normal mx-1" style={{ fontSize: coinData.market_data.circulating_supply * 100 / coinData.market_data.max_supply < 25 ? '.45rem' : '.55rem' }}>{number_format(coinData.market_data.circulating_supply * 100 / coinData.market_data.max_supply, `0,0.000${Math.abs(coinData.market_data.circulating_supply * 100 / coinData.market_data.max_supply) < 0.001 ? '000' : ''}`)}%</div>}
                            color="bg-gray-200 dark:bg-gray-600 rounded"
                            backgroundClassName="h-3 bg-gray-100 dark:bg-gray-800 rounded"
                            className={`h-3 flex items-center justify-${coinData.market_data.circulating_supply * 100 / coinData.market_data.max_supply < 25 ? 'start' : 'end'}`}
                          />
                          <span className="text-gray-400 dark:text-gray-500 font-normal ml-auto" style={{ fontSize: '.65rem' }}>
                            <span className="font-medium mr-1">Max</span>
                            {number_format(coinData.market_data.max_supply, '0,0')}
                          </span>
                        </div>
                      </>
                      :
                      coinData.market_data.total_supply > 0 ?
                        <>
                          <div className="flex items-center text-xs space-x-1.5 mt-1">
                            <ProgressBarWithText
                              width={coinData.market_data.circulating_supply * 100 / coinData.market_data.total_supply}
                              text={<div className="text-gray-600 dark:text-gray-400 font-normal mx-1" style={{ fontSize: coinData.market_data.circulating_supply * 100 / coinData.market_data.total_supply < 25 ? '.45rem' : '.55rem' }}>{number_format(coinData.market_data.circulating_supply * 100 / coinData.market_data.total_supply, `0,0.000${Math.abs(coinData.market_data.circulating_supply * 100 / coinData.market_data.total_supply) < 0.001 ? '000' : ''}`)}%</div>}
                              color="bg-gray-200 dark:bg-gray-600 rounded"
                              backgroundClassName="h-3 bg-gray-100 dark:bg-gray-800 rounded"
                              className={`h-3 flex items-center justify-${coinData.market_data.circulating_supply * 100 / coinData.market_data.total_supply < 25 ? 'start' : 'end'}`}
                            />
                            <span className="text-gray-400 dark:text-gray-500 font-normal ml-auto" style={{ fontSize: '.65rem' }}>
                              <span className="font-medium mr-1">Total</span>
                              {number_format(coinData.market_data.total_supply, '0,0')}
                            </span>
                          </div>
                        </>
                        :
                        null
                    }
                  </>
                  :
                  '-'
                :
                <>
                  <div className="skeleton w-36 h-6 rounded mt-1" />
                  <div className="skeleton w-20 h-4 rounded mt-1.5" />
                </>
              }
            </span>}
            className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
          />
        )}
      </div>
    </>
  )
}