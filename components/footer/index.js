import { useSelector, shallowEqual } from 'react-redux'
import moment from 'moment'
import { FaHeart } from 'react-icons/fa'
import { BsTwitter, BsTelegram, BsGithub } from 'react-icons/bs'

import Image from '../image'

export default () => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  return (
    <div className={`${theme} footer flex flex-col md:flex-row items-end space-y-2.5 sm:space-y-0 p-3 3xl:text-2xl 3xl:p-8`} style={{ minHeight: '64px' }}>
      <div className="w-full md:w-1/2 lg:w-1/3 min-w-max flex items-center justify-center md:justify-start space-x-1">
        <span>Data from</span>
        <a
          href="https://coingecko.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/logos/others/coingecko.png"
            width={20}
            height={20}
          />
        </a>
      </div>
      <div className="hidden lg:flex w-full lg:w-1/3 flex-wrap items-center justify-center space-x-2">
        {process.env.NEXT_PUBLIC_TWITTER_USERNAME && (
          <a
            href={`https://twitter.com/${process.env.NEXT_PUBLIC_TWITTER_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTwitter size={20} className="text-blue-400 dark:text-white" />
          </a>
        )}
        {process.env.NEXT_PUBLIC_TELEGRAM_USERNAME && (
          <a
            href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTelegram size={20} className="text-blue-500 dark:text-white" />
          </a>
        )}
        {process.env.NEXT_PUBLIC_GITHUB_URL && (
          <a
            href={process.env.NEXT_PUBLIC_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsGithub size={20} className="text-black dark:text-white" />
          </a>
        )}
      </div>
      <div className="w-full md:w-1/2 lg:w-1/3 min-w-max flex items-center justify-center md:justify-end space-x-1">
        <span className="text-slate-500 dark:text-white font-normal">
          © {moment().format('YYYY')} made with
        </span>
        <FaHeart className="text-red-400 text-xl pr-0.5" />
        <span className="text-slate-500 dark:text-white font-normal">
          by
        </span>
        <a
          href={process.env.NEXT_PUBLIC_TEAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 dark:text-white font-medium"
        >
          {process.env.NEXT_PUBLIC_TEAM_NAME}
        </a>
        <span className="text-slate-500 dark:text-white font-normal">
          team.
        </span>
      </div>
    </div>
  )
}