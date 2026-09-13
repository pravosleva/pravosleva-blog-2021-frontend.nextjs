import React from 'react'
import { BadGateway502Svg } from '~/components/special-content/error/BadGateway502Svg'
import { UniversalContainer } from '~/components/special-content/error/UniversalContainer'
import { Layout } from '~/components/Layout'

const Custom500Page = () => {
  return (
    <Layout>
      <UniversalContainer>
        <BadGateway502Svg />
      </UniversalContainer>
    </Layout>
  )
}

export default Custom500Page
