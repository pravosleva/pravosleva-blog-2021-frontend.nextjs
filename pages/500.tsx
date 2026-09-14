import React from 'react'
import { ServerError500Svg } from '~/components/special-svg-content/error/ServerError500Svg'
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer'
import { Layout } from '~/components/Layout'

const Custom500Page = () => {
  return (
    <Layout>
      <UniversalContainer isForLayout={true} hasBreadcrumbs={false}>
        <ServerError500Svg />
      </UniversalContainer>
    </Layout>
  )
}

export default Custom500Page
