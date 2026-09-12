import { TArticle } from '~/components/Article'
import { universalHttpClient } from '~/utils/universalHttpClient';
import Head from 'next/head'
// import { convertToPlainText } from '~/utils/markdown/convertToPlainText';
import { ErrorPage } from '~/components/ErrorPage';
import { Layout } from '~/components/Layout';
import { wrapper } from '~/store'
import { ArticlesList } from '~/components/ArticlesList'
// import { slugMap } from '~/constants/blog/slugMap'
import { NCodeSamplesSpace } from '~/types'
import { addSQT } from '~/store/reducers/siteSearch'
import { getInitialPropsBase, setCommonStore } from '~/utils/next'

// const isProd = process.env.NODE_ENV === 'production'

type TPageProps = {
  _pageService: {
    isOk: boolean;
    message?: string;
    response?: NCodeSamplesSpace.TNotesListResponseModified;
  };
  list: TArticle[];
  searchQueryTitle: {
    original: string;
    withoutSpaces: string;
    normalized: string;
  },
}

const BlogQST = ({ _pageService, list, searchQueryTitle }: TPageProps) => {
  if (!_pageService?.isOk) return (
    <Layout>
      <ErrorPage
        message={_pageService?.message || 'ERR: No _pageService.message'}
      >
        <pre>{JSON.stringify({ _pageService, list }, null, 2)}</pre>
      </ErrorPage>
    </Layout>
  )

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
    // Декларативный список альтернативных локалей без дублирования en_US
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
        <link href="/static/css/min/blog_sqt_[search_query_title].css" rel="stylesheet" />
        <link href="/static/css/min/blog_sqt_[search_query_title]-qrcode.react.css" rel="stylesheet" />
      </Head>
      <Layout>
        <ArticlesList
          // _pageService={_pageService}
          list={list}
          searchQueryTitle={searchQueryTitle}
        />
      </Layout>
    </>
  )
}

BlogQST.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => async (ctx: any) => {
    const { query: { search_query_title } } = ctx
    // let errorMsg = null
    const _pageService: {
      isOk: boolean;
      message?: string;
      response?: NCodeSamplesSpace.TNotesListResponseModified;
    } = {
      isOk: false
    }
    let list: TArticle[] = []

    const withoutSpaces = typeof search_query_title === 'string' ? search_query_title.replace(/\s/g, '') : ''
    const normalized = !!withoutSpaces
      ? search_query_title.replace(/\s/g, '')
        .split(',')
        // .map((tag: any) => !!tag && typeof tag === 'string' ? decodeURIComponent(tag) : '')
        // .filter((normalizedTag: string) => !!normalizedTag)
        .join(', ')
      : ''

    // console.log(`withoutSpaces -> ${withoutSpaces}`)
    // console.log(`normalized -> ${normalized}`)
    // console.log(`/express-next-api/code-samples-proxy/api/notes?q_title_all_words=${encodeURIComponent(withoutSpaces)}`)

    switch (true) {
      case !!withoutSpaces: {
        store.dispatch(addSQT({
          original: search_query_title,
          withoutSpaces,
          normalized,
        }))
        const notesResult = await universalHttpClient.get<NCodeSamplesSpace.TNotesListResponseModified>(`/express-next-api/code-samples-proxy/api/notes?q_title_all_words=${encodeURIComponent(withoutSpaces)}`)
        if (notesResult.ok && !!notesResult?.response?.data && Array.isArray(notesResult.response.data)) {
          _pageService.isOk = true
          _pageService.response = notesResult.response
          // list = [...notesResult.response.data.map(({ _id, ...rest }: NCodeSamplesSpace.TNote) => ({
          //   original: {
          //     _id,
          //     ...rest,
          //   },
          //   slug: slugMap.get(_id)?.slug || null,
          //   brief: slugMap.get(_id)?.brief || null,
          //   bg: slugMap.get(_id)?.bg || null,
          // }))]
          list = !!notesResult.response?.data
          ? notesResult.response?.data
          : []
        } else {
          _pageService.isOk = false
          _pageService.response = notesResult?.response
          _pageService.message = notesResult?.message || 'No notesResult?.message'
        }
      }
        break
      default:
        _pageService.isOk = false
        _pageService.message = 'Кажется, нет такой заметки, но она скоро обязательно появится...'
        break
    }

    const baseProps = await getInitialPropsBase(ctx)

    setCommonStore({ store, baseProps })

    return {
      _pageService,
      list,
      searchQueryTitle: {
        original: search_query_title,
        withoutSpaces,
        normalized,
      },
    }
  }
)

export default BlogQST
