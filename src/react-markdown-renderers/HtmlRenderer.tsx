import { YoutubePlayer, YoutubeGrid, YoutubeInModal } from './YoutubeRenderer'
import JsxParser from 'react-jsx-parser'
import Gist from 'react-gist'
import { Alert } from './Alert'
import { ControlsBox } from './ControlsBox'
import { ImageInNewTab } from './ImageRenderer'
import { ImagesGalleryBox, TProps as TImagesGalleryBoxProps } from './ImagesGalleryBox'
import { JSONComparison } from './JSONComparison'

const componentTransforms = {
  Alert: (props: any) => <Alert text={props.value} {...props} />,
  ControlsBox: (props: any) => <ControlsBox {...props} />,
  React: (props: any) => <>{props.children}</>,
  YoutubeGrid,
  YoutubeInModal,
  YoutubePlayer,
  Gist: ({ gistId }: { gistId: string }) => <Gist id={gistId} />,
  ImageInNewTab: (props: any) => <ImageInNewTab {...props} />,
  JSONComparison: (props: any) => <JSONComparison {...props} />,
  ImagesGalleryBox: (props: TImagesGalleryBoxProps) => <ImagesGalleryBox itemsJson={props?.itemsJson} />
}

// @ts-ignore
export const HtmlRenderer = (props: any) => <JsxParser jsx={props.value} components={componentTransforms} />
