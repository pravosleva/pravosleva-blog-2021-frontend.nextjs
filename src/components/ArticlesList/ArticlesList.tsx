import { useMemo } from 'react'
import { Typography } from '@mui/material'
import { GoHomeSection } from '~/components/GoHomeSection'
import { withTranslator } from '~/hocs/withTranslator'
import { TArticle } from '~/components/Article/types'
import { BreadCrumbs, NBreadCrumbs } from '~/components/BreadCrumbs'
import { PagesGrid } from './components'
import { useCompare } from '~/hooks/useDeepEffect'
// import { useSearch } from '~/hooks/useSearch'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'

type TArticlesListComponentProps = {
  // t: (translatableString: string) => string;
  list: TArticle[];
  searchQueryTitle: {
    original: string;
    withoutSpaces: string;
    normalized: string;
  },
  isBlogPage?: boolean;
}

export const ArticlesList = withTranslator<TArticlesListComponentProps>(({ t, currentLang, list, searchQueryTitle, isBlogPage }) => {
  // const { state: _state, set, reset } = useSearch('blog.search')
  // useEffect(() => {
  //   if (isBlogPage) reset()
  //   else if (!!searchQueryTitle.withoutSpaces) set(searchQueryTitle)
  // }, [useCompare([searchQueryTitle])])

  const legend = useMemo(() => {
    let defaultResult: NBreadCrumbs.TLegendItem[] = [{ labelCode: 'HOME', link:'/', noTranslate: false }, { labelCode: 'BLOG' }]
    if (isBlogPage) return defaultResult

    defaultResult = [
      { labelCode: 'HOME', link:'/', noTranslate: false },
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
      <ResponsiveBlock
        isPaddedMobile
        isLimited
      >
        <BreadCrumbs
          t={t}
          // lastLabel={article?.original.title}
          legend={legend}
        />
      </ResponsiveBlock>

      <ResponsiveBlock
        isLimited
        isPaddedMobile
        style={{
          paddingBottom: '50px',
        }}
      >
        <div
          // className="article-body"
          style={{
            boxSizing: 'border-box',
            // overflowX: 'hidden',
          }}>
          <Typography variant="h2" component="h1" gutterBottom className='truncate'>
            {isBlogPage ? t(searchQueryTitle.original) : searchQueryTitle.normalized}
          </Typography>
          {
            !!list && Array.isArray(list) && (
              <PagesGrid articles={list} />
            )
          }
        </div>
      </ResponsiveBlock>

      <ResponsiveBlock
        isLimited
        isLastSection
        isPaddedMobile
      >
        <GoHomeSection t={t} currentLang={currentLang} />
      </ResponsiveBlock>
    </>
  )
})
