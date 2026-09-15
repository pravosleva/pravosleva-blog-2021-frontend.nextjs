import Head from 'next/head'
import React from 'react'
import { Layout } from '~/components/Layout'
import { AuthorizationRequired401Svg } from '~/components/special-svg-content/error/AuthorizationRequired401Svg'
import { BadGateway502Svg } from '~/components/special-svg-content/error/BadGateway502Svg'
import { ContentLockedSvg } from '~/components/special-svg-content/error/ContentLockedSvg'
import { NoInternetConnectionSvg } from '~/components/special-svg-content/error/NoInternetConnectionSvg'
import { PageNotFound404Svg } from '~/components/special-svg-content/error/PageNotFound404Svg'
import { ServerError500Svg } from '~/components/special-svg-content/error/ServerError500Svg'

const BlogArticleSlug = () => {
  return (
    <>
      <Head>
        <title>Errs page</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Layout>
        <div style={{ paddingBottom: '50px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AuthorizationRequired401Svg />
          <BadGateway502Svg />
          <ContentLockedSvg />
          <NoInternetConnectionSvg />
          <PageNotFound404Svg />
          <ServerError500Svg />
        </div>
      </Layout>
    </>
  )
}

export default BlogArticleSlug
