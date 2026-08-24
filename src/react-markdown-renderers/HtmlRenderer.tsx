import { YoutubePlayer, YoutubeGrid, YoutubeInModal } from './YoutubeRenderer'
import JsxParser from 'react-jsx-parser'
import Gist from 'react-gist'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '~/mui/ErrorFallback'
// import { Alert } from './Alert'
import { ControlsBox } from './ControlsBox'
import { ImageInNewTab } from './ImageRenderer'
import { ImagesGalleryBox, ImagesGalleryBox2, TProps as TImagesGalleryBoxProps } from './ImagesGalleryBox'
import { JSONComparison } from './JSONComparison'
import { CollapsibleBox } from './CollapsibleBox'
import { CardsExample } from './CardsExample'
import { Podcast } from './PodcastComponent'
import { EdnaExp } from './EdnaExp'
import dynamic from 'next/dynamic'

const DynamicAlert = dynamic(
  () => import('~/react-markdown-renderers/Alert/Alert.v4').then(mod => mod.Alert),
  { ssr: true }
)

const componentTransforms = {
  // -- NEW: Забираем текст из children, а не из атрибута value
  // Alert: (props: any) => <Alert text={props.children || props.value} {...props} />,
  // ИСПРАВЛЕНО: передаем и value, и children. Компонент сам разберется с приоритетом
  Alert: DynamicAlert, // (props: any) => <Alert text={props.value} {...props} />,
  // Alert: (props: any) => {
  //   let textContent = props.value || ''
    
  //   // Если есть children, пытаемся вытащить текст из HTML-комментария
  //   if (props.children) {
  //     const rawChildren = Array.isArray(props.children) ? props.children.join('') : String(props.children)
  //     // Вырезаем текст, находящийся между <!-- и -->
  //     const match = rawChildren.match(/<!--([\s\S]*?)-->/)
  //     if (match && match[1]) {
  //       textContent = match[1]
  //     } else {
  //       textContent = rawChildren
  //     }
  //   }

  //   return <Alert text={textContent} {...props} />
  // },
  // --
  ControlsBox: (props: any) => <ControlsBox {...props} />,
  React: (props: any) => <>{props.children}</>,
  YoutubeGrid,
  YoutubeInModal,
  YoutubePlayer,
  Gist: ({ gistId }: { gistId: string }) => (
    <div
      style={{
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 3px 7px -1px',
        borderRadius: '8px',
      }}
    >
      <Gist id={gistId} />
    </div>),
  ImageInNewTab: (props: any) => <ImageInNewTab {...props} />,
  JSONComparison: (props: any) => <JSONComparison {...props} />,
  ImagesGalleryBox: (props: TImagesGalleryBoxProps) => (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
    // onReset={handleClearText}
    >
      <ImagesGalleryBox itemsJson={props?.itemsJson} />
    </ErrorBoundary>
  ),
  ImagesGalleryBox2: (props: TImagesGalleryBoxProps) => (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
    // onReset={handleClearText}
    >
      <ImagesGalleryBox2 itemsJson={props?.itemsJson} />
    </ErrorBoundary>
  ),
  CollapsibleBox: (props: any) => <CollapsibleBox {...props} />,
  CardsExample: (props: any) => (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
    // onReset={handleClearText}
    >
      <CardsExample {...props} />
    </ErrorBoundary>
  ),
  Podcast: (props: any) => <Podcast {...props} />,
  EdnaExp: (props: any) => <EdnaExp {...props} />,
}

// @ts-ignore
export const HtmlRenderer = (props: any) => <JsxParser jsx={props.value} components={componentTransforms} />
