import { useSelector, shallowEqual } from 'react-redux'
import Circle from 'react-circle'

export default ({
  size = 'lg',
  progress,
  color,
}) => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  return (
    <Circle
      size={size === 'sm' ? 60 : size === 'lg' ? 140 : 100}
      lineWidth={size === 'sm' ? 30 : 40}
      progress={progress}
      progressColor={color}
      bgColor={theme === 'dark' ? '#334155' : '#f1f5f9'}
      textColor={color}
      showPercentageSymbol={true}
      textStyle={{ font: 'normal 6rem Open Sans, Helvetica, sans-serif' }}
    />
  )
}