import { useSelector, shallowEqual } from 'react-redux'

import Iframe from '../iframe'

export default () => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  return (
    <div className="space-y-2 mt-2 mb-6">
      <h1 className="text-2xl font-bold">
        Embed widgets to your website
      </h1>
      <div className="flex flex-col space-y-12">
        <div className="w-full grid grid-flow-row grid-cols-1 gap-4">
          {[
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}?widget=price-marquee${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Price Update',
              width: '100%',
              height: 60,
            },
          ].map((w, i) => (
            <Iframe
              key={i}
              { ...w }
              value={`<iframe src="${w.src}" title="${w.title}" frameBorder="0" width="${w.width}" height="${w.height}"></iframe>`}
            />
          ))}
        </div>
        <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}?widget=fear-and-greed${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Fear & Greed',
              width: 320,
              height: 320,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}?widget=dominance${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Dominance',
              width: 320,
              height: 320,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}?widget=top-movers${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Top Gainers/Losers',
              width: 320,
              height: 320,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}?widget=trending${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Trending Search',
              width: 320,
              height: 320,
            },
          ].map((w, i) => (
            <Iframe
              key={i}
              { ...w }
              value={`<iframe src="${w.src}" title="${w.title}" frameBorder="0" width="${w.width}" height="${w.height}"></iframe>`}
            />
          ))}
        </div>
        <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/token/bitcoin?view=widget${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Bitcoin',
              width: 300,
              height: 240,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/token/ethereum?view=widget${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Ethereum',
              width: 300,
              height: 240,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/token/binancecoin?view=widget${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Binance',
              width: 300,
              height: 240,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/token/solana?view=widget${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Solana',
              width: 300,
              height: 240,
            },
          ].map((w, i) => (
            <Iframe
              key={i}
              { ...w }
              value={`<iframe src="${w.src}" title="${w.title}" frameBorder="0" width="${w.width}" height="${w.height}"></iframe>`}
            />
          ))}
        </div>
        <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/exchanges?view=widget&n=10${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Top Exchanges',
              width: 580,
              height: 1000,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/tokens?view=widget&n=10${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Top Market Cap',
              width: 600,
              height: 700,
            },
          ].map((w, i) => (
            <Iframe
              key={i}
              { ...w }
              value={`<iframe src="${w.src}" title="${w.title}" frameBorder="0" width="${w.width}" height="${w.height}"></iframe>`}
            />
          ))}
        </div>
        <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/tokens/decentralized-finance-defi?view=widget&n=10${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Top DeFi',
              width: 600,
              height: 700,
            },
            {
              src: `${process.env.NEXT_PUBLIC_SITE_URL}/tokens/non-fungible-tokens-nft?view=widget&n=10${theme === 'dark' ? `&theme=${theme}` : ''}`,
              title: 'Top NFTs',
              width: 600,
              height: 700,
            },
          ].map((w, i) => (
            <Iframe
              key={i}
              { ...w }
              value={`<iframe src="${w.src}" title="${w.title}" frameBorder="0" width="${w.width}" height="${w.height}"></iframe>`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}