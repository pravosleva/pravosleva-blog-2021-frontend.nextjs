import { YoutubePlayer, YoutubeGrid, YoutubeInModal } from './YoutubeRenderer'
import JsxParser from 'react-jsx-parser'
import Gist from 'react-gist'
import { Alert } from './Alert'
import { ControlsBox } from './ControlsBox'
import { ImageInNewTab } from './ImageRenderer'
import { ImagesGalleryBox, ImagesGalleryBox2, TProps as TImagesGalleryBoxProps } from './ImagesGalleryBox'
import { JSONComparison } from './JSONComparison'
import { CollapsibleBox } from './CollapsibleBox'

const componentTransforms = {
  Alert: (props: any) => <Alert text={props.value} {...props} />,
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
  ImagesGalleryBox: (props: TImagesGalleryBoxProps) => <ImagesGalleryBox itemsJson={props?.itemsJson} />,
  ImagesGalleryBox2: (props: TImagesGalleryBoxProps) => <ImagesGalleryBox2 itemsJson={props?.itemsJson} />,
  CollapsibleBox: (props: any) => <CollapsibleBox {...props} />,
}

// @ts-ignore
export const HtmlRenderer = (props: any) => <JsxParser jsx={props.value} components={componentTransforms} />
