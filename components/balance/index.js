import { useSelector, shallowEqual } from 'react-redux'
import { TailSpin } from 'react-loader-spinner'

import assets from '../../config/assets'
import { number_format, equals_ignore_case, loader_color } from '../../lib/utils'

export default ({
  environment = 'testnet',
  chainId,
  asset,
  contractAddress,
  symbol,
  className = '',
}) => {
  const {
    preferences,
    wallet,
    balances,
  } = useSelector(state =>
    (
      {
        preferences: state.preferences,
        wallet: state.wallet,
        balances: state.balances,
      }
    ),
    shallowEqual,
  )
  const {
    theme,
  } = { ...preferences }
  const {
    wallet_data,
  } = { ...wallet }
  const {
    web3_provider,
  } = { ...wallet_data }
  const {
    balances_data,
  } = { ...balances }

  const assets_data =
    assets[environment] ||
    []

  const asset_data = assets_data
    .find(a =>
      a?.id === asset
    )

  const {
    contracts,
  } = { ...asset_data }

  const contract_data = contracts?.[chainId]

  const {
    address,
  } = { ...contract_data }

  contractAddress =
    contractAddress ||
    address

  const balance = (balances_data?.[chainId] || [])
    .find(b =>
      equals_ignore_case(
        b?.address,
        contractAddress ||
        address,
      )
    )

  let {
    amount,
  } = { ...balance }

  amount = !isNaN(amount) ?
    Number(amount) :
    null

  symbol =
    symbol ||
    contract_data?.symbol ||
    asset_data?.symbol

  return chainId &&
    asset &&
    (
      <div className={`flex items-center justify-center text-slate-600 dark:text-slate-200 text-xs space-x-1 ${className}`}>
        {typeof amount === 'number' ?
          <>
            <span className="font-bold">
              {number_format(
                amount,
                amount > 10000 ?
                  '0,0' :
                  amount > 100 ?
                    '0,0.00' :
                    '0,0.000000',
                true,
              )}
            </span>
            <span className="hidden sm:block font-semibold">
              {symbol}
            </span>
          </> :
          typeof amount === 'string' ?
            <span>
              n/a
            </span> :
            web3_provider && (
              <TailSpin
                color={loader_color(theme)}
                width="18"
                height="18"
              />
            )
        }
      </div>
    )
}