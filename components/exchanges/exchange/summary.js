import { useSelector, shallowEqual } from 'react-redux'
import { Card, CardBody, CardFooter, Tooltip } from '@material-tailwind/react'
import _ from 'lodash'
import { FaFacebook, FaTwitter, FaTelegram, FaReddit, FaSlack, FaYoutube, FaInstagram, FaGithub, FaLinkedin, FaDiscord, FaMedium, FaWeibo } from 'react-icons/fa'
import { GoBrowser } from 'react-icons/go'

import Spinner from '../../spinner'
import NumberDisplay from '../../number'
import Stars from '../../stars'
import { split, toArray } from '../../../lib/utils'

const METRICS = ['confidence', 'tokens', 'pairs', 'perpetual_pairs', 'futures_pairs', 'open_interest', 'volume']

export default ({ data, tickers }) => {
  const { rates } = useSelector(state => ({ rates: state.rates }), shallowEqual)
  const { rates_data } = { ...rates }

  const { trust_score_rank, trust_score, number_of_tokens, number_of_pairs, number_of_perpetual_pairs, number_of_futures_pairs } = { ...data }
  let { market_type, open_interest_btc, trade_volume_24h_btc } = { ...data }
  market_type = market_type || 'spot'
  if (market_type !== 'spot') {
    open_interest_btc = rates_data ? _.sumBy(tickers, 'open_interest_usd') * rates_data.btc?.value / rates_data.usd?.value : -1
    trade_volume_24h_btc = _.sumBy(tickers, 'converted_volume.btc')
  }
  else {
    trade_volume_24h_btc = trade_volume_24h_btc || _.sumBy(tickers, 'converted_volume.btc')
  }

  const render = id => {
    const valueClassName = 'text-black dark:text-white text-3xl lg:text-2xl 2xl:text-3xl font-semibold'
    const titleClassName = 'whitespace-nowrap text-blue-400 dark:text-blue-500 text-base'

    let title
    let loading
    let tooltip
    let component

    switch (id) {
      case 'confidence':
        title = 'Confidence'
        loading = !data
        tooltip = data && trust_score > -1 ? `Trust score: ${trust_score}` : ''
        component = (
          <div>
            <NumberDisplay
              value={trust_score_rank}
              format="0,0"
              prefix="#"
              className={valueClassName}
            />
          </div>
        )
        break
      case 'tokens':
        title = 'Tokens'
        loading = !(data && tickers)
        tooltip = 'Number of tokens'
        component = (
          <div>
            <NumberDisplay
              value={number_of_tokens}
              format="0,0"
              className={valueClassName}
            />
          </div>
        )
        break
      case 'pairs':
        title = 'Pairs'
        loading = !(data && tickers)
        tooltip = 'Number of pairs'
        component = (
          <div>
            <NumberDisplay
              value={number_of_pairs}
              format="0,0"
              className={valueClassName}
            />
          </div>
        )
        break
      case 'perpetual_pairs':
        title = 'Perpetual Pairs'
        loading = !data
        tooltip = 'Number of perpetual pairs'
        component = (
          <div>
            <NumberDisplay
              value={number_of_perpetual_pairs}
              format="0,0"
              className={valueClassName}
            />
          </div>
        )
        break
      case 'futures_pairs':
        title = 'Futures Pairs'
        loading = !data
        tooltip = 'Number of futures pairs'
        component = (
          <div>
            <NumberDisplay
              value={number_of_futures_pairs}
              format="0,0"
              className={valueClassName}
            />
          </div>
        )
        break
      case 'open_interest':
        title = 'Open Interest 24h'
        loading = !data
        tooltip = `Total 24h open interest in ${rates_data ? 'USD' : 'BTC'}`
        component = (
          <div>
            <NumberDisplay
              value={open_interest_btc * (rates_data ? rates_data.usd?.value / rates_data.btc?.value : 1)}
              format="0,0"
              prefix={rates_data && '$'}
              suffix={!rates_data ? ' BTC' : ''}
              noTooltip={true}
              className={valueClassName}
            />
          </div>
        )
        break
      case 'volume':
        title = 'Volume 24h'
        loading = !data
        tooltip = `Total 24h volume in ${rates_data ? 'USD' : 'BTC'}`
        component = (
          <div>
            <NumberDisplay
              value={trade_volume_24h_btc * (rates_data ? rates_data.usd?.value / rates_data.btc?.value : 1)}
              format="0,0"
              prefix={rates_data && '$'}
              suffix={!rates_data ? ' BTC' : ''}
              noTooltip={true}
              className={valueClassName}
            />
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
      {data && market_type === 'spot' && (
        <div className="flex flex-wrap items-center mx-3">
          {['facebook_url', 'twitter_handle', 'telegram_url', 'reddit_url', 'slack_url', 'other_url_1', 'other_url_2'].filter(f => data[f]).map(f => {
            let v = data[f]
            const is_url = v.startsWith('http')
            v = (is_url && new URL(v).searchParams.get('url')) || v

            let url = is_url ? v : ''
            switch (f) {
              case 'facebook_url':
                url = `https://facebook.com/${v}`
                break
              case 'twitter_handle':
                url = `https://twitter.com/${v}`
                break
              case 'telegram_url':
                url = `https://t.me/${v}`
                break
              case 'reddit_url':
                url = `https://www.reddit.com${v}`
                break
              default:
                url = v
                break
            }

            const paths = url.startsWith('http') && split(new URL(url).pathname, 'lower', '/')
            const value = paths ? ['reddit.com'].findIndex(s => url.includes(s)) > -1 ? paths.join('/') : ['youtube.com'].findIndex(s => url.includes(s)) > -1 ? new URL(url).hostname : (_.last(paths) || new URL(v).hostname) : v
            return ({ field: f, value, url })
          })
          .map((d, i) => {
            const { field, value, url } = { ...d }

            let icon
            switch (field) {
              case 'facebook_url':
                icon = <FaFacebook size={20} className="text-facebook" />
                break
              case 'twitter_handle':
                icon = <FaTwitter size={20} className="text-twitter" />
                break
              case 'telegram_url':
                icon = <FaTelegram size={20} className="text-telegram" />
                break
              case 'reddit_url':
                icon = <FaReddit size={20} className="text-reddit" />
                break
              case 'slack_url':
                icon = <FaSlack size={20} className="text-slack" />
                break
              default:
                const hostname = new URL(d.url).hostname
                if (hostname.includes('youtube.com')) {
                  icon = <FaYoutube size={20} className="text-youtube" />
                }
                else if (hostname.includes('instagram.com')) {
                  icon = <FaInstagram size={20} className="text-instagram" />
                }
                else if (hostname.includes('github.com')) {
                  icon = <FaGithub size={20} className="text-github dark:text-white" />
                }
                else if (hostname.includes('linkedin.com')) {
                  icon = <FaLinkedin size={20} className="text-linkedin" />
                }
                else if (hostname.includes('discord')) {
                  icon = <FaDiscord size={20} className="text-discord" />
                }
                else if (hostname.includes('medium.com')) {
                  icon = <FaMedium size={20} className="text-medium dark:text-white" />
                }
                else if (hostname.includes('weibo.com')) {
                  icon = <FaWeibo size={20} className="text-weibo" />
                }
                else {
                  icon = <GoBrowser size={20} className="text-google" />
                }
                break
            }

            return (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 mb-1 mr-2 sm:mr-4"
              >
                {icon}
                <span className="text-blue-400 dark:text-blue-500 text-sm font-semibold">
                  {value}
                </span>
              </a>
            )
          })}
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.filter(m => !(market_type === 'spot' ? ['perpetual_pairs', 'futures_pairs', 'open_interest'] : ['confidence', 'tokens', 'pairs']).includes(m)).map(m => render(m))}
      </div>
    </>
  )
}