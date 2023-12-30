import { Layout } from '~/components/Layout'
import { SPSocketLab } from '~/components/SPSocketLab'
import Head from 'next/head'

const Page = () => {
  return (
    <>
      <Head>
        <title>SP exp</title>
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
      </Head>
      <Layout>
        <SPSocketLab />
      </Layout>
    </>
  )
}

export default Page
