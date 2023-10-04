// import { useMemo } from 'react'
import NextNProgress from 'nextjs-progressbar'
import clsx from 'clsx'
import DesktopHeader from './components/Header/Desktop'
import MobileHeader from './components/Header/Mobile'
import { useStyles } from './useStyles'
import classes from './Layout.module.scss'

type TProps = {
  children: React.ReactNode;
  noFooter?: boolean;
}

export const Layout = ({ children, noFooter }: TProps) => {
  // const fullYear = useMemo(() => new Date().getFullYear(), [])
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

      {
        !noFooter && (
          <>
            <footer
              style={{
                minHeight: '70px',
                // border: '2px dashed red',
              }}
            >
              <div style={{ margin: '0 auto', maxWidth: 960 + 40, lineHeight: '70px' }}>
                <span style={{ margin: '0 20px 0 20px' }}>© 2018</span>
              </div>
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
