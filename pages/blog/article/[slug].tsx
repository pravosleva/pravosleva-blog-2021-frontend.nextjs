import { Article, TArticle, TPageService } from '~/components/Article'
import { universalHttpClient } from '~/utils/universalHttpClient';
import Head from 'next/head'
// import { convertToPlainText } from '~/utils/markdown/convertToPlainText';
import { ErrorPage } from '~/components/ErrorPage';
import { Layout } from '~/components/Layout';
import { wrapper } from '~/store'
import { slugMapping } from '~/constants/blog/slugMap'

const isProd = process.env.NODE_ENV === 'production'

const _Article = ({ _pageService, article }: { _pageService: TPageService, article: TArticle }) => {
  if (!_pageService?.isOk) return (
    <Layout>
      <ErrorPage message={_pageService?.message || 'ERR: No _pageService.message'} />
      <pre>{JSON.stringify({ _pageService, article }, null, 2)}</pre>
    </Layout>
  )

  const thisPageUrl = `https://pravosleva.ru/blog/article/${article.slug}`
  
  return (
    <>
      <Head>
        <title>{`Pravosleva${article?.original.title ? ` | ${article?.original.title}` : 'No title'}`}</title>
        <link href="/static/css/article.css" rel="stylesheet" />
        {!!article.brief && <meta name="description" content={article.brief} />}
        {!!article.brief && <meta property="og:description" content={article.brief} />}
        {!!article.bgSrc && <meta property="vk:image" content={article.bgSrc} />}
        {!!article.bgSrc && <meta property="twitter:image" content={article.bgSrc} />}
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />
        <meta property="og:title" content={article.original.title} />
        <meta property="og:image" content={article.bgSrc} />
        <meta property="og:type" content="article" />
        {isProd && <meta property="og:url" content={thisPageUrl} />}
        <meta property="og:site_name" content="pravosleva.ru" />
      </Head>
      <Layout>
        <Article _pageService={_pageService} article={article} />
      </Layout>
    </>
  )
}

_Article.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => async (ctx: any) => {
    const { query: { slug } } = ctx
    // let errorMsg = null
    const _pageService: TPageService = {
      isOk: false,
      modifiedArticle: null,
    }
    let article = null

    switch (true) {
      case !!slugMapping[slug]: {
        const noteResult = await universalHttpClient.get(`/express-next-api/code-samples-proxy/api/notes/${slugMapping[slug].id}`)
        console.log(`-- ${slug}`)
        console.log(noteResult)
        console.log('--')
        if (noteResult.isOk && !!noteResult.response) {
          _pageService.isOk = true
          _pageService.response = noteResult.response
          article = {
            original: { ...noteResult.response.data },

            slug,
            brief: slugMapping[slug].brief,
            bgSrc: slugMapping[slug].bgSrc,
          }
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
      article,
    }
  }
)

export default _Article
