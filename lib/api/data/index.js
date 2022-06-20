const _module = 'data'

const request = async (path, params) => {
  params = { ...params, path, module: _module }
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: 'POST',
    body: JSON.stringify(params),
  }).catch(error => { return null })
  return res && await res.json()
}

export const chains = async params => {
  const is_staging = process.env.NEXT_PUBLIC_SITE_URL?.includes('staging')
  params = { ...params, collection: 'chains' }
  const response = await request(null, params)
  return {
    ...response,
    mainnet: {
      ...response?.mainnet,
      evm: response?.mainnet?.evm?.filter(a => !a?.is_staging || is_staging) || [],
    },
  }
}