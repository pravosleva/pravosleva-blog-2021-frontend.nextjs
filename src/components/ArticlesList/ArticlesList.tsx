import React, { useMemo, memo } from 'react'
import { GoHomeSection } from '~/components/GoHomeSection'
import { withTranslator } from '~/hocs/withTranslator'
import { TArticle } from '~/components/Article/types'
import { BreadCrumbs, NBreadCrumbs } from '~/components/BreadCrumbs'
import { ArticlesSearchDesktop, ArticlesSearchMobile, PagesGrid } from './components'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

type TArticlesListComponentProps = {
  list: TArticle[];
  searchQueryTitle: {
    original: string;
    withoutSpaces: string;
    normalized: string;
  };
  isBlogPage?: boolean;
  // t: (str: string, opts?: any) => string;
  // currentLang: string;
}

// Выносим статические инлайновые стили в константы, 
// чтобы React не пересоздавал объекты стилей при каждом рендере.
const mainContainerStyle = { boxSizing: 'border-box' } as const
const footerSectionStyle = { paddingTop: '50px', paddingBottom: '50px' } as const

export const ArticlesList = memo(withTranslator<TArticlesListComponentProps>(({ 
  t, 
  currentLang, 
  list, 
  searchQueryTitle, 
  isBlogPage 
}) => {
  // Получаем тему из Redux
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)

  // Извлекаем строку из объекта. Строка — это примитив, 
  // React идеально сравнивает её по значению без всяких useCompare.
  const normalizedSearchTitle = searchQueryTitle?.normalized

  // Оптимизация 1: Исправлен опасный вызов хука. 
  // Зависимости стали чистыми и понятными для сборщика.
  const legend = useMemo(() => {
    if (isBlogPage) {
      return [{ labelCode: 'BLOG' }] as NBreadCrumbs.TLegendItem[]
    }

    return [
      { labelCode: 'BLOG', link: '/blog' },
      { labelCode: normalizedSearchTitle || '', noTranslate: true },
    ] as NBreadCrumbs.TLegendItem[]
  }, [isBlogPage, normalizedSearchTitle])

  // Безопасная проверка массива перед рендером сетки
  const hasArticles = useMemo(() => !!list && Array.isArray(list), [list])

  return (
    <>
      <ResponsiveBlock isPaddedMobile isLimited>
        <BreadCrumbs t={t} legend={legend} />
      </ResponsiveBlock>

      <ResponsiveBlock isLimited isPaddedMobile>
        <div style={mainContainerStyle}>
          {hasArticles && <PagesGrid articles={list} variant="magazine" />}
        </div>
      </ResponsiveBlock>

      <ResponsiveBlock isLimited style={footerSectionStyle} isPaddedMobile>
        <GoHomeSection t={t} currentLang={currentLang} />
      </ResponsiveBlock>

      {/* Оптимизация 2: Если компоненты поиска внутри используют React.memo, */}
      {/* они больше не будут перерисовываться при изменении списка статей list */}
      <ArticlesSearchMobile currentTheme={currentTheme} />
      <ArticlesSearchDesktop currentTheme={currentTheme} />
    </>
  )
}))

ArticlesList.displayName = 'ArticlesList'
