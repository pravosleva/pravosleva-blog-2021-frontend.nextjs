import React from 'react'
import { compose } from 'recompose'
import Head from 'next/head'
// import { ToastContainer } from 'react-toastify'
import { withLeftSidebar } from '~/components/time-scoring/hocs/withLeftSidebar'
import { withAbsoluteList } from '~/components/time-scoring/hocs/withAbsoluteList'
import { withLSManager } from '~/components/time-scoring/hocs/withLSManager'
import { TimeManagementContent } from '~/components/time-scoring/TimeManagementContent'
import { ContentWithMobileTogglers } from '~/components/time-scoring/hocs/ContentWithMobileTogglers'

const title = 'TeamScoring 2019'
const description= 'Можно предсказать будущее! Но только в случае если: Вы располагаете достаточным количеством актуальной статистики.'
const img = {
  src: 'https://pravosleva.pro/static/img/projects/scoring.jpg',
  w: 1200,
  h: 630,
  type: 'image/jpg',
  alt: 'TeamScoring 2019',
}
const thisPageUrl = 'https://pravosleva.pro/team-scoring/legacy'

const Component = compose(
  withLSManager,
  withAbsoluteList,
  withLeftSidebar,
)((props) => (
  <>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* <!-- Facebook Meta Tags --> */}
      <meta property="og:url" content={thisPageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />

      <meta property="og:locale" content="ru_RU" />
      <meta property="article:publisher" content="https://pravosleva.pro/" />
      <meta property="article:section" content={title} />
      <meta property="og:locale:alternate" content="be_BY" />
      <meta property="og:locale:alternate" content="kk_KZ" />
      <meta property="og:locale:alternate" content="tt_RU" />
      <meta property="og:locale:alternate" content="uk_UA" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="en_US" />
      
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img.src} />
      <meta property="og:image:secure_url" content={thisPageUrl} />
      <meta property='og:image:width' content={String(img.w)} />
      <meta property='og:image:height' content={String(img.h)} />
      <meta property='og:image:type' content={img.type} />
      <meta property="og:image:alt" content={img.alt} />
      
      <meta property="og:site_name" content="Pravosleva" />

      {/* <!-- Twitter Meta Tags --> */}
      <meta property="twitter:domain" content="pravosleva.pro" />
      <meta property="twitter:url" content={thisPageUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={img.src} />
      
      <link rel="stylesheet" href="/static/css/team-scoring.common.css" />
      <link rel="stylesheet" href="/static/css/react-day-picker.original.css" />
      <link rel="stylesheet" href="/static/css/react-day-picker.custom.css" />
      <link rel="stylesheet" href="/static/css/react-datepicker.original.css" />
      <link rel="stylesheet" href="/static/css/react-datepicker.custom.css" />

      <link rel="stylesheet" href="/static/css/react-infinite-calendar.original.css" />

      <link rel="stylesheet" href="/static/css/main.css" />
    </Head>
    {/* @ts-ignore */}
    <ContentWithMobileTogglers {...props} content={TimeManagementContent} />
    {/* <ToastContainer autoClose={7000} position="top-right" /> */}
  </>
))

export default Component
