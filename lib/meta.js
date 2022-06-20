import _ from 'lodash'
import { name, equals_ignore_case } from './utils'

export default (path, data) => {
  path = !path ? '/' : path.toLowerCase()
  path = path.startsWith('/widget/') ? path.substring('/widget'.length) : path
  path = path.includes('?') ? path.substring(0, path.indexOf('?')) : path
  const pathSplit = path.split('/').filter(x => x)

  let title = `${_.cloneDeep(pathSplit).reverse().map(x => name(x, data)).join(' - ')}${pathSplit.length > 0 ? ` | ${process.env.NEXT_PUBLIC_APP_NAME}` : process.env.NEXT_PUBLIC_DEFAULT_TITLE}`
  let description = process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION
  let image = `${process.env.NEXT_PUBLIC_SITE_URL}/images/ogimage.png`
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${path}`
  if (pathSplit[0] === 'tokens') {
    if (pathSplit[1] === 'high-volume') {
      title = `Tokens - High Volume | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of top cryptocurrency prices by volume, along with their statistics that matter.`
    }
    else if (pathSplit[1] === 'categories') {
      title = `Tokens - Categories | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of cryptocurrencies by category, along with their statistics that matter.`
    }
    else if (pathSplit[1]) {
      title = `${name(pathSplit[1], data)} | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of cryptocurrencies by type, along with their statistics that matter.`
    }
    else {
      title = `Tokens | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of top cryptocurrency prices by market capitalization, along with their statistics that matter.`
    }
  }
  else if (pathSplit[0] === 'token') {
    if (data) {
      title = `${data.name} ${data.symbol ? `${data.symbol.toUpperCase()} ` : ''}| ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Get the latest ${data.name} price, ${data.symbol ? `${data.symbol.toUpperCase()} ` : ''}market cap, Technical charts and other information related to ${data.name}.`
      image = data.image?.large ? data.image.large : image
    }
  }
  else if (pathSplit[0] === 'derivatives') {
    if (pathSplit[1] === 'futures') {
      title = `Top Cryptocurrencies' Derivatives Futures Contract | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of cryptocurrencies' derivatives contracts by open interest, along with their statistics that matter.`
    }
    else {
      title = `Top Cryptocurrencies' Derivatives Perpetual Contract | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of cryptocurrencies' derivatives contracts by open interest, along with their statistics that matter.`
    }
  }
  else if (pathSplit[0] === 'exchanges') {
    if (pathSplit[1] === 'dex') {
      title = `Top Decentralized Exchanges by Volume | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of top decentralized exchanges by volume, along with their statistics that matter.`
    }
    else if (pathSplit[1] === 'derivatives') {
      title = `Top Derivatives Exchanges by Volume | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of top derivatives exchanges by volume, along with their statistics that matter.`
    }
    else {
      title = `Top Exchanges by Confidence | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of top exchanges by confidence, along with their statistics that matter.`
    }
  }
  else if (pathSplit[0] === 'exchange') {
    if (data) {
      title = `${data.name} Trade Volume, Trade Pairs, Market Listing | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Find out ${data.name} trading volume, fees, pair list and other updated information. See the most actively traded tokens on ${data.name}.`
      image = typeof data.image === 'string' ? data.image.replace('small', 'large') : image
    }
  }
  else if (pathSplit[0] === 'public-companies') {
    if (pathSplit[1]) {
      title = `${name(pathSplit[1])} Holdings by Public Companies | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of publicly traded companies that are buying ${name(pathSplit[1])} as part of corporate treasury.`
    }
    else {
      title = `Crypto Holdings by Public Companies | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of publicly traded companies that are buying crypto as part of corporate treasury.`
    }
  }
  else if (pathSplit[0] === 'widgets') {
    title = `Widgets | ${process.env.NEXT_PUBLIC_APP_NAME}`
    description = `Embed ${process.env.NEXT_PUBLIC_APP_NAME}'s cryptocurrency widgets to your website or blog for free.`
  }
  return {
    title,
    description,
    url,
    image,
  }
}