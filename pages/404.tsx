import React from 'react'
import { PageNotFound404Svg } from '~/components/special-svg-content/error/PageNotFound404Svg'
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer'
import { Layout } from '~/components/Layout'

const Custom404Page = () => {
  return (
    <Layout>
      <UniversalContainer isForLayout={true} hasBreadcrumbs={false}>
        <PageNotFound404Svg />
      </UniversalContainer>
    </Layout>
  )
}

// Экспортируем по дефолту, чтобы Next.js успешно подхватил роут при билде
export default Custom404Page
