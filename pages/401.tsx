import React from 'react'
import { AuthorizationRequired401Svg } from '~/components/special-content/error/AuthorizationRequired401Svg'
import { UniversalContainer } from '~/components/special-content/UniversalContainer'
import { Layout } from '~/components/Layout'

const Custom404Page = () => {
  return (
    <Layout>
      <UniversalContainer isForLayout={true} hasBreadcrumbs={false}>
        <AuthorizationRequired401Svg />
      </UniversalContainer>
    </Layout>
  )
}

// Экспортируем по дефолту, чтобы Next.js успешно подхватил роут при билде
export default Custom404Page
