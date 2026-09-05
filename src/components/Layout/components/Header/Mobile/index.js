import React, { useCallback, memo } from 'react'
import Headroom from 'react-headroom'
import styled, { css } from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { withMobileMenu } from './hocs/with-mobile-menu'
import { HamburgerIcon, CrossCloseIcon } from './components'
import { ThemeToggler } from '../../ThemeToggler'
import { withTranslator } from '@/hocs/withTranslator'
import { LangLink } from '../components/LangLink'
import { breakpoints } from '~/mui/theme'
import MemoryIcon from '@mui/icons-material/Memory'
import { toggleBrowserMemoryMonitor } from '~/store/reducers/customDevTools'

export const MobileHeaderLoader = styled.div`
  @media (min-width: ${breakpoints.sm + 1}px) {
    display: none;
  }
  @media (max-width: ${breakpoints.sm}px) {
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
    p.isSidebarOpened &&
    css`
      margin-right: 0;
    `}
`

const Nav = styled.div`
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
    text-transform: uppercase;
    letter-spacing: .1em;
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
  @media (min-width: ${breakpoints.md + 1}px) {
    display: none;
  }
`

// Оптимизация 5: Выносим стили элементов списка в Styled Components, 
// освобождая DOM от инлайнового мусора
const NavItem = styled.li`
  min-width: 45px;
  margin-bottom: 0px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  font-weight: 500;
`

// Оптимизация 2: Оборачиваем сам компонент в React.memo, 
// чтобы HOC-и не вызывали холостых перерисовок
const MobileHeader = memo(({
  sidebarToggler,
  isSidebarOpened,
  topDocRef,
  setLang,
  suppoerLocales,
  currentLang,
}) => {
  const dispatch = useDispatch()
  const isBrowserMemoryMonitorEnabled = !!useSelector((state) => state.customDevTools.browserMemoryMonitor.isEnabled)

  const toggleBrowserMemoryMonitorDevTools = useCallback((e) => {
    e.preventDefault()
    dispatch(toggleBrowserMemoryMonitor())
  }, [dispatch])

  // Оптимизация 1: Убираем каррирование. Передаем язык через data-аттрибут
  const handleSetLang = useCallback((e) => {
    e.preventDefault()
    const targetLang = e.currentTarget.getAttribute('data-lang')
    if (targetLang) {
      setLang(targetLang)
    }
  }, [setLang])

  // Оптимизация 3.2: Стабильная функция для закрытия сайдбара по клику на лого
  const handleLogoClick = useCallback(() => {
    sidebarToggler(false)
  }, [sidebarToggler])

  return (
    <Headroom style={{ zIndex: 5 }}>
      <header style={{ boxShadow: '0 0 4px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.28)' }}>
        <Nav ref={topDocRef}>
          <ul>
            <li
              style={{
                marginLeft: '16px',
                marginRight: 'auto',
                marginBottom: '0px',
                fontFamily: 'Montserrat',
                fontSize: '0.8em',
              }}
              onClick={handleLogoClick}
            >
              <a href='/' target='_self' style={{ lineHeight: '40px' }}>R-ENGINE</a>
            </li>

            {!isBrowserMemoryMonitorEnabled && (
              <li
                className='fade-in-effect'
                style={{
                  marginBottom: '0px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: '40px',
                }}
                onClick={toggleBrowserMemoryMonitorDevTools}
              >
                <LangLink
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  isCurrentSelection={isBrowserMemoryMonitorEnabled}
                >
                  <MemoryIcon />
                </LangLink>
              </li>
            )}

            {!!suppoerLocales &&
              suppoerLocales.length > 0 &&
              suppoerLocales.map((lang) => (
                <NavItem key={lang.label}>
                  {/* Оптимизация 4: Убран лишний Next Link, добавлен data-lang */}
                  <LangLink
                    title={lang.name}
                    isCurrentSelection={lang.value === currentLang}
                    onClick={handleSetLang}
                    data-lang={lang.value}
                  >
                    {lang.label}
                  </LangLink>
                </NavItem>
              ))}
              
            <ThemeToggler type="mobile" />
            
            <li style={{ marginBottom: '0px', display: 'flex', alignItems: 'center' }}>
              <HamburgerButton onClick={sidebarToggler} isSidebarOpened={isSidebarOpened}>
                {isSidebarOpened ? <CrossCloseIcon /> : <HamburgerIcon />}
              </HamburgerButton>
            </li>
          </ul>
        </Nav>
      </header>
    </Headroom>
  )
})

MobileHeader.displayName = 'MobileHeader'

// Экспортируем обернутый компонент
export default withMobileMenu(withTranslator(MobileHeader))
