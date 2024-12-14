import { useMemo, useCallback, useState, memo } from 'react'
import { useStyles } from './useStyles'
// import { isValidJson } from '~/utils/isValidJson'
// import { Gallery, Image } from 'react-grid-gallery'
import Lightbox from 'react-image-lightbox'
// import 'react-image-lightbox/style.css'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { Image } from '../components'
import { TNormalizedItem, TProps } from '../types'

// interface ICustomImage extends Image {
//   original: string;
// }

/* NOTE: Example
const images: CustomImage[] = [
  {
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    original: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    width: 320,
    height: 174,
    tags: [
      { value: "Nature", title: "Nature" },
      { value: "Flora", title: "Flora" },
    ],
    caption: "After Rain (Jeshu John - designerspics.com)",
  },
]
*/

export const ImagesGalleryBox2 = memo(({ itemsJson }: TProps) => {
  const [index, setIndex] = useState<number>(-1)
  const styles = useStyles()
  const arePropsValid = useMemo(() => ((str) => {
    try {
      switch (true) {
        case typeof str === 'string':
          // @ts-ignore
          JSON.parse(str)
          break
        default:
          throw new Error(`🚫 Incorrect type: ${typeof str}`)
      }
    } catch (e) {
      console.warn(e)
      return false
    }
    return true
  })(itemsJson), [itemsJson])

  const normalizedItems: TNormalizedItem[] = useMemo(() => JSON.parse(itemsJson), [itemsJson])

  const currentImage = useMemo(() => index === -1 ? null : normalizedItems[index], [normalizedItems, index])
  const nextIndex = useMemo(() => (index + 1) % normalizedItems.length, [normalizedItems, index])
  const nextImage = useMemo(() => normalizedItems[nextIndex] || currentImage, [normalizedItems, nextIndex, currentImage])
  const prevIndex = useMemo(() => (index + normalizedItems.length - 1) % normalizedItems.length, [normalizedItems, index])
  const prevImage = useMemo(() => normalizedItems[prevIndex] || currentImage, [normalizedItems, currentImage])

  const handleClick = useCallback((index: number) => () => setIndex(index), [setIndex])
  const handleClose = useCallback(() => setIndex(-1), [setIndex])
  const handleMovePrev = useCallback(() => setIndex(prevIndex), [setIndex, prevIndex])
  const handleMoveNext = useCallback(() => setIndex(nextIndex), [setIndex, nextIndex])

  const isServer = typeof window === 'undefined'
  if (isServer) return <CircularIndeterminate />
  else if (!arePropsValid) return (
    <ResponsiveBlock
      isLimited
      isPaddedMobile
      style={{
        paddingBottom: '30px',
        // maxWidth: '100%'
      }}
    >
      <pre>{itemsJson}</pre>
    </ResponsiveBlock>
  )
  else if (normalizedItems.length === 0) return (
    <b>Empty ImagesGalleryBox</b>
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.srLWrapperLayout}>
        {
          normalizedItems.map(({ src, caption }, i) => {
            return (
              <Image
                key={src}
                src={src}
                alt={caption || 'img'}
                onClickHandler={handleClick(i)}
              />
            )
          })
        }
      </div>
      {/* <Gallery
        // key={Math.random()}
        images={[...normalizedItems]}
        onClick={handleClick}
        enableImageSelection={false}
        // thumbnailStyle={{}}
        // tileViewportStyle={{}}
        margin={0}
        rowHeight={210}
      /> */}
      {!!currentImage && (
        /* @ts-ignore */
        <Lightbox
          mainSrc={currentImage.original}
          imageTitle={currentImage.title}
          imageCaption={currentImage.caption}
          mainSrcThumbnail={currentImage.src}
          nextSrc={nextImage.original}
          nextSrcThumbnail={nextImage.src}
          prevSrc={prevImage.original}
          prevSrcThumbnail={prevImage.src}
          onCloseRequest={handleClose}
          onMovePrevRequest={handleMovePrev}
          onMoveNextRequest={handleMoveNext}
          // enableZoom={false}
          // closeLabel='Закрыть'
        />
      )}
    </div>
  )
})
