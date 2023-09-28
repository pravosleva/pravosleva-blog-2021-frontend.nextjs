import { useStyles } from './styles'
import { GridItem } from './GridItem'
import { TArticle } from '~/components/Article/types'

export const PagesGrid = ({ articles }: { articles: TArticle[] }) => {
  const classes = useStyles()
  
  return (
    <div className={classes.wrapper}>
      {
        articles.map((article) => <GridItem key={article.original._id} article={article} />)
      }
    </div>
  )
}