import React from 'react'
import { BadGateway502Svg } from '~/components/special-svg-content/error/BadGateway502Svg'
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer'
import { Layout } from '~/components/Layout'

const Custom500Page = () => {
  return (
    <Layout>
      <UniversalContainer isForLayout={true} hasBreadcrumbs={false}>
        <BadGateway502Svg />
      </UniversalContainer>
    </Layout>
  )
}

export default Custom500Page
