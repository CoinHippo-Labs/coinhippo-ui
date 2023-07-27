import { useRouter } from 'next/router'
import { Card, CardBody, CardFooter, Tooltip } from '@material-tailwind/react'
import _ from 'lodash'
import { FaHome, FaFacebook, FaTwitter, FaTelegram, FaReddit, FaSlack, FaYoutube, FaInstagram, FaGithub, FaBitbucket, FaLinkedin, FaDiscord, FaMedium, FaWeibo } from 'react-icons/fa'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { GoBrowser } from 'react-icons/go'

import SelectExplorer from './select/explorer'
import SelectSourceCode from './select/sourcecode'
import SelectContract from './select/contract'
import Spinner from '../../spinner'
import NumberDisplay from '../../number'
import { ProgressBarWithText } from '../../progress-bars'
import { split, toArray, getTitle, ellipse } from '../../../lib/utils'

const METRICS = ['market_cap', 'fully_diluted_market_cap', 'total_value_locked', 'volume', 'circulating_supply']

export default ({ data }) => {
  const router = useRouter()
  const { query } = { ...router }
  const { view } = { ...query }

  const { market_data, links } = { ...data }
  const { market_cap, fully_diluted_valuation, total_value_locked, total_volume, circulating_supply, max_supply } = { ...market_data }
  const has_tvl = total_value_locked?.btc > 0
  const is_widget = view === 'widget'

  const render = id => {
    const valueClassName = 'text-black dark:text-white text-3xl lg:text-2xl 2xl:text-3xl font-semibold'
    const titleClassName = 'whitespace-nowrap text-blue-400 dark:text-blue-500 text-base'

    let title
    let loading
    let tooltip
    let component

    switch (id) {
      case 'market_cap':
        title = 'Market Cap'
        loading = !data
        component = (
          <div>
            {market_cap?.usd > -1 && (
              <NumberDisplay
                value={market_cap.usd}
                format="0,0"
                prefix="$"
                className={valueClassName}
              />
            )}
          </div>
        )
        break
      case 'fully_diluted_market_cap':
        title = 'Fully Diluted MCap'
        loading = !data
        component = (
          <div>
            {fully_diluted_valuation?.usd > -1 && (
              <NumberDisplay
                value={fully_diluted_valuation.usd}
                format="0,0"
                prefix="$"
                className={valueClassName}
              />
            )}
          </div>
        )
        break
      case 'total_value_locked':
        title = 'Total Value Locked'
        loading = !data
        component = (
          <div>
            {total_value_locked?.usd > -1 && (
              <NumberDisplay
                value={total_value_locked.usd}
                format="0,0"
                prefix="$"
                className={valueClassName}
              />
            )}
          </div>
        )
        break
      case 'volume':
        title = 'Volume 24h'
        loading = !data
        component = (
          <div>
            {total_volume?.usd > -1 && (
              <NumberDisplay
                value={total_volume.usd}
                format="0,0"
                prefix="$"
                className={valueClassName}
              />
            )}
          </div>
        )
        break
      case 'circulating_supply':
        title = 'Circulating Supply'
        loading = !data
        const percentage = max_supply > 0 ? circulating_supply * 100 / max_supply : 0
        component = (
          <div>
            {circulating_supply > -1 && (
              <div className="flex flex-col">
                <NumberDisplay
                  value={circulating_supply}
                  format="0,0"
                  className={valueClassName}
                />
                {max_supply > 0 && (
                  <>
                    <ProgressBarWithText
                      width={percentage}
                      color="bg-slate-200 dark:bg-slate-600 rounded-lg"
                      text={
                        <NumberDisplay
                          value={percentage}
                          format="0,0.00"
                          suffix="%"
                          noTooltip={true}
                          className="text-slate-600 dark:text-slate-200 font-medium mx-1"
                          style={{ fontSize: percentage < 25 ? '.45rem' : '.55rem' }}
                        />
                      }
                      className={`h-3 flex items-center justify-${percentage < 25 ? 'start' : 'end'}`}
                      backgroundClassName="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
                    />
                    <NumberDisplay
                      value={max_supply}
                      format="0,0"
                      prefix="Max: "
                      noTooltip={true}
                      className="whitespace-nowrap text-2xs font-medium"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )
        break
      default:
        break
    }

    return (
      <Card key={id} className="card">
        <CardBody className="mt-0.5 pt-4 2xl:pt-6 pb-1 2xl:pb-2 px-4 2xl:px-6">
          {!loading ?
            tooltip ?
              <Tooltip placement="top-start" content={tooltip}>
                {component}
              </Tooltip> :
              component :
            <Spinner name="ProgressBar" width={36} height={36} />
          }
        </CardBody>
        <CardFooter className="card-footer pb-4 2xl:pb-6 px-4 2xl:px-6">
          <span className={titleClassName}>
            {title}
          </span>
        </CardFooter>
      </Card>
    )
  }

  return (
    <>
      {data && !is_widget && (
        <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="max-w-sm lg:max-w-4xl flex flex-wrap items-center my-auto">
            {['homepage', 'facebook_username', 'twitter_screen_name', 'telegram_channel_identifier', 'subreddit_url', 'announcement_url', 'official_forum_url', 'bitcointalk_thread_identifier', 'chat_url'].filter(f => toArray(links?.[f]).length > 0 || typeof links?.[f] === 'object').flatMap(f => {
              let v
              if (Array.isArray(links[f])) {
                v = toArray(links[f])
              }
              else if (typeof links[f] === 'object') {
                v = Object.values({ ...links[f] }).flatMap(_v => toArray(_v))
              }

              const urls = []
              if (v) {
                for (let url of v) {
                  const is_url = url.startsWith('http')
                  url = (is_url && new URL(url).searchParams.get('url')) || url

                  switch (f) {
                    case 'facebook_username':
                      url = `https://facebook.com/${url}`
                      break
                    case 'twitter_screen_name':
                      url = `https://twitter.com/${url}`
                      break
                    case 'telegram_channel_identifier':
                      url = `https://t.me/${url}`
                      break
                    case 'subreddit_url':
                      url = `https://www.reddit.com${url}`
                      break
                    case 'bitcointalk_thread_identifier':
                      url = `https://bitcointalk.org/index.php?topic=${url}`
                      break
                    default:
                      break
                  }

                  const paths = url.startsWith('http') && split(new URL(url).pathname, 'lower', '/')
                  const value = paths ? ['reddit.com'].findIndex(s => url.includes(s)) > -1 ? paths.join('/') : ['youtube.com'].findIndex(s => url.includes(s)) > -1 ? new URL(url).hostname : (_.last(paths) || new URL(url).hostname) : url
                  urls.push({ field: f, value, url })
                }
              }
              return urls
            })
            .map((d, i) => (
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
                ['blockchain_site'].filter(f => toArray(links?.[f]).length > 0).flatMap(f => {
                  const v = toArray(links[f])
                  const urls = []
                  for (let url of v) {
                    const is_url = url.startsWith('http')
                    url = (is_url && new URL(url).searchParams.get('url')) || url
                    const paths = url.startsWith('http') && split(new URL(url).pathname, 'lower', '/')
                    const value = paths ? ['reddit.com'].findIndex(s => url.includes(s)) > -1 ? paths.join('/') : ['youtube.com'].findIndex(s => url.includes(s)) > -1 ? new URL(url).hostname : (_.last(paths) || new URL(url).hostname) : url
                    urls.push({ field: f, value, url })
                  }
                  return urls
                })
                .map((d, i) => {
                  const { value } = { ...d }
                  return {
                    ...d,
                    icon: <GoBrowser size={20} className="text-google" />,
                    value: (
                      <span className="text-blue-400 dark:text-white text-xs font-semibold">
                        {value}
                      </span>
                    ),
                  }
                })
              }
            />
            <SelectSourceCode
              data={
                ['repos_url'].filter(f => toArray(links?.[f]).length > 0 || typeof links?.[f] === 'object').flatMap(f => {
                  let v
                  if (Array.isArray(links[f])) {
                    v = toArray(links[f])
                  }
                  else if (typeof links[f] === 'object') {
                    v = Object.values({ ...links[f] }).flatMap(_v => toArray(_v))
                  }

                  const urls = []
                  for (let url of v) {
                    const is_url = url.startsWith('http')
                    url = (is_url && new URL(url).searchParams.get('url')) || url
                    const paths = url.startsWith('http') && split(new URL(url).pathname, 'lower', '/')
                    const value = paths ? ['reddit.com'].findIndex(s => url.includes(s)) > -1 ? paths.join('/') : ['youtube.com'].findIndex(s => url.includes(s)) > -1 ? new URL(url).hostname : (_.last(paths) || new URL(url).hostname) : url
                    urls.push({ field: f, value, url })
                  }
                  return urls
                })
                .map((d, i) => {
                  const { value, url } = { ...d }
                  const hostname = new URL(url).hostname
                  return {
                    ...d,
                    icon: hostname.includes('github.com') ? <FaGithub size={20} className="text-github dark:text-white" /> : hostname.includes('bitbucket.org') ? <FaBitbucket size={20} className="text-bitbucket" /> : <GoBrowser size={20} className="text-google" />,
                    value: (
                      <span className="text-blue-400 dark:text-white text-xs font-semibold">
                        {value}
                      </span>
                    ),
                  }
                })
              }
            />
            <SelectContract
              data={
                ['platforms'].filter(f => data?.[f]).flatMap(f => {
                  let v
                  if (Array.isArray(data[f])) {
                    v = toArray(data[f])
                  }
                  else if (typeof data[f] === 'object') {
                    v = Object.entries(data[f]).filter(([k, v]) => toArray(v).length > 5).map(([k, v]) => { return { chain: getTitle(k), address: v } })
                  }

                  const contracts = []
                  for (const c of v) {
                    contracts.push({ field: f, ...c })
                  }
                  return contracts
                })
                .map((d, i) => {
                  const { address, chain } = { ...d }
                  return {
                    ...d,
                    text: address,
                    title: (
                      <span className="text-slate-400 dark:text-slate-200 text-2xs font-semibold">
                        {chain}
                      </span>
                    ),
                    value: (
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
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
      <div className={`w-full ${is_widget ? 'flex flex-col' : `grid grid-cols-2 ${has_tvl ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4`}`}>
        {METRICS.filter(m => !(is_widget ? ['fully_diluted_market_cap', !has_tvl && 'total_value_locked', 'circulating_supply'] : [!has_tvl && 'total_value_locked']).includes(m)).map(m => render(m))}
      </div>
    </>
  )
}