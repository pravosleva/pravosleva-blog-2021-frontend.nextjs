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
// import path from 'path'
import { defaultBg } from '~/srv.utils/local-mdx/defaultBg'
import { IEnhancedArticle, readLocalMdx } from '~/srv.utils/local-mdx/readLocalMdx'
import { NCodeSamplesSpace } from '~/types'
import { ISlugMappingItem } from '~/constants/blog/types'

interface IBlogArticleSlugProps {
  _pageService: TPageService;
  article: TArticle | null;
}

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
    console.log('[getInitialProps] Текущий query:', ctx.query)
    
    const rawNoteId = ctx.query?.note_id
    const note_id = typeof rawNoteId === 'string' ? rawNoteId : ''

    const _pageService: TPageService = {
      isOk: false,
      modifiedArticle: null,
    }
    let article: IEnhancedArticle | null = null

    // ИСПРАВЛЕНИЕ ПРИЧИНЫ 2: Защита от двойного триггера при пустом клиентском роуте.
    // Если Next.js еще не распарсил URL, мы мгновенно возвращаем пустой стейт,
    // предотвращая отправку холостых запросов к бэкенду.
    if (!note_id) {
      _pageService.isOk = false
      _pageService.message = 'Идентификатор статьи пуст (ожидание инициализации роутера)'
      return { _pageService, article: null }
    }

    const isServer = typeof window === 'undefined'
    const apiUrl = `/express-next-api/code-samples-proxy/api/notes/${note_id}`

    if (isServer) {
      // --- СЕРВЕРНЫЙ РЕНДЕРИНГ (SSR / F5) ---
      console.log('[getInitialProps] Выполнение на СЕРВЕРЕ')
      
      const localArticle = await readLocalMdx(note_id)
      if (localArticle) {
        store.dispatch(setTitle(localArticle.original.title))
        _pageService.isOk = true
        
        const basePropsFallback = await getInitialPropsBase(ctx)
        setCommonStore({ store, baseProps: basePropsFallback })
        
        return {
          _pageService,
          article: localArticle,
        }
      }

      // Если локального файла нет — делаем ОДИН запрос к нашему Express-прокси
      const noteResult = await universalHttpClient.get<NCodeSamplesSpace.TSingleNoteResponse>(apiUrl)

      console.log(noteResult)
      
      const typedSlugMapping = slugMapping as Record<string, ISlugMappingItem | undefined>
      const matchedMapping = typedSlugMapping[note_id]

      if (noteResult.ok && noteResult.response?.data) {
        store.dispatch(setTitle(noteResult.response.data.original.title || 'Без названия'))
        _pageService.isOk = true
        _pageService.response = noteResult.response
        
        article = matchedMapping 
          ? {
              original: noteResult.response.data.original,
              slug: note_id,
              brief: matchedMapping.brief || '',
              bg: matchedMapping.bg || defaultBg,
            }
          : noteResult.response.data
      } else {
        _pageService.isOk = false
        _pageService.response = noteResult?.response?.data ? { data: noteResult.response.data, success: false } : undefined
        _pageService.message = matchedMapping 
          ? 'Локальной копии не найдено; Из БД не получено: Возможно, автор закрыл статью на редактирование'
          : 'Доселе не публикованная статья. Возможно всего, автор закрыл статью на редактирование'
      }

    } else {
      // --- КЛИЕНТСКИЙ ПЕРЕХОД (SPA / Next Link) ---
      console.log('[getInitialProps] Выполнение на КЛИЕНТЕ')
      
      // ИСПРАВЛЕНИЕ ПРИЧИНЫ 1: Делаем ровно один запрос, используя созданную ранее константу apiUrl
      const noteResult = await universalHttpClient.get<NCodeSamplesSpace.TSingleNoteResponse>(apiUrl)
      
      try {
        if (!noteResult.ok) {
          throw new Error('Не удалось получить статью с удаленного API.')
        }
        
        if (noteResult.response?.data?.original) {
          const originalNote = noteResult.response.data.original
          
          if (!originalNote.isPrivate) {
            store.dispatch(setTitle(originalNote.title || 'Без названия'))
            _pageService.isOk = true
            _pageService.response = noteResult.response

            const typedSlugMapping = slugMapping as Record<string, ISlugMappingItem | undefined>
            const matchedMapping = typedSlugMapping[note_id]

            article = {
              original: originalNote,
              slug: note_id,
              brief: matchedMapping?.brief || 'DRAFT',
              bg: matchedMapping?.bg || defaultBg,
            }
          } else {
            throw new Error(`Неизвестный кейс (статья приватная - isPrivate is ${String(originalNote.isPrivate)})`)
          }
        } else {
          throw new Error('Неизвестный кейс (ответ получен, но структура невалидна)')
        }
      } catch (err: unknown) {
        const error = err as Error
        _pageService.isOk = false
        _pageService.response = noteResult?.response || undefined
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
