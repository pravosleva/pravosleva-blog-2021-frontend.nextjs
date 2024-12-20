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
// import '~/mui/common.module.scss'
// @ts-ignore
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
// import { IRootState } from '~/store/IRootState';
import { SnackbarProvider } from 'notistack'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { Theme } from '~/ui-kit.uremont/Theme'
import Head from 'next/head'

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
  const ts = new Date().getTime()

  return (
    <>
      <Head>
        <meta name="theme-color" content="#0162c8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />

        <link
          href="/static/css/min/common.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link rel="stylesheet" href="/static/css/min/common.css" />
        
        <link
          href="/static/css/min/gosuslugi.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link rel="stylesheet" href="/static/css/min/gosuslugi.css" />

        <link
          href="/static/css/min/layout.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link href="/static/css/min/layout.css" rel="stylesheet" />

        {/* <link href="/static/css/min/animations.css" rel="stylesheet" /> */}
        {/* <link href="/static/css/min/fix.sweetalert2.css" rel="stylesheet" /> */}

        <link
          href={`/static/css/min/backdrop-blur.css?ts=${ts}`}
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link href={`/static/css/min/backdrop-blur.css?ts=${ts}`} rel="stylesheet" />

        <link
          href="/static/css/min/audit-list.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link href="/static/css/min/audit-list.css" rel="stylesheet" />
        
        <link
          href={`/static/css/global-theming.css?ts=${ts}`}
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link href={`/static/css/global-theming.css?ts=${ts}`} rel="stylesheet" />
        
        <link
          href="/static/css/min/standart-form.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link href="/static/css/min/standart-form.css" rel="stylesheet" />

        <link
          href="/static/css/min/rippled-btn.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link href="/static/css/min/rippled-btn.css" rel="stylesheet" />

        <link
          href="/static/css/min/link-as-rippled-btn.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link href="/static/css/min/link-as-rippled-btn.css" rel="stylesheet" />

        <link
          href="/static/css/custom-breadcrumbs.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link href="/static/css/custom-breadcrumbs.css" rel="stylesheet" />

        {/* <link href="/static/css/min/block-quotes.css" rel="stylesheet" /> */}

        {/* <link href="/static/css/min/sp-nw-2022.css" rel="stylesheet" /> */}

        <link
          href="/static/prismjs/themes/prism-material-theme.min.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link href="/static/prismjs/themes/prism-material-theme.min.css" rel="stylesheet" />

        <link
          href="/static/css/min/mapbox-gl@2.6.1.min.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link href="/static/css/min/mapbox-gl@2.6.1.min.css" rel="stylesheet" />
        
        {/* <link
          href="https://use.fontawesome.com/releases/v5.8.0/css/all.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
          integrity="sha384-Mmxa0mLqhmOeaE8vgOSbKacftZcsNYDjQzuCOm6D02luYSzBG8vpaOykv9lFQ51Y"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.8.0/css/all.css"
          integrity="sha384-Mmxa0mLqhmOeaE8vgOSbKacftZcsNYDjQzuCOm6D02luYSzBG8vpaOykv9lFQ51Y"
          crossOrigin="anonymous"
        /> */}

        <link
          href="/static/css/variant.react-image-ligthbox.css"
          rel="preload"
          as="style"
          // @ts-ignore
          fetchpriority="high"
        />
        <link href="/static/css/variant.react-image-ligthbox.css" rel="stylesheet" />

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
    </>
  )
}

export default wrapper.withRedux(AppWithRedux)
