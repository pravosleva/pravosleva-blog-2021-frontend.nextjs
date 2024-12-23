import React, { useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { compose, withStateHandlers, withProps } from 'recompose'
import styled, { css } from 'styled-components'
import Link from 'next/link'
import { add, remove } from '@/store/reducers/scrollDisablingComponents'
import { withScrollDisabler } from '@/hocs/withScrollDisabler'
import { isCurrentPath } from '@/utils/routing/isCurrentPath'
// import { logout } from '@/helpers/services/restService'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
// import { showAsyncToast } from '@/actions'
import { withTranslator } from '@/hocs/withTranslator'
import { breakpoints } from '~/mui/theme'
// import { userInfoActions } from '@/store/reducers/user-info'
import { abSort } from '~/utils/string-tools/abSort'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  @media (max-width: ${breakpoints.sm}px) {
    top: 0;
    bottom: 0;
    position: relative;
  }
  box-sizing: border-box;
`

const Sidebar = styled.div`
  background-color: white;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: ${breakpoints.md + 1}px) {
    display: none;
  }
  @media (max-width: ${breakpoints.md}px) {
    padding: 10px 20px 10px 20px;

    min-height: calc(100vh - 40px);
    height: 100%;
    min-width: 100%;
    width: 100%;
    transform: translateX(0);
    transition: transform 0.5s ease-in-out, opacity 0.7s ease-in-out;
    background-color: #0162c8;
    > ul {
      margin: 0;
      padding: 0;
    }
    > ul > li {
      margin: 0;
      
      list-style-type: none;
    }
    > ul > li > * {
      color: #fff;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 0.9em;
      letter-spacing: 0.1em;
    }
    > ul > li > a.active {
      /* outline: 2px solid #fff;
      padding: 4px;
      border-radius: 8px; */
      color: #ff781e;
      font-weight: bold;
    }
    > ul > li > a.active::before {
      content: '👉';
      margin-right: 10px;
    }

    ${(p) =>
      !p.opened &&
      css`
        transform: translateX(-100%);
        opacity: 0;
      `}
    position: absolute;
    top: 40px;
    overflow-x: hidden;
  }
  box-sizing: border-box;
  z-index: 3;
