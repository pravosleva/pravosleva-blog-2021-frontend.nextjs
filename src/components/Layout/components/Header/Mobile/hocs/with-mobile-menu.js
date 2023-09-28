import React, { useEffect, useCallback } from 'react'
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
// import { userInfoActions } from '@/store/reducers/user-info'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  @media (max-width: 767px) {
    top: 0;
    bottom: 0;
    position: relative;
  }
  box-sizing: border-box;
`

const Sidebar = styled.div`
  background-color: white;
  overflow-y: auto;
  @media (min-width: 768px) {
    display: none;
  }
  @media (max-width: 767px) {
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
      padding: 10px 10px 10px 20px;
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
      color: #ff781e;
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
          if (window) {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          }

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
        if (isSidebarOpened) {
          dispatch(add('Layout_Header_Mobile_hocs_with-mobile-menu'))
        } else {
          dispatch(remove('Layout_Header_Mobile_hocs_with-mobile-menu'))
        }
      }, [
        isSidebarOpened,
        // scrollToRef,
        dispatch,
        topDocRef,
      ])

      const router = useRouter()
      const isCurrentPathCb = useCallback(isCurrentPath, [router.pathname, router.asPath])

      // useEffect(() => {
      //   console.log(router)
      // }, [])

      const handleCloseSidebar = useCallback(() => {
        sidebarToggler(false)
      }, [])

      return (
        <Wrapper opened={isSidebarOpened}>
          <Sidebar opened={isSidebarOpened}>
            <ul className="bold">
              {/*<li>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9em', fontWeight: '500' }}>
                  <span>{t('ONLINE')}</span>
                  <i className="fas fa-globe" style={{ marginLeft: '15px', marginRight: '15px' }}></i>
                  usersConnected?.length
                </span>
              </li>
              */}
              {!isAuthenticated && (
                <li>
                  <Link href="/auth/login" as="/auth/login">
                    <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/auth/login') ? 'active' : ''}>{t('LOGIN')}</a>
                  </Link>
                </li>
              )}
              {isAuthenticated && (
                <li>
                  <Link href="/profile" as="/profile">
                    <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/profile') ? 'active' : ''}>{t('PROFILE')}</a>
                  </Link>
                </li>
              )}
              <li>
                <Link href="/feedback">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/feedback') ? 'active' : ''}>{t('FEEDBACK')}</a>
                </Link>
              </li>
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
              <li>
                <Link href="/subprojects/todo">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/subprojects/todo') ? 'active' : ''}>{t('AUDITLIST_OFFLINE')}</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog') ? 'active' : ''}>{t('BLOG')}</a>
                </Link>
              </li>
              {/* <li>
                <Link href="/blog/article/ubuntu-first-steps">
                  <a className={isCurrentPathCb(router.pathname, '/blog/article/[slug]') ? 'active' : ''}>Ubuntu first steps</a>
                </Link>
              </li> */}

              {/* -- NOTE: Target Article*/}
              <li>
                <Link href="/blog/article/tires-how-to-choose">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/article/tires-how-to-choose') || isCurrentPathCb(router.asPath, '/blog/article/tires-how-to-choose') ? 'active' : ''}>Шины и диски</a>
                </Link>
              </li>
              <li>
                <Link href="/blog/article/nginx-logs">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/article/nginx-logs') || isCurrentPathCb(router.asPath, '/blog/article/nginx-logs') ? 'active' : ''}>NGINX logs</a>
                </Link>
              </li>
              <li>
                <Link href="/blog/article/limp-bizkit-video">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/article/limp-bizkit-video') || isCurrentPathCb(router.asPath, '/blog/article/limp-bizkit-video') ? 'active' : ''}>Клипы Limp Bizkit</a>
                </Link>
              </li>
              {/* -- */}

              {/* -- NOTE: Target search by title */}
              <li>
                <Link href="/blog/sqt/bash">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/sqt/bash') || isCurrentPathCb(router.asPath, '/blog/sqt/bash') ? 'active' : ''}>#bash</a>
                </Link>
              </li>
              <li>
                <Link href="/blog/sqt/nginx">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/sqt/nginx') || isCurrentPathCb(router.asPath, '/blog/sqt/nginx') ? 'active' : ''}>#nginx</a>
                </Link>
              </li>
              <li>
                <Link href="/blog/sqt/git">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/sqt/git') || isCurrentPathCb(router.asPath, '/blog/sqt/git') ? 'active' : ''}>#git</a>
                </Link>
              </li>
              <li>
                <Link href="/blog/sqt/ssl">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/sqt/ssl') || isCurrentPathCb(router.asPath, '/blog/sqt/ssl') ? 'active' : ''}>#ssl</a>
                </Link>
              </li>
              <li>
                <Link href="/blog/sqt/jsVanilla">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/sqt/jsVanilla') || isCurrentPathCb(router.asPath, '/blog/sqt/jsVanilla') ? 'active' : ''}>#jsVanilla</a>
                </Link>
              </li>
              <li>
                <Link href="/blog/sqt/cssVanilla">
                  <a onClick={handleCloseSidebar} className={isCurrentPathCb(router.pathname, '/blog/sqt/cssVanilla') || isCurrentPathCb(router.asPath, '/blog/sqt/cssVanilla') ? 'active' : ''}>#cssVanilla</a>
                </Link>
              </li>
              {/* -- */}
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
