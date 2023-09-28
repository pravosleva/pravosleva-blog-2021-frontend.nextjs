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

// const isProd = process.env.NODE_ENV === 'production'

type TPageProps = {
  _pageService: TPageService;
  list: TArticle[];
  searchQueryTitle: {
    original: string,
    modified: string
  },
}

const _ArticlesList = ({ _pageService, list, searchQueryTitle }: TPageProps) => {
  if (!_pageService?.isOk) return (
    <Layout>
      <ErrorPage message={_pageService?.message || 'ERR: No _pageService.message'} />
      <pre>{JSON.stringify({ _pageService, list }, null, 2)}</pre>
    </Layout>
  )

  // const thisPageUrl = `https://pravosleva.ru/blog/sqt/${article.slug}`
  
  return (
    <>
      <Head>
        {/* <title>{`Pravosleva${article?.original.title ? ` | ${convertToPlainText(article?.original.title)}` : 'No title'}`}</title> */}
        {/* {!!article.brief && <meta name="description" content={convertToPlainText(article.brief)} />}
        {!!article.brief && <meta property="og:description" content={convertToPlainText(article.brief)} />} */}
        {/* {!!article.bgSrc && <meta property="vk:image" content={article.bgSrc} />}
        {!!article.bgSrc && <meta property="twitter:image" content={article.bgSrc} />} */}
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />
        {/* <meta property="og:title" content={convertToPlainText(article.original.title)} /> */}
        {/* <meta property="og:image" content={article.bgSrc} /> */}
        <meta property="og:type" content="article" />
        {/* {isProd && <meta property="og:url" content={thisPageUrl} />} */}
        <meta property="og:site_name" content="pravosleva.ru" />
      </Head>
      <Layout>
        <ArticlesList _pageService={_pageService} list={list} searchQueryTitle={searchQueryTitle} />
      </Layout>
    </>
  )
}

_ArticlesList.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => async (ctx: any) => {
    const { query: { search_query_title } } = ctx
    // let errorMsg = null
    const _pageService: TPageService = {
      isOk: false,
      modifiedArticle: null,
    }
    let list: TArticle[] = []

    const withoutSpaces = search_query_title.replace(/\s/g, '')

    switch (true) {
      case !!withoutSpaces: {
        const noteResult = await universalHttpClient.get(`/express-next-api/code-samples-proxy/api/notes?limit=20&q_title_all_words=${withoutSpaces}`)
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
            bgSrc: slugMap.get(_id)?.bgSrc || null,
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
        modified: withoutSpaces
      },
    }
  }
)

export default _ArticlesList
