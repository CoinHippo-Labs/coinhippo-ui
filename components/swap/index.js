import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { SquidWidget } from '@0xsquid/widget'

export default () => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const config = {
    integratorId: process.env.NEXT_PUBLIC_SQUID_INTEGRATOR_ID,
    companyName: process.env.NEXT_PUBLIC_APP_NAME,
    apiUrl: 'https://api.squidrouter.com',
    enableExpress: true,
    infiniteApproval: false,
    slippage: 1.5,
    priceImpactWarnings: {
      warning: 3,
      critical: 5,
    },
    style: {
      ...(theme === 'dark' ?
        {
          neutralContent: '#959BB2',
          baseContent: '#E8ECF2',
          base100: '#10151B',
          base200: '#272D3D',
          base300: '#171D2B',
          error: '#ED6A5E',
          warning: '#FFB155',
          success: '#2EAEB0',
          primary: '#71B4BD',
          secondary: '#71B4BD',
          secondaryContent: '#191C29',
          neutral: '#191C29',
        } :
        {
          neutralContent: '#C4AEEC',
          baseContent: '#070002',
          base100: '#ffffff',
          base200: '#fafafa',
          base300: '#e8e8e8',
          error: '#ED6A5E',
          warning: '#FFB155',
          success: '#2EAEB0',
          primary: '#A992EA',
          secondary: '#F89CC3',
          secondaryContent: '#F7F6FB',
          neutral: '#FFFFFF'
        }
      ),
      roundedBtn: '26px',
      roundedCornerBtn: '999px',
      roundedBox: '1rem',
      roundedDropDown: '20rem',
    },
  }

  return <SquidWidget config={config} />
}