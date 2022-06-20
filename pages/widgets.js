import { useSelector, shallowEqual } from 'react-redux'
import Iframe from '../components/iframe'

export default function Widgets() {
  const { theme } = useSelector(state => ({ theme: state.theme }), shallowEqual)
  const { background } = { ...theme }

  return (
    <>
      <div
        title="Embed widgets to your website"
        subtitle="Widgets"
        className="flex-col sm:flex-row items-start sm:items-center mx-1"
      />
      <div className="flex flex-col space-y-12">
        <div className="w-full grid grid-flow-row grid-cols-1 gap-4">
          {[
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}?widget=price-marquee${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Price Update',
              width: '100%',
              height: 60,
            },
          ].map((widget, i) => (
            <Iframe
              key={i}
              { ...widget }
              copyText={`<iframe src="${widget.src}" title="${widget.title}" frameBorder="0" width="${widget.width}" height="${widget.height}"></iframe>`}
            />
          ))}
        </div>
        <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}?widget=fear-and-greed${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Fear & Greed',
              width: 320,
              height: 320,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}?widget=dominance${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Dominance',
              width: 320,
              height: 320,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}?widget=top-movers${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Top Gainers/Losers',
              width: 320,
              height: 320,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}?widget=trending${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Trending Search',
              width: 320,
              height: 320,
            },
          ].map((widget, i) => (
            <Iframe
              key={i}
              { ...widget }
              copyText={`<iframe src="${widget.src}" title="${widget.title}" frameBorder="0" width="${widget.width}" height="${widget.height}"></iframe>`}
            />
          ))}
        </div>
        <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/token/bitcoin?view=widget${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Bitcoin',
              width: 300,
              height: 240,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/token/ethereum?view=widget${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Ethereum',
              width: 300,
              height: 240,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/token/dogecoin?view=widget${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Dogecoin',
              width: 300,
              height: 240,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/token/axie-infinity?view=widget${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Axie Infinity',
              width: 300,
              height: 240,
            },
          ].map((widget, i) => (
            <Iframe
              key={i}
              { ...widget }
              copyText={`<iframe src="${widget.src}" title="${widget.title}" frameBorder="0" width="${widget.width}" height="${widget.height}"></iframe>`}
            />
          ))}
        </div>
        <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/exchanges?view=widget&n=10${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Top Exchanges',
              width: 580,
              height: 1050,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/tokens?view=widget&n=10${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Top Market Cap',
              width: 600,
              height: 900,
            },
          ].map((widget, i) => (
            <Iframe
              key={i}
              { ...widget }
              copyText={`<iframe src="${widget.src}" title="${widget.title}" frameBorder="0" width="${widget.width}" height="${widget.height}"></iframe>`}
            />
          ))}
        </div>
        <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/tokens/decentralized-finance-defi?view=widget&n=10${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Top DeFi',
              width: 600,
              height: 900,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/tokens/non-fungible-tokens-nft?view=widget&n=10${background === 'dark' ? `&theme=${background}` : ''}`,
              title: 'Top NFTs',
              width: 600,
              height: 900,
            },
          ].map((widget, i) => (
            <Iframe
              key={i}
              { ...widget }
              copyText={`<iframe src="${widget.src}" title="${widget.title}" frameBorder="0" width="${widget.width}" height="${widget.height}"></iframe>`}
            />
          ))}
        </div>
      </div>
    </>
  )
}