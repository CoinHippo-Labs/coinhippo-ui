import { GLOBAL_DATA } from './types'

export default (
  state = {
    [GLOBAL_DATA]: null,
  },
  action,
) => {
  switch (action.type) {
    case GLOBAL_DATA:
      return {
        ...state,
        [GLOBAL_DATA]: action.value,
      }
    default:
      return state
  }
}