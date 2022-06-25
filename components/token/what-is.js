import Linkify from 'react-linkify';
import parse from 'html-react-parser';

export default ({ data }) => {
  const { name, description } = { ...data }
  return data && (
    <div className="space-y-2">
      <div className="flex items-center space-x-1">
        <span className="text-base font-bold">
          What is {name}?
        </span>
      </div>
      <p
        className="max-w-2xl overflow-y-auto text-slate-400 dark:text-slate-500 font-medium"
        style={{ maxHeight: '68vh' }}
      >
        <Linkify>
          {parse(description?.en
            .replaceAll('\n', '<br>')
            .replaceAll('https://www.coingecko.com/en/coins/', `${process.env.NEXT_PUBLIC_SITE_URL}/token/`)
            .replaceAll('https://www.coingecko.com/en/exchanges/', `${process.env.NEXT_PUBLIC_SITE_URL}/exchange/`)
            .replace(`${process.env.NEXT_PUBLIC_SITE_URL}/coin/all`, `${process.env.NEXT_PUBLIC_SITE_URL}/tokens`)
          )}
        </Linkify>
      </p>
    </div>
  )
}