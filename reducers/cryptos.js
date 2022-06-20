import { CRYPTOS_DATA } from './types'

export default (
  state = {
    [`${CRYPTOS_DATA}`]: null,
  },
  action
) => {
  switch (action.type) {
    case CRYPTOS_DATA:
      return {
        ...state,
        [`${CRYPTOS_DATA}`]: action.value,
      }
    default:
      return state
  }
}