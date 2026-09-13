import React from 'react'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import { Store } from 'redux'
import { wrapper } from '~/store'
import { IRootState } from '~/store/IRootState'
import { setTitle } from '~/store/reducers/pageMeta'
import { Layout } from '~/components/Layout'
import { ArticlesList } from '~/components/ArticlesList'
import { TArticle } from '~/components/Article'
import { NCodeSamplesSpace } from '~/types'
import { universalHttpClient } from '~/utils/universalHttpClient'
import { getInitialPropsBase, setCommonStore } from '~/utils/next'
import { UniversalContainer } from '~/components/special-content/UniversalContainer'
import { ContentLockedSvg } from '~/components/special-content/error/ContentLockedSvg'

type TPageService = {
  isOk: boolean;
  message?: string;
  response?: NCodeSamplesSpace.TNotesListResponseModified;
}

interface IBlogIndexProps {
  _pageService: TPageService;
  list: TArticle[];
}

const BlogIndex = ({ _pageService, list }: IBlogIndexProps) => {
  // Синхронизируем заголовок с глобальным Redux-стейтом метаданных страницы
  const { title } = useSelector((state: IRootState) => state.pageMeta)

  // =========================================================================
  // 🛡️ ЗАЩИТНЫЙ БАРЬЕР UI-СЛОЯ ОШИБОК (Стандартизация под UniversalContainer)
  // =========================================================================
  if (!_pageService?.isOk) {
    return (
      <Layout>
        <UniversalContainer isForLayout={true} hasBreadcrumbs={true}>
          <ContentLockedSvg message={_pageService?.message || 'ERR: No _pageService.message'} />
        </UniversalContainer>
      </Layout>
    )
  }

  const canonicalUrl = `${process.env.NEXT_SEO}/blog`
  const __defaultDescr = 'Найдётся всё что не нашлось ранее, если оно действительно нужно'
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
    "og:locale:alternate": ["be_BY", "kk_KZ", "tt_RU", "uk_UA", "en_US"],
  }

  return (
    <>
      <Head>
        <title>{title || 'Pravosleva | Blog'}</title>
        <link rel="canonical" href={canonicalUrl} />

        {/* --- Автоматический рендеринг nameMeta (SEO & Twitter) --- */}
        {Object.entries(nameMeta).map(([key, value]) => {
          if (!value) return null
          return <meta key={key} name={key} content={String(value)} />
        })}

        {/* --- Автоматический рендеринг propertyMeta (Open Graph) --- */}
        {Object.entries(propertyMeta).map(([key, value]) => {
          if (!value) return null
          
          if (Array.isArray(value)) {
            return value.map((locale) => (
              <meta key={`${key}-${locale}`} property={key} content={locale} />
            ))
          }
          
          return <meta key={key} property={key} content={String(value)} />
        })}

        {/* Специфические бандлы стилей поисковых заголовков */}
        <link href="/static/css/min/blog_sqt_[search_query_title].css" rel="stylesheet" fetchpriority="high"  />
        <link href="/static/css/min/blog_sqt_[search_query_title]-qrcode.react.css" rel="stylesheet" fetchpriority="high" />
      </Head>
      <Layout>
        <ArticlesList
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
  (store: Store) => async (ctx: any): Promise<IBlogIndexProps> => {
    const baseProps = await getInitialPropsBase(ctx)
    // const { query: { tg_chat_id } } = ctx
    const _pageService: TPageService = { isOk: false }
    let list: TArticle[] = []

    // const result = await autoparkHttpClient.checkJWT({
    //   tested_chat_id: tg_chat_id,
    // })
    //   .then((res) => res)
    //   .catch((err) => err.message || 'Unknown err (GIPP)')

    // if (result?.ok === true) store.dispatch(setIsOneTimePasswordCorrect(true))
    // if (typeof result === 'string') errorMsg = result

    // Запрашиваем плоский список статей с прокси-эндпоинта Express
    const notesResult = await universalHttpClient.get<NCodeSamplesSpace.TNotesListResponseModified>('/express-next-api/code-samples-proxy/api/notes')

    switch (true) {
      case notesResult.ok && !!notesResult.response:
        // Устанавливаем базовое название раздела в Redux-стейт метаданных
        store.dispatch(setTitle('Pravosleva | Blog'))
        
        _pageService.isOk = true
        _pageService.response = notesResult.response
        list = notesResult.response?.data ? notesResult.response.data : []
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
