// import { Alert } from './Alert'
import { BlockquoteRenderer } from './BlockquoteRenderer'
import {
  // CodeRendererSynthwave84,
  CodeRendererMaterialOceanic,
  // CodeRendererMaterialDark,
} from './CodeRenderer'
import { HeadingRenderer } from './HeadingRenderer'
import { ImageRenderer } from './ImageRenderer'
import { HtmlRenderer } from './HtmlRenderer'
import { LinkRenderer } from './LinkRenderer'
import { TableRenderer } from './TableRenderer'

export * from './BlockquoteRenderer'
export * from './CodeRenderer'
export * from './HeadingRenderer'
export * from './ImageRenderer/ImageRenderer'
export * from './LinkRenderer'

export const baseRenderers = {
  blockquote: BlockquoteRenderer,
  code: CodeRendererMaterialOceanic,
  heading: HeadingRenderer,
  html: HtmlRenderer,
  image: ImageRenderer,
  link: LinkRenderer,
  table: TableRenderer,
}

export const theNotePageRenderers = {
  blockquote: BlockquoteRenderer,
  // code: CodeRendererMaterialDark,
  code: CodeRendererMaterialOceanic,
  heading: HeadingRenderer,
  html: HtmlRenderer,
  image: ImageRenderer,
  link: LinkRenderer,
}

export const dialogRenderers = {
  blockquote: BlockquoteRenderer,
  code: CodeRendererMaterialOceanic,
  heading: HeadingRenderer,
  html: HtmlRenderer,
  image: ImageRenderer,
  link: LinkRenderer,
}
