import React from 'react'
import { Article, TArticle, TPageService } from '~/components/Article'
import { universalHttpClient } from '~/utils/universalHttpClient'
import Head from 'next/head'
import { Layout } from '~/components/Layout'
import { wrapper } from '~/store'
// import { slugMapping } from '~/constants/blog/slugMap'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { setTitle } from '~/store/reducers/pageMeta'
import { getInitialPropsBase, setCommonStore } from '~/utils/next'
import { NextPageContext } from 'next'
import { Store } from 'redux'
import { NCodeSamplesSpace } from '~/types'
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer'
import { ContentLockedSvg } from '~/components/special-svg-content/error/ContentLockedSvg'
import { AuthorizationRequired401Svg } from '~/components/special-svg-content/error/AuthorizationRequired401Svg'

// Строгое описание пропсов, приходящих в компонент страницы
interface IBlogArticleSlugProps {
  _pageService: TPageService;
  article: TArticle | null;
  statusCode?: number; // НОВОЕ: Проп для проброса HTTP-статуса в UI слой
}

const defaultBg = {
  src: '/static/img/blog/dog.webp',
  size: { w: 896, h: 1344 },
  type: 'image/webp'
}

const BlogArticleSlug = ({ _pageService, article, statusCode }: IBlogArticleSlugProps) => {
  const { title } = useSelector((state: IRootState) => state.pageMeta)

  // =========================================================================
  // 🔥 РАСШИРЕННЫЙ ЗАЩИТНЫЙ БАРЬЕР UI-СЛОЯ ОШИБОК
  // =========================================================================
  
  // КЕЙС 1: Если бэкенд или проверка прав выкинули статус 401 (Unauthorized)
  if (statusCode === 401) {
    return (
      <Layout>
        <UniversalContainer isForLayout={true} hasBreadcrumbs={true}>
          <AuthorizationRequired401Svg message={_pageService?.message} />
        </UniversalContainer>
      </Layout>
    )
  }

  // КЕЙС 2: Стандартная ошибка отсутствия статьи или закрытия на редактирование (500/404)
  if (!_pageService?.isOk || !article) {
    return (
      <Layout>
        <UniversalContainer isForLayout={true} hasBreadcrumbs={true}>
          <ContentLockedSvg message={_pageService?.message} />
        </UniversalContainer>
      </Layout>
    )
  }

  const canonicalUrl = `${process.env.NEXT_SEO}/p/${article.slug}`
  const __defaultDescr = 'Найдётся всё что не нашлось ранее, если оно действительно нужно'
  const defaultLogoUrl = `${process.env.NEXT_SEO}/static/img/logo/logo-pravosлева.jpg`  
  const customMeta: NCodeSamplesSpace.TNote['meta'] = article.original?.meta || undefined
  
  const nameMeta = {
    description: customMeta?.description || article.brief || __defaultDescr,
    "twitter:domain": "pravosleva.pro",
    "twitter:url": canonicalUrl,
    "twitter:title": customMeta?.["og:title"] || article.original?.title || title,
    "twitter:description": customMeta?.["og:description"] || article.brief || __defaultDescr,
    "twitter:card": article.bg ? "summary_large_image" : "summary",
    "twitter:image": article.bg?.src || defaultLogoUrl,
  }

  const propertyMeta = {
    "og:type": customMeta?.["og:type"] || "website",
    "og:title": customMeta?.["og:title"] || article.original?.title || title,
    "og:description": customMeta?.["og:description"] || article.brief || __defaultDescr,
    "og:url": canonicalUrl,
    "og:site_name": "PravoSleva | Blog",
    "og:locale": customMeta?.["og:locale"] || 'ru_RU',
    "og:locale:alternate": customMeta?.["og:locale:alternate"] || undefined,
    "profile:first_name": customMeta?.["profile:first_name"] || undefined,
    "profile:last_name": customMeta?.["profile:last_name"] || undefined,
    "profile:username": customMeta?.["profile:username"] || undefined,
    "article:section": article.original?.category || undefined,
    "article:publisher": process.env.NEXT_SEO,

    "og:image": article.bg?.src || defaultLogoUrl,
    "og:image:secure_url": article.bg?.src || defaultLogoUrl,
    "og:image:width": !!article.bg?.size.w ? String(article.bg.size.w) : undefined,
    "og:image:height": !!article.bg?.size.h ? String(article.bg.size.h) : undefined,
    "og:image:type": !!article.bg?.type ? String(article.bg.type) : undefined,
    "og:image:alt": 'img',
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={article.brief || 'Найдётся всё что не нашлось ранее, если оно действительно нужно'} />
        <link rel="canonical" href={canonicalUrl} />

        {Object.entries(nameMeta).map(([key, value]) => {
          if (!value) return null
          return <meta key={key} name={key} content={String(value)} />
        })}

        {Object.entries(propertyMeta).map(([key, value]) => {
          if (!value) return null
          return <meta key={key} property={key} content={String(value)} />
        })}
      </Head>
      <Layout>
        <Article _pageService={_pageService} article={article} />
      </Layout>
    </>
  )
}

BlogArticleSlug.getInitialProps = wrapper.getInitialPageProps(
  (store: Store) => async (ctx: NextPageContext): Promise<IBlogArticleSlugProps> => {
    const rawNoteId = ctx.query?.note_id
    const note_id = typeof rawNoteId === 'string' ? rawNoteId : ''

    const _pageService: TPageService = { isOk: false }
    let article: TArticle | null = null
    let statusCode = 200 // По умолчанию всё хорошо

    if (!note_id) {
      _pageService.isOk = false
      _pageService.message = 'Идентификатор заметки пуст или невалиден'
    } else {
      const noteResult = await universalHttpClient.get<NCodeSamplesSpace.TLocalNoteResponse>(`/express-next-api/code-samples-proxy/api/notes/${note_id}`)
      
      try {
        if (!noteResult?.ok) {
          throw new Error('getInitialProps: Не удалось получить статью. Возможно, автор закрыл ее на редактирование, либо ее не существует')
        }
        
        if (noteResult?.response) {
          const noteData = noteResult.response.data;

          // =========================================================================
          // 🛡️ РУБЕЖ ПРОВЕРКИ ПРИВАТНОСТИ БЭКЕНДА
          // =========================================================================
          if (noteData.isPrivate) {
            // Жёстко выставляем HTTP статус 401 на уровне Node.js сервера (для SEO краулеров)
            if (ctx.res) {
              ctx.res.statusCode = 401;
            }
            statusCode = 401;
            throw new Error('У вас нет прав для просмотра этой приватной заметки. Требуется авторизация.')
          }

          store.dispatch(setTitle(noteData.title || 'Без названия'))

          _pageService.isOk = true
          _pageService.response = noteResult.response
          article = {
            original: { ...noteData },
            slug: note_id,
            brief: noteData.brief || 'DRAFT',
            bg: noteData.bg || defaultBg,
          }
        } else {
          throw new Error('Неизвестный кейс (ответ получен, но невалидный)')
        }
      } catch (err: unknown) {
        const error = err as Error
        _pageService.isOk = false
        _pageService.response = noteResult?.response
        _pageService.message = error?.message || 'Unknown error occurred'
        
        // Если это не наша явная 401 ошибка, проставляем стандартный сбой
        if (statusCode !== 401) {
          statusCode = 500;
        }
      }
    }

    const baseProps = await getInitialPropsBase(ctx)
    setCommonStore({ store, baseProps })

    return {
      _pageService,
      article,
      statusCode, // Пробрасываем статус-код в React-компонент
    }
  }
)

export default BlogArticleSlug
