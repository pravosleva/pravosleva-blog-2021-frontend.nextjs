import React, { useEffect, useMemo } from 'react';
// import Head from 'next/head';
import App, { AppContext, AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '~/mui/theme';
import createEmotionCache from '~/createEmotionCache';
// import { CookiesProvider } from 'react-cookie';
import { wrapper } from '~/store';
import { pageview } from '~/utils/googleAnalitycs';
import { useRouter } from 'next/router'
// import '~/mui/common.module.scss'
// @ts-ignore
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
// import { IRootState } from '~/store/IRootState';
import { SnackbarProvider } from 'notistack'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { Theme } from '~/ui-kit.uremont/Theme'
import Head from 'next/head'
import Script from 'next/script'

// import '../public/static/css/min/gosuslugi.css'
import '../public/static/css/min/animations.css'
import '../public/static/css/min/fix.sweetalert2.css'
// import '../public/static/css/min/backdrop-blur.css'
// import '../public/static/css/article.css'
// import '../public/static/css/min/audit-list.css'
// import '../public/static/css/min/layout.css'
// import '../public/static/css/min/project-list.css'
// import '../public/static/css/min/global-theming.css'
// import '../public/static/css/min/standart-form.css'
// import '../public/static/css/min/rippled-btn.css'
// import '../public/static/css/min/link-as-rippled-btn.css'
// import '../public/static/css/min/custom-breadcrumbs.css'
import '../public/static/css/min/block-quotes.css'
import '../public/static/css/min/sp-nw-2022.css'

import { ClientPerfWidget } from '~/components'
import { getInitialPropsBase } from '~/utils/next/getInitialPropsBase';
import { setTheme } from '~/store/reducers/globalTheme';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function AppWithRedux(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  } = props;

  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url)
    }
    // When the component is mounted, subscribe to router changes
    // and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // -- NOTE: Optimization
  useEffect(() => {
    // Находим на клиенте тег со стилями, который прилетел с сервера
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      // Удаляем его, так как клиентский рантайм @mui/styles уже перехватил управление
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  // --

  const store = useStore()
  const isServer = useMemo<boolean>(() => typeof window === 'undefined', [typeof window])
  // const ts = new Date().getTime()

  return (
    <>
      <Head>
        <meta name="theme-color" content="#0162c8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />

        {/* Базовый цвет темы (оставляем тут, так как завязано на рантайм) */}
        <meta name="theme-color" content="#0162c8" />
        
        {/* Каноническая ссылка по умолчанию (страницы смогут перебивать её своим уникальным URL) */}
        <link rel="canonical" href='https://pravosleva.pro/' />

        {/* Мета-тег viewport (Next.js требует держать его строго в _app) */}
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />

        {/* <script type="text/javascript" defer src='/static/common/eruda.custom.js' /> */}
      </Head>
      {
        isServer ? (
          <CacheProvider value={emotionCache}>
            <SCThemeProvider theme={Theme}>
              <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Component {...pageProps} />
              </ThemeProvider>
            </SCThemeProvider>
          </CacheProvider>
        ) : (
          <PersistGate
            // @ts-ignore
            persistor={store.__persistor}
          >
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              style={{
                borderRadius: '8px',
                maxWidth: '430px',
              }}
            >
              <CacheProvider value={emotionCache}>
                <SCThemeProvider theme={Theme}>
                  <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <Component {...pageProps} />
                    <ClientPerfWidget position='top-center' />
                  </ThemeProvider>
                </SCThemeProvider>
              </CacheProvider>
            </SnackbarProvider>
          </PersistGate>
        )
      }

      {!isServer &&
        <Script src="/static/common/eruda.custom.js" strategy="lazyOnload" />
      }
    </>
  )
}

AppWithRedux.getInitialProps = wrapper.getInitialAppProps(
  (store) => async (context: AppContext) => {
    // 1. Запускаем базовую функцию
    const baseProps = await getInitialPropsBase(context.ctx)
    const targetTheme = baseProps.themeData.fromCookies || baseProps.themeData.default
    
    // 2. Диспатчим тему в стор, чтобы серверный HTML зафиксировал её
    store.dispatch(setTheme(targetTheme))

    const appProps = await App.getInitialProps(context)
    return {
      ...appProps,
      pageProps: {
        ...appProps.pageProps,
        baseProps
      }
    }
  }
)

export default wrapper.withRedux(AppWithRedux)
