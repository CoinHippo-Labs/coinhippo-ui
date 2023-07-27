import Linkify from 'react-linkify'
import parse from 'html-react-parser'

export default ({ data }) => {
  const { name, description } = { ...data }
  let { en } = { ...description }

  if (en) {
    en = en.replaceAll('\n', '<br>')
    en = en.replaceAll('https://www.coingecko.com/en/coins/', `${process.env.NEXT_PUBLIC_APP_URL}/token/`)
    en = en.replaceAll('https://www.coingecko.com/en/exchanges/', `${process.env.NEXT_PUBLIC_APP_URL}/exchange/`)
    en = en.replace(`${process.env.NEXT_PUBLIC_APP_URL}/coin/all`, `${process.env.NEXT_PUBLIC_APP_URL}/tokens`)
  }

  return data && (
    <div className="space-y-2">
      <div className="text-base font-semibold">
        What is {name}?
      </div>
      {en && (
        <p className="linkify max-w-2xl overflow-y-auto text-slate-400 dark:text-slate-500 font-medium" style={{ maxHeight: '68vh' }}>
          <Linkify>
            {parse(en)}
          </Linkify>
        </p>
      )}
    </div>
  )
}