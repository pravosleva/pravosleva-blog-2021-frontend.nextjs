import { useMemo } from 'react'
import { Typography } from '@mui/material'
import { GoHomeSection } from '~/components/GoHomeSection'
import { withTranslator } from '~/hocs/withTranslator'
import { TArticle } from '~/components/Article/types'
import { BreadCrumbs, NBreadCrumbs } from '~/components/BreadCrumbs'
import { PagesGrid } from './components'
import { useCompare } from '~/hooks/useDeepEffect'
// import { useSearch } from '~/hooks/useSearch'

type TArticlesListComponentProps = {
  t: (translatableString: string) => string;
  list: TArticle[];
  searchQueryTitle: {
    original: string;
    withoutSpaces: string;
    normalized: string;
  },
  isBlogPage?: boolean;
}

export const ArticlesList = withTranslator(({ t, list, searchQueryTitle, isBlogPage }: TArticlesListComponentProps) => {
  // const { state: _state, set, reset } = useSearch('blog.search')
  // useEffect(() => {
  //   if (isBlogPage) reset()
  //   else if (!!searchQueryTitle.withoutSpaces) set(searchQueryTitle)
  // }, [useCompare([searchQueryTitle])])

  const legend = useMemo(() => {
    let defaultResult: NBreadCrumbs.TLegendItem[] = [{ labelCode: 'BLOG' }]
    if (isBlogPage) return defaultResult

    defaultResult = [
      {
        labelCode: 'BLOG',
        link: '/blog',
      },
      {
        labelCode: searchQueryTitle.normalized,
        noTranslate: true,
      },
    ]

    return defaultResult
  }, [isBlogPage, useCompare([searchQueryTitle])])

  return (
    <>
      <BreadCrumbs
        t={t}
        // lastLabel={article?.original.title}
        legend={legend}
      />

      <div
        className="article-body"
        style={{
          boxSizing: 'border-box',
          // overflowX: 'hidden',
        }}>
        <Typography variant="h1" component="h1" gutterBottom className='truncate'>
          {isBlogPage ? t(searchQueryTitle.original) : searchQueryTitle.normalized}
        </Typography>
        {
          !!list && Array.isArray(list) && (
            <PagesGrid articles={list} />
          )
        }
      </div>

      <GoHomeSection t={t} />
    </>
  )
})
