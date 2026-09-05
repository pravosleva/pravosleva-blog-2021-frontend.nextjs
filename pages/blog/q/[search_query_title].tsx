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
import { getInitialPropsBase, setCommonStore } from '~/utils/next'

const defaultBg = {
  src: '/static/img/blog/dog.webp',
  size: { w: 896, h: 1344 },
  type: 'image/webp',
}

type TPageProps = {
  _pageService: TPageService;
  list: TArticle[];
  searchQueryTitle: {
    original: string;
    withoutSpaces: string;
    normalized: string;
  },
}

import path from 'path'

// Функция сканирует папку _articles и ищет совпадения по тексту
const searchLocalMdx = async (queryText: string): Promise<NCodeSamplesSpace.TNote[]> => {
  if (typeof window !== 'undefined') return [];
  
  try {
    const fs = require('fs');
    const matter = require('gray-matter');
    
    const articlesDirectory = path.join(process.cwd(), 'public/static/_articles');
    
    if (!fs.existsSync(articlesDirectory)) return [];
    
    const files: string[] = fs.readdirSync(articlesDirectory);
    const matchedNotes: NCodeSamplesSpace.TNote[] = [];
    
    const normalizedQuery = queryText.toLowerCase().trim();

    files.forEach((fileName) => {
      // Работаем только с файлами .mdx
      if (!fileName.endsWith('.mdx')) return;
      
      const filePath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const title = (data.title || '').toLowerCase();
      const slug = fileName.replace(/\.mdx$/, '');

      // Если поисковый запрос есть в заголовке статьи — добавляем в результаты
      if (title.includes(normalizedQuery) || slug.toLowerCase().includes(normalizedQuery)) {
        matchedNotes.push({
          _id: slug,
          title: data.title || slug,
          description: content,
          isPrivate: false,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          priority: data.priority || 0
        });
      }
    });
    
    return matchedNotes;
  } catch (error) {
    console.error('[MDX Search] Ошибка локального поиска:', error);
    return [];
  }
};

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

  const thisPageUrl = `https://pravosleva.pro/blog/q/${searchQueryTitle.withoutSpaces}`

  return (
    <>
      <Head>
        {/* -- NOTE: Meta */}
        {/* <!-- HTML Meta Tags --> */}
        <title>Search 🔎 | {searchQueryTitle.normalized}</title>
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
        <meta property="og:description" content={`What about ${searchQueryTitle.normalized}`} />
        <meta property="og:image" content="https://pravosleva.pro/static/img/logo/logo-pravosleva.jpg" />
        <meta property="og:site_name" content="Pravo$leva // Search" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary" />
        {/* <meta property="twitter:domain" content="pravosleva.pro" /> */}
        <link rel="canonical" href={thisPageUrl}></link>
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
    const _pageService: TPageService = {
      isOk: false,
      modifiedArticle: null,
    }
    let list: TArticle[] = []

    // const withoutSpaces = typeof search_query_title === 'string' ? search_query_title.replace(/\s/g, '') : ''
    // const normalized = !!withoutSpaces
    //   ? search_query_title.replace(/\s/g, '')
    //     .split(',')
    //     // .map((tag: any) => !!tag && typeof tag === 'string' ? decodeURIComponent(tag) : '')
    //     // .filter((normalizedTag: string) => !!normalizedTag)
    //     .join(', ')
    //   : ''

    // console.log(`withoutSpaces -> ${withoutSpaces}`)
    // console.log(`normalized -> ${normalized}`)
    // console.log(`/express-next-api/code-samples-proxy/api/notes?q_title_all_words=${encodeURIComponent(withoutSpaces)}`)

    // -- LOCAL EXP
    // Внутри getInitialProps страницы поиска (BlogQST):
    const withoutSpaces = typeof search_query_title === 'string' ? search_query_title.replace(/\s/g, '') : '';
    const normalized = !!withoutSpaces
      ? search_query_title.replace(/\s/g, '')
        .split(',')
        // .map((tag: any) => !!tag && typeof tag === 'string' ? decodeURIComponent(tag) : '')
        // .filter((normalizedTag: string) => !!normalizedTag)
        .join(', ')
      : ''

    let remoteData: NCodeSamplesSpace.TNote[] = [];
    let localData: NCodeSamplesSpace.TNote[] = [];

    // 1. Пробуем искать в сети
    const noteResult = await universalHttpClient.get(`/express-next-api/code-samples-proxy/api/notes?q_title_all_words=${encodeURIComponent(withoutSpaces)}`);
    if (noteResult.ok && Array.isArray(noteResult.response?.data)) {
      remoteData = noteResult.response.data;
      _pageService.isOk = true;
      _pageService.response = noteResult.response;
    }

    // 2. Ищем локально на диске сервера
    if (withoutSpaces) {
      localData = await searchLocalMdx(withoutSpaces);
      // Если сеть лежала, но локально что-то нашлось — помечаем страницу как успешную
      if (localData.length > 0) {
        _pageService.isOk = true;
      }
    }

    // 3. Объединяем результаты без дубликатов (ориентируемся на _id)
    const combinedData = [...remoteData];
    localData.forEach(localNote => {
      const isDuplicate = combinedData.some(remoteNote => remoteNote._id === localNote._id);
      if (!isDuplicate) {
        combinedData.push(localNote);
      }
    });

    // 4. Маппим объединенный список в TArticle[] для сетки PagesGrid
    list = combinedData.map((note) => ({
      original: note,
      slug: slugMap.get(note._id)?.slug || note._id, // используем _id как фолбек-слаг
      brief: slugMap.get(note._id)?.brief || 'Локальный материал',
      bg: slugMap.get(note._id)?.bg || defaultBg,
    }));
    // --

    switch (true) {
      case !!withoutSpaces: {
        store.dispatch(addSQT({
          original: search_query_title,
          withoutSpaces,
          normalized,
        }))
        const noteResult = await universalHttpClient.get(`/express-next-api/code-samples-proxy/api/notes?q_title_all_words=${encodeURIComponent(withoutSpaces)}`)
        if (noteResult.ok && !!noteResult?.response?.data && Array.isArray(noteResult.response.data)) {
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
