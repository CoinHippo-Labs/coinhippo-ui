import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { utils } from 'ethers'
const { formatUnits } = { ...utils }
import { MdLocalGasStation } from 'react-icons/md'

import { ProgressBar } from '../../progress-bars'
import NumberDisplay from '../../number'
import { getProvider } from '../../../lib/chain/evm'

const GAS_GWEI_THRESHOLD = 15
const REFRESH_RATE_SECONDS = 15

export default () => {
  const { chains } = useSelector(state => ({ chains: state.chains }), shallowEqual)
  const { chains_data } = { ...chains }

  const [gasPrice, setGasPrice] = useState(null)
  const [refreshSeconds, setRefreshSeconds] = useState(REFRESH_RATE_SECONDS)

  useEffect(
    () => {
      const getData = async () => {
        if (refreshSeconds === REFRESH_RATE_SECONDS) {
          const provider = getProvider('ethereum', chains_data)
          if (provider) {
            try {
              const { gasPrice } = { ...await provider.getFeeData() }
              setGasPrice(Number(formatUnits(gasPrice, 'gwei')))
            } catch (error) {}
          }
        }
      }
      getData()
    },
    [chains_data, refreshSeconds],
  )

  useEffect(
    () => {
      const interval = setInterval(() => setRefreshSeconds(refreshSeconds - 1 || REFRESH_RATE_SECONDS), 1000)
      return () => clearInterval(interval)
    },
    [refreshSeconds],
  )

  const color = typeof gasPrice === 'number' ? gasPrice <= GAS_GWEI_THRESHOLD ? 'green-500' : gasPrice <= GAS_GWEI_THRESHOLD * 2 ? 'green-500' : gasPrice <= GAS_GWEI_THRESHOLD * 4 ? 'red-500' : 'red-500' : 'slate-500'

  return gasPrice && (
    <a
      href="https://etherscan.io/gastracker"
      target="_blank"
      rel="noopener noreferrer"
      className={`w-8 flex flex-col items-center justify-center text-${color} space-y-0.5 pl-1 pr-3`}
    >
      <MdLocalGasStation size={24} />
      <ProgressBar
        width={refreshSeconds * 100 / REFRESH_RATE_SECONDS}
        color={`bg-${color}`}
        className="h-1 rounded-lg"
      />
      <NumberDisplay
        value={gasPrice}
        format="0,0"
        maxDecimals={0}
        noTooltip={true}
        className={`bg-${color} w-5 h-5 absolute leading-none rounded-full inline-flex items-center justify-center text-white text-2xs font-semibold ml-3`}
        style={{ top: 4 }}
      />
    </a>
  )
}