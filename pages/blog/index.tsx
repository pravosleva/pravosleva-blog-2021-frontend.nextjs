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

const BlogSQT = ({ _pageService, list }: { _pageService: TPageService; list: TArticle[]; }) => {
  if (!_pageService?.isOk) return (
    <Layout>
      <ErrorPage message={_pageService?.message || 'ERR: No _pageService.message'} />
      <pre>{JSON.stringify({ _pageService }, null, 2)}</pre>
    </Layout>
  )

  return (
    <>
      <Head>
        <title>Pravosleva | Blog</title>
        <meta property="og:title" content="Pravosleva | Blog" />
      </Head>
      <Layout>
        <ArticlesList _pageService={_pageService} list={list} searchQueryTitle={{ modified: 'ALL', original: 'ALL' }} isBlogPage />
      </Layout>
    </>
  )
}

BlogSQT.getInitialProps = wrapper.getInitialPageProps(
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

    const notesResult = await universalHttpClient.get('/express-next-api/code-samples-proxy/api/notes?limit=20')
    let list: TArticle[] = []

    switch (true) {
      case notesResult.isOk && !!notesResult.response:
        _pageService.isOk = true
        _pageService.response = notesResult.response
        list = [...notesResult.response.data.map(({ _id, ...rest }: NCodeSamplesSpace.TNote) => ({
          original: {
            _id,
            ...rest,
          },
          slug: slugMap.get(_id)?.slug || null,
          brief: slugMap.get(_id)?.brief || null,
          bgSrc: slugMap.get(_id)?.bgSrc || null,
        }))]
        break
      default:
        _pageService.isOk = false
        _pageService.message = `Ошибка при получении списка заметок: ${notesResult.msg || 'No notesResult.msg'}`
        break
    }

    return {
      _pageService,
      list,
    }
  }
)

export default BlogSQT
