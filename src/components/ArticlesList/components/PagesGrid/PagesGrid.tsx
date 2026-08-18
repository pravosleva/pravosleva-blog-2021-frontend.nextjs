import { memo } from 'react'
import { GridItem } from './GridItem'
import { TArticle } from '~/components/Article/types'

export const PagesGrid = memo(({ articles }: { articles: TArticle[] }) => (
    <div className='articleListWrapper'>
      {
        articles.map((article) => <GridItem key={article.original._id} article={article} />)
      }
    </div>
  )
)
