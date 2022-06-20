import { useSelector, shallowEqual } from 'react-redux'
import Stars from '../stars'
import { FaFacebook, FaTwitter, FaTelegram, FaReddit, FaSlack, FaYoutube, FaInstagram, FaGithub, FaLinkedin, FaDiscord, FaMedium, FaWeibo, FaCoins } from 'react-icons/fa'
import { GoBrowser } from 'react-icons/go'
import { BsCheckCircle, BsCircle, BsFileCheck } from 'react-icons/bs'
import { AiOutlineBarChart } from 'react-icons/ai'
import { RiExchangeLine } from 'react-icons/ri'
import _ from 'lodash'
import { currency, currency_btc } from '../../lib/object/currency'
import { numberFormat } from '../../lib/utils'

export default ({ exchangeData, tickersData, derivativeType = 'perpetual', selectDerivativeType }) => {
  const { rates } = useSelector(state => ({ rates: state.rates }), shallowEqual)
  const { rates_data } = { ...rates }

  const marketType = (exchangeData && exchangeData.market_type) || 'spot'

  if (exchangeData) {
    if (marketType !== 'spot') {
      exchangeData.open_interest_btc = exchange_rates_data ? _.sumBy(tickersData, 'open_interest_usd') * exchange_rates_data[currencyBTC.id].value / exchange_rates_data[currencyUSD.id].value : -1
      exchangeData.trade_volume_24h_btc = _.sumBy(tickersData, `converted_volume.${currencyBTC.id}`)
    }
    else {
      exchangeData.trade_volume_24h_btc = exchangeData.trade_volume_24h_btc || _.sumBy(tickersData, `converted_volume.${currencyBTC.id}`)
    }
  }

  return (
    <>
      {exchangeData && marketType === 'spot' && (
        <div className="flex flex-wrap items-center mb-1">
          {['facebook_url', 'twitter_handle', 'telegram_url', 'reddit_url', 'slack_url', 'other_url_1', 'other_url_2'].filter(field => exchangeData[field])
          .map(field => {
            exchangeData[field] = (exchangeData[field].startsWith('http') && new URL(exchangeData[field]).searchParams.get('url')) || exchangeData[field]

            const url = field === 'facebook_url' && !exchangeData[field].startsWith('http') ?
              `https://facebook.com/${exchangeData[field]}`
              :
              field === 'twitter_handle' && !exchangeData[field].startsWith('http') ?
                `https://twitter.com/${exchangeData[field]}`
                :
                field === 'telegram_url' && !exchangeData[field].startsWith('http') ?
                  `https://t.me/${exchangeData[field]}`
                  :
                  field === 'reddit_url' && !exchangeData[field].startsWith('http') ?
                    `https://www.reddit.com${exchangeData[field]}`
                    :
                    exchangeData[field]

            const urlSplit = url.startsWith('http') && new URL(url).pathname.split('/').filter(path => path)

            const value = urlSplit ? ['reddit.com'].findIndex(hostname => url.includes(hostname)) > -1 ? urlSplit.join('/') : ['youtube.com'].findIndex(hostname => url.includes(hostname)) > -1 ? new URL(url).hostname : (_.last(urlSplit) || new URL(exchangeData[field]).hostname) : exchangeData[field]

            return ({
              field,
              value,
              url,
            })
          }).map((urlData, i) => (
            <a key={i} href={urlData.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs space-x-1 mb-1 mr-2 sm:mr-4">
              {urlData.field === 'facebook_url' ?
                <FaFacebook size={20} className="text-facebook" />
                :
                urlData.field === 'twitter_handle' ?
                  <FaTwitter size={20} className="text-twitter" />
                  :
                  urlData.field === 'telegram_url' ?
                    <FaTelegram size={20} className="text-telegram" />
                    :
                    urlData.field === 'reddit_url' ?
                      <FaReddit size={20} className="text-reddit" />
                      :
                      urlData.field === 'slack_url' ?
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
                                      <GoBrowser size={20} className="text-google" />
            }
              <span className="text-blue-500 dark:text-blue-400">{urlData.value}</span>
            </a>
          ))}
        </div>
      )}
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 md:mb-4">
        {marketType === 'spot' && (
          <div
            title={<span className="uppercase flex items-center">
            Confidence
            {exchangeData ?
              <span className="h-7 text-gray-900 dark:text-gray-100 text-xl ml-auto">
                {exchangeData.trust_score_rank > -1 ? `#${numberFormat(exchangeData.trust_score_rank, '0,0')}`
                  :
                  '-'
                }
              </span>
              :
              <div className="skeleton w-8 h-7 rounded ml-auto" />
            }
          </span>}
            description={<span className="text-xl">
              {exchangeData ?
                <>
                  <Stars score={exchangeData.trust_score} className="h-7" />
                  <div className="text-gray-400 text-xs font-medium space-x-1 mt-1">
                    {exchangeData.trust_score > -1 ?
                      <>
                        <span className="uppercase">Score:</span>
                        <span>{numberFormat(exchangeData.trust_score, '0,0')}</span>
                      </>
                      :
                      '-'
                    }
                  </div>
                </>
                :
                <>
                  <div className="skeleton w-36 h-6 rounded mt-1" />
                  <div className="skeleton w-20 h-4 rounded mt-1.5" />
                </>
              }
            </span>}
          />
        )}
        {marketType === 'spot' && (
          <>
            <div
              title={<span className="h-7 uppercase flex items-center">
                Coins
                <FaCoins size={24} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
              </span>}
              description={<span className="text-2xl">
                {exchangeData && tickersData ?
                  numberFormat(exchangeData.number_of_coins, '0,0')
                  :
                  <div className="skeleton w-10 h-7 rounded mt-1" />
                }
              </span>}
              onClick={() => selectDerivativeType && selectDerivativeType('perpetual')}
            />
            <div
              title={<span className="uppercase flex items-center">
                Pairs
                <RiExchangeLine size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
              </span>}
              description={<span className="text-2xl">
                {exchangeData && tickersData ?
                  numberFormat(exchangeData.number_of_pairs, '0,0')
                  :
                  <div className="skeleton w-10 h-7 rounded mt-1" />
                }
              </span>}
              onClick={() => selectDerivativeType && selectDerivativeType('futures')}
            />
          </>
        )}
        {marketType !== 'spot' && (
          <>
            <div
              title={<span className={`uppercase ${derivativeType === 'perpetual' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>Perpetual Pairs</span>}
              description={<span className={`${derivativeType === 'perpetual' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'} text-2xl`}>
                {exchangeData ?
                  numberFormat(exchangeData.number_of_perpetual_pairs, '0,0')
                  :
                  <div className="skeleton w-10 h-7 rounded mt-1" />
                }
              </span>}
              right={derivativeType === 'perpetual' ?
                <BsCheckCircle size={32} className="stroke-current text-blue-600 dark:text-blue-400" />
                :
                <BsCircle size={28} className="stroke-current text-gray-300 dark:text-gray-700 mt-1" />
              }
              onClick={() => selectDerivativeType && selectDerivativeType('perpetual')}
              className={`${derivativeType === 'perpetual' ? 'border-2 border-blue-600 dark:border-blue-400' : ''} cursor-pointer`}
            />
            <div
              title={<span className={`uppercase ${derivativeType === 'futures' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>Futures Pairs</span>}
              description={<span className={`${derivativeType === 'futures' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'} text-2xl`}>
                {exchangeData ?
                  numberFormat(exchangeData.number_of_futures_pairs, '0,0')
                  :
                  <div className="skeleton w-10 h-7 rounded mt-1" />
                }
              </span>}
              right={derivativeType === 'futures' ?
                <BsCheckCircle size={32} className="stroke-current text-blue-600 dark:text-blue-400" />
                :
                <BsCircle size={28} className="stroke-current text-gray-300 dark:text-gray-700 mt-1" />
              }
              onClick={() => selectDerivativeType && selectDerivativeType('futures')}
              className={`${derivativeType === 'futures' ? 'border-2 border-blue-600 dark:border-blue-400' : ''} cursor-pointer`}
            />
          </>
        )}
        {marketType !== 'spot' && (
          <div
            title={<span className="uppercase flex items-center">
              24h Open Interest
              <BsFileCheck size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
            </span>}
            description={<span className="text-xl">
              {exchangeData ?
                <>
                  <span className="space-x-1">
                    {(exchange_rates_data ? currency : currencyBTC).symbol}
                    <span>{numberFormat(exchangeData.open_interest_btc * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyBTC.id].value : 1), `0,0${Math.abs(exchangeData.open_interest_btc * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyBTC.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                    {!((exchange_rates_data ? currency : currencyBTC).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyBTC).id}</span>)}
                  </span>
                  {exchange_rates_data && currency.id !== currencyBTC.id && (
                    <div className="text-gray-400 text-xs font-medium space-x-1 mt-1">
                      {exchangeData.open_interest_btc > -1 ?
                        <>
                          <span>{numberFormat(exchangeData.open_interest_btc, `0,0${Math.abs(exchangeData.open_interest_btc) < 1 ? '.000' : ''}`)}</span>
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
          />
        )}
        <div
          title={<span className="uppercase flex items-center">
            24h Volume
            <AiOutlineBarChart size={28} className="stroke-current text-gray-500 dark:text-gray-400 ml-auto" />
          </span>}
          description={<span className="text-xl">
            {exchangeData ?
              <>
                <span className="space-x-1">
                  {(exchange_rates_data ? currency : currencyBTC).symbol}
                  <span>{numberFormat(exchangeData.trade_volume_24h_btc * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyBTC.id].value : 1), `0,0${Math.abs(exchangeData.trade_volume_24h_btc * (exchange_rates_data ? exchange_rates_data[currency.id].value / exchange_rates_data[currencyBTC.id].value : 1)) < 1 ? '.000' : ''}`)}</span>
                  {!((exchange_rates_data ? currency : currencyBTC).symbol) && (<span className="uppercase">{(exchange_rates_data ? currency : currencyBTC).id}</span>)}
                </span>
                {exchange_rates_data && currency.id !== currencyBTC.id && (
                  <div className="text-gray-400 text-xs font-medium space-x-1 mt-1">
                    {exchangeData.trade_volume_24h_btc > -1 ?
                      <>
                        <span>{numberFormat(exchangeData.trade_volume_24h_btc, `0,0${Math.abs(exchangeData.trade_volume_24h_btc) < 1 ? '.000' : ''}`)}</span>
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
        />
      </div>
    </>
  )
}