import { TArticle } from '~/components/Article'
import { universalHttpClient } from '~/utils/universalHttpClient';
import Head from 'next/head'
// import { convertToPlainText } from '~/utils/markdown/convertToPlainText';
import { ErrorPage } from '~/components/ErrorPage';
import { Layout } from '~/components/Layout';
import { wrapper } from '~/store'
import { ArticlesList } from '~/components/ArticlesList'
import { slugMap } from '~/constants/blog/slugMap'
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

  const thisPageUrl = `${process.env.NEXT_SEO}/blog/q/${encodeURIComponent(searchQueryTitle.withoutSpaces)}`

  return (
    <>
      <Head>
        {/* -- NOTE: Meta */}
        {/* <!-- HTML Meta Tags --> */}
        <title>Поиск: {searchQueryTitle.normalized} | Pravosleva</title>
        {/* Склеиваем параметры поиска на домен .pro */}
        <link rel="canonical" href={thisPageUrl} />

        <meta name="description" content={`What about ${searchQueryTitle.normalized}`} />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content={thisPageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:locale:alternate" content="be_BY" />
        <meta property="og:locale:alternate" content="kk_KZ" />
        <meta property="og:locale:alternate" content="tt_RU" />
        <meta property="og:locale:alternate" content="uk_UA" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:title" content='🔎 Check it out' />
        <meta property="og:description" content={`About ${searchQueryTitle.normalized}`} />
        <meta property="og:image" content={`${process.env.NEXT_SEO}/static/img/logo/logo-pravosleva.jpg`} />
        <meta property="og:site_name" content="PravoSleva // Search" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary" />
        <link
          rel="canonical"
          href={process.env.NEXT_SEO}
        ></link>
        <meta name="twitter:title" content='🔎 Check it out' />
        <meta name="twitter:description" content={`What about ${searchQueryTitle.normalized}`} />
        <meta name="twitter:image" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
        {/* -- Meta Tags Generated via https://www.opengraph.xyz -- */}

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
