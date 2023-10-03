import { useMemo } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux';
import { IRootState } from '~/store/IRootState';
// import { useSearch } from '~/hooks/useSearch'
import { useCompare } from '~/hooks/useDeepEffect'

export const GoHomeSection = ({
  t,
}: {
  t: (_s: string) => void;
}) => {
  // const { state: searchState, set: _set, reset: _reset } = useSearch('blog.search')
  const sqtState = useSelector((state: IRootState) => state.siteSearch.sqt)

  const defaultBtns = [{
    href: '/',
    as: '/',
    Component: (
      <a className="link-as-rippled-btn truncate" style={{ whiteSpace: 'pre' }}>
        <i className="fas fa-arrow-left"></i>
        <span style={{ marginLeft: '10px', whiteSpace: 'pre' }}>{t('GO_BACK_TO_THE_HOMEPAGE')}</span>
      </a>
    ),
  }]
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
        ...sqtState.map(({ withoutSpaces, normalized,  }) => {
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
                >{normalized}</span>
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

      <div className="special-link-wrapper--tags fade-in-effect unselectable">
        {
          defaultBtns.map(({ as, href, Component }, i: number) => (
            <Link href={href} as={as} key={`${href}-${i}`}>
              {Component}
            </Link>
          ))
        }
      </div>

      {btns.length > 0 && (
        <div className="special-link-wrapper--tags fade-in-effect unselectable">
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
