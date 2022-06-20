import Linkify from 'react-linkify';
import parse from 'html-react-parser';

export default ({ coinData }) => {
  return (
    <>
      {coinData && (
        <div className="my-8">
          <div
            title={<div className="text-gray-800 dark:text-gray-200 text-base font-semibold space-x-1">
              <span>What is {coinData.name}</span>
              {coinData.symbol && (
                <span className="uppercase">({coinData.symbol})</span>
              )}
              ?
            </div>}
            className="bg-transparent border-0 p-0"
          >
            <p className="max-w-2xl overflow-y-auto text-gray-500 mt-4" style={{ maxHeight: '70vh' }}>
              <Linkify>
                {parse(coinData.description.en
                  .replaceAll('\n', '<br>')
                  .replaceAll('https://www.coingecko.com/en/coins/', `${process.env.NEXT_PUBLIC_SITE_URL}/token/`)
                  .replaceAll('https://www.coingecko.com/en/exchanges/', `${process.env.NEXT_PUBLIC_SITE_URL}/exchange/`)
                  .replace(`${process.env.NEXT_PUBLIC_SITE_URL}/coin/all`, `${process.env.NEXT_PUBLIC_SITE_URL}/tokens`)
                )}
              </Linkify>
            </p>
          </div>
        </div>
      )}
    </>
  )
}