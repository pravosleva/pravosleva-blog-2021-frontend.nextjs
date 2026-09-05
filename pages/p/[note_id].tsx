import React from 'react'
import { Article, TArticle, TPageService } from '~/components/Article'
import { universalHttpClient } from '~/utils/universalHttpClient'
import Head from 'next/head'
import { ErrorPage } from '~/components/ErrorPage'
import { Layout } from '~/components/Layout'
import { wrapper } from '~/store'
import { slugMapping } from '~/constants/blog/slugMap'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { setTitle } from '~/store/reducers/pageMeta'
import { getInitialPropsBase, setCommonStore } from '~/utils/next'
import { NextPageContext } from 'next'
import { Store } from 'redux'
import path from 'path'
import { defaultBg } from '~/srv.utils/local-mdx/defaultBg'

interface ISlugMappingItem {
  id: string | number;
  brief?: string;
  bg?: {
    src: string;
    size: { w: number; h: number };
    type: string;
  };
}

interface IBlogArticleSlugProps {
  _pageService: TPageService;
  article: TArticle | null;
}

const readLocalMdx = async (slug: string): Promise<TArticle | null> => {
  if (typeof window !== 'undefined') return null;

  try {
    const fs = require('fs');
    const matter = require('gray-matter');

    const articlesDirectory = path.join(process.cwd(), '_articles');
    const filePath = path.join(articlesDirectory, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    console.log(`[MDX Fallback] Прочитана локальная статья: ${slug}`);

    return {
      original: {
        _id: slug,
        title: data.title || 'Без названия (Локальный файл)',
        description: content,
        isPrivate: false,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        priority: data.priority || 0
      },
      slug: slug,
      brief: data.brief || 'Локальная копия статьи',
      bg: data.bg_src ? {
        src: data.bg_src,
        size: data.bg_size || { w: 896, h: 1344 },
        type: data.bg_type || 'image/webp'
      } : defaultBg,
    };
  } catch (error) {
    console.error(`[MDX Fallback] Ошибка чтения файла ${slug}:`, error);
    return null;
  }
};

export default function BlogArticleSlug({ _pageService, article }: IBlogArticleSlugProps) {
  const { title } = useSelector((state: IRootState) => state.pageMeta)

  if (!_pageService?.isOk || !article) {
    return (
      <Layout>
        <ErrorPage message={_pageService?.message || 'ERR: No _pageService.message'}>
          <pre>{JSON.stringify({ _pageService, article }, null, 2)}</pre>
        </ErrorPage>
      </Layout>
    )
  }

  const thisPageUrl = `https://pravosleva.pro{article.slug}`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={article.brief || 'Найдётся всё что не нашлось ранее, если оно действительно нужно'} />

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

        <meta property="og:description" content={article.brief || ''} />
        {article.bg ? (
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
            <meta property="og:image" content="https://pravosleva.pro" />
            <meta property="og:image:secure_url" content="https://pravosleva.pro" />
          </>
        )}

        <meta property="og:site_name" content="Pravo$leva // Blog" />

        <meta property="twitter:domain" content="pravosleva.pro" />
        <meta property="twitter:url" content={thisPageUrl} />
        <meta name="twitter:title" content={article.original.title} />
        <meta name="twitter:description" content={article.brief || ''} />
        {article.bg ? (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={article.bg.src} />
          </>
        ) : (
          <>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:image" content="https://pravosleva.pro" />
          </>
        )}
      </Head>
      <Layout>
        {/* Передаем пропсы безопасно, подстраиваясь под мемоизацию компонента */}
        <Article _pageService={_pageService} article={article} />
      </Layout>
    </>
  )
}

BlogArticleSlug.getInitialProps = wrapper.getInitialPageProps(
  (store: Store) => async (ctx: NextPageContext): Promise<IBlogArticleSlugProps> => {
    const rawNoteId = ctx.query?.note_id
    const note_id = typeof rawNoteId === 'string' ? rawNoteId : ''

    const _pageService: TPageService = {
      isOk: false,
      modifiedArticle: null,
    }
    let article: TArticle | null = null

    // 1. ПРИОРИТЕТ: Ищем сначала локальный .mdx файл
    if (note_id) {
      const localArticle = await readLocalMdx(note_id);
      if (localArticle) {
        store.dispatch(setTitle(localArticle.original.title));
        _pageService.isOk = true;
        
        const basePropsFallback = await getInitialPropsBase(ctx);
        setCommonStore({ store, baseProps: basePropsFallback });
        
        return {
          _pageService,
          article: localArticle,
        };
      }
    }

    const typedSlugMapping = slugMapping as Record<string, ISlugMappingItem | undefined>
    const matchedMapping = note_id ? typedSlugMapping[note_id] : undefined

    if (matchedMapping) {
      // КЕЙС А: Статья из маппинга
      const noteResult = await universalHttpClient.get(`/express-next-api/code-samples-proxy/api/notes/${matchedMapping.id}`)
      
      if (noteResult.ok && noteResult.response?.data) {
        store.dispatch(setTitle(noteResult.response.data.title || 'Без названия'))

        _pageService.isOk = true
        _pageService.response = noteResult.response
        article = {
          original: { ...noteResult.response.data },
          slug: note_id,
          brief: matchedMapping.brief || '',
          bg: matchedMapping.bg || defaultBg,
        }
      } else {
        _pageService.isOk = false
        _pageService.response = noteResult?.response || null
        _pageService.message = 'Скорее всего, автор закрыл статью на редактирование'
      }
    } else {
      // КЕЙС Б: Статья по прямому системному ID в URL
      if (!note_id) {
        _pageService.isOk = false
        _pageService.message = 'Идентификатор заметки пуст или невалиден'
      } else {
        // ИСПРАВЛЕН Баг пути: теперь строго /express-next-api/...
        const noteResult = await universalHttpClient.get(`/express-next-api/code-samples-proxy/api/notes/${note_id}`)
        
        try {
          if (!noteResult.ok) {
            throw new Error('Не удалось получить статью с удаленного API. Локальной копии также не найдено.')
          }
          
          if (noteResult.response) {
            if (!noteResult.response.isPrivate) {
              store.dispatch(setTitle(noteResult.response.data?.title || 'Без названия'))

              _pageService.isOk = true
              _pageService.response = noteResult.response
              article = {
                original: { ...noteResult.response.data },
                slug: note_id,
                brief: 'DRAFT',
                bg: defaultBg,
              }
            } else {
              throw new Error(`Неизвестный кейс (ответ получен, но не соответствует ожидаемым стандартам - isPrivate is ${String(noteResult.response.isPrivate)})`)
            }
          } else {
            throw new Error('Неизвестный кейс (ответ получен, но невалидный)')
          }
        } catch (err: unknown) {
          const error = err as Error
          _pageService.isOk = false
          _pageService.response = noteResult?.response || null
          _pageService.message = error?.message || 'Unknown error occurred'
        }
      }
    }

    const baseProps = await getInitialPropsBase(ctx)
    setCommonStore({ store, baseProps })

    return {
      _pageService,
      article,
    }
  }
)
