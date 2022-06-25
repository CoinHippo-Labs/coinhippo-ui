import { useRouter } from 'next/router'
import _ from 'lodash'
import { FaHome, FaFacebook, FaTwitter, FaTelegram, FaReddit, FaSlack, FaYoutube, FaInstagram, FaGithub, FaBitbucket, FaLinkedin, FaDiscord, FaMedium, FaWeibo } from 'react-icons/fa'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { GoBrowser } from 'react-icons/go'

import SelectExplorer from './select/explorer'
import SelectSourcecode from './select/sourcecode'
import SelectContract from './select/contract'
import { ProgressBarWithText } from '../progress-bars'
import { currency, currency_symbol, currency_btc } from '../../lib/object/currency'
import { name, number_format, ellipse } from '../../lib/utils'

export default ({ data }) => {
  const router = useRouter()
  const { query } = { ...router }
  const { view } = { ...query }

  const { market_data, links } = { ...data }
  const { market_cap, fully_diluted_valuation, total_value_locked, total_volume, circulating_supply, max_supply } = { ...market_data }
  const has_tvl = total_value_locked?.[currency_btc] > 0
  const is_widget = ['widget'].includes(view)

  return (
    <>
      {!is_widget && data && (
        <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="max-w-sm lg:max-w-4xl flex flex-wrap items-center my-auto">
            {['homepage', 'facebook_username', 'twitter_screen_name', 'telegram_channel_identifier', 'subreddit_url', 'announcement_url', 'official_forum_url', 'bitcointalk_thread_identifier', 'chat_url'].filter(f => links?.[f]?.length > 0 || typeof links?.[f] === 'object').flatMap(f => {
              if (Array.isArray(links[f])) {
                links[f] = links[f].filter(url => url)
              }
              else if (typeof links[f] === 'object') {
                links[f] = Object.values({ ...links[f] }).flatMap(v => v?.filter(url => url))
              }
              const urls = []
              for (let i = 0; i < (Array.isArray(links[f]) ? links[f].length : 1); i++) {
                let url = Array.isArray(links[f]) ? links[f][i] : links[f]
                const is_url = url.startsWith('http')
                url = (is_url && new URL(url).searchParams.get('url')) || url
                url = !is_url ?
                  f === 'facebook_username' ?
                    `https://facebook.com/${url}` :
                    f === 'twitter_screen_name' ?
                      `https://twitter.com/${url}` :
                      f === 'telegram_channel_identifier' ?
                        `https://t.me/${url}` :
                        f === 'subreddit_url' ?
                          `https://www.reddit.com${url}` :
                          f === 'bitcointalk_thread_identifier' ?
                            `https://bitcointalk.org/index.php?topic=${url}` :
                            url :
                  url
                const url_splitted = url.startsWith('http') && new URL(url).pathname.split('/').filter(p => p)
                const value = url_splitted ? ['reddit.com'].findIndex(h => url.includes(h)) > -1 ?
                  url_splitted.join('/') :
                  ['youtube.com'].findIndex(h => url.includes(h)) > -1 ?
                    new URL(url).hostname :
                    (_.last(url_splitted) || new URL(url).hostname) :
                    url
                urls.push({
                  field: f,
                  value,
                  url,
                })
              }
              return urls
            }).map((d, i) => (
              <a
                key={i}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs space-x-1 mb-1 mr-2 sm:mr-4"
              >
                {d.field === 'homepage' ?
                  <FaHome size={20} className="text-blue-400 dark:text-blue-600" /> :
                  new URL(d.url).hostname.includes('facebook.com') ?
                    <FaFacebook size={20} className="text-facebook" /> :
                    new URL(d.url).hostname.includes('twitter.com') ?
                      <FaTwitter size={20} className="text-twitter" /> :
                      new URL(d.url).hostname.includes('t.me') ?
                        <FaTelegram size={20} className="text-telegram" /> :
                        new URL(d.url).hostname.includes('reddit.com') ?
                          <FaReddit size={20} className="text-reddit" /> :
                          new URL(d.url).hostname.includes('slack.com') ?
                            <FaSlack size={20} className="text-slack" /> :
                            new URL(d.url).hostname.includes('youtube.com') ?
                              <FaYoutube size={20} className="text-youtube" /> :
                              new URL(d.url).hostname.includes('instagram.com') ?
                                <FaInstagram size={20} className="text-instagram" /> :
                                new URL(d.url).hostname.includes('github.com') ?
                                  <FaGithub size={20} className="text-github dark:text-white" /> :
                                  new URL(d.url).hostname.includes('bitbucket.org') ?
                                    <FaBitbucket size={20} className="text-bitbucket" /> :
                                    new URL(d.url).hostname.includes('linkedin.com') ?
                                      <FaLinkedin size={20} className="text-linkedin" /> :
                                      new URL(d.url).hostname.includes('discord') ?
                                        <FaDiscord size={20} className="text-discord" /> :
                                        new URL(d.url).hostname.includes('medium.com') ?
                                          <FaMedium size={20} className="text-medium dark:text-white" /> :
                                          new URL(d.url).hostname.includes('weibo.com') ?
                                            <FaWeibo size={20} className="text-weibo" /> :
                                            new URL(d.url).hostname.includes('kakao.com') ?
                                              <RiKakaoTalkFill size={20} className="text-kakao" /> :
                                              <GoBrowser size={20} className="text-google" />
                }
                <span className="hidden sm:block text-blue-400 dark:text-blue-600 text-sm font-semibold">
                  {d.value}
                </span>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center space-x-2">
            <SelectExplorer
              data={
                ['blockchain_site'].filter(f => links?.[f]?.length > 0).flatMap(f => {
                  if (Array.isArray(links[f])) {
                    links[f] = links[f].filter(url => url)
                  }
                  const urls = []
                  for (let i = 0; i < (Array.isArray(links[f]) ? links[f].length : 1); i++) {
                    let url = Array.isArray(links[f]) ? links[f][i] : links[f]
                    const is_url = url.startsWith('http')
                    url = (is_url && new URL(url).searchParams.get('url')) || url
                    const url_splitted = url.startsWith('http') && new URL(url).pathname.split('/').filter(p => p)
                    const value = url_splitted ? new URL(url).hostname : url
                    urls.push({
                      field: f,
                      value,
                      url,
                    })
                  }
                  return urls
                }).map((d, i) => {
                  return {
                    ...d,
                    icon: (
                      <GoBrowser size={20} className="text-google" />
                    ),
                    value: (
                      <span className="text-blue-500 hover:text-blue-600 dark:text-slate-200 dark:hover:text-white text-xs font-semibold">
                        {d.value}
                      </span>
                    ),
                  }
                })
              }
            />
            <SelectSourcecode
              data={
                ['repos_url'].filter(f => (links?.[f]?.length > 0 || typeof links?.[f] === 'object')).flatMap(f => {
                  if (Array.isArray(links[f])) {
                    links[f] = links[f].filter(url => url)
                  }
                  else if (typeof links[f] === 'object') {
                    links[f] = Object.values({ ...links[f] }).flatMap(v => v?.filter(url => url))
                  }
                  const urls = []
                  for (let i = 0; i < (Array.isArray(links[f]) ? links[f].length : 1); i++) {
                    let url = Array.isArray(links[f]) ? links[f][i] : links[f]
                    const is_url = url.startsWith('http')
                    url = (is_url && new URL(url).searchParams.get('url')) || url
                    const url_splitted = url.startsWith('http') && new URL(url).pathname.split('/').filter(p => p)
                    const value = url_splitted ? ['reddit.com'].findIndex(h => url.includes(h)) > -1 ?
                      url_splitted.join('/') :
                      ['youtube.com'].findIndex(h => url.includes(h)) > -1 ?
                        new URL(url).hostname :
                        (_.last(url_splitted) || new URL(url).hostname) :
                        url
                    urls.push({
                      field: f,
                      value,
                      url,
                    })
                  }
                  return urls
                }).map((d, i) => {
                  const { url } = { ...d }
                  return {
                    ...d,
                    icon: (
                      new URL(url).hostname.includes('github.com') ?
                        <FaGithub size={20} className="text-github dark:text-white" /> :
                        new URL(url).hostname.includes('bitbucket.org') ?
                          <FaBitbucket size={20} className="text-bitbucket" /> :
                          <GoBrowser size={20} className="text-google" />
                    ),
                    value: (
                      <span className="text-blue-500 hover:text-blue-600 dark:text-slate-200 dark:hover:text-white text-xs font-semibold">
                        {d.value}
                      </span>
                    ),
                  }
                })
              }
            />
            <SelectContract
              data={
                ['platforms'].filter(f => data?.[f])
                .flatMap(f => {
                  if (Array.isArray(data[f])) {
                    data[f] = data[f].filter(c => c)
                  }
                  else if (typeof data[f] === 'object') {
                    data[f] = Object.entries(data[f]).filter(([k, v]) => v?.length > 5).map(([k, v]) => {
                      return {
                        chain: name(k),
                        address: v,
                      }
                    })
                  }
                  const contracts = []
                  for (let i = 0; i < (Array.isArray(data[f]) ? data[f].length : 1); i++) {
                    const c = Array.isArray(data[f]) ? data[f][i] : data[f]
                    contracts.push({
                      ...c,
                      field: f,
                    })
                  }
                  return contracts
                }).map((c, i) => {
                  const { address, chain } = { ...c }
                  return {
                    ...c,
                    text: address,
                    title: (
                      <span className="text-slate-400 dark:text-slate-200 text-2xs font-semibold">
                        {chain}
                      </span>
                    ),
                    value: (
                      <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                        {ellipse(address, 10)}
                      </span>
                    ),
                  }
                })
              }
            />
          </div>
        </div>
      )}
      <div className={`w-full ${is_widget ? 'flex flex-col' : `grid grid-flow-row grid-cols-1 sm:grid-cols-2 ${has_tvl ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4`}`}>
        <div className={`${is_widget ? 'flex items-center justify-between space-x-2' : 'space-y-2'}`}>
          <div className="whitespace-nowrap text-slate-400 dark:text-slate-500 font-semibold">
            Market Cap
          </div>
          {data && (
            <div className={`${is_widget ? 'w-72 text-base text-right' : 'text-xl'} font-bold`}>
              {currency_symbol}
              {market_cap?.[currency] > -1 ? number_format(market_cap[currency], `0,0${Math.abs(market_cap[currency]) < 1 ? '.000' : ''}`) : '-'}
            </div>
          )}
        </div>
        {!is_widget && (
          <div className="space-y-2">
            <div className="whitespace-nowrap text-slate-400 dark:text-slate-500 font-semibold">
              Fully Diluted MCap
            </div>
            {data && (
              <div className={`${is_widget ? 'w-72 text-base text-right' : 'text-xl'} font-bold`}>
                {currency_symbol}
                {fully_diluted_valuation?.[currency] > -1 ? number_format(fully_diluted_valuation[currency], `0,0${Math.abs(fully_diluted_valuation[currency]) < 1 ? '.000' : ''}`) : '-'}
              </div>
            )}
          </div>
        )}
        {has_tvl && (
          <div className={`${is_widget ? 'flex items-center justify-between space-x-2' : 'space-y-2'}`}>
            <div className="whitespace-nowrap text-slate-400 dark:text-slate-500 font-semibold">
              Total Value Locked
            </div>
            {data && (
              <div className={`${is_widget ? 'w-72 text-base text-right' : 'text-xl'} font-bold`}>
                {currency_symbol}
                {total_value_locked?.[currency] > -1 ? number_format(total_value_locked[currency], `0,0${Math.abs(total_value_locked[currency]) < 1 ? '.000' : ''}`) : '-'}
              </div>
            )}
          </div>
        )}
        <div className={`${is_widget ? 'flex items-center justify-between space-x-2' : 'space-y-2'}`}>
          <div className="whitespace-nowrap text-slate-400 dark:text-slate-500 font-semibold">
            Volume 24h
          </div>
          {data && (
            <div className={`${is_widget ? 'w-72 text-base text-right' : 'text-xl'} font-bold`}>
              {currency_symbol}
              {total_volume?.[currency] > -1 ? number_format(total_volume[currency], `0,0${Math.abs(total_volume[currency]) < 1 ? '.000' : ''}`) : '-'}
            </div>
          )}
        </div>
        {!is_widget && (
          <div className="space-y-2">
            <div className="whitespace-nowrap text-slate-400 dark:text-slate-500 font-semibold">
              Circulating Supply
            </div>
            {data && (
              <div className="flex flex-col items-start space-y-1">
                <div className={`${is_widget ? 'w-72 text-base text-right' : 'text-xl'} font-bold`}>
                  {circulating_supply > -1 ? number_format(circulating_supply, '0,0') : '-'}
                </div>
                {circulating_supply > 0 && max_supply > 0 && (
                  <>
                    <ProgressBarWithText
                      width={circulating_supply * 100 / max_supply}
                      color="bg-slate-200 dark:bg-slate-600 rounded-lg"
                      text={<div
                        className="text-slate-600 dark:text-slate-400 font-medium mx-1"
                        style={{
                          fontSize: circulating_supply * 100 / max_supply < 25 ?
                            '.45rem' : '.55rem',
                        }}
                      >
                        {number_format(circulating_supply * 100 / max_supply, `0,0.000${Math.abs(circulating_supply * 100 / max_supply) < 0.001 ? '000' : ''}`)}%
                      </div>}
                      className={`h-3 flex items-center justify-${circulating_supply * 100 / max_supply < 25 ? 'start' : 'end'}`}
                      backgroundClassName="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
                    />
                    <div className="flex items-center justify-start sm:justify-end space-x-1.5">
                      <span className="text-2xs font-medium">
                        Max:
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-2xs font-semibold">
                        {number_format(max_supply, '0,0')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}