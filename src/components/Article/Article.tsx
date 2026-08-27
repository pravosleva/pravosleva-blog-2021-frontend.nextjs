import { useMemo, memo, useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic' // Импортируем утилиту динамических импортов Next.js
import ReactMarkdown from 'react-markdown'
import { getFormatedDate2 } from '~/utils/time-tools/timeConverter'
import { withTranslator } from '~/hocs/withTranslator'
import { baseRenderers } from '~/react-markdown-renderers'
import { TArticleComponentProps } from './types'
import gfm from 'remark-gfm'
import { GoHomeSection, BreadCrumbs, WebShareBtn, WebShareDesktopBtn } from '~/components'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import clsx from 'clsx'
import { useBaseStyles } from '~/mui/useBaseStyles'
import { getTagList } from '~/utils/string-tools/getTagList'
import { IRootState } from '~/store/IRootState'
import { useSelector } from 'react-redux'
import styles from './Article.module.scss'
// import { CollapsibleQuickNav } from '~/react-markdown-renderers/CollapsibleBox/CollapsibleQuickNav'
// import { HeadingsQuickNav, HeadingsQuickNavMobile } from '~/react-markdown-renderers/HeadingsQuickNav'
import { resetGalleryRegistry } from '~/store/reactive-engine/reactiveGalleryEngine';
import { ArticlesSearchDesktop } from '../ArticlesList/components'
import { useArticlesSearch } from '../ArticlesList/components/ArticlesSearch/useArticlesSearch'
import { StickyArticleHeaderComponent } from './StickyArticleHeader'
import { DesktopOnly, MobileOnly } from './render-utils'
// import { GlobalArticleLightbox } from '~/react-markdown-renderers/ImagesGalleryBox/ImagesGalleryBox2/GlobalArticleLightbox'
import Image from 'next/image' // 1. Импортируем оптимизатор картинок Next.js

/* =========================================================================
   РАЗГРУЗКА БАНДЛА СТРАНИЦЫ: Переводим тяжелые виджеты на ленивую загрузку (SSR: false).
   Браузер вообще не будет скачивать и парсить их JS-код при первой загрузке,
   что освободит Main Thread для мгновенной фиксации LCP и снизит TBT!
   ========================================================================= */
const DynamicCollapsibleQuickNav = dynamic(
  () => import('~/react-markdown-renderers/CollapsibleBox/CollapsibleQuickNav').then(m => m.CollapsibleQuickNav),
  { ssr: false }
)
const DynamicHeadingsQuickNav = dynamic(
  () => import('~/react-markdown-renderers/HeadingsQuickNav').then(m => m.HeadingsQuickNav),
  { ssr: false }
)
const DynamicHeadingsQuickNavMobile = dynamic(
  () => import('~/react-markdown-renderers/HeadingsQuickNav').then(m => m.HeadingsQuickNavMobile),
  { ssr: false }
)
const DynamicGlobalArticleLightbox = dynamic(
  () => import('~/react-markdown-renderers/ImagesGalleryBox/ImagesGalleryBox2/GlobalArticleLightbox').then(m => m.GlobalArticleLightbox),
  { ssr: false }
)

export const Article = withTranslator<TArticleComponentProps>(memo(({ t, currentLang, article }) => {
  const baseClasses = useBaseStyles()
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)

  /* =========================================================================
     ИСПРАВЛЕНО: Флаг отложенного монтирования для защиты от каскадного SSR-фриза
     ========================================================================= */
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true) // Сработает строго на клиенте после полной отрисовки первого экрана
  }, [])

  const { slug } = article
  const { isSearchPanelOpen } = useArticlesSearch()
  const tagList = useMemo(() => getTagList({ 
      originalMsgList: [clsx(article?.original?.title, article?.brief)] 
  }).sortedList, [article?.original?.title, article?.brief])
  const linkColor = useMemo(() => currentTheme === 'hard-gray' ? '#fff' : currentTheme === 'dark' ? '#FF9000': '#0162c8', [currentTheme])
  const MemoizedArticleMarkdown = useMemo(() => {
    return (
      <ReactMarkdown
        renderers={baseRenderers}
        // @ts-ignore
        plugins={[gfm, { singleTilde: false }]}
        children={article.original.description}
      />
    )
  }, [article.original.description])
  const bannerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    resetGalleryRegistry();
    return () => resetGalleryRegistry();
  }, [article.slug]);

  return (
    <>
      <StickyArticleHeaderComponent 
        currentTheme={currentTheme}
        linkColor={linkColor}
        article={article}
        bannerRef={bannerRef}
      />
      <DesktopOnly>
        <ArticlesSearchDesktop currentTheme={currentTheme} />
      </DesktopOnly>
      {isMounted && (
        <>
          <DynamicCollapsibleQuickNav pageLimit={5} />
          <DynamicHeadingsQuickNav currentTheme={currentTheme} levels={['h1', 'h2', 'h3', 'h4']} pageLimit={13} actualSlug={slug} />
          <DynamicHeadingsQuickNavMobile currentTheme={currentTheme} levels={['h1', 'h2', 'h3', 'h4']} pageLimit={10} actualSlug={slug} />
        </>
      )}
      {!!article ? (
        <>
          {/* Хлебные крошки */}
          <ResponsiveBlock isPaddedMobile isLimited>
            <BreadCrumbs
              t={t}
              legend={[
                { link: '/blog', labelCode: 'BLOG' },
                { labelCode: article.original.title, noTranslate: true }
              ]}
            />
          </ResponsiveBlock>

          {/* Главный широкоформатный баннер статьи */}
          {!!article.bg && (
            <ResponsiveBlock isLimitedForDesktop>
              <div ref={bannerRef} className={styles['external-article-wrapper']}>
                <article
                  className='article-wrapper'
                  style={{ position: 'relative', overflow: 'hidden', marginBottom: '50px' }} // Контекст позиционирования для layout="fill"
                >
                  {/* =========================================================================
                    ИСПРАВЛЕНО ДЛЯ NEXT 11 (ТИПЫ): Убран проп style. 
                    Обертка div гарантирует z-index: 0 без генерации ошибок компиляции!
                    ========================================================================= */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
                    <Image
                      src={article.bg?.src || '/static/img/blog/coming-soon-v3.jpg'}
                      alt={article.original.title}
                      layout="fill" // Адаптивное растягивание по спецификации Next.js 11
                      objectFit="cover" // Эквивалент background-size: cover
                      objectPosition="center" // Эквивалент background-position: center
                      priority // Критический preload-приоритет в <head> для разгона LCP
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    />
                  </div>

                  {/* Контент баннера поверх картинки (поднимаем z-index выше картинки) */}
                  <div
                    className={clsx(
                      'tiles-grid-item-in-article',
                      'white',
                      'article-wrapper__big-image-as-container'
                    )}
                    style={{ backdropFilter: 'grayscale(1)', position: 'relative', zIndex: 1 }}
                  >
                    <h1 className='article-page-title'>{article.original.title}</h1>
                    {article.brief && (
                      <div className='article-wrapper__big-image-as-container__brief'
                        style={{ fontSize: '0.8em', maxWidth: '550px' }}
                      >
                        <ReactMarkdown children={article.brief} />
                      </div>
                    )}
                    <small className={clsx("inactive", 'article-wrapper__big-image-as-container__date')}>
                      {!!article.original.createdAt ? getFormatedDate2(new Date(article.original.createdAt)) : 'No date'}
                    </small>
                  </div>
                </article>
              </div>
            </ResponsiveBlock>
          )}

          {/* Тело статьи */}
          <ResponsiveBlock isLimited isPaddedMobile>
            <div className={clsx("article-body", baseClasses.customizableListingWrapper)}>
              {!!article.original.description ? <div className="description-markdown">{MemoizedArticleMarkdown}</div> : 'No body'}
            </div>
          </ResponsiveBlock>
          {tagList.length > 0 && (
            <ResponsiveBlock isLimited isPaddedMobile style={{ paddingTop: '1.45rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {tagList.map((tag) => (
                  <a
                    className={clsx('truncate')}
                    style={{ whiteSpace: 'pre', color: linkColor, WebkitTapHighlightColor: 'transparent' }}
                    key={tag}
                    href={`/blog/q/${tag.substring(1)}`}
                  >
                    <span style={{ whiteSpace: 'pre' }} className='truncate'>{tag}</span>
                  </a>
                ))}
              </div>
            </ResponsiveBlock>
          )}
          {!!article.slug && (
            <>
              <DesktopOnly>
                <WebShareDesktopBtn
                  url={`https://pravosleva.pro/p/${article.slug}`}
                  title={article.original.title} 
                  isSearchPanelOpen={isSearchPanelOpen}
                />
              </DesktopOnly>
              <MobileOnly
                style={{
                  margin: '1.45rem 0px 0px 0px', paddingLeft: '16px',
                  position: 'sticky', bottom: '76px', zIndex: 10, width: 'fit-content',
                }}
              >
                <div
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 7px -1px', padding: '8px', borderRadius: '24px', width: 'fit-content' }}
                  className={clsx({ 'backdrop-blur--lite': true })}
                >
                  <WebShareBtn url={`https://pravosleva.pro/p/${article.slug}`} title={article.original.title} text={clsx('Pravo$leva', '|', article.brief)} />
                </div>
              </MobileOnly>
            </>
          )}
          <ResponsiveBlock
            isLimited
            style={{ paddingTop: '50px', paddingBottom: '50px' }}
            isPaddedMobile
          >
            <GoHomeSection t={t} currentLang={currentLang} />
          </ResponsiveBlock>
        </>
      ) : null}
      {isMounted && <DynamicGlobalArticleLightbox />}
    </>
  )
}))
