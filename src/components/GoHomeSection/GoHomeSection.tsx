import { useMemo } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux';
import { IRootState } from '~/store/IRootState';
// import { useSearch } from '~/hooks/useSearch'
import { useCompare } from '~/hooks/useDeepEffect'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import clsx from 'clsx';

export const GoHomeSection = ({
  t,
  currentLang,
}: {
  t: (_s: string) => void;
  currentLang: string;
}) => {
  // const { state: searchState, set: _set, reset: _reset } = useSearch('blog.search')
  const sqtState = useSelector((state: IRootState) => state.siteSearch.sqt)
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  // const lang = useSelector((state: IRootState) => state.)
  const linkColor = useMemo(() => {
    return (
      currentTheme === 'hard-gray'
        ? '#fff'
        : currentTheme === 'dark'
          ? '#fff' : '#0162c8'
    )
  }, [currentTheme])
  const defaultBtns = useMemo(() => [{
    href: '/blog',
    as: '/blog',
    Component: (
      <a
        // className='link-as-rippled-btn truncate'
        style={{
          whiteSpace: 'pre',
          display: 'flex',
          alignItems: 'center',
          color: linkColor,
        }}
      >
        {/* <i className="fas fa-arrow-left"></i> */}
        <KeyboardArrowLeftIcon
          style={{
            borderRadius: '50%',
            border: `2px solid ${linkColor}`,
          }}
        />
        <span style={{ marginLeft: '10px', whiteSpace: 'pre', fontWeight: 'bold' }} className='truncate'>{t('BLOG')}</span>
      </a>
    ),
  }], [linkColor, currentTheme, currentLang])
  const btns = useMemo(() => {
    let result: {
      href: string;
      as: string;
      Component: React.ReactNode;
    }[] = [
      // {
      //   href: '/',
      //   as: '/',
      //   Component: (
      //     <a className="link-as-rippled-btn">
      //       <i className="fas fa-arrow-left"></i>
      //       <span style={{ marginLeft: '10px' }}>{t('GO_BACK_TO_THE_HOMEPAGE')}</span>
      //     </a>
      //   ),
      // },
    ]

    if (sqtState.length > 0) {
      result = [
        // {
        //   href: '/',
        //   as: '/',
        //   Component: (
        //     <a className="link-as-rippled-btn">
        //       <i className="fas fa-arrow-left"></i>
        //       <span style={{ marginLeft: '10px' }}>{t('GO_BACK_TO_THE_HOMEPAGE')}</span>
        //     </a>
        //   ),
        // },
        ...sqtState.map(({ withoutSpaces, normalized }) => {
          return ({
            href: '/blog/q/[search_query_title]',
            as: `/blog/q/${withoutSpaces}`,
            Component: (
              <a className="link-as-rippled-btn truncate" style={{ whiteSpace: 'pre' }}>
                {/* <i className="fas fa-tag"></i> */}
                <span
                  style={{
                    // marginLeft: '10px',
                    whiteSpace: 'pre',
                  }}
                  className='truncate'
                >#{normalized}</span>
              </a>
            )
          })
        }),
      ]
    }
    return result
  }, [useCompare([sqtState])])

  return (
    <div className='page-control-box-wrapper'>

      <div
        className={clsx('special-link-wrapper--tags', 'fade-in-effect', 'unselectable')}
      >
        {
          defaultBtns.map(({ as, href, Component }, i: number) => (
            <Link href={href} as={as} key={`${href}-${i}`}>
              {Component}
            </Link>
          ))
        }
      </div>

      {btns.length > 0 && (
        <div
          className={clsx('special-link-wrapper--tags', 'fade-in-effect', 'unselectable')}
        >
          {
            btns.map(({ as, href, Component }, i: number) => (
              <Link href={href} as={as} key={`${href}-${i}`}>
                {Component}
              </Link>
            ))
          }
        </div>
      )}

    </div>
  )
}
