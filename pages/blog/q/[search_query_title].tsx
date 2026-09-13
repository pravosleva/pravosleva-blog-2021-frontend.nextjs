import React from 'react'
import Head from 'next/head'
import { Store } from 'redux'
import { wrapper } from '~/store'
import { Layout } from '~/components/Layout'
import { ArticlesList } from '~/components/ArticlesList'
import { TArticle } from '~/components/Article'
import { NCodeSamplesSpace } from '~/types'
import { addSQT } from '~/store/reducers/siteSearch'
import { universalHttpClient } from '~/utils/universalHttpClient'
import { getInitialPropsBase, setCommonStore } from '~/utils/next'
import { UniversalContainer } from '~/components/special-content/UniversalContainer'
import { PageNotFound404Svg } from '~/components/special-content/error/PageNotFound404Svg'

type TPageService = {
  isOk: boolean;
  message?: string;
  response?: NCodeSamplesSpace.TNotesListResponseModified;
}

interface IBlogQSTProps {
  _pageService: TPageService;
  list: TArticle[];
  searchQueryTitle: {
    original: string;
    withoutSpaces: string;
    normalized: string;
  }
}

const BlogQST = ({ _pageService, list, searchQueryTitle }: IBlogQSTProps) => {
  // =========================================================================
  // 🛡️ ЗАЩИТНЫЙ БАРЬЕР UI-СЛОЯ ОШИБОК (Стандартизация под PageNotFound404Svg)
  // =========================================================================
  if (!_pageService?.isOk) {
    return (
      <Layout>
        <UniversalContainer isForLayout={true} hasBreadcrumbs={true}>
          <PageNotFound404Svg message={_pageService?.message || 'ERR: No _pageService.message'} />
        </UniversalContainer>
      </Layout>
    )
  }

  // Склеиваем параметры поиска на домен .pro со строгим энкодингом query-компонента
  const thisPageUrl = `${process.env.NEXT_SEO}/blog/q/${encodeURIComponent(searchQueryTitle.withoutSpaces)}`
  const defaultLogoUrl = `${process.env.NEXT_SEO}/static/img/logo/logo-pravosleva.jpg`
  const queryName = searchQueryTitle.normalized

  // 1. Мета-теги, использующие стандартный атрибут "name" (SEO + Twitter)
  const nameMeta = {
    description: `What about ${queryName}`,
    "twitter:card": "summary",
    "twitter:domain": "pravosleva.pro",
    "twitter:url": thisPageUrl,
    "twitter:title": "🔎 Check it out",
    "twitter:description": `What about ${queryName}`,
    "twitter:image": defaultLogoUrl,
  }

  // 2. Мета-теги, использующие атрибут "property" (Open Graph / Facebook спецификация)
  const propertyMeta = {
    "og:url": thisPageUrl,
    "og:type": "website",
    "og:site_name": "PravoSleva // Search",
    "og:title": "🔎 Check it out",
    "og:description": `About ${queryName}`,
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
        <title>Поиск: {queryName} | Pravosleva</title>
        
        {/* Единственная, строго валидная каноническая ссылка на страницу поиска */}
        <link rel="canonical" href={thisPageUrl} />

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
        <link href="/static/css/min/blog_sqt_[search_query_title].css?v=0" rel="stylesheet" fetchpriority="high"  />
        <link href="/static/css/min/blog_sqt_[search_query_title]-qrcode.react.css?v=0" rel="stylesheet" fetchpriority="high"  />
      </Head>
      <Layout>
        <ArticlesList
          list={list}
          searchQueryTitle={searchQueryTitle}
        />
      </Layout>
    </>
  )
}

BlogQST.getInitialProps = wrapper.getInitialPageProps(
  (store: Store) => async (ctx: any): Promise<IBlogQSTProps> => {
    const search_query_title = ctx.query?.search_query_title
    
    const _pageService: TPageService = { isOk: false }
    let list: TArticle[] = []

    const withoutSpaces = typeof search_query_title === 'string' ? search_query_title.replace(/\s/g, '') : ''
    const normalized = !!withoutSpaces
      ? search_query_title.replace(/\s/g, '').split(',').join(', ')
      : ''

    switch (true) {
      case !!withoutSpaces: {
        // Записываем поисковые параметры в Redux-редюсер siteSearch
        store.dispatch(addSQT({
          original: String(search_query_title),
          withoutSpaces,
          normalized,
        }))

        const notesResult = await universalHttpClient.get<NCodeSamplesSpace.TNotesListResponseModified>(
          `/express-next-api/code-samples-proxy/api/notes?q_title_all_words=${encodeURIComponent(withoutSpaces)}`
        )

        if (notesResult.ok && !!notesResult?.response?.data && Array.isArray(notesResult.response.data)) {
          _pageService.isOk = true
          _pageService.response = notesResult.response
          list = notesResult.response.data
        } else {
          _pageService.isOk = false
          _pageService.response = notesResult?.response
          _pageService.message = notesResult?.message || 'Ошибка выполнения поискового запроса на бэкенде.'
        }
        break
      }
      default:
        _pageService.isOk = false
        _pageService.message = 'Строка поиска пуста. Кажется, нет такой заметки, но она скоро обязательно появится...'
        break
    }

    const baseProps = await getInitialPropsBase(ctx)
    setCommonStore({ store, baseProps })

    return {
      _pageService,
      list,
      searchQueryTitle: {
        original: String(search_query_title || ''),
        withoutSpaces,
        normalized,
      },
    }
  }
)

export default BlogQST
