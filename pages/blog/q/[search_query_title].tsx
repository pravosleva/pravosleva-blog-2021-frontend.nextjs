import { TArticle, TPageService } from '~/components/Article'
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

// const isProd = process.env.NODE_ENV === 'production'

type TPageProps = {
  _pageService: TPageService;
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
      <ErrorPage message={_pageService?.message || 'ERR: No _pageService.message'} />
      <pre>{JSON.stringify({ _pageService, list }, null, 2)}</pre>
    </Layout>
  )

  const thisPageUrl = `https://pravosleva.pro/blog/q/${searchQueryTitle.withoutSpaces}`
  
  return (
    <>
      <Head>
        {/* -- NOTE: Meta */}
        {/* <!-- HTML Meta Tags --> */}
        <title>🔎 | {searchQueryTitle.normalized}</title>
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
        <meta property="og:title" content='🔎 Look what I found' />
        <meta property="og:description" content={`What about ${searchQueryTitle.normalized}`} />
        <meta property="og:image" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
        <meta property="og:site_name" content="Pravosleva" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
        <meta property="twitter:domain" content="pravosleva.pro" />
        <meta property="twitter:url" content="https://pravosleva.pro/blog/article/bash-quaint-files-copy" />
        <meta name="twitter:title" content='🔎 Look what I found' />
        <meta name="twitter:description" content={`What about ${searchQueryTitle.normalized}`} />
        <meta name="twitter:image" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
        {/* -- Meta Tags Generated via https://www.opengraph.xyz -- */}

        <link href="/static/css/blog_sqt_[search_query_title].css" rel="stylesheet" />
      </Head>
      <Layout>
        <ArticlesList _pageService={_pageService} list={list} searchQueryTitle={searchQueryTitle} />
      </Layout>
    </>
  )
}

BlogQST.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => async (ctx: any) => {
    const { query: { search_query_title } } = ctx
    // let errorMsg = null
    const _pageService: TPageService = {
      isOk: false,
      modifiedArticle: null,
    }
    let list: TArticle[] = []

    const withoutSpaces = typeof search_query_title === 'string' ? search_query_title.replace(/\s/g, '') : ''
    const normalized = !!withoutSpaces ? search_query_title.replace(/\s/g, '').split(',').join(', ') : ''

    switch (true) {
      case !!withoutSpaces: {
        store.dispatch(addSQT({
          original: search_query_title,
          withoutSpaces,
          normalized,
        }))
        const noteResult = await universalHttpClient.get(`/express-next-api/code-samples-proxy/api/notes?q_title_all_words=${withoutSpaces}`)
        if (noteResult.isOk && !!noteResult?.response?.data && Array.isArray(noteResult.response.data)) {
          _pageService.isOk = true
          _pageService.response = noteResult.response
          list = [...noteResult.response.data.map(({ _id, ...rest }: NCodeSamplesSpace.TNote) => ({
            original: {
              _id,
              ...rest,
            },
            slug: slugMap.get(_id)?.slug || null,
            brief: slugMap.get(_id)?.brief || null,
            bg: slugMap.get(_id)?.bg || null,
          }))]
        } else {
          _pageService.isOk = false
          _pageService.response = noteResult?.response || null
          _pageService.message = noteResult?.response?.message || 'No noteResult?.response?.message'
        }
      }
      break
      default:
        _pageService.isOk = false
        _pageService.message = 'Кажется, нет такой заметки, но она скоро обязательно появится...'
        break
    }

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
