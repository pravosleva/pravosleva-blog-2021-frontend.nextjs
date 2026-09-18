import React from 'react'
import Head from 'next/head'
import { Layout } from '~/components/Layout';
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer';
import { AutoparkIntroSvg } from '~/components/special-svg-content/projects/autopark/AutoparkIntroSvg';

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

      <Layout>
        <UniversalContainer
          isForLayout={true} hasBreadcrumbs={false}
          className='fade-in-effect'
        >
          <AutoparkIntroSvg />
          <em>Проект на стадии ревью...</em>
        </UniversalContainer>
      </Layout>
    </>
  )
}
