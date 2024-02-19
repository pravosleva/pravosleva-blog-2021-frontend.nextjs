// import { useMemo } from 'react'
// import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getFormatedDate2 } from '~/utils/time-tools/timeConverter'
// import Prism from 'prismjs'
import { withTranslator } from '~/hocs/withTranslator'
import { baseRenderers } from '~/react-markdown-renderers'
import { TArticleComponentProps } from './types'
import gfm from 'remark-gfm'
import { BreadCrumbs } from '~/components/BreadCrumbs'
import { GoHomeSection } from '~/components/GoHomeSection'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
// import { convert } from 'html-to-text'
import clsx from 'clsx'
import { useBaseStyles } from '~/mui/useBaseStyles'
// import styles from './Article.module.scss'
// import { breakpoints } from '~/mui/theme'

export const Article = withTranslator<TArticleComponentProps>(({ t, article }) => {
  // React.useEffect(() => {
  //   // You can call the Prism.js API here
  //   // Use setTimeout to push onto callback queue so it runs after the DOM is updated
  //   setTimeout(() => Prism.highlightAll(), 1000)
  // }, [])
  // const convertedTitle = convert(article?.original.title)

  const baseClasses = useBaseStyles()

  return (
    <>
      {!!article ? (
        <>
          <ResponsiveBlock
            isPaddedMobile
            isLimited
          >
            <BreadCrumbs
              t={t}
              // lastLabel={article?.original.title}
              legend={[
                {
                  link:'/',
                  labelCode: 'HOME',
                  noTranslate: false
                },
                {
                  labelCode: 'BLOG',
                  link: '/blog',
                },
                {
                  labelCode: article?.original.title,
                  noTranslate: true,
                }
              ]}
            />
          </ResponsiveBlock>

          {!!article?.bg && (
            <ResponsiveBlock
              isLimitedForDesktop
            >
              <article className="article-wrapper">
                <div className={clsx('tiles-grid-item-in-article', 'white', 'article-wrapper__big-image-as-container')}>
                  <h1 className='article-page-title'>
                    {article?.original.title}
                  </h1>
                  {article?.brief && (
                    <div
                      className='article-wrapper__big-image-as-container__brief'
                      style={{
                        fontSize: '0.8em',
                      }}
                    >
                      <ReactMarkdown
                        children={article.brief}
                      />
                    </div>
                  )}
                  <small className={clsx("inactive", 'article-wrapper__big-image-as-container__date')}>
                    {!!article.original.createdAt ? getFormatedDate2(new Date(article.original.createdAt)) : 'No date'}
                  </small>
                </div>
              </article>
            </ResponsiveBlock>
          )}

          <ResponsiveBlock
            isLimited
            isPaddedMobile
            style={{
              paddingBottom: '30px',
            }}
          >
            <div className={clsx("article-body", baseClasses.customizableListingWrapper)}>
              {!!article.original.description ? (
                <div className="description-markdown">
                  <ReactMarkdown
                    renderers={baseRenderers}
                    // @ts-ignore
                    plugins={[gfm, { singleTilde: false }]}
                    children={article.original.description}
                  />
                </div>
              ) : (
                'No body'
              )}
            </div>
          </ResponsiveBlock>
          <ResponsiveBlock
            isLimited
            isLastSection
            isPaddedMobile
          >
            <GoHomeSection t={t} />
          </ResponsiveBlock>
        </>
      ) : (
        <>
          <h1>Not found, try again...</h1>
          <div>
            Hey, where is the f*cking <code>id</code> in query params?
          </div>
        </>
      )}
      
      <style jsx>{`
        .article-wrapper::after {
          content: '';
          background: url(${!!article.bg ? article.bg.src : '/static/img/blog/coming-soon-v3.jpg'});
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }
      `}</style>
    </>
  )
})
