import { TArticle, TPageService } from '~/components/Article'
import { universalHttpClient } from '~/utils/universalHttpClient';
import Head from 'next/head'
// import { convertToPlainText } from '~/utils/markdown/convertToPlainText';
import { ErrorPage } from '~/components/ErrorPage';
import { Layout } from '~/components/Layout';
import { wrapper } from '~/store'
import { ArticlesList } from '~/components/ArticlesList'
import { slugMap, slugMapping } from '~/constants/blog/slugMap'
import { NCodeSamplesSpace } from '~/types'
import { addSQT } from '~/store/reducers/siteSearch'
import { getInitialPropsBase, setCommonStore } from '~/utils/next'
import path from 'path'
import { IEnhancedArticle } from '~/srv.utils/local-mdx/readLocalMdx';
import { ISlugMappingItem } from '~/constants/blog/types';

type TPageProps = {
  // _pageService: TPageService;
  list: IEnhancedArticle[];
  searchQueryTitle: {
    original: string;
    withoutSpaces: string;
    normalized: string;
  },
}

// Функция сканирует папку _articles и ищет совпадения по тексту
const searchLocalMdx = async (queryText: string): Promise<IEnhancedArticle[]> => {
  if (typeof window !== 'undefined') return [];
  
  try {
    const fs = require('fs');
    const matter = require('gray-matter');
    
    const articlesDirectory = path.join(process.cwd(), 'public/static/_articles');
    
    if (!fs.existsSync(articlesDirectory)) return [];
    
    const files: string[] = fs.readdirSync(articlesDirectory);
    const matchedNotes: IEnhancedArticle[] = [];
    
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
          slug,
          brief: 'DRAFT',
          original: {
            _id: slug,
            title: data.title || slug,
            description: content,
            isPrivate: false,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            priority: data.priority || 0
          }
        });
      }
    });
    
    return matchedNotes;
  } catch (error) {
    console.error('[MDX Search] Ошибка локального поиска:', error);
    return [];
  }
};

const typedSlugMapping = slugMapping as Record<string, ISlugMappingItem | undefined>

const BlogQST = ({ list, searchQueryTitle }: TPageProps) => {
  // if (!_pageService?.isOk) return (
  //   <Layout>
  //     <ErrorPage
  //       message={_pageService?.message || 'ERR: No _pageService.message'}
  //     >
  //       <pre>{JSON.stringify({ _pageService, list }, null, 2)}</pre>
  //     </ErrorPage>
  //   </Layout>
  // )

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
        {
          list.length > 0 ? (
            <ArticlesList
              // _pageService={_pageService}
              list={list}
              searchQueryTitle={searchQueryTitle}
            />
          ) : (
            <b>Не найдено</b>
          )
        }
      </Layout>
    </>
  )
}

BlogQST.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => async (ctx: NextPageContext) => {
    const { query: { search_query_title } } = ctx
    const _pageService: { isOk: boolean; message?: string } = {
      isOk: false,
    }

    let list: IEnhancedArticle[] = []
    const isServer = typeof window === 'undefined'

    // const apiUrl = '/express-next-api/code-samples-proxy/api/notes'
    

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

    let remoteData: IEnhancedArticle[] = [];
    let localData: IEnhancedArticle[] = [];

    // 1. Пробуем искать в сети
    // const noteResult = await universalHttpClient.get<NCodeSamplesSpace.TNotesListResponse>(`/express-next-api/code-samples-proxy/api/notes?q_title_all_words=${encodeURIComponent(withoutSpaces)}`);
    const notesResult = await universalHttpClient.get<NCodeSamplesSpace.TNotesListResponse>(`/express-next-api/code-samples-proxy/api/notes?q_title_all_words=${encodeURIComponent(withoutSpaces)}`)
    if (notesResult.ok && !!notesResult.response?.data && Array.isArray(notesResult.response.data)) {
      remoteData = notesResult.response.data;
    }

    if (notesResult.ok && notesResult.response?.data) {
      _pageService.isOk = true
      list = notesResult.response.data
    } else {
      if (isServer) {
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
          const isDuplicate = combinedData.some(remoteNote => remoteNote.original._id === localNote.original._id);
          if (!isDuplicate) {
            combinedData.push(localNote);
          }
        });

        // 4. Маппим объединенный список в TArticle[] для сетки PagesGrid
        list = combinedData
        // --
      } else {
        _pageService.isOk = false
        _pageService.message = 'Not today, bro'
      }
    }

    switch (true) {
      case !!withoutSpaces: {
        store.dispatch(addSQT({
          original: search_query_title,
          withoutSpaces,
          normalized,
        }))
        const notesResult = await universalHttpClient.get<NCodeSamplesSpace.TNotesListResponse>(`/express-next-api/code-samples-proxy/api/notes?q_title_all_words=${encodeURIComponent(withoutSpaces)}`)
        if (notesResult.ok && !!notesResult?.response?.data && Array.isArray(notesResult.response.data)) {
          _pageService.isOk = true
          list = notesResult.response.data.map((n) => ({
            original: n.original,
            bg: typedSlugMapping[n.slug]?.bg,
            brief: typedSlugMapping[n.slug]?.brief as string,
            slug: n.slug,
          }))
        } else {
          _pageService.isOk = false
          _pageService.message = notesResult?.message || 'No notesResult?.response?.message'
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
