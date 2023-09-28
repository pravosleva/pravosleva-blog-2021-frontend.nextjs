import {
  // Box,
  // Container,
  // Stack,
  Typography,
} from '@mui/material'
import { GoHomeSection } from '~/components/GoHomeSection'
import { withTranslator } from '~/hocs/withTranslator'
import { TArticle } from '~/components/Article/types'
import { BreadCrumbs } from '~/components/BreadCrumbs'
import { PagesGrid } from './components'

type TArticlesListComponentProps = {
  t: (translatableString: string) => string;
  list: TArticle[];
  searchQueryTitle: {
    original: string,
    modified: string
  },
  isBlogPage?: boolean;
}

export const ArticlesList = withTranslator(({ t, list, searchQueryTitle, isBlogPage }: TArticlesListComponentProps) => {
  return (
    <>
      <BreadCrumbs
        t={t}
        // lastLabel={article?.original.title}
        legend={
          isBlogPage
          ? [{ labelCode: 'BLOG' }]
          : [
            {
              labelCode: 'BLOG',
              link: '/blog',
            },
            {
              labelCode: searchQueryTitle.modified,
              noTranslate: true,
            },
          ]
        }
      />

      <div
        className="article-body"
        style={{
          boxSizing: 'border-box',
          // overflowX: 'hidden',
        }}>
        <Typography variant="h1" component="h1" gutterBottom className='truncate'>
          {isBlogPage ? t(searchQueryTitle.modified) : searchQueryTitle.modified}
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
