import { useMemo } from 'react'
import NextNProgress from 'nextjs-progressbar'
import clsx from 'clsx'
import { DesktopHeader } from './components/Header/Desktop'
import MobileHeader from './components/Header/Mobile'
import { useStyles } from './useStyles'
import classes from './Layout.module.scss'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { CookiePolicyOffer } from '~/components'

type TProps = {
  children: React.ReactNode;
  noFooter?: boolean;
}

export const Layout = ({ children, noFooter }: TProps) => {
  const fullYear = useMemo(() => new Date().getFullYear(), [])
  const styles = useStyles()

  return (
    <>
      <DesktopHeader />
      <MobileHeader />
      <NextNProgress color="#FFF" startPosition={0.3} stopDelayMs={200} height={2} options={{ showSpinner: false }} />
      <main
        // className="universal-container"
        className={clsx(styles.content, classes.limitedHeight)}
      >
        {children}
      </main>
      <CookiePolicyOffer />

      {
        !noFooter && (
          <>
            <footer
              style={{
                minHeight: '70px',
                // border: '2px dashed red',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
              }}
            >
              <ResponsiveBlock isLimited isPaddedMobile>
                <div style={{ lineHeight: '70px' }}>
                  <span>© 2018 – {fullYear}, Pravosleva, Inc. or its affiliates</span>
                </div>
              </ResponsiveBlock>
            </footer>
            {/* <ScrollTopBtn onClick={scrollTop} isShowed={showScroll} themeName={currentTheme}>
              <i className="fas fa-arrow-up"></i>
            </ScrollTopBtn> */}
          </>
        )
      }
    </>
  )
}
