// import { useMemo } from 'react'
import NextNProgress from 'nextjs-progressbar'
import DesktopHeader from './components/Header/Desktop'
import MobileHeader from './components/Header/Mobile'

type TProps = {
  children: React.ReactNode;
}

export const Layout = ({ children }: TProps) => {
  // const fullYear = useMemo(() => new Date().getFullYear(), [])

  return (
    <>
      <DesktopHeader />
      <MobileHeader />
      <NextNProgress color="#FFF" startPosition={0.3} stopDelayMs={200} height={2} options={{ showSpinner: false }} />
      <div className="universal-container">
        <main
          className='min-height-limited--withoutHeader'
          style={{
            // padding: '20px 0 20px 0',
            // border: '2px solid red',
            boxSizing: 'border-box',
          }}
        >{children}</main>
      </div>
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
