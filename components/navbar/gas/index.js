import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { providers, utils } from 'ethers'
import { MdLocalGasStation } from 'react-icons/md'

import { ProgressBar } from '../../progress-bars'
import { number_format } from '../../../lib/utils'

const gas_gwei_threshold = 15
const refresh_rate_seconds = 15

export default () => {
  const { chains } = useSelector(state => ({ chains: state.chains }), shallowEqual)
  const { chains_data } = { ...chains }

  const [provider, setProvider] = useState(null)
  const [gasPrice, setGasPrice] = useState(null)
  const [refreshSeconds, setRefreshSeconds] = useState(refresh_rate_seconds)

  useEffect(() => {
    const getData = async () => {
      if (chains_data) {
        const chain_data = chains_data.mainnet?.evm?.find(c => c?.id === 'ethereum')
        const { rpcUrls } = { ...chain_data?.provider_params?.[0] }
        if (rpcUrls) {
          setProvider(new providers.FallbackProvider(rpcUrls.map(url => new providers.JsonRpcProvider(url))))
        }
      }
    }
    getData()
  }, [chains_data])

  useEffect(() => {
    const interval = setInterval(() => setRefreshSeconds(refreshSeconds - 1 || refresh_rate_seconds), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [refreshSeconds])

  useEffect(() => {
    const getData = async () => {
      if (provider && refreshSeconds === refresh_rate_seconds) {
        setGasPrice(Number(utils.formatUnits(await provider.getGasPrice(), 'gwei')))
      }
    }
    getData()
  }, [provider, refreshSeconds])

  const color = typeof gasPrice === 'number' ? gasPrice <= gas_gwei_threshold ? 'green-600' : gasPrice <= gas_gwei_threshold * 2 ? 'green-400' : gasPrice <= gas_gwei_threshold * 4 ? 'red-400' : 'red-600' : 'slate-500'

  return gasPrice && (
    <a
      href="https://etherscan.io/gastracker"
      target="_blank"
      rel="noopener noreferrer"
      className={`w-8 flex flex-col items-center justify-center text-${color} space-y-0.5 pl-1 pr-3`}
    >
      <MdLocalGasStation size={24} />
      <ProgressBar
        width={refreshSeconds * 100 / refresh_rate_seconds}
        color={`bg-${color}`}
        className="h-1 rounded-lg"
      />
      <span
        className={`bg-${color} w-5 h-5 absolute leading-none rounded-full inline-flex items-center justify-center text-white text-2xs font-semibold ml-3`}
        style={{ top: 4 }}
      >
        {number_format(gasPrice, '0,0')}
      </span>
    </a>
  )
}