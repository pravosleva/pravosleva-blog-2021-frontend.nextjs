import React from 'react'
// import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getFormatedDate2 } from '~/utils/timeConverter'
// import Prism from 'prismjs'
import { withTranslator } from '~/hocs/withTranslator'
import { baseRenderers } from '~/react-markdown-renderers'
import { TArticleComponentProps } from './types'
import gfm from 'remark-gfm'
import { BreadCrumbs } from '~/components/BreadCrumbs'
import { GoHomeSection } from '~/components/GoHomeSection'
import { convert } from 'html-to-text'

export const Article = withTranslator(({ t, article }: TArticleComponentProps) => {
  // React.useEffect(() => {
  //   // You can call the Prism.js API here
  //   // Use setTimeout to push onto callback queue so it runs after the DOM is updated
  //   setTimeout(() => Prism.highlightAll(), 1000)
  // }, [])
  const convertedTitle = convert(article?.original.title)

  return (
    <>
      {!!article ? (
        <>
          <BreadCrumbs
            t={t}
            // lastLabel={article?.original.title}
            legend={[
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
          {!!article?.bgSrc && (
            <div>
              <div className="article-wrapper">
                <div className="tiles-grid-item-in-article white article-wrapper__big-image-as-container">
                  <h1 className="article-page-title">
                    {convertedTitle}
                  </h1>
                  {article?.brief && (
                    <div className="article-wrapper__big-image-as-container__brief">
                      <ReactMarkdown
                        children={article.brief}
                      />
                    </div>
                  )}
                  <small className="inactive article-wrapper__big-image-as-container__date">
                    {!!article.original.createdAt ? getFormatedDate2(new Date(article.original.createdAt)) : 'No date'}
                  </small>
                </div>
              </div>
            </div>
          )}

          <div className="article-body">
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

          <GoHomeSection t={t} />
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
        .article-wrapper {
          width: 100%;
          background: linear-gradient(rgba(255, 255, 255, 1), transparent);
          display: block;
          position: relative;
        }
        .article-wrapper::after {
          content: '';
          background: url(${article.bgSrc});
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          filter: grayscale(1);
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          position: absolute;
          z-index: -1;
        }
        .article-wrapper__big-image-as-container {
          border-radius: 0;
          width: 100%;
          min-height: 250px;
          // margin: 10px 0 50px 0;
          margin-bottom: 50px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 768px) {
          .article-wrapper,
          .article-wrapper::after {
            border-radius: 10px;
          }
          .article-wrapper__big-image-as-container {
            // margin: 50px 0 50px 0;
            border-radius: 10px;
          }
        }
        .article-wrapper__big-image-as-container > * {
          margin: 0;
          padding: 20px;
        }
        .article-wrapper__big-image-as-container__brief {
          margin-bottom: 30px;
          line-height: 1em;
          font-family: Montserrat;
          font-style: italic;
        }
        .article-wrapper__big-image-as-container__date {
          text-align: right;
        }
      `}</style>
    </>
  )
})
