import { Article, TArticle, TPageService } from '~/components/Article'
import { universalHttpClient } from '~/utils/universalHttpClient'
import Head from 'next/head'
// import { convertToPlainText } from '~/utils/markdown/convertToPlainText';
import { ErrorPage } from '~/components/ErrorPage';
import { Layout } from '~/components/Layout';
import { wrapper } from '~/store'
import { slugMapping } from '~/constants/blog/slugMap'
import { useSelector } from 'react-redux';
import { IRootState } from '~/store/IRootState'
import { setTitle } from '~/store/reducers/pageMeta'

const BlogArticleSlug = ({ _pageService, article }: { _pageService: TPageService, article: TArticle }) => {
  if (!_pageService?.isOk) return (
    <Layout>
      <ErrorPage message={_pageService?.message || 'ERR: No _pageService.message'}>
        <pre>{JSON.stringify({ _pageService, article }, null, 2)}</pre>
      </ErrorPage>
    </Layout>
  )

  const thisPageUrl = `https://pravosleva.pro/blog/article/${article.slug}`
  const { title } = useSelector((state: IRootState) => state.pageMeta)
  // console.log('redux:title', title)
  // console.log('props:title', article?.original?.title || JSON.stringify(article))
  // NOTE: Should be like {article.original.title} on ssr
  
  return (
    <>
      <Head>
        {/* -- NOTE: Meta */}
        {/* <!-- HTML Meta Tags --> */}
        <title>{title}</title>
        <meta name="description" content={article.brief || 'Найдётся всё что не нашлось ранее, если оно действительно нужно'} />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content={thisPageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={article.original.title} />

        <meta property="og:locale" content="ru_RU" />
        <meta property="article:publisher" content="https://pravosleva.pro/" />
        <meta property="article:section" content={article.original.title} />
        <meta property="og:locale:alternate" content="be_BY" />
        <meta property="og:locale:alternate" content="kk_KZ" />
        <meta property="og:locale:alternate" content="tt_RU" />
        <meta property="og:locale:alternate" content="uk_UA" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="en_US" />
        
        <meta property="og:description" content={article.brief} />
        {
          !!article.bg ? (
            <>
              <meta property="og:image" content={article.bg.src} />
              <meta property="og:image:secure_url" content={article.bg.src} />
              <meta property='og:image:width' content={String(article.bg.size.w)} />
              <meta property='og:image:height' content={String(article.bg.size.h)} />
              <meta property='og:image:type' content={article.bg.type} />
              <meta property="og:image:alt" content="img alt sample" />
            </>
          ) : (
            <>
              <meta property="og:image" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
              <meta property="og:image:secure_url" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
            </>
          )
        }
        
        <meta property="og:site_name" content="Web exp // Blog" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta property="twitter:domain" content="pravosleva.pro" />
        {/* <meta property="twitter:url" content="https://pravosleva.pro/blog/article/bash-quaint-files-copy" /> */}
        <meta property="twitter:url" content={thisPageUrl} />
        <meta name="twitter:title" content={article.original.title} />
        <meta name="twitter:description" content={article.brief} />
        {
          !!article.bg ? (
            <>
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:image" content={article.bg.src} />
            </>
          ) : (
            <>
              <meta name="twitter:card" content="summary" />
              <meta name="twitter:image" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
            </>
          )
        }
        
        {/* -- Meta Tags Generated via https://www.opengraph.xyz -- */}

        <link href="/static/css/article.css" rel="stylesheet" />

        {/* <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="630"/> */}

        {/* <meta property="og:locale" content="ru_RU" />
        <meta property="og:image" content={`https://pravosleva.pro/static/img/blog/${article.bgSrc || 'coming-soon.avif'}`} key='og-image' />
        <meta property="og:description" content="Pravosleva | So, we have unconscious consumption society. What about this?" /> */}
      </Head>
      <Layout>
        <Article _pageService={_pageService} article={article} />
      </Layout>
    </>
  )
}

BlogArticleSlug.getInitialProps = wrapper.getInitialPageProps(
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
        // console.log(`-- ${slug}`)
        // console.log(noteResult)
        // console.log('--')
        if (noteResult.ok && !!noteResult.response) {
          store.dispatch(setTitle(noteResult.response.data.title))

          _pageService.isOk = true
          _pageService.response = noteResult.response
          article = {
            original: { ...noteResult.response.data },

            slug,
            brief: slugMapping[slug].brief,
            bg: slugMapping[slug].bg,
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
        _pageService.message = 'Кажется, нет такой заметки, возможно появится позже'
        break
    }

    // console.log('-- 0. before makeStore on server')
    // console.log(`_pageService.isOk= ${_pageService.isOk}`)
    // console.log('--')

    return {
      _pageService,
      article,
    }
  }
)

export default BlogArticleSlug
