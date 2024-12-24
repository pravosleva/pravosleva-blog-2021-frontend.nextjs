import { useMemo, memo } from 'react'
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
import { getTagList } from '~/utils/string-tools/getTagList'
import { IRootState } from '~/store/IRootState'
import { useSelector } from 'react-redux'
import styles from './Article.module.scss'
// import { breakpoints } from '~/mui/theme'

export const Article = withTranslator<TArticleComponentProps>(memo(({ t, currentLang, article }) => {
  // React.useEffect(() => {
  //   // You can call the Prism.js API here
  //   // Use setTimeout to push onto callback queue so it runs after the DOM is updated
  //   setTimeout(() => Prism.highlightAll(), 1000)
  // }, [])
  // const convertedTitle = convert(article?.original.title)

  const baseClasses = useBaseStyles()
  const tagList = useMemo(() => getTagList({ originalMsgList: [clsx(article.original.title, article.brief)] }).sortedList, [])
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const linkColor = useMemo(() => {
    return (
      currentTheme === 'hard-gray'
        ? '#fff'
        : currentTheme === 'dark'
          ? '#FF9000' : '#0162c8'
    )
  }, [currentTheme])
  // const briefGradientLayout = useMemo(() => {
  //   switch (true) {
  //     case currentTheme === 'light':
  //       return 'linear-gradient(rgba(1, 98, 200, 1) 35%, transparent 100%)'
  //     default:
  //       return 'linear-gradient(rgba(0, 0, 0, 1), transparent)'
  //   }
  // }, [currentTheme])

  const MemoizedArticleBody = useMemo(() => {
    return (
      <ResponsiveBlock
        isLimited
        isPaddedMobile
        // style={{
        //   paddingBottom: '30px',
        // }}
      >
        <div className={clsx("article-body", baseClasses.customizableListingWrapper)}>
          {!!article.original.description ? (
            <div className="description-markdown">
              <ReactMarkdown
                // key={Math.random()}
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
    )
  }, [article.original.description])
  
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
                  link: '/blog',
                  labelCode: 'BLOG',
                },
                {
                  labelCode: article?.original.title,
                  noTranslate: true,
                }
              ]}
            />
          </ResponsiveBlock>

          {!!article?.bg && (
            <ResponsiveBlock isLimitedForDesktop>
              <div
                style={{
                  // border: '1px solid red',
                  // background: briefGradientLayout,
                }}
                className={styles['external-article-wrapper']}
              >
                <article
                  className='article-wrapper'
                  
                  style={{
                    content: '',
                    background: `url(${!!article.bg ? article.bg?.src : '/static/img/blog/coming-soon-v3.jpg'})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    // filter: 'grayscale(1)',
                    // borderRadius: '16px',
                  }}
                >
                  <div
                    className={
                      clsx(
                        'tiles-grid-item-in-article',
                        'white',
                        'article-wrapper__big-image-as-container'
                      )
                    }
                    style={{
                      backdropFilter: 'grayscale(1)',
                    }}
                  >
                    <h1 className='article-page-title'>
                      {article?.original.title}
                    </h1>
                    {article?.brief && (
                      <div
                        className='article-wrapper__big-image-as-container__brief'
                        style={{ fontSize: '0.8em', maxWidth: '550px' }}
                      >
                        <ReactMarkdown children={article.brief} />
                      </div>
                    )}
                    <small className={clsx("inactive", 'article-wrapper__big-image-as-container__date')}>
                      {!!article.original.createdAt ? getFormatedDate2(new Date(article.original.createdAt)) : 'No date'}
                    </small>
                  </div>
                </article>
              </div>
            </ResponsiveBlock>
          )}

          {MemoizedArticleBody}

          {tagList.length > 0 && (
            <ResponsiveBlock
              isLimited
              isPaddedMobile
              style={{
                // border: '1px solid red',
                // marginBottom: '30px',
                paddingTop: '16px',
                // paddingBottom: '16px',
              }}
            >
              <div
                // className="special-link-wrapper--tags fade-in-effect unselectable"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                {tagList.map((tag) => (
                  <a
                    className={clsx('truncate')}
                    style={{
                      whiteSpace: 'pre',
                      color: linkColor,
                      WebkitTapHighlightColor: 'transparent',
                    }}
                    key={tag}
                    href={`/blog/q/${tag.substring(1)}`}
                  >
                    {/* <i className="fas fa-tag"></i> */}
                    <span
                      style={{
                        // marginLeft: '10px',
                        whiteSpace: 'pre',
                      }}
                      className='truncate'
                    >{tag}</span>
                  </a>
                ))}
              </div>
            </ResponsiveBlock>
          )}
          
          <ResponsiveBlock
            isLimited
            // isLastSection
            style={{
              paddingTop: '50px',
              paddingBottom: '50px',
            }}
            isPaddedMobile
          >
            <GoHomeSection t={t} currentLang={currentLang} />
          </ResponsiveBlock>
        </>
      ) : (
        <>
          <h1>Not found, try again...</h1>
          <div>
            Hey, where is the f*ckn <code>id</code> in query params?
          </div>
        </>
      )}
    </>
  )
}))
