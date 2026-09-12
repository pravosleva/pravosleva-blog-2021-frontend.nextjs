import React from 'react'
import { Article, TArticle, TPageService } from '~/components/Article'
import { universalHttpClient } from '~/utils/universalHttpClient'
import Head from 'next/head'
import { ErrorPage } from '~/components/ErrorPage'
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

// Строгое описание пропсов, приходящих в компонент страницы
interface IBlogArticleSlugProps {
  _pageService: TPageService;
  article: TArticle | null;
}

const defaultBg = {
  src: '/static/img/blog/dog.webp',
  size: { w: 896, h: 1344 },
  type: 'image/webp'
}

const BlogArticleSlug = ({ _pageService, article }: IBlogArticleSlugProps) => {
  const { title } = useSelector((state: IRootState) => state.pageMeta)

  // Оптимизация 1: Защитный барьер. Если статья не найдена или упала с ошибкой,
  // мы прерываем выполнение до того, как Head попытается прочитать свойства из null.
  if (!_pageService?.isOk || !article) {
    return (
      <Layout>
        <ErrorPage message={_pageService?.message || 'ERR: No _pageService.message'}>
          <pre>{JSON.stringify({ _pageService, article }, null, 2)}</pre>
        </ErrorPage>
      </Layout>
    )
  }

  const canonicalUrl = `${process.env.NEXT_SEO}/p/${article.slug}`
  const __defaultDescr = 'Найдётся всё что не нашлось ранее, если оно действительно нужно'
  // Константа дефолтного логотипа (ИСПРАВЛЕНО: добавлен разделительный слэш между доменом и статикой)
  const defaultLogoUrl = `${process.env.NEXT_SEO}/static/img/logo/logo-pravosleva.jpg`  
  // Читаем переопределенные мета-данные из front-matter шапки статьи
  const customMeta: NCodeSamplesSpace.TNote['meta'] = article.original?.meta || undefined
  // 1. Мета-теги, использующие атрибут "name"
  const nameMeta = {
    description: customMeta?.description || article.brief || __defaultDescr,
    "twitter:domain": "pravosleva.pro",
    "twitter:url": canonicalUrl,
    "twitter:title": customMeta?.["og:title"] || article.original?.title || title,
    "twitter:description": customMeta?.["og:description"] || article.brief || __defaultDescr,
    "twitter:card": article.bg ? "summary_large_image" : "summary",
    "twitter:image": article.bg?.src || defaultLogoUrl,
  }

  // 2. Мета-теги, использующие атрибут "property" (Open Graph / Спецификация Профилей)
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

        {/* --- Open Graph / Facebook Meta Tags --- */}
        <link rel="canonical" href={canonicalUrl} />

        {/* --- Рендеринг стандартных тегов (атрибут name) --- */}
        {Object.entries(nameMeta).map(([key, value]) => {
          if (!value) return null
          return <meta key={key} name={key} content={String(value)} />
        })}

        {/* --- Рендеринг Open Graph тегов (атрибут property) --- */}
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
    // Оптимизация 2: Превращаем непредсказуемый query-параметр в чистую строку
    const note_id = typeof rawNoteId === 'string' ? rawNoteId : ''

    const _pageService: TPageService = { isOk: false }
    let article: TArticle | null = null

    // Приведение карты slugMapping к безопасному индексному типу Record
    // const typedSlugMapping = slugMapping as Record<string, ISlugMappingItem | undefined>
    // const matchedMapping = note_id ? typedSlugMapping[note_id] : undefined
    
    // NOTE: Прямой поиск статьи по её системному ID из URL
    // See also: GET https://pravosleva.ru/express-next-api/code-samples-proxy/api/notes/instructions.local
    if (!note_id) {
      _pageService.isOk = false
      _pageService.message = 'Идентификатор заметки пуст или невалиден'
    } else {
      const noteResult = await universalHttpClient.get<NCodeSamplesSpace.TLocalNoteResponse>(`/express-next-api/code-samples-proxy/api/notes/${note_id}`)
      try {
        if (!noteResult?.ok) {
          throw new Error([
            'getInitialProps: Не удалось получить статью. Возможно, автор закрыл ее на редактирование, либо ее не существует'
          ].join('; '))
        }
        if (noteResult?.response) {
          // if (!noteResult.response.data.isPrivate) {
          store.dispatch(setTitle(noteResult.response.data.title || 'Без названия'))

          _pageService.isOk = true
          _pageService.response = noteResult.response
          article = {
            original: { ...noteResult.response.data },
            slug: note_id,
            brief: noteResult.response.data.brief || 'DRAFT',
            bg: noteResult.response.data.bg || defaultBg,
          }
          // } else {
          //   throw new Error(`Неизвестный кейс (ответ получен, но не соответствует ожидаемым стандартам - isPrivate is ${String(noteResult.response.data.isPrivate)})`)
          // }
        } else {
          throw new Error('Неизвестный кейс (ответ получен, но невалидный)')
        }
      } catch (err: unknown) {
        const error = err as Error
        _pageService.isOk = false
        _pageService.response = noteResult?.response
        _pageService.message = error?.message || 'Unknown error occurred'
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

export default BlogArticleSlug
