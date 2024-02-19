import { useMemo } from 'react'
import { useStyles } from './styles'
import { isValidJson } from '~/utils/isValidJson'

type TNormalizedItem = {
  src: string;
}
export type TProps = {
  itemsJson: string;
}

export const ImagesGalleryBox = ({ itemsJson } : TProps) => {
  const styles = useStyles()
  const arePropsValid = useMemo(() => isValidJson(itemsJson), [itemsJson])
  if (!arePropsValid) return <div>INVALID PROPS!</div>

  const normalizedItems = useMemo<TNormalizedItem[]>(() => JSON.parse(itemsJson), [itemsJson])

  return (
    <div className={styles.wrapper}>
      ImagesGalleryBox WIP {normalizedItems.length}
    </div>
  )
}
