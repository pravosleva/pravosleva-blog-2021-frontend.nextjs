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

  const btns = useMemo(() => {
    let result: {
      href: string;
      as: string;
      Component: React.ReactNode;
    }[] = [
      {
        href: '/',
        as: '/',
        Component: (
          <a className="link-as-rippled-btn">
            <i className="fas fa-arrow-left"></i>
            <span style={{ marginLeft: '10px' }}>{t('GO_BACK_TO_THE_HOMEPAGE')}</span>
          </a>
        ),
      },
    ]

    if (!!sqtState.withoutSpaces) {
      result = [
        {
          href: '/',
          as: '/',
          Component: (
            <a className="link-as-rippled-btn">
              <i className="fas fa-arrow-left"></i>
              <span style={{ marginLeft: '10px' }}>{t('GO_BACK_TO_THE_HOMEPAGE')}</span>
            </a>
          ),
        },
        {
          href: '/blog/q/[search_query_title]',
          as: `/blog/q/${sqtState.withoutSpaces}`,
          Component: (
            <a className="link-as-rippled-btn">
              <i className="fas fa-search"></i>
              <span
              style={{ marginLeft: '10px' }}
            >{sqtState.normalized}</span>
            </a>
          ),
        },
      ]
    }
    return result
  }, [useCompare([sqtState])])

  return (
    <div className="special-link-wrapper fade-in-effect unselectable">
      {
        btns.map(({ as, href, Component }, i: number) => (
          <Link href={href} as={as} key={`${href}-${i}`}>
            {Component}
          </Link>
        ))
      }
    </div>
  )
}
