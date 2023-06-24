const request = async params => {
  params = { ...params, method: 'getFearAndGreed' }
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL, { method: 'POST', body: JSON.stringify(params) }).catch(error => { return null })
  return response && await response.json()
}

export const fear_and_greed = async params => await request(params)