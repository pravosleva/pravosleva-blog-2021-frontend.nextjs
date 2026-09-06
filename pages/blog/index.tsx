import React from 'react'
import { Layout } from '~/components/Layout'
import { wrapper } from '~/store'
import { universalHttpClient } from '~/utils/universalHttpClient'
import { NCodeSamplesSpace } from '~/types'
import { ArticlesList } from '~/components/ArticlesList'
import { ErrorPage } from '~/components/ErrorPage'
import { slugMapping } from '~/constants/blog/slugMap'
import { TArticle } from '~/components/Article'
import Head from 'next/head'
import { getInitialPropsBase } from '~/utils/next/getInitialPropsBase'
import { setCommonStore } from '~/utils/next'
import { NextPageContext } from 'next'
import { Store } from 'redux'
// import fs from 'fs'
// import path from 'path'
// import matter from 'gray-matter'
// import { defaultBg } from '~/srv.utils/local-mdx/defaultBg'
import { IEnhancedArticle } from '~/srv.utils/local-mdx/readLocalMdx'
import { ISlugMappingItem } from '~/constants/blog/types'

type TPageService = {
  isOk: boolean;
  message?: string;
  response?: NCodeSamplesSpace.TNotesListResponse;
}

interface IBlogIndexProps {
  _pageService: TPageService
  list: IEnhancedArticle[] // Используем расширенный тип со свойством индикатора
}

export default function BlogIndex({ _pageService, list }: IBlogIndexProps) {
  if (!_pageService?.isOk) {
    return (
      <Layout>
        <ErrorPage message={_pageService?.message || 'ERR: No _pageService.message'} />
        <pre>{JSON.stringify({ _pageService }, null, 2)}</pre>
      </Layout>
    )
  }

  return (
    <>
      <Head>
        <title>Pravosleva | Blog</title>
        <meta name="description" content="Найдётся всё что не нашлось ранее, если оно действительно нужно" />

        {/* Facebook Meta Tags */}
        <meta property="og:url" content="https://pravosleva.pro" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:locale:alternate" content="be_BY" />
        <meta property="og:locale:alternate" content="kk_KZ" />
        <meta property="og:locale:alternate" content="tt_RU" />
        <meta property="og:locale:alternate" content="uk_UA" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:title" content="Blog" />
        <meta property="og:description" content="Найдётся всё что не нашлось ранее, если оно действительно нужно" />
        <meta property="og:image" content="https://pravosleva.pro" />
        <meta property="og:site_name" content="Pravo$leva" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="https://pravosleva.pro" />
        <meta property="twitter:domain" content="pravosleva.pro" />
        <meta property="twitter:url" content="https://pravosleva.pro" />
        <meta name="twitter:title" content="Blog" />
        <meta name="twitter:description" content="Найдётся всё что не нашлось ранее, если оно действительно нужно" />
        <meta name="twitter:image" content="https://pravosleva.pro" />

        <link href="/static/css/min/blog_sqt_[search_query_title].css" rel="stylesheet" />
        <link href="/static/css/min/blog_sqt_[search_query_title]-qrcode.react.css" rel="stylesheet" />
      </Head>
      <Layout>
        {/* Компонент ArticlesList внутри себя перебирает массив list. */}
        {/* Ниже я покажу, как внутри карточки отрендерить сам бейдж. */}
        <ArticlesList
          list={list}
          searchQueryTitle={{
            original: 'ALL',
            withoutSpaces: 'ALL',
            normalized: 'ALL',
          }}
          isBlogPage
        />
      </Layout>
    </>
  )
}

const typedSlugMapping = slugMapping as Record<string, ISlugMappingItem | undefined>

BlogIndex.getInitialProps = wrapper.getInitialPageProps(
  (store: Store) => async (ctx: NextPageContext): Promise<IBlogIndexProps> => {
    const baseProps = await getInitialPropsBase(ctx)
    const _pageService: TPageService = {
      isOk: false,
    }

    let list: IEnhancedArticle[] = []
    const isServer = typeof window === 'undefined'

    // Выполняем HTTP-запрос к нашему локальному Express-роутеру.
    // Наш роутер на бэкенде уже умеет сам подмешивать локальные файлы,
    // поэтому при успешной сети этот кейс отработает идеально и на сервере, и на клиенте.
    const apiUrl = '/express-next-api/code-samples-proxy/api/notes'
    const notesResult = await universalHttpClient.get<NCodeSamplesSpace.TNotesListResponse>(apiUrl)

    if (notesResult.ok && notesResult.response?.data) {
      _pageService.isOk = true
      _pageService.response = notesResult.response
      list = notesResult.response.data.map((n) => ({
        original: n.original,
        bg: typedSlugMapping[n.slug]?.bg,
        brief: typedSlugMapping[n.slug]?.brief as string,
        slug: n.slug,
      }))
    } else {
      // КЕЙС 2: API (сеть) недоступно или упало с ошибкой
      
      if (isServer) {
        // Мы на СЕРВЕРЕ (F5) — безопасно сканируем локальную директорию public/static/_article
        console.warn('[Blog Index Fallback] API недоступно. Запуск серверного сканирования через утилиту readLocalMdx...')
        
        try {
          const fs = require('fs')
          const path = require('path')

          // Динамический импорт утилиты: защищает браузер от попадания Node.js кода в клиентский чанк!
          const { readLocalMdx } = await import('~/srv.utils/local-mdx/readLocalMdx')

          const targetDir = path.join(process.cwd(), 'public', 'static', '_articles')

          if (fs.existsSync(targetDir)) {
            const files: string[] = fs.readdirSync(targetDir)
            const localArticles: IEnhancedArticle[] = []

            // Обходим файлы параллельно для максимального быстродействия
            await Promise.all(
              files.map(async (fileName) => {
                if (!fileName.endsWith('.mdx')) return
                const slug = fileName.replace(/\.mdx$/, '')
                
                // Переиспользуем общую утилиту
                const localArticle = await readLocalMdx(slug)
                if (localArticle) {
                  localArticles.push(localArticle)
                }
              })
            )

            if (localArticles.length > 0) {
              _pageService.isOk = true
              _pageService.message = 'Данные подгружены из локальной статической директории проекта (сетевое API недоступно).'
              // Сортируем: новые статьи вверху
              list = localArticles.sort(
                (a, b) => new Date(b.original.createdAt).getTime() - new Date(a.original.createdAt).getTime()
              )
            }
          }
        } catch (serverFallbackError) {
          console.error('[Blog Index Fallback] Ошибка серверного фолбека через утилиту:', serverFallbackError)
        }

        // Если и на диске ничего не нашли, выводим ошибку сети
        if (list.length === 0) {
          _pageService.isOk = false
          _pageService.message = `Ошибка сети, а папка со статическими статьями пуста: ${notesResult.message || 'Unknown API Error'}`
        }

      } else {
        // Мы на КЛИЕНТЕ (переход по ссылке) — браузер не может читать диск.
        // Чтобы не крашить страницу, отдаем пользователю понятную ошибку
        _pageService.isOk = false
        _pageService.message = `Не удалось обновить список статей при переходе: ${notesResult.message || 'Проверьте подключение к интернету'}`
      }
    }

    setCommonStore({ store, baseProps })

    return {
      _pageService,
      list,
    }
  }
)
