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
// import { slugMap } from '~/constants/blog/slugMap'
import { TArticle } from '~/components/Article'
import Head from 'next/head'
import { getInitialPropsBase } from '~/utils/next/getInitialPropsBase'
import { setCommonStore } from '~/utils/next'

// const isProd = process.env.NODE_ENV === 'production'

type TPageService = {
  isOk: boolean;
  message?: string;
  response?: NCodeSamplesSpace.TNotesListResponseModified;
}

const BlogIndex = ({ _pageService, list }: { _pageService: TPageService; list: TArticle[]; }) => {
  if (!_pageService?.isOk) return (
    <Layout>
      <ErrorPage message={_pageService?.message || 'ERR: No _pageService.message'} />
      <pre>{JSON.stringify({ _pageService }, null, 2)}</pre>
    </Layout>
  )

  const canonicalUrl = `${process.env.NEXT_SEO}/blog`
  const __defaultDescr = 'Найдётся всё что не нашлось ранее, если оно действительно нужно'
  
  // Исправленный абсолютный путь к дефолтному логотипу блога (без склеек)
  const defaultLogoUrl = `${process.env.NEXT_SEO}/static/img/logo/logo-pravosleva.jpg`

  // 1. Мета-теги, использующие стандартный атрибут "name" (SEO + Twitter)
  const nameMeta = {
    description: __defaultDescr,
    "twitter:card": "summary_large_image",
    "twitter:domain": "pravosleva.pro",
    "twitter:url": canonicalUrl,
    "twitter:title": "Pravosleva | Blog",
    "twitter:description": __defaultDescr,
    "twitter:image": defaultLogoUrl,
  }

  // 2. Мета-теги, использующие атрибут "property" (Open Graph / Facebook спецификация)
  const propertyMeta = {
    "og:url": canonicalUrl,
    "og:type": "website",
    "og:site_name": "PravoSleva",
    "og:title": "Pravosleva | Blog",
    "og:description": __defaultDescr,
    "og:image": defaultLogoUrl,
    "og:image:secure_url": defaultLogoUrl,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/jpeg",
    "og:locale": "ru_RU",
    // Списком объявляем альтернативные локали без дублирования
    "og:locale:alternate": ["be_BY", "kk_KZ", "tt_RU", "uk_UA", "en_US"],
  }

  return (
    <>
      <Head>
        {/* TODO: Синхронизируем title с глобальным Redux-стейтом метаданных */}
        <title>Pravosleva | Blog</title>
        
        {/* Нативная каноническая ссылка */}
        <link rel="canonical" href={canonicalUrl} />

        {/* --- Автоматический рендеринг nameMeta (SEO & Twitter) --- */}
        {Object.entries(nameMeta).map(([key, value]) => {
          if (!value) return null
          return <meta key={key} name={key} content={String(value)} />
        })}

        {/* --- Автоматический рендеринг propertyMeta (Open Graph) --- */}
        {Object.entries(propertyMeta).map(([key, value]) => {
          if (!value) return null
          
          // Безопасный рендеринг массива альтернативных локалей
          if (Array.isArray(value)) {
            return value.map((locale) => (
              <meta key={`${key}-${locale}`} property={key} content={locale} />
            ))
          }
          
          return <meta key={key} property={key} content={String(value)} />
        })}

        {/* Специфические бандлы стилей поисковых заголовков */}
        <link href="/static/css/min/blog_sqt_[search_query_title].css" rel="stylesheet" />
        <link href="/static/css/min/blog_sqt_[search_query_title]-qrcode.react.css" rel="stylesheet" />
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
    const baseProps = await getInitialPropsBase(ctx)
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

    const notesResult = await universalHttpClient.get<NCodeSamplesSpace.TNotesListResponseModified>('/express-next-api/code-samples-proxy/api/notes')
    let list: TArticle[] = []

    switch (true) {
      case notesResult.ok && !!notesResult.response:
        _pageService.isOk = true
        _pageService.response = notesResult.response
        list = !!notesResult.response?.data
          ? notesResult.response?.data
          : []
        break
      default:
        _pageService.isOk = false
        _pageService.message = `Ошибка при получении списка заметок: ${notesResult.message || 'No notesResult.msg'}`
        break
    }

    setCommonStore({ store, baseProps })

    return {
      _pageService,
      list,
    }
  }
)

export default BlogIndex
