import { THEME, COLLAPSED } from './types'

export default (
  state = {
    [`${THEME}`]: 'light',
    [`${COLLAPSED}`]: true,
  },
  action
) => {
  switch (action.type) {
    case THEME:
      localStorage.setItem(THEME, action.value)

      return {
        ...state,
        [`${THEME}`]: action.value,
      }
    case COLLAPSED:
      localStorage.setItem(COLLAPSED, action.value)

      return {
        ...state,
        [`${COLLAPSED}`]: action.value,
      }
    default:
      return state
  }
}