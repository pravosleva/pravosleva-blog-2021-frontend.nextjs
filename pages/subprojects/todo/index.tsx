import { ToDo2023 } from '~/components/ToDo2023.offline'
import { Layout } from '~/components/Layout'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'

export default () => {
  return (
    <Layout>
      <ResponsiveBlock
        isLimitedForDesktop
        style={{
          paddingBottom: '30px',
        }}
      >
        <ToDo2023 />
      </ResponsiveBlock>
    </Layout>
  )
}