`

/* TODO:
const items = [
  // { path: '/cabinet', label: 'Личный кабинет', id: 0, accessForRoles: ['public', 'authenticated'] },
  { path: '/profile', label: 'Profile', id: 1, accessForRoles: ['authenticated'] }, // 'public', 'authenticated', 'free'
  // { path: '/login', label: 'Login', id: 2, accessForRoles: ['unauthenticated'] },
  // { path: '/graphql-sample', label: 'GraphQL', id: 3, accessForRoles: ['free'] },
]
*/

export const withMobileMenu = (ComposedComponent) =>
  compose(
    withTranslator,
    withProps({
      topDocRef: React.createRef(),
    }),
    withStateHandlers(
      { isSidebarOpened: false },
      {
        sidebarToggler: ({ isSidebarOpened }, props) => (val) => {
          // Need to scroll top:
          if (typeof window !== 'undefined') window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })

          return {
            isSidebarOpened: val === true || val === false ? val : !isSidebarOpened,
          }
        },
      }
    ),
    withScrollDisabler
  )(
    ({
      // Sidebar hoc:
      isSidebarOpened,
      topDocRef,
      sidebarToggler,

      // Scroll disabler hoc (topDocRef used there):
      scrollToRef,

      // Translator:
      t,
      setLang,
      suppoerLocales, // Array like this: [{ label, name, value }]
      currentLang,

      ...props
    }) => {
      // const usersConnected = useSelector((state) => state.users?.items)
      const isAuthenticated = !!useSelector((state) => state.userInfo?.fromServer?.id)
      const dispatch = useDispatch()
      const handleLogoutCb = useCallback(async () => {
        // const result = await logout()
        //   .then(() => {
        //     router.push('/auth/login')
        //   })
        //   .catch((text) => {
        //     // dispatch(showAsyncToast({ text, delay: 20000, type: 'error' }))
        //   })
        // return result
        return Promise.reject({ message: 'In progress...' })
      }, [])
      const handleLogout = useDebouncedCallback(() => {
        handleLogoutCb()
          .then(() => {
            // dispatch(userInfoActions.fillDelta({ fromServer: null, isLoadedSuccessfully: true }))
          })
          .catch((err) => {
            console.log(err)
          })
      }, 500)

      useEffect(() => {
        if (isSidebarOpened)
          dispatch(add('Layout_Header_Mobile_hocs_with-mobile-menu'))
        else
          dispatch(remove('Layout_Header_Mobile_hocs_with-mobile-menu'))
      }, [
        isSidebarOpened,
        // scrollToRef,
        dispatch,
        topDocRef,
      ])

      const router = useRouter()
      const isCurrentPathCb = useCallback(isCurrentPath, [router.pathname, router.asPath, isCurrentPath])

      // useEffect(() => {
      //   console.log(router)
      // }, [])

      const handleCloseSidebar = useCallback(() => {
        sidebarToggler(false)
      }, [])
      const TagLinksListItems = useMemo(() => {
        return [
          'сетевые_протоколы',
          'краснаяАкула',
          'bash',
          'git',
          'jsVanilla',
          'mongodb',
          'nginx',
          'ssl',
        ]
          .sort(abSort)
          .map((tag, i) => (
            <li key={tag}>
              <Link href={`/blog/q/${tag}`}>
                <a
                  onClick={handleCloseSidebar}
                  className={isCurrentPathCb(router.pathname, `/blog/q/${tag}`) || isCurrentPathCb(decodeURIComponent(router.asPath), `/blog/q/${tag}`) ? 'active' : ''}
                >
                  #{tag}
                </a>
              </Link>
            </li>
          ))
      }, [router.pathname, isCurrentPathCb, router.asPath])

      return (
        <Wrapper opened={isSidebarOpened}>
          <Sidebar opened={isSidebarOpened}>
            <ul
              className="bold"
              style={{
                margin: '8px 0 8px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>
                <Link href="/blog">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog') ? 'active' : ''}>{t('BLOG')}</a>
                </Link>
              </li>
              {/*<li>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9em', fontWeight: '500' }}>
                  <span>{t('ONLINE')}</span>
                  <i className="fas fa-globe" style={{ marginLeft: '15px', marginRight: '15px' }}></i>
                  usersConnected?.length
                </span>
              </li>
              */}
              {/* !isAuthenticated && (
                <li>
                  <Link href="/auth/login" as="/auth/login">
                    <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/auth/login') ? 'active' : ''}>{t('LOGIN')}</a>
                  </Link>
                </li>
              ) */}
              {isAuthenticated && (
                <li>
                  <Link href="/profile" as="/profile">
                    <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/profile') ? 'active' : ''}>{t('PROFILE')}</a>
                  </Link>
                </li>
              )}
              
              {isAuthenticated && (
                <li onClick={handleLogout}>
                  <a
                    className={isCurrentPathCb(router.pathname, '/auth/login') ? 'active' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={handleCloseSidebar}
                  >
                    {t('LOGOUT')}
                  </a>
                </li>
              )}
              {/*
              <li>
                <Link href="/subprojects/audit-list">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/subprojects/audit-list') ? 'active' : ''}>{t('AUDITLIST_OFFLINE')} 2023</a>
                </Link>
              </li>
              */}
              <li>
                <Link href="/blog/article/team-scoring">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.asPath, '/blog/article/team-scoring') ? 'active' : ''}>About Team Scoring 2019</a>
                </Link>
              </li>
              {/* <li>
                <Link href="/blog/article/ubuntu-first-steps">
                  <a className={isCurrentPathCb(router.pathname, '/blog/article/[slug]') ? 'active' : ''}>Ubuntu first steps</a>
                </Link>
              </li> */}

              {/* -- NOTE: Target Article*/}
              {/* <li>
                <Link href="/blog/article/tires-how-to-choose">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/article/tires-how-to-choose') || isCurrentPathCb(router.asPath, '/blog/article/tires-how-to-choose') ? 'active' : ''}>Шины и диски</a>
                </Link>
              </li>
              <li>
                <Link href="/blog/article/nginx-logs">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/article/nginx-logs') || isCurrentPathCb(router.asPath, '/blog/article/nginx-logs') ? 'active' : ''}>NGINX logs</a>
                </Link>
              </li> */}
              {/* <li>
                <Link href="/blog/article/limp-bizkit-video">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/article/limp-bizkit-video') || isCurrentPathCb(router.asPath, '/blog/article/limp-bizkit-video') ? 'active' : ''}>Limp Bizkit</a>
                </Link>
              </li> */}
              {/* -- */}

              {/* -- NOTE: Target search by title */}
              <li>
                <Link href="/blog/q/MartVirkus">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/q/MartVirkus') || isCurrentPathCb(router.asPath, '/blog/q/MartVirkus') ? 'active' : ''}>Comic by Mart Virkus</a>
                </Link>
              </li>
              <li>
                <Link href="/feedback">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/feedback') ? 'active' : ''}>{t('FEEDBACK')}</a>
                </Link>
              </li>
              <li>
                <a target='_self' href='/dist.hacker-news-2024'>Hacker News Client</a>
              </li>
            </ul>
            <div
              style={{
                borderTop: '1px solid #FFF',
              }}
            />
            <ul
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                gap: '8px',
                margin: '8px 0 8px 0',
              }}
            >
              {TagLinksListItems}
            </ul>
          </Sidebar>
          <ComposedComponent
            {...props}
            isSidebarOpened={isSidebarOpened}
            sidebarToggler={sidebarToggler}
            // scrollToRef={scrollToRef}
          />
        </Wrapper>
      )
    }
  )
