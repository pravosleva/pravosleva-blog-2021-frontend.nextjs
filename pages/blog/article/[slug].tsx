import { Article, TArticle, TPageService } from '~/components/Article'
import { universalHttpClient } from '~/utils/universalHttpClient';
import Head from 'next/head'
// import { convertToPlainText } from '~/utils/markdown/convertToPlainText';
import { ErrorPage } from '~/components/ErrorPage';
import { Layout } from '~/components/Layout';
import { wrapper } from '~/store'
import { slugMapping } from '~/constants/blog/slugMap'

const _Article = ({ _pageService, article }: { _pageService: TPageService, article: TArticle }) => {
  if (!_pageService?.isOk) return (
    <Layout>
      <ErrorPage message={_pageService?.message || 'ERR: No _pageService.message'} />
      <pre>{JSON.stringify({ _pageService, article }, null, 2)}</pre>
    </Layout>
  )

  // const thisPageUrl = `https://pravosleva.pro/blog/article/${article.slug}`
  
  return (
    <>
      <Head>
        <title>{`Pravosleva | ${article.original.title}`}</title>
        {/* <meta property="og:title" content={`Pravosleva | ${article?.original.title}`} /> */}
        <meta name="description" content={article.brief} />

        {/* -- NOTE: v2 */}
        <meta property="og:site_name" content="Pravosleva" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://parvosleva.ru" />
        <meta property="og:image" content="https://parvosleva.ru/static/img/logo/logo-pravosleva.jpg" />

        <meta name="twitter:url" content="http://code-samples.space" />
        <meta name="twitter:title" content="Pravosleva" />
        <meta name="twitter:image" content="https://parvosleva.ru/static/img/logo/logo-pravosleva-512x512.jpg" />
        <meta name="twitter:creator" content="@pravosleva86" />
        <meta name="twitter:card" content="summary" />
        {!!article?.original.title ? (
          <>
            <title>{article.original.title}</title>
            <meta property="og:title" content={article.original.title} />
            <meta property="og:description" content={article.brief} />
            <meta name="twitter:description" content={article.brief} />
          </>
        ) : (
          <>
            <title>WTF?</title>
            <meta property="og:title" content="Pravosleva | ERR" />
            <meta property="og:description" content="No description" />
            <meta name="twitter:description" content="Смотри что я нашел!" />
          </>
        )}
        {/* -- */}

        {/* <meta property="og:locale" content="ru_RU" />
        <meta property="og:image" content={`https://pravosleva.pro/static/img/blog/${article.bgSrc || 'coming-soon.avif'}`} key='og-image' />
        
        <meta property="og:description" content={article.brief} key='og-descr' />
        <meta property="og:url" content={thisPageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU"></meta>
        <meta property="og:locale:alternate" content="be_BY" />
        <meta property="og:locale:alternate" content="kk_KZ" />
        <meta property="og:locale:alternate" content="tt_RU" />
        <meta property="og:locale:alternate" content="uk_UA" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="en_US" />
        {
          !!article.bgSrc ? (
            <meta property="vk:image" content={`https://pravosleva.pro/static/img/blog/${article.bgSrc || 'coming-soon.avif'}`} />
          ) : (
            <meta property="og:image" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
          )
        }
        <link href="/static/css/article.css" rel="stylesheet" />
        <meta property="og:description" content="Pravosleva | So, we have unconscious consumption society. What about this?" /> */}
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
