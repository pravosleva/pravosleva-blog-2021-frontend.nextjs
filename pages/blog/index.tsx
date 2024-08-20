// import {
//   // Box,
//   // Container,
//   // Stack,
//   // <Stack spacing={1}>
//   Typography,
// } from '@mui/material'
// import Link from '~/components/Link'
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// import React, { useState, useCallback, useEffect } from 'react'
// import { useDispatch } from 'react-redux'
// import { Recaptcha } from '~/components/Recaptcha'
// import { useInput } from '~/hooks/useInput'
import { Layout } from '~/components/Layout'
// import styled from 'styled-components'
// import { useRouter } from 'next/router'
// import { loadReCaptcha } from 'react-recaptcha-v3'
// import { universalHttpClient } from '~/utils/universalHttpClient'
// import { showAsyncToast } from '@/actions'
// import { withTranslator } from '~/hocs/withTranslator'
// import { metrics } from '@/constants'
import { wrapper } from '~/store'
import { universalHttpClient } from '~/utils/universalHttpClient'
import { NCodeSamplesSpace } from '~/types'
import { ArticlesList } from '~/components/ArticlesList'
import { ErrorPage } from '~/components/ErrorPage'
import { slugMap } from '~/constants/blog/slugMap'
import { TArticle } from '~/components/Article'
import Head from 'next/head'

// const isProd = process.env.NODE_ENV === 'production'

type TPageService = {
  isOk: boolean;
  message?: string;
  response?: NCodeSamplesSpace.TNotesListResponse;
}

const BlogIndex = ({ _pageService, list }: { _pageService: TPageService; list: TArticle[]; }) => {
  if (!_pageService?.isOk) return (
    <Layout>
      <ErrorPage message={_pageService?.message || 'ERR: No _pageService.message'} />
      <pre>{JSON.stringify({ _pageService }, null, 2)}</pre>
    </Layout>
  )

  return (
    <>
      <Head>
        {/* -- NOTE: Meta */}
        {/* <!-- HTML Meta Tags --> */}
        <title>Pravosleva | Blog</title>
        <meta name="description" content='Найдётся всё что не нашлось ранее, если оно действительно нужно' />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://pravosleva.pro/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:locale:alternate" content="be_BY" />
        <meta property="og:locale:alternate" content="kk_KZ" />
        <meta property="og:locale:alternate" content="tt_RU" />
        <meta property="og:locale:alternate" content="uk_UA" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:title" content="Blog" />
        <meta property="og:description" content='Найдётся всё что не нашлось ранее, если оно действительно нужно' />
        <meta property="og:image" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
        <meta property="og:site_name" content="Web exp" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
        <meta property="twitter:domain" content="pravosleva.pro" />
        <meta property="twitter:url" content="https://pravosleva.pro/blog" />
        <meta name="twitter:title" content="Blog" />
        <meta name="twitter:description" content='Найдётся всё что не нашлось ранее, если оно действительно нужно' />
        <meta name="twitter:image" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
        {/* -- Meta Tags Generated via https://www.opengraph.xyz -- */}

        <link href="/static/css/blog_sqt_[search_query_title].css" rel="stylesheet" />
      </Head>
      <Layout>
        <ArticlesList
          // _pageService={_pageService}
          list={list}
          searchQueryTitle={{
            original: 'ALL',
            withoutSpaces: 'ALL',
            normalized: 'ALL',
          }}
          isBlogPage
        />
      </Layout>
    </>
  )
}

BlogIndex.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => async (ctx: any) => {
    // const { query: { tg_chat_id } } = ctx
    // let errorMsg = null
    const _pageService: TPageService = {
      isOk: false,
    }

    // const result = await autoparkHttpClient.checkJWT({
    //   tested_chat_id: tg_chat_id,
    // })
    //   .then((res) => res)
    //   .catch((err) => err.message || 'Unknown err (GIPP)')

    // if (result?.ok === true) store.dispatch(setIsOneTimePasswordCorrect(true))
    // if (typeof result === 'string') errorMsg = result

    const notesResult = await universalHttpClient.get('/express-next-api/code-samples-proxy/api/notes')
    let list: TArticle[] = []

    switch (true) {
      case notesResult.ok && !!notesResult.response:
        _pageService.isOk = true
        _pageService.response = notesResult.response
        list = [...notesResult.response.data.map(({ _id, ...rest }: NCodeSamplesSpace.TNote) => ({
          original: {
            _id,
            ...rest,
          },
          slug: slugMap.get(_id)?.slug || null,
          brief: slugMap.get(_id)?.brief || null,
          bg: slugMap.get(_id)?.bg || null,
        }))]
        break
      default:
        _pageService.isOk = false
        _pageService.message = `Ошибка при получении списка заметок: ${notesResult.message || 'No notesResult.msg'}`
        break
    }

    return {
      _pageService,
      list,
    }
  }
)

export default BlogIndex
