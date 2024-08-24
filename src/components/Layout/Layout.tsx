import { useMemo } from 'react'
import NextNProgress from 'nextjs-progressbar'
import clsx from 'clsx'
import { DesktopHeader } from './components/Header/Desktop'
import MobileHeader from './components/Header/Mobile'
import { useStyles } from './useStyles'
import classes from './Layout.module.scss'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { CookiePolicyOffer } from '~/components'
import { ScrollTopBtn } from './components/ScrollTopBtn'
import TelegramIcon from '@mui/icons-material/Telegram'

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
      <ScrollTopBtn />

      {
        !noFooter && (
          <>
            <footer
              style={{
                // minHeight: '70px',
                // border: '2px dashed red',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
              }}
            >
              <ResponsiveBlock isLimited isPaddedMobile>
                <div
                  style={{
                    // lineHeight: '70px',
                    padding: '16px 0 16px 0',
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div>© 2018 – {fullYear}, Pravosleva, Inc. or its affiliates</div>
                  <div
                    style={{
                      // lineHeight: '70px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <a
                      // className='link-as-rippled-btn truncate'
                      style={{
                        whiteSpace: 'pre',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#fff',
                      }}
                      href='https://t.me/bash_exp_ru'
                    >
                      {/* <i className="fas fa-arrow-left"></i> */}
                      <TelegramIcon
                        // style={{
                        //   borderRadius: '50%',
                        //   border: `2px solid ${linkColor}`,
                        // }}
                      />
                      {/* <span style={{ marginLeft: '10px', whiteSpace: 'pre', fontWeight: 'bold' }} className='truncate'>@pravosleva</span> */}
                    </a>
                  </div>
                </div>
              </ResponsiveBlock>
            </footer>
          </>
        )
      }
    </>
  )
}
