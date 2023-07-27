const request = async params => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL, { method: 'POST', body: JSON.stringify(params) }).catch(error => { return null })
  return response && await response.json()
}

export const getCoingecko = async params => await request({ ...params, method: 'coingecko' })
export const getFearAndGreed = async params => await request({ ...params, method: 'getFearAndGreed' })
export const getChains = async params => await request({ ...params, method: 'getChains' })