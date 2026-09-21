// import { YoutubePlayer, YoutubeGrid, YoutubeInModal } from './YoutubeRenderer'
import JsxParser from 'react-jsx-parser'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '~/mui/ErrorFallback'
// import { Alert } from './Alert'
import { ControlsBox } from './ControlsBox'
import { ImageInNewTab } from './ImageRenderer'
import { ImagesGalleryBox, TProps as TImagesGalleryBoxProps } from './ImagesGalleryBox'
// import { JSONComparison } from './JSONComparison/index.2-ways'
import { CollapsibleBox } from './CollapsibleBox'
import { CardsExample } from './CardsExample'
import { Podcast } from './PodcastComponent'
const DynamicEdnaExp = dynamic(
  () => import('~/react-markdown-renderers/EdnaExp/EdnaExp').then(mod => mod.EdnaExp),
  { ssr: false } // Отключение SSR полностью разгрузит серверный бандл и гидратацию
)
import dynamic from 'next/dynamic'
import { CodeComparison } from './CodeComparison'
// import { PWACacheManager } from './PWACacheManager'

const DynamicAlert = dynamic(
  () => import('~/react-markdown-renderers/Alert/Alert.v4').then(mod => mod.Alert),
  { ssr: true }
)

const DynamicPWACacheManager = dynamic(
  () => import('~/react-markdown-renderers/PWACacheManager/PWACacheManager').then(mod => mod.PWACacheManager),
  { ssr: true }
)

const DynamicFullWidthSection = dynamic(
  () => import('~/react-markdown-renderers/FullWidthSection').then(mod => mod.FullWidthSection),
  { ssr: true }
)

const DynamicImagesGalleryBox2 = dynamic(
  () => import('~/react-markdown-renderers/ImagesGalleryBox/ImagesGalleryBox2/ImagesGalleryBox2').then(mod => mod.ImagesGalleryBox2),
  { ssr: true }
)

const DynamicJSONComparison = dynamic(
  () => import('~/react-markdown-renderers/JSONComparison/index.2-ways').then(mod => mod.JSONComparison),
  { ssr: false }
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
  // YoutubeGrid,
  // YoutubeInModal,
  // YoutubePlayer,
  ImageInNewTab: (props: any) => <ImageInNewTab {...props} />,
  JSONComparison: (props: any) => <DynamicJSONComparison {...props} />,
  // РЕГИСТРАЦИЯ: Теперь MDX-парсер знает про кастомный тег CodeComparison
  CodeComparison: (props: any) => <CodeComparison {...props} />,
  ImagesGalleryBox: (props: TImagesGalleryBoxProps) => (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
    // onReset={handleClearText}
    >
      <ImagesGalleryBox itemsJson={props?.itemsJson} />
    </ErrorBoundary>
  ),
  ImagesGalleryBox2: (props: any) => {
    // Поддерживаем и новый короткий проп items, и старый легаси itemsJson
    const rawData = props?.items || props?.itemsJson

    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DynamicImagesGalleryBox2 itemsData={rawData} previewPosition={props?.previewPosition} />
      </ErrorBoundary>
    )
  },
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
  PWACacheManager: () => <DynamicPWACacheManager />,
  EdnaExp: DynamicEdnaExp,
  FullWidthSection: DynamicFullWidthSection,
}

// @ts-ignore
export const HtmlRenderer = (props: any) => <JsxParser jsx={props.value} components={componentTransforms} />
