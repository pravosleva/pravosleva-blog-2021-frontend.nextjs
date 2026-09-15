import { Layout } from '~/components/Layout'
import { SPSocketLab } from '~/components/SPSocketLab'
import Head from 'next/head'
import { getInitialPropsBase, IPageContext, setCommonStore } from '~/utils/next'
import { wrapper } from '~/store'
import { TradeInHeaderSvg } from '~/components/special-svg-content/projects/tradein/TradeInHeaderSvg'
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer'

const Page = () => {
  return (
    <>
      <Head>
        <title>SP exp</title>
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
        <link rel="stylesheet" href="/static/css/min/mapbox-gl@2.6.1.min.css" />
      </Head>
      <Layout>
        <UniversalContainer isForLayout={true} hasBreadcrumbs={false}>
          <TradeInHeaderSvg />
        </UniversalContainer>
        <SPSocketLab />
      </Layout>
    </>
  )
}

const getInitialPropsWithStore = async ({
  ctx,
  store,
}: {
  ctx: IPageContext;
  store: any;
}) => {
  const baseProps = await getInitialPropsBase(ctx)

  setCommonStore({ store, baseProps })

  return {
    ...baseProps,
  }
}

Page.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => (ctx: IPageContext) => getInitialPropsWithStore({ ctx, store })
)

export default Page
