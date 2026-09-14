import { useMemo, memo } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { useCompare } from '~/hooks/useDeepEffect'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import clsx from 'clsx';

export const GoHomeSection = memo(({
  t,
  currentLang,
  isBlogPage,
}: {
  t: (_s: string) => void;
  currentLang: string;
  isBlogPage?: boolean;
}) => {
  const sqtState = useSelector((state: IRootState) => state.siteSearch.sqt)
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const linkColor = useMemo(() => {
    return (
      currentTheme === 'hard-gray'
        ? '#fff'
        : currentTheme === 'dark'
          ? '#fff' : '#0162c8'
    )
  }, [currentTheme])
  const defaultBtns = useMemo(() => isBlogPage
    ? [{
      href: '/',
      as: '/',
      Component: (
        <a
          style={{
            whiteSpace: 'pre',
            display: 'flex',
            alignItems: 'center',
            color: linkColor,
          }}
        >
          <KeyboardArrowLeftIcon
            style={{
              borderRadius: '50%',
              border: `2px solid ${linkColor}`,
            }}
          />
          <span style={{ marginLeft: '10px', whiteSpace: 'pre', fontWeight: 'bold' }} className='truncate'>{t('HOME')}</span>
        </a>
      )
    }]
    : [{
      href: '/blog',
      as: '/blog',
      Component: (
        <a
          style={{
            whiteSpace: 'pre',
            display: 'flex',
            alignItems: 'center',
            color: linkColor,
          }}
        >
          <KeyboardArrowLeftIcon
            style={{
              borderRadius: '50%',
              border: `2px solid ${linkColor}`,
            }}
          />
          <span style={{ marginLeft: '10px', whiteSpace: 'pre', fontWeight: 'bold' }} className='truncate'>{t('BLOG')}</span>
        </a>
      ),
    }], [linkColor, currentTheme, currentLang, isBlogPage])
  const btns = useMemo(() => {
    let result: { href: string; as: string; Component: React.ReactNode; }[] = []
    if (sqtState.length > 0) {
      result = [
        ...sqtState.map(({ withoutSpaces, normalized }) => {
          return ({
            href: '/blog/q/[search_query_title]',
            as: `/blog/q/${withoutSpaces}`,
            Component: (
              <a className="link-as-rippled-btn truncate" style={{ whiteSpace: 'pre' }}>
                <span style={{ whiteSpace: 'pre' }} className='truncate'>#{normalized}</span>
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
      {defaultBtns.length > 0 && (
        <div className={clsx('special-link-wrapper--tags', 'fade-in-effect', 'unselectable')}>
          {
            defaultBtns.map(({ as, href, Component }, i: number) => (
              <Link href={href} as={as} key={`${href}-${i}`}>{Component}</Link>
            ))
          }
        </div>
      )}
      {btns.length > 0 && (
        <div className={clsx('special-link-wrapper--tags', 'fade-in-effect', 'unselectable')}>
          {
            btns.map(({ as, href, Component }, i: number) => (
              <Link href={href} as={as} key={`${href}-${i}`}>{Component}</Link>
            ))
          }
        </div>
      )}
    </div>
  )
})
