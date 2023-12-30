import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { ConnectedData } from './components'

export const SPSocketLab = () => {
  return (
    <ResponsiveBlock
      isLimited
      isPaddedMobile
      style={{
        borderTop: '1px solid lightgray',
        borderBottom: '1px solid lightgray',
        padding: '32px 0 32px 0',
      }}
    >
      <h1>SP exp</h1>
      <ConnectedData />
    </ResponsiveBlock>
  ) 
}
