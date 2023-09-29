import React, { useEffect } from 'react';
// import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '~/mui/theme';
// import createEmotionCache from '~/createEmotionCache';
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
// const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  // emotionCache?: EmotionCache;
}

function AppWithRedux(props: MyAppProps) {
  const {
    Component,
    // emotionCache = clientSideEmotionCache,
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

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />
        <link rel="apple-touch-icon" href="https://pravosleva.ru/static/img/logo/logo-pravosleva-76x76.jpg" sizes="76x76"></link>
        <link rel="apple-touch-icon" href="https://pravosleva.ru/static/img/logo/logo-pravosleva-120x120.jpg" sizes="120x120"></link>
        <link rel="apple-touch-icon" href="https://pravosleva.ru/static/img/logo/logo-pravosleva-152x152.jpg" sizes="152x152"></link>
        <link rel="apple-touch-icon" href="https://pravosleva.ru/static/img/logo/logo-pravosleva-180x180.jpg" sizes="180x180"></link>
        {/* <link rel="alternate" type="application/rss+xml" title="Новости Яндекса" href="https://yandex.ru/company/press_releases/news.rss"></link> */}
        {/* <link rel="alternate" type="application/rss+xml" title="Блог Яндекса" href="https://yandex.ru/blog/company/rss"></link> */}
        {/* <link rel="search" href="//yandex.ru/opensearch.xml" title="Яндекс" type="application/opensearchdescription+xml"></link> */}
        <link rel="shortcut icon" href="https://pravosleva.ru/static/img/logo/logo-pravosleva-16x16.jpg" sizes="16x16" />
        <link rel="shortcut icon" href="https://pravosleva.ru/static/img/logo/logo-pravosleva-32x32.jpg" sizes="32x32" />
        <link rel="shortcut icon" href="https://pravosleva.ru/static/img/logo/logo-pravosleva-192x192.jpg" sizes="192x192" />
        
        <title>Pravosleva</title>
        <meta property="og:title" content="Pravosleva" />
        <meta property="og:image" content="https://pravosleva.ru/static/img/logo/logo-pravosleva.jpg" />
        <meta property="og:description" content="Найдётся всё что не нашлось ранее, если оно действительно нужно" />
        <meta name="description" content="Найдётся всё что не нашлось ранее, если оно действительно нужно" /> 
        <meta property="og:url" content="https://pravosleva.ru" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Pravosleva" />
        <meta property="og:locale" content="ru_RU"></meta>
        <meta property="og:locale:alternate" content="be_BY" />
        <meta property="og:locale:alternate" content="kk_KZ" />
        <meta property="og:locale:alternate" content="tt_RU" />
        <meta property="og:locale:alternate" content="uk_UA" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="en_US" />

        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}

        <link rel="icon" href="/static/favicon.ico" />
        <meta name="theme-color" content="#0162c8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        {/* PWA primary color */}
        {/* <meta name="theme-color" content={theme.palette.primary.main} /> */}
        <meta name="application-name" content="Pravosleva" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pravosleva" />
        {/* <meta name="description" content="Pravosleva | Web / Infrastructure / SEO experience maybe something else" /> */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* <meta name='msapplication-config' content='/static/icons/browserconfig.xml' /> */}
        <meta name="msapplication-TileColor" content="#0162c8" />
        <meta name="msapplication-tap-highlight" content="no" />
      </Head>
      {/* @ts-ignore */}
      <PersistGate persistor={store.__persistor}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {/* <CacheProvider value={emotionCache}> */}
          <SCThemeProvider theme={Theme}>
            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </SCThemeProvider>
          {/* </CacheProvider> */}
        </SnackbarProvider>
      </PersistGate>
    </>
  )
}

const App = wrapper.withRedux(AppWithRedux)

export default App
