import React, { useCallback } from 'react'
import Headroom from 'react-headroom'
import styled, { css } from 'styled-components'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { withMobileMenu } from './hocs/with-mobile-menu'
import { HamburgerIcon, CrossCloseIcon } from './components'
// import { showAsyncToast } from '@/actions'
// import { logout } from '@/helpers/services/restService'
import { useRouter } from 'next/router'
// import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { isCurrentPath } from '@/utils/routing/isCurrentPath'
// import { ThemeToggler } from '../../ThemeToggler'
import { withTranslator } from '@/hocs/withTranslator'
import { LangLink } from '../components/LangLink'
// import { userInfoActions } from '@/store/reducers/user-info'
import loadable from '@loadable/component'

const Identicon = loadable(() => import(/* webpackChunkName: "identicon" */ 'react-hooks-identicons'), {
  ssr: false,
})

// Could be used if !ssr
export const MobileHeaderLoader = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
  @media (max-width: 767px) {
    height: 40px;
    background-color: transparent;
  }
`
const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  height: 100%;
  background: transparent;
  ${(p) =>
    p.issidebaropened &&
    css`
      margin-right: 0;
    `}
`
// const slideDownEffect = keyframes`
//   0%{transform:translateY(-60px)}90%{transform:translateY(0)}100%{transform:translateY(0)}
// `
const Nav = styled('div')`
  padding: 0;
  color: #fff;
  background-color: #0162c8;
  > ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    line-height: 40px;
    font-size: 16px;
  }
  > ul > li:first-child {
    margin-left: auto;
  }
  > ul > li:last-child {
    margin-right: 0;
  }
  > ul > li > a {
    text-decoration: none;
    color: #fff;
  }
  > ul > li > .login-btn-m {
    text-decoration: none;
    background-color: transparent;
  }
  @media (min-width: 768px) {
    display: none;
  }
`

// const getSlicedText = ({ text, limit = 7 }) => {
//   let sliced = text.slice(0, limit);
//
//   if (sliced.length < text.length) sliced += '...';
//
//   return sliced;
// };

const MobileHeader = ({
  // withMobileMenu:
  sidebarToggler,
  issidebaropened,
  topDocRef,

  // withTranslator:
  t,
  setLang,
  suppoerLocales, // Array like this: [{ label, name, value }]
  currentLang,
}) => {
  const isAuthenticated = !!useSelector((state) => state.userInfo?.fromServer?.id)
  // const dispatch = useDispatch()
  const userInfo = !!useSelector((state) => state.userInfo?.fromServer)
  const router = useRouter()
  // const handleLogoutCb = useCallback(async () => {
  //   await logout()
  //     .then(() => {
  //       router.push('/auth/login')
  //     })
  //     .catch((msg) => {
  //       dispatch(showAsyncToast({ text: msg, delay: 20000, type: 'error' }))
  //     })
  // }, [dispatch, showAsyncToast])
  // const handleLogout = useDebouncedCallback(() => {
  //   handleLogoutCb().then(() => {
  //     dispatch(userInfoActions.fillDelta({ fromServer: null, isLoadedSuccessfully: true }))
  //   })
  // }, 500)
  const isCurrentPathCb = useCallback(isCurrentPath, [])
  const handleSetLang = useCallback(
    (value) => (e) => {
      e.preventDefault()
      setLang(value)
    },
    []
  )
  const redirectToProfile = useCallback(() => {
    router.push('/profile')
  }, [])

  return (
    <Headroom>
      <header style={{ boxShadow: '0 0 4px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.28)' }}>
        <Nav ref={topDocRef}>
          <ul
            style={{
              textTransform: 'uppercase',
              letterSpacing: '.1em',
              display: 'flex',
              gap: '',
            }}
          >
            <li
              style={{
                marginLeft: '20px',
                marginRight: 'auto',
                marginBottom: '0px',
                fontFamily: 'Montserrat',
                fontSize: '0.8em',
              }}
              onClick={() => sidebarToggler(false)}
            >
              <Link href="/" as="/">
                <a style={{ lineHeight: '40px' }}>Pravosleva blog</a>
              </Link>
            </li>
            {!!suppoerLocales &&
              suppoerLocales.length > 0 &&
              suppoerLocales.map((lang) => (
                <li
                  key={lang.label}
                  style={{
                    minWidth: '45px',
                    marginBottom: '0px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: '500',
                  }}
                >
                  <Link href="/">
                    <LangLink
                      title={lang.name}
                      isCurrentSelection={lang.value === currentLang}
                      onClick={handleSetLang(lang.value)}
                    >
                      {lang.label}
                    </LangLink>
                  </Link>
                </li>
              ))}
            {/* <ThemeToggler /> */}
            {!isAuthenticated && (
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '40px',
                  marginBottom: '0px',
                  fontFamily: 'Montserrat',
                }}
                className="fade-in-effect"
                title={t('LOGIN')}
              >
                <Link href="/auth/login">
                  <a
                    style={{
                      color: isCurrentPathCb(router.pathname, '/auth/login') ? '#ff781e' : '#FFF',
                      height: '100%',
                      width: '100%',
                      textAlign: 'center',
                    }}
                    className={`${!isCurrentPathCb(router.pathname, '/auth/login') ? ' muted no-muted-on-hover' : ''}`}
                  >
                    <span style={{ height: '100%' }}>
                      <i className="fas fa-fingerprint"></i>
                    </span>
                  </a>
                </Link>
              </li>
            )}
            {/* isAuthenticated && (
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '40px',
                  marginBottom: '0px',
                  fontFamily: 'Montserrat',
                }}
                className="fade-in-effect"
                onClick={handleLogout}
                title="Logout"
              >
                <a href="#" style={{ width: '100%', textAlign: 'center' }}>
                  <i className="fas fa-sign-out-alt"></i>
                </a>
              </li>
            ) */}
            {isAuthenticated && process.browser && (
              <li style={{ marginLeft: '0px', marginBottom: '0px', minWidth: '40px' }} className="avatar-wrapper">
                <div style={{ cursor: 'pointer' }} onClick={redirectToProfile} className="avatar-wrapper">
                  <Identicon
                    string={userInfo.email}
                    size={21}
                    bg="transparent"
                    fg={isCurrentPathCb(router.pathname, '/profile') ? '#ff781e' : '#fff'}
                    count={5}
                    padding={1}
                  />
                </div>
              </li>
            )}
            <li
              style={{
                marginBottom: '0px',

                display: 'flex',
                alignItems: 'center',
              }}
            >
              <HamburgerButton onClick={sidebarToggler} issidebaropened={issidebaropened}>
                {issidebaropened ? <CrossCloseIcon /> : <HamburgerIcon />}
              </HamburgerButton>
            </li>
          </ul>
        </Nav>
      </header>
      <style jsx>{`
        .avatar-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </Headroom>
  )
}

export default withMobileMenu(withTranslator(MobileHeader))
