import React from 'react'
import { ServerError500Svg } from '~/components/special-content/error/ServerError500Svg'
import { UniversalContainer } from '~/components/special-content/error/UniversalContainer'
import { Layout } from '~/components/Layout'

const Custom500Page = () => {
  return (
    <Layout>
      <UniversalContainer>
        <ServerError500Svg />
      </UniversalContainer>
    </Layout>
  )
}

export default Custom500Page
