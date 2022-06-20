import { TRENDING_DATA } from './types'

export default (
  state = {
    [`${TRENDING_DATA}`]: null,
  },
  action
) => {
  switch (action.type) {
    case TRENDING_DATA:
      return {
        ...state,
        [`${TRENDING_DATA}`]: action.value,
      }
    default:
      return state
  }
}