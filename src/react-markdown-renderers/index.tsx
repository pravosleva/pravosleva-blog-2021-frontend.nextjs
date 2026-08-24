import dynamic from 'next/dynamic'
import { BlockquoteRenderer } from './BlockquoteRenderer'
// import {
//   // CodeRendererSynthwave84,
//   CodeRendererMaterialOceanic,
//   // CodeRendererMaterialDark,
// } from './CodeRenderer'
import { HeadingRenderer } from './HeadingRenderer'
import { ImageRenderer } from './ImageRenderer'
import { HtmlRenderer } from './HtmlRenderer'
import { LinkRenderer } from './LinkRenderer/LinkRenderer'
import { TableRenderer } from './TableRenderer'

export * from './BlockquoteRenderer'
// export * from './CodeRenderer'
export * from './HeadingRenderer'
export * from './ImageRenderer/ImageRenderer.v0'
export * from './LinkRenderer/LinkRenderer'

/* =========================================================================
   ИСПРАВЛЕНО: Динамический импорт изолированного рендерера кода с SSR
   ========================================================================= */
const DynamicCodeRenderer = dynamic(
  () => import('./CodeRenderer').then(mod => mod.CodeRendererMaterialOceanic),
  { 
    ssr: true, // Оставляем true, чтобы поисковые роботы видели код для SEO
    loading: () => <pre style={{ background: '#263238', padding: '1em' }}><code style={{ color: '#fff' }}>Загрузка парсера кода...</code></pre>
  }
)

export const baseRenderers = {
  blockquote: BlockquoteRenderer,
  code: DynamicCodeRenderer,
  heading: HeadingRenderer,
  html: HtmlRenderer,
  image: ImageRenderer,
  link: LinkRenderer,
  table: (props: any) => (
    <TableRenderer 
      withScrollButtons={true} /* Включает стрелки прокрутки */
      withFloatingHeader={true} /* Включает умную плавающую шапку */
      topOffset={0} /* Измените на высоту хедера сайта, если он у вас есть (например, 60) */
      {...props} 
    />
  ),
}

export const theNotePageRenderers = {
  blockquote: BlockquoteRenderer,
  // code: CodeRendererMaterialDark,
  code: DynamicCodeRenderer,
  heading: HeadingRenderer,
  html: HtmlRenderer,
  image: ImageRenderer,
  link: LinkRenderer,
}

export const dialogRenderers = {
  blockquote: BlockquoteRenderer,
  code: DynamicCodeRenderer,
  heading: HeadingRenderer,
  html: HtmlRenderer,
  image: ImageRenderer,
  link: LinkRenderer,
}
