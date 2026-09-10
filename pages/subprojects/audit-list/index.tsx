import { ToDo2023 } from '~/components/ToDo2023.offline'
import { Layout } from '~/components/Layout'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'

/* TODO: Жесткий запрет индексации страницы
  <meta name="robots" content="noindex, nofollow" />
*/

export default () => {
  return (
    <Layout noFooter>
      <ResponsiveBlock
        isLimitedForDesktop
      >
        <ToDo2023 />
      </ResponsiveBlock>
    </Layout>
  )
}
