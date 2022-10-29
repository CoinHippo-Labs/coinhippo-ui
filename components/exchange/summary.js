import { useSelector, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { TailSpin } from 'react-loader-spinner'
import { FaFacebook, FaTwitter, FaTelegram, FaReddit, FaSlack, FaYoutube, FaInstagram, FaGithub, FaLinkedin, FaDiscord, FaMedium, FaWeibo } from 'react-icons/fa'
import { GoBrowser } from 'react-icons/go'

import Stars from '../stars'
import { currency, currency_symbol, currency_btc } from '../../lib/object/currency'
import { number_format, loader_color } from '../../lib/utils'

export default ({
  data,
  tickers,
}) => {
  const { preferences, rates } = useSelector(state => ({ preferences: state.preferences, rates: state.rates }), shallowEqual)
  const { theme } = { ...preferences }
  const { rates_data } = { ...rates }

  const market_type = data?.market_type || 'spot'
  if (data) {
    if (market_type !== 'spot') {
      data.open_interest_btc = rates_data ? _.sumBy(tickers, 'open_interest_usd') * rates_data[currency_btc]?.value / rates_data[currency]?.value : -1
      data.trade_volume_24h_btc = _.sumBy(tickers, `converted_volume.${currency_btc}`)
    }
    else {
      data.trade_volume_24h_btc = data.trade_volume_24h_btc || _.sumBy(tickers, `converted_volume.${currency_btc}`)
    }
  }
  const metricClassName = 'bg-white dark:bg-black border hover:border-transparent dark:border-slate-900 hover:dark:border-transparent shadow hover:shadow-lg dark:shadow-slate-400 rounded-lg space-y-0.5 py-4 px-5'

  return (
    <>
      {data && market_type === 'spot' && (
        <div className="flex flex-wrap items-center mb-1">
          {['facebook_url', 'twitter_handle', 'telegram_url', 'reddit_url', 'slack_url', 'other_url_1', 'other_url_2'].filter(f => data[f])
          .map(f => {
            const is_url = data[f].startsWith('http')
            data[f] = (is_url && new URL(data[f]).searchParams.get('url')) || data[f]
            const url = f === 'facebook_url' && !is_url ?
              `https://facebook.com/${data[f]}` :
              f === 'twitter_handle' && !is_url ?
                `https://twitter.com/${data[f]}` :
                f === 'telegram_url' && !is_url ?
                  `https://t.me/${data[f]}` :
                  f === 'reddit_url' && !is_url ?
                    `https://www.reddit.com${data[f]}` :
                    data[f]
            const url_splitted = url.startsWith('http') && new URL(url).pathname.split('/').filter(p => p)
            const value = url_splitted ? ['reddit.com'].findIndex(h => url.includes(h)) > -1 ?
              url_splitted.join('/') :
              ['youtube.com'].findIndex(h => url.includes(h)) > -1 ?
                new URL(url).hostname :
                (_.last(url_splitted) || new URL(data[f]).hostname) :
                data[f]
            return ({
              field: f,
              value,
              url,
            })
          }).map((d, i) => (
            <a
              key={i}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 mb-1 mr-2 sm:mr-4"
            >
              {d.field === 'facebook_url' ?
                <FaFacebook size={20} className="text-facebook" /> :
                d.field === 'twitter_handle' ?
                  <FaTwitter size={20} className="text-twitter" /> :
                  d.field === 'telegram_url' ?
                    <FaTelegram size={20} className="text-telegram" /> :
                    d.field === 'reddit_url' ?
                      <FaReddit size={20} className="text-reddit" /> :
                      d.field === 'slack_url' ?
                        <FaSlack size={20} className="text-slack" /> :
                         new URL(d.url).hostname.includes('youtube.com') ?
                          <FaYoutube size={20} className="text-youtube" /> :
                          new URL(d.url).hostname.includes('instagram.com') ?
                            <FaInstagram size={20} className="text-instagram" /> :
                            new URL(d.url).hostname.includes('github.com') ?
                              <FaGithub size={20} className="text-github dark:text-white" /> :
                              new URL(d.url).hostname.includes('linkedin.com') ?
                                <FaLinkedin size={20} className="text-linkedin" /> :
                                new URL(d.url).hostname.includes('discord') ?
                                  <FaDiscord size={20} className="text-discord" /> :
                                  new URL(d.url).hostname.includes('medium.com') ?
                                    <FaMedium size={20} className="text-medium dark:text-white" /> :
                                    new URL(d.url).hostname.includes('weibo.com') ?
                                      <FaWeibo size={20} className="text-weibo" /> :
                                      <GoBrowser size={20} className="text-google" />
              }
              <span className="text-blue-400 dark:text-blue-600 text-sm font-semibold">
                {d.value}
              </span>
            </a>
          ))}
        </div>
      )}
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {market_type === 'spot' && (
          <>
            <div className={`${metricClassName}`}>
              <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
                Confidence
              </span>
              <div className="text-3xl font-bold">
                {data ?
                  data.trust_score_rank > -1 ?
                    `#${number_format(data.trust_score_rank, '0,0')}` :
                    '-' :
                  <TailSpin
                    color={loader_color(theme)}
                    width="36"
                    height="36"
                  />
                }
              </div>
              <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
                Trust score: {data && (data.trust_score > -1 ? number_format(data.trust_score, '0,0') : '-')}
              </span>
            </div>
            <div className={`${metricClassName}`}>
              <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
                Tokens
              </span>
              <div className="text-3xl font-bold">
                {data && tickers ?
                  number_format(data.number_of_tokens, '0,0') :
                  <TailSpin
                    color={loader_color(theme)}
                    width="36"
                    height="36"
                  />
                }
              </div>
              <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
                Number of tokens
              </span>
            </div>
            <div className={`${metricClassName}`}>
              <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
                Pairs
              </span>
              <div className="text-3xl font-bold">
                {data && tickers ?
                  number_format(data.number_of_pairs, '0,0') :
                  <TailSpin
                    color={loader_color(theme)}
                    width="36"
                    height="36"
                  />
                }
              </div>
              <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
                Number of pairs
              </span>
            </div>
          </>
        )}
        {market_type !== 'spot' && (
          <>
            <div className={`${metricClassName}`}>
              <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
                Perpetual Pairs
              </span>
              <div className="text-3xl font-bold">
                {data ?
                  number_format(data.number_of_perpetual_pairs, '0,0') :
                  <TailSpin
                    color={loader_color(theme)}
                    width="36"
                    height="36"
                  />
                }
              </div>
              <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
                Number of perpetual pairs
              </span>
            </div>
            <div className={`${metricClassName}`}>
              <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
                Futures Pairs
              </span>
              <div className="text-3xl font-bold">
                {data ?
                  number_format(data.number_of_futures_pairs, '0,0') :
                  <TailSpin
                    color={loader_color(theme)}
                    width="36"
                    height="36"
                  />
                }
              </div>
              <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
                Number of futures pairs
              </span>
            </div>
            <div className={`${metricClassName}`}>
              <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
                Open Interest 24h
              </span>
              <div className="text-3xl font-bold">
                {data ?
                  <div className="flex items-center uppercase font-semibold space-x-2">
                    <span>
                      {rates_data && currency_symbol}
                      {number_format(data.open_interest_btc * (rates_data ? rates_data[currency]?.value / rates_data[currency_btc]?.value : 1), '0,0')}
                    </span>
                    {!rates_data && (
                      <span>
                        {currency_btc}
                      </span>
                    )}
                  </div> :
                  <TailSpin
                    color={loader_color(theme)}
                    width="36"
                    height="36"
                  />
                }
              </div>
              <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
                Total 24h open interest in {(rates_data ? currency : currency_btc).toUpperCase()}
              </span>
            </div>
          </>
        )}
        <div className={`${metricClassName}`}>
          <span className="text-slate-500 dark:text-slate-300 text-base font-semibold">
            Volume 24h
          </span>
          <div className="text-3xl font-bold">
            {data ?
              <div className="flex items-center uppercase font-semibold space-x-2">
                <span>
                  {rates_data && currency_symbol}
                  {number_format(data.trade_volume_24h_btc * (rates_data ? rates_data[currency]?.value / rates_data[currency_btc]?.value : 1), '0,0')}
                </span>
                {!rates_data && (
                  <span>
                    {currency_btc}
                  </span>
                )}
              </div> :
              <TailSpin
                color={loader_color(theme)}
                width="36"
                height="36"
              />
            }
          </div>
          <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">
            Total 24h volume in {(rates_data ? currency : currency_btc).toUpperCase()}
          </span>
        </div>
      </div>
    </>
  )
}