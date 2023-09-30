import React, { useEffect, useMemo } from 'react';
// import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '~/mui/theme';
import createEmotionCache from '~/createEmotionCache';
// import { CookiesProvider } from 'react-cookie';
import { wrapper } from '~/store';
import { pageview } from '~/utils/googleAnalitycs';
import { useRouter } from 'next/router'
import '~/mui/common.css'
// @ts-ignore
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
// import { IRootState } from '~/store/IRootState';
import { SnackbarProvider } from 'notistack'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { Theme } from '~/ui-kit/Theme'
import '../public/static/css/article.css' 
import Head from 'next/head'

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

  const store = useStore()
  const isServer = useMemo<boolean>(() => typeof window === 'undefined', [typeof window])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/static/favicon.ico" />
        {/* <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' /> */}

        <meta name="theme-color" content="#0162c8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />

        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>
      {
        isServer ? (
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <CacheProvider value={emotionCache}>
              <SCThemeProvider theme={Theme}>
                <ThemeProvider theme={theme}>
                  {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </SCThemeProvider>
            </CacheProvider>
          </SnackbarProvider>
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
            >
              <CacheProvider value={emotionCache}>
                <SCThemeProvider theme={Theme}>
                  <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <Component {...pageProps} />
                  </ThemeProvider>
                </SCThemeProvider>
              </CacheProvider>
            </SnackbarProvider>
          </PersistGate>
        )
      }
    </>
  )
}

export default wrapper.withRedux(AppWithRedux)
