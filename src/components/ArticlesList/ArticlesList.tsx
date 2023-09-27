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

      <div className="article-body">
        <Typography variant="h1" component="h1" gutterBottom className='truncate'>
          {isBlogPage ? t(searchQueryTitle.modified) : searchQueryTitle.modified}
        </Typography>
        {
          !!list && Array.isArray(list) && (

            list.map((ps) => {
              return (
                <pre key={ps.original._id}>{JSON.stringify(ps, null, 2)}</pre>
              )
            })
            
          )
        }
      </div>

      <GoHomeSection t={t} />
    </>
  )
})
