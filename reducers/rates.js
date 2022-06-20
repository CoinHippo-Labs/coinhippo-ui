import { RATES_DATA } from './types'

export default (
  state = {
    [`${RATES_DATA}`]: null,
  },
  action
) => {
  switch (action.type) {
    case RATES_DATA:
      return {
        ...state,
        [`${RATES_DATA}`]: action.value,
      }
    default:
      return state
  }
}