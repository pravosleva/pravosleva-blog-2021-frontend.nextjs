import { useMemo, memo, useRef } from 'react'
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
import { CollapsibleQuickNav } from '~/react-markdown-renderers/CollapsibleBox/CollapsibleQuickNav'
import { HeadingsQuickNav, HeadingsQuickNavMobile } from '~/react-markdown-renderers/HeadingsQuickNav'
import { ArticlesSearchDesktop } from '../ArticlesList/components'
import { useArticlesSearch } from '../ArticlesList/components/ArticlesSearch/useArticlesSearch'
import { StickyArticleHeaderComponent } from './StickyArticleHeader'
import { DesktopOnly, MobileOnly } from './render-utils'

export const Article = withTranslator<TArticleComponentProps>(memo(({ t, currentLang, article }) => {
  const baseClasses = useBaseStyles()
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const { slug } = article
  const { isSearchPanelOpen } = useArticlesSearch() // Глобальный реактивный стейт шторки

  // 1. Оптимизация тегов: собираем список один раз при изменении статьи
  const tagList = useMemo(() => {
    return getTagList({ 
      originalMsgList: [clsx(article?.original?.title, article?.brief)] 
    }).sortedList
  }, [article?.original?.title, article?.brief])

  // Динамический расчет цвета ссылок под тему
  const linkColor = useMemo(() => {
    return currentTheme === 'hard-gray'
      ? '#fff'
      : currentTheme === 'dark'
        ? '#FF9000' 
        : '#0162c8'
  }, [currentTheme])

  // Реф для отслеживания положения главного баннера
  const bannerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* 
        СЖАТАЯ КОПИЯ ЗАГОЛОВКА (Показывается только на десктопе при скролле): Рендерим изолированную шапку и передаем ей реф.
        Теперь при скролле обновляется ТОЛЬКО этот изолированный компонент,
        а ReactMarkdown ниже остается неподвижным и не ререндерится!
      */}
      <StickyArticleHeaderComponent 
        currentTheme={currentTheme}
        linkColor={linkColor}
        article={article}
        bannerRef={bannerRef}
      />

      {/* 
        Универсальный поиск по сайту.
        ИСПРАВЛЕНО: Убрали typeof window. Хук isDesktop гарантирует, 
        что код выполнится только на клиенте и не сломает гидратацию Next.js.
      */}
      <DesktopOnly>
        <ArticlesSearchDesktop currentTheme={currentTheme} />
      </DesktopOnly>
      
      {/* Правая панель экстренных блоков */}
      <CollapsibleQuickNav pageLimit={5} />
      
      {/* Левая панель содержания (десктоп) */}
      <HeadingsQuickNav currentTheme={currentTheme} levels={['h1', 'h2', 'h3', 'h4']} pageLimit={13} actualSlug={slug} />
      
      {/* Мобильная шторка содержания (автоматически < 800px) */}
      <HeadingsQuickNavMobile currentTheme={currentTheme} levels={['h1', 'h2', 'h3', 'h4']} pageLimit={10} actualSlug={slug} />

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
                  style={{
                    background: `url(${article.bg?.src || '/static/img/blog/coming-soon-v3.jpg'})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div
                    className={clsx(
                      'tiles-grid-item-in-article',
                      'white',
                      'article-wrapper__big-image-as-container'
                    )}
                    style={{ backdropFilter: 'grayscale(1)' }}
                  >
                    <h1 className='article-page-title'>
                      {article.original.title}
                    </h1>
                    {article.brief && (
                      <div
                        className='article-wrapper__big-image-as-container__brief'
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

          {/* 
            Тело статьи (Текст в формате Markdown)
            ИСПРАВЛЕНО: Убран деструктивный useMemo. Теперь при смене темы 
            оформление кода и блоков контента мгновенно и корректно перерисовывается.
          */}
          <ResponsiveBlock isLimited isPaddedMobile>
            <div className={clsx("article-body", baseClasses.customizableListingWrapper)}>
              {!!article.original.description ? (
                <div className="description-markdown">
                  <ReactMarkdown
                    renderers={baseRenderers}
                    // @ts-ignore
                    plugins={[gfm, { singleTilde: false }]}
                    children={article.original.description}
                  />
                </div>
              ) : (
                'No body'
              )}
            </div>
          </ResponsiveBlock>

          {/* Облако тегов внизу статьи */}
          {tagList.length > 0 && (
            <ResponsiveBlock isLimited isPaddedMobile style={{ paddingTop: '16px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {tagList.map((tag) => (
                  <a
                    className={clsx('truncate')}
                    style={{
                      whiteSpace: 'pre',
                      color: linkColor,
                      WebkitTapHighlightColor: 'transparent',
                    }}
                    key={tag}
                    href={`/blog/q/${tag.substring(1)}`}
                  >
                    <span style={{ whiteSpace: 'pre' }} className='truncate'>{tag}</span>
                  </a>
                ))}
              </div>
            </ResponsiveBlock>
          )}

          {/* Блок шаринга статьи (Адаптивный виджет) */}
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
                  margin: '16px 0px 0px 0px',
                  paddingLeft: '16px',
                  position: 'sticky',
                  bottom: '76px',
                  zIndex: 10,
                  width: 'fit-content',
                }}
              >
                <div
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 7px -1px',
                    padding: '8px',
                    borderRadius: '24px',
                    width: 'fit-content',
                  }}
                  className={clsx({ 'backdrop-blur--lite': true })}
                >
                  <WebShareBtn
                    url={`https://pravosleva.pro/p/${article.slug}`}
                    title={article.original.title}
                    text={clsx('Pravo$leva', '|', article.brief)}
                  />
                </div>
              </MobileOnly>
            </>
          )}

          {/* Кнопка "На главную" */}
          <ResponsiveBlock
            isLimited
            style={{ paddingTop: '50px', paddingBottom: '50px' }}
            isPaddedMobile
          >
            <GoHomeSection t={t} currentLang={currentLang} />
          </ResponsiveBlock>
        </>
      ) : null}
    </>
  )
}))
