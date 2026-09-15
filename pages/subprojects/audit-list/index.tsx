import Head from 'next/head'
import { ToDo2023 } from '~/components/ToDo2023.offline'
// import { Layout } from '~/components/Layout'

export default () => {
  return (
    <>
      <Head>
        <title>AuditList | Online</title>
        <meta name="robots" content="noindex, nofollow" />
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
        <link rel="stylesheet" href="/static/css/src/audit-list.css?v=0" />
      </Head>
    
      {/* <Layout noFooter isPrivatePage> */}
        <div
          className='audit-list-page-wrapper-2026--centered'
          // style={{ border: '1px solid red' }}
        >
          <ToDo2023 />
        </div>
      {/* </Layout> */}
    </>
  )
}
