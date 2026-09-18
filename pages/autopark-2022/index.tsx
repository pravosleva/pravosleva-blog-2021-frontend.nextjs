import React from 'react'
import Head from 'next/head'
import { Layout } from '~/components/Layout';
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer';
import { AutoparkIntroSvg } from '~/components/special-svg-content/projects/autopark/AutoparkIntroSvg';

// const isDev = process.env.NODE_ENV === 'development'
// const baseURL = isDev
//   ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
//   : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'

type TPageService = {
  isOk: boolean;
  message?: string;
  hasAuthenticated: boolean;
}

interface IMyProjectsProps {
  _pageService: TPageService;
}

export default function MyProjects(_ps: IMyProjectsProps) {
  
  return (
    <>
      <Head>
        <title>AutoPark | Панель управления</title>
        {/* Жёсткий запрет индексации приватной панели роботами */}
        <meta name="robots" content="noindex, nofollow" />
        {/* <link rel="manifest" href={`${baseURL}/get-dynamic-manifest?chat_id=${chat_id}&project_type=autopark`} /> */}
      </Head>
      
      {/* <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Container maxWidth="xs" style={{ paddingTop: '24px' }}>
          <AutoparkHeaderSvg />
        </Container>
      </div> */}

      <Layout>
        <UniversalContainer
          isForLayout={true} hasBreadcrumbs={false}
          className='fade-in-effect'
        >
          <AutoparkIntroSvg />
        </UniversalContainer>
      </Layout>
    </>
  )
}
