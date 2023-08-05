import _ from 'lodash'

import { split, getTitle } from './utils'

export default (path, data) => {
  path = !path ? '/' : path.toLowerCase()
  path = path.includes('?') ? path.substring(0, path.indexOf('?')) : path
  const _paths = split(path, 'normal', '/')

  let title = `${_.reverse(_.cloneDeep(_paths)).filter(x => !(x.startsWith('[') && x.endsWith(']'))).map(x => getTitle(x, data)).join(' - ')}${_paths.length > 0 ? ` | ${process.env.NEXT_PUBLIC_APP_NAME}` : process.env.NEXT_PUBLIC_DEFAULT_TITLE}`
  let description = process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION
  let image = `${process.env.NEXT_PUBLIC_APP_URL}/images/ogimage.png`
  const url = `${process.env.NEXT_PUBLIC_APP_URL}${path}`

  switch (_paths[0]) {
    case 'tokens':
      switch (_paths[1]) {
        case 'high-volume':
          title = `Tokens - High Volume | ${process.env.NEXT_PUBLIC_APP_NAME}`
          description = 'See the list of top cryptocurrency prices by volume, along with their statistics that matter.'
          break
        case 'categories':
          title = `Tokens - Categories | ${process.env.NEXT_PUBLIC_APP_NAME}`
          description = 'See the list of cryptocurrencies by category, along with their statistics that matter.'
          break
        default:
          if (_paths[1]) {
            title = `${getTitle(_paths[1], data)} | ${process.env.NEXT_PUBLIC_APP_NAME}`
            description = 'See the list of cryptocurrencies by type, along with their statistics that matter.'
          }
          else {
            title = `Tokens | ${process.env.NEXT_PUBLIC_APP_NAME}`
            description = 'See the list of top cryptocurrency prices by market capitalization, along with their statistics that matter.'
          }
          break
      }
      break
    case 'token':
      if (data) {
        title = `${data.name} ${data.symbol ? `${data.symbol.toUpperCase()} ` : ''}| ${process.env.NEXT_PUBLIC_APP_NAME}`
        description = `Get the latest ${data.name} price, ${data.symbol ? `${data.symbol.toUpperCase()} ` : ''}market cap, Technical charts and other information related to ${data.name}.`
        image = data.image?.large ? data.image.large : image
      }
      break
    case 'derivatives':
      switch (_paths[1]) {
        case 'futures':
          title = `Top Cryptocurrencies' Derivatives Futures Contract | ${process.env.NEXT_PUBLIC_APP_NAME}`
          description = `See the list of cryptocurrencies' derivatives contracts by open interest, along with their statistics that matter.`
          break
        default:
          title = `Top Cryptocurrencies' Derivatives Perpetual Contract | ${process.env.NEXT_PUBLIC_APP_NAME}`
          description = `See the list of cryptocurrencies' derivatives contracts by open interest, along with their statistics that matter.`
          break
      }
      break
    case 'exchanges':
      switch (_paths[1]) {
        case 'dex':
          title = `Top Decentralized Exchanges by Volume | ${process.env.NEXT_PUBLIC_APP_NAME}`
          description = 'See the list of top decentralized exchanges by volume, along with their statistics that matter.'
          break
        case 'derivatives':
          title = `Top Derivatives Exchanges by Volume | ${process.env.NEXT_PUBLIC_APP_NAME}`
          description = 'See the list of top derivatives exchanges by volume, along with their statistics that matter.'
          break
        default:
          title = `Top Exchanges by Confidence | ${process.env.NEXT_PUBLIC_APP_NAME}`
          description = 'See the list of top exchanges by confidence, along with their statistics that matter.'
          break
      }
      break
    case 'exchange':
      if (data) {
        title = `${data.name} Trade Volume, Trade Pairs, Market Listing | ${process.env.NEXT_PUBLIC_APP_NAME}`
        description = `Find out ${data.name} trading volume, fees, pair list and other updated information. See the most actively traded tokens on ${data.name}.`
        image = typeof data.image === 'string' ? data.image.replace('small', 'large') : image
      }
      break
    case 'public-companies':
      if (_paths[1]) {
        title = `${getTitle(_paths[1])} Holdings by Public Companies | ${process.env.NEXT_PUBLIC_APP_NAME}`
        description = `See the list of publicly traded companies that are buying ${getTitle(_paths[1])} as part of corporate treasury.`
      }
      else {
        title = `Crypto Holdings by Public Companies | ${process.env.NEXT_PUBLIC_APP_NAME}`
        description = `See the list of publicly traded companies that are buying crypto as part of corporate treasury.`
      }
      break
    case 'widgets':
      title = `Widgets | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Embed ${process.env.NEXT_PUBLIC_APP_NAME}'s cryptocurrency widgets to your website or blog for free.`
      break
    case 'swap':
      title = `Swap | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = 'a seamless and secure platform to swap crypto tokens across chains.'
      break
    default:
      break
  }

  return { title, description, url, image }
}