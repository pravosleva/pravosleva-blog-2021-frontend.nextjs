import React, { useEffect, useCallback, useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import Link from 'next/link'
import { add, remove } from '@/store/reducers/scrollDisablingComponents'
import { withScrollDisabler } from '@/hocs/withScrollDisabler'
import { isCurrentPath } from '@/utils/routing/isCurrentPath'
import { withTranslator } from '@/hocs/withTranslator'
import { breakpoints } from '~/mui/theme'
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
    padding: 10px 20px;
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

const STATIC_TAGS = [...['сетевые_протоколы', 'краснаяАкула', 'bash', 'git', 'nginx', 'рабочие_моменты']].sort(abSort)

export const withMobileMenu = (ComposedComponent) => {
  // 1. Создаем внутренний чистый компонент со всей логикой
  const MenuWrapperComponent = (props) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const topDocRef = useRef(null)
    const [isSidebarOpened, setIsSidebarOpened] = useState(false)

    const sidebarToggler = useCallback((val) => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      setIsSidebarOpened((prev) => (typeof val === 'boolean' ? val : !prev))
    }, [])

    useEffect(() => {
      const MENU_KEY = 'Layout_Header_Mobile_hocs_with-mobile-menu'
      if (isSidebarOpened) {
        dispatch(add(MENU_KEY))
      } else {
        dispatch(remove(MENU_KEY))
      }
    }, [isSidebarOpened, dispatch])

    const handleCloseSidebar = useCallback(() => {
      sidebarToggler(false)
    }, [sidebarToggler])

    const oneTimePasswordServiceMessage = useSelector((state) => state.baseProps?.authData?.oneTime?.jwt?._service?.message)
    const oneTimePasswordChatId = useSelector((state) => state.baseProps?.authData?.oneTime?.jwt?.data?.chat_id)

    const checkActive = useCallback((targetPath) => {
      return isCurrentPath(router.pathname, targetPath) || isCurrentPath(decodeURIComponent(router.asPath), targetPath) ? 'active' : ''
    }, [router.pathname, router.asPath])

    const tagLinksListItems = useMemo(() => {
      return STATIC_TAGS.map((tag) => {
        const path = `/blog/q/${tag}`
        return (
          <li key={tag}>
            <Link href={path}>
              <a onClick={handleCloseSidebar} className={checkActive(path)}>
                #{tag}
              </a>
            </Link>
          </li>
        )
      })
    }, [handleCloseSidebar, checkActive])

    return (
      <Wrapper opened={isSidebarOpened}>
        <Sidebar opened={isSidebarOpened}>
          <ul className="bold" style={{ margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <Link href="/blog">
                <a onClick={handleCloseSidebar} className={checkActive('/blog')}>{props.t('BLOG')}</a>
              </Link>
            </li>
            <li>
              <Link href="/p/estimate-corrector-2024">
                <a onClick={handleCloseSidebar} className={isCurrentPath(router.asPath, '/p/estimate-corrector-2024') ? 'active' : ''}>
                  About Estimate Corrector 2024
                </a>
              </Link>
            </li>
            <li>
              <Link href="/p/protocols">
                <a onClick={handleCloseSidebar} className={isCurrentPath(router.asPath, '/p/protocols') ? 'active' : ''}>
                  {props.t('NETWORK_PROTOCOLS')}
                </a>
              </Link>
            </li>
            <li>
              <Link href="/blog/q/MartVirkus">
                <a onClick={handleCloseSidebar} className={checkActive('/blog/q/MartVirkus')}>Comic by Mart Virkus</a>
              </Link>
            </li>
            <li>
              <Link href="/feedback">
                <a onClick={handleCloseSidebar} className={checkActive('/feedback')}>{props.t('FEEDBACK')}</a>
              </Link>
            </li>
            <li>
              <Link href="/p/cv-ru">
                <a onClick={handleCloseSidebar} className={isCurrentPath(router.asPath, '/p/cv-ru') ? 'active' : ''}>
                  {props.t('CV')}
                </a>
              </Link>
            </li>
            <li>
              <Link href="/p/what-where-when">
                <a onClick={handleCloseSidebar} className={isCurrentPath(router.asPath, '/p/what-where-when') ? 'active' : ''}>
                  {props.t('WHAT_WHERE_WHEN_EXTERNAL_LINK')}
                </a>
              </Link>
            </li>
          </ul>
          
          <div style={{ borderTop: '1px solid #FFF' }} />
          
          <ul style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', gap: '8px', margin: '8px 0' }}>
            {tagLinksListItems}
          </ul>
          
          {!!oneTimePasswordChatId && (
            <>
              <div style={{ borderTop: '1px solid #FFF' }} />
              <ul>
                <li>
                  <Link href={`/autopark-2022/${oneTimePasswordChatId}`}>
                    <a onClick={handleCloseSidebar} className={isCurrentPath(router.asPath, `/autopark-2022/${oneTimePasswordChatId}`) ? 'active' : ''}>
                      🔓 Logged in Autopark
                    </a>
                  </Link>
                </li>
              </ul>
            </>
          )}
          
          {!!oneTimePasswordServiceMessage && (
            <>
              <div style={{ borderTop: '1px solid #FFF' }} />
              <ul style={{ fontSize: 'small' }}>
                <li><b>⚠️ {oneTimePasswordServiceMessage}</b></li>
              </ul>
            </>
          )}
        </Sidebar>

        <ComposedComponent
          {...props}
          topDocRef={topDocRef}
          isSidebarOpened={isSidebarOpened}
          sidebarToggler={sidebarToggler}
        />
      </Wrapper>
    )
  }

  // 2. Оборачиваем созданный компонент в другие HOC-и по очереди, чтобы не запутаться в скобках
  const EnhancedComponent = withTranslator(withScrollDisabler(MenuWrapperComponent))

  EnhancedComponent.displayName = `withMobileMenu(${ComposedComponent.displayName || ComposedComponent.name || 'Component'})`
  
  return EnhancedComponent
}
