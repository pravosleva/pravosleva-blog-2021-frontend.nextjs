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
  const fullYear = useMemo(() => new Date().getFullYear(), [])
  const styles = useStyles()
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  // const basePropsErrors = useSelector((state: IRootState) => state.baseProps.errors)
  const isServer = useMemo(() => typeof window === 'undefined', [typeof window])

  return (
    <>
      <DesktopHeader />
      <MobileHeader />
      <NextNProgress color="#FFF" startPosition={0.3} stopDelayMs={200} height={2} options={{ showSpinner: false }} />
      <main
        // className="universal-container"
        className={clsx(styles.content, classes.limitedHeight, currentTheme)}
      >
        {children}
      </main>

      {/* basePropsErrors.length > 0 && (
        <ResponsiveBlock isLimited isPaddedMobile>
          <pre>{JSON.stringify(basePropsErrors, null, 2)}</pre>
        </ResponsiveBlock>
      ) */}

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
                padding: isServer ? '16px 0px 16px 0px' : '0',
              }}
            >
              <ResponsiveBlock isLimited isPaddedMobile>
                <div className={classes.footerMainBox}>
                  <div className={classes.footerSiteInfoBox}>
                    <div>Pravosleva {NEXT_APP_VERSION}, Inc. or its affiliates</div>
                    <div>Last build {NEXT_APP_BUILD_DATE}</div>
                    <div>GIT SHA1 {NEXT_APP_GIT_SHA1}</div>
                    <div>© 2018 – {fullYear}</div>
                  </div>
                  <div className={classes.footerSiteSocialBox}>
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
