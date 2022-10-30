import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import _ from 'lodash'
import { Squid } from '@0xsquid/sdk'
import { utils } from 'ethers'

import PoweredBy from './powered-by'
import AddToken from '../add-token'
import Balance from '../balance'
import EnsProfile from '../ens-profile'
import Wallet from '../wallet'
import Copy from '../copy'
import chains from '../../config/chains'
import assets from '../../config/assets'
import { number_format, ellipse, equals_ignore_case, loader_color } from '../../lib/utils'

export default ({
  environment = 'testnet',
}) => {
  const dispatch = useDispatch()
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
    default_chain_id,
    web3_provider,
    address,
  } = { ...wallet_data }
  const {
    balances_data,
  } = { ...balances }

  const {
    evm,
    cosmos,
  } = { ...chains[environment] }

  const evm_chains_data =
    evm ||
    []
  const cosmos_chains_data =
    cosmos ||
    []

  const chains_data =
    _.concat(
      evm_chains_data,
      cosmos_chains_data,
    )

  const assets_data =
    assets[environment] ||
    []

  const [sdk, setSdk] = useState(null)
  const [params, setParams] = useState(null)

  const init = async => {
    setSdk(
      new Squid(
        {
          baseUrl: `https://${environment}.api.0xsquid.com`,
        },
      )
    )
  }

  useEffect(() => {
    init()
  }, [environment])

  const {
    from_chain,
    to_chain,
    from_asset,
    to_asset,
    amount,
  } = { ...params }

  const type =
    from_chain &&
    from_chain === to_chain ?
      'Swap' :
      'Bridge'

  const from_chain_data =
    chains_data.find(c =>
      c.id === from_chain
    )

  const to_chain_data =
    chains_data.find(c =>
      c.id === to_chain
    )

  const from_asset_data =
    assets_data.find(a =>
      a.id === from_asset
    )

  const to_asset_data =
    assets_data.find(a =>
      a.id === to_asset
    )

  return (
    <div className="max-w-lg space-y-3 mt-0 sm:mt-8 mx-auto py-4 px-2">
      <div className="flex items-center justify-between space-x-2 mx-0.5">
        <h1 className="tracking-wider uppercase text-2xl font-normal">
          {type}
        </h1>
        <div className="flex items-center space-x-2">
          {
            web3_provider &&
            address &&
            (
              <div className="hidden sm:block">
                <EnsProfile
                  address={address}
                />
              </div>
            )
          }
          <Wallet
            environment={environment}
            mainController={true}
            connectChainId={default_chain_id}
          />
        </div>
      </div>
      <div className="h-96 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-50 border border-slate-100 dark:border-slate-900 rounded-2xl pt-3 pb-2 px-2">
      </div>
      <PoweredBy />
    </div>
  )
}