// import { useStyles } from './styles'
import { GridItem } from './GridItem'
import { TArticle } from '~/components/Article/types'
// import styles from './PagesGrid.module.scss'
// import clsx from 'clsx' 

export const PagesGrid = ({ articles }: { articles: TArticle[] }) => {
  // const classes = useStyles()
  
  return (
    <div className='articleListWrapper'>
      {
        articles.map((article) => <GridItem key={article.original._id} article={article} />)
      }
    </div>
  )
}