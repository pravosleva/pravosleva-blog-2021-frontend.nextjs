import React from 'react'
import { compose } from 'recompose'
import Head from 'next/head'
// import { ToastContainer } from 'react-toastify'
import { withLeftSidebar } from '~/components/time-scoring/hocs/withLeftSidebar'
import { withAbsoluteList } from '~/components/time-scoring/hocs/withAbsoluteList'
import { withLSManager } from '~/components/time-scoring/hocs/withLSManager'
import { TimeManagementContent } from '~/components/time-scoring/TimeManagementContent'
import { ContentWithMobileTogglers } from '~/components/time-scoring/hocs/ContentWithMobileTogglers'

const Component = compose(
  withLSManager,
  withAbsoluteList,
  withLeftSidebar,
)((props) => (
  <>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <title>Team Scoring 2019</title>
      <link rel="stylesheet" href="/static/css/team-scoring.common.css" />
      <link rel="stylesheet" href="/static/css/react-day-picker.original.css" />
      <link rel="stylesheet" href="/static/css/react-day-picker.custom.css" />
      <link rel="stylesheet" href="/static/css/react-datepicker.original.css" />
      <link rel="stylesheet" href="/static/css/react-datepicker.custom.css" />
      <link rel="stylesheet" href="/static/css/sweetalert2-custom.css" />

      <link rel="stylesheet" href="/static/css/react-infinite-calendar.original.css" />

      <link rel="stylesheet" href="/static/css/main.css" />
    </Head>
    {/* @ts-ignore */}
    <ContentWithMobileTogglers {...props} content={TimeManagementContent} />
    {/* <ToastContainer autoClose={7000} position="top-right" /> */}
  </>
))

export default Component
