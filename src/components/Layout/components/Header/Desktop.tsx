import React, { memo, useCallback, useState } from 'react'
import Headroom from 'react-headroom'
import styled from 'styled-components'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { MenuModal } from './components/MenuModal'
import { useUnscrolledBody } from '~/hooks/useUnscrolledBody'
import { ThemeToggler } from '../ThemeToggler'
import { withTranslator } from '@/hocs/withTranslator'
import { LangLink } from './components/LangLink'
import { breakpoints } from '~/mui/theme'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { IRootState } from '~/store/IRootState'
import MemoryIcon from '@mui/icons-material/Memory'
import { toggleBrowserMemoryMonitor } from '~/store/reducers/customDevTools'

// Переносим повторяющиеся инлайновые стили в styled-компонент, 
// чтобы React не пересоздавал объекты стилей на каждом рендере.
const Nav = styled.div`
  font-size: 16px;
  font-weight: 500;
  padding: 0;
  color: #fff;
  background-color: #0162c8;

  & ul {
    max-width: calc(${breakpoints.md}px + 40px);
    display: flex;
    list-style: none;
    margin: 0 auto;
    padding: 0;
    line-height: 50px;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: .1em;
  }
  & ul > li:first-child {
    margin-left: auto;
  }
  & ul > li > a {
    text-decoration: none;
    color: #fff;
    display: block;
    height: 100%;
  }
  @media (max-width: ${breakpoints.md}px) {
    display: none;
  }
`

const NavItem = styled.li`
  margin-bottom: 0px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface ISupportLocale {
  label: string;
  value: string;
  name: string;
}

interface IDesktopHeaderProps {
  t: (str: string, opts?: any) => string;
  setLang: (lang: string) => void;
  suppoerLocales: ISupportLocale[];
  currentLang: string;
}

const _DesktopHeader = memo(({
  setLang,
  suppoerLocales,
  currentLang,
}: IDesktopHeaderProps) => {
  const dispatch = useDispatch()
  
  // Оптимизация 1: Селекторы вытаскивают только примитивы, рендер сработает только при реальном изменении
  const isAuthenticated = !!useSelector((state: IRootState) => state.userInfo?.fromServer?.id)
  const isBrowserMemoryMonitorEnabled = !!useSelector((state: IRootState) => state.customDevTools.browserMemoryMonitor.isEnabled)

  const toggleBrowserMemoryMonitorDevTools = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(toggleBrowserMemoryMonitor())
  }, [dispatch])

  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const { onBlockScrollBody } = useUnscrolledBody(false)

  const handleMenuClose = useCallback(() => {
    onBlockScrollBody(false)
    setIsMenuOpened(false)
  }, [onBlockScrollBody])

  // Оптимизация 2: Избавляемся от каррирования. 
  // Вместо создания функции в функции, мы принимаем значение из data-атрибута элемента.
  const handleSetLang = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const targetLang = e.currentTarget.getAttribute('data-lang')
    if (targetLang) {
      setLang(targetLang)
    }
  }, [setLang])

  return (
    <>
      <Headroom style={{ zIndex: 5 }}>
        <header style={{ boxShadow: '0 0 4px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.28)' }}>
          <Nav>
            <ResponsiveBlock isLimited isPaddedMobile>
              <ul>
                <li style={{ margin: '0 auto 0 0' }}>
                  <Link href="/">
                    R-ENGINE
                  </Link>
                </li>

                {!isBrowserMemoryMonitorEnabled && (
                  <NavItem
                    className="fade-in-effect"
                    onClick={toggleBrowserMemoryMonitorDevTools}
                    title="Or try this 👉 ?open_clent_perf_widget=1 👈"
                  >
                    <LangLink
                      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                      isCurrentSelection={isBrowserMemoryMonitorEnabled}
                    >
                      <MemoryIcon />
                    </LangLink>
                  </NavItem>
                )}

                {suppoerLocales.map((lang) => (
                  <NavItem key={lang.label}>
                    {/* Оптимизация 3: Передаем значение через data-lang и убираем лишнюю обертку Link, */}
                    {/* так как это не переход по страницам, а переключение стейта языка на месте. */}
                    <LangLink
                      isCurrentSelection={lang.value === currentLang}
                      onClick={handleSetLang}
                      data-lang={lang.value}
                      title={lang.name}
                    >
                      {lang.label}
                    </LangLink>
                  </NavItem>
                ))}

                <ThemeToggler type="desktop" />
              </ul>
            </ResponsiveBlock>
          </Nav>
        </header>
      </Headroom>
      
      <MenuModal
        isOpened={isMenuOpened}
        onHideModal={handleMenuClose}
        isAuthenticated={isAuthenticated}
      />
    </>
  )
})

_DesktopHeader.displayName = 'DesktopHeader'

export const DesktopHeader = withTranslator<Omit<IDesktopHeaderProps, 't' | 'setLang' | 'suppoerLocales' | 'currentLang'>>(_DesktopHeader)
