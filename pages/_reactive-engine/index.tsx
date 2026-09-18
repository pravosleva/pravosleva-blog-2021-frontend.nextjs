import React from 'react'
import Head from 'next/head'
import { Layout } from '~/components/Layout'
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer'
import { ReactiveEngineIntroSvg } from '~/components/special-svg-content/projects/reactive-engine/_tmp'
import Button from '@mui/material/Button'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Link from '~/components/Link'

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
        <title>Reactive Engine</title>
        {/* Жёсткий запрет индексации приватной панели роботами */}
        <meta name="robots" content="noindex, nofollow" />
        {/* <link rel="manifest" href={`${baseURL}/get-dynamic-manifest?chat_id=${chat_id}&project_type=autopark`} /> */}
      </Head>

      <Layout>
        <UniversalContainer
          isForLayout={true} hasBreadcrumbs={false}
          className='fade-in-effect'
        >
          <span>
            <Button
              size='small'
              // endIcon={<ArrowForwardIcon />}
              variant='text'
              // variant='text'
              color='primary'
              component={Link}
              noLinkStyle
              href={'https://pravosleva.pro/reactive-engine/'}
              target='_self'
            >
              Документация
            </Button>
          </span>
          <ReactiveEngineIntroSvg />
          <span>
            <Button
              size='small'
              endIcon={<ArrowForwardIcon />}
              variant='contained'
              // variant='text'
              color='primary'
              component={Link}
              noLinkStyle
              href={'/p/reactive-engine-ru'}
              target='_self'
            >
              Подробный разбор
            </Button>
          </span>
        </UniversalContainer>
      </Layout>
    </>
  )
}
