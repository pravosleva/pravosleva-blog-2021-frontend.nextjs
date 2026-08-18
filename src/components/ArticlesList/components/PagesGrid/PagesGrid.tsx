import { memo } from 'react'
import { GridItem } from './GridItem'
import { TArticle } from '~/components/Article/types'

type TGridProps = {
  articles: TArticle[];
  variant?: 'default' | 'magazine'; // Добавляем проп для вариативности
}

export const PagesGrid = memo(({ articles, variant = 'default' }: TGridProps) => {
  // Формируем строку классов в зависимости от выбранного варианта
  const wrapperClassName = `articleListWrapper ${variant === 'magazine' ? '--magazine-layout' : ''}`

  return (
    <div className={wrapperClassName}>
      {
        articles.map((article) => (
          <GridItem key={article.original._id} article={article} />
        ))
      }
    </div>
  )
})
