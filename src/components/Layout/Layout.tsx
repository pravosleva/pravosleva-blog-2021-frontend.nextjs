import React, { useMemo, useEffect, useState } from 'react'
import NextNProgress from 'nextjs-progressbar'
import clsx from 'clsx'
import { DesktopHeader } from './components/Header/Desktop'
import MobileHeader from './components/Header/Mobile'
import { useStyles } from './useStyles'
import classes from './Layout.module.scss'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { CookiePolicyOffer } from '~/components'
import { ScrollTopBtn } from './components/ScrollTopBtn'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

const NEXT_APP_BUILD_DATE = process.env.NEXT_APP_BUILD_DATE || 'No env'
const NEXT_APP_GIT_SHA1 = process.env.NEXT_APP_GIT_SHA1 || 'No env'
const NEXT_APP_VERSION = process.env.NEXT_APP_VERSION || 'No env'

type TProps = {
  children: React.ReactNode;
  noFooter?: boolean;
}

export const Layout = ({ children, noFooter }: TProps) => {
  const styles = useStyles()
  
  // Оптимизация 1: Получаем тему. Чтобы избежать полной перерисовки 
  // children при смене темы, класс темы лучше вешать на body через useEffect, 
  // но если архитектура требует вешать на <main>, оставляем здесь.
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)

  // Оптимизация 2: Год можно безопасно вычислить на сервере один раз, 
  // так как он не изменится в процессе сессии пользователя.
  const fullYear = useMemo(() => new Date().getFullYear(), [])

  // Оптимизация 3: Убираем глитч футера через состояние монтирования
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <DesktopHeader />
      <MobileHeader />
      
      <NextNProgress 
        color="#FFF" 
        startPosition={0.3} 
        stopDelayMs={200} 
        height={2} 
        options={{ showSpinner: false }} 
      />
      
      <main className={clsx(styles.content, classes.limitedHeight, currentTheme)}>
        {children}
      </main>
      
      <CookiePolicyOffer />
      <ScrollTopBtn />
      
      {!noFooter && (
        <footer
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            // Заменяем isServer на логику, которая на сервере и при первом рендере в браузере даст одинаковый результат ('16px 0px')
            // И только после успешного мантирования (когда сработает useEffect) изменится на '0'
            padding: isClient ? '0' : '16px 0px 16px 0px',
          }}
        >
          <ResponsiveBlock isLimited isPaddedMobile>
            <div className={classes.footerMainBox}>
              <div className={classes.footerSiteInfoBox}>
                <div>
                  <a
                    style={{ whiteSpace: 'pre', color: '#fff', fontWeight: 'bold' }}
                    href='https://t.me/pravosleva'
                  >
                    @pravosleva
                  </a>
                </div>
                <div>2018 – {fullYear}</div>
                <div>
                  Ver. <code>{NEXT_APP_VERSION}</code> Last build {NEXT_APP_BUILD_DATE}
                </div>
                <div>
                  GIT SHA1 <code>{NEXT_APP_GIT_SHA1}</code>
                </div>
                <div>
                  Bundle analyzer 👉{' '}
                  <a
                    style={{ whiteSpace: 'pre', color: '#fff', fontWeight: 'bold' }}
                    href='/static/analyze/server.html' 
                    target='_blank'
                  >
                    Server
                  </a>{' '}
                  |{' '}
                  <a
                    style={{ whiteSpace: 'pre', color: '#fff', fontWeight: 'bold' }}
                    href='/static/analyze/client.html' 
                    target='_blank'
                  >
                    Client
                  </a>
                </div>
              </div>
            </div>
          </ResponsiveBlock>
        </footer>
      )}
    </>
  )
}
