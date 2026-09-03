import React, { useEffect, useMemo, useRef } from 'react'
import App, { AppContext, AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '~/mui/theme'
import createEmotionCache from '~/createEmotionCache'
import { wrapper } from '~/store'
// import { pageview } from '~/utils/googleAnalitycs'
import { useRouter } from 'next/router'
// @ts-ignore
import { PersistGate } from 'redux-persist/integration/react'
import { useStore } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { Theme } from '~/ui-kit.uremont/Theme'
import Head from 'next/head'
// import Script from 'next/script'
// import '../public/static/css/min/animations.css'
// import '../public/static/css/min/fix.sweetalert2.css'
// import '../public/static/css/min/block-quotes.css'
// import '../public/static/css/min/sp-nw-2022.css'
import { ClientPerfWidget } from '~/components'
import { getInitialPropsBase } from '~/utils/next/getInitialPropsBase'
import { setTheme } from '~/store/reducers/globalTheme'
import { GlobalAudioPlayer } from '~/components/GlobalAudioPlayer'
import { GlobalPodcastSidebarButton } from '~/components/GlobalPodcastSidebarButton'
import { metrics } from '~/constants'
import { pageview } from '~/utils/googleAnalitycs'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const isProd = process.env.NODE_ENV === 'production'
// const YANDEX_COUNTER_ID = !!metrics.YANDEX_COUNTER_ID ? Number(metrics.YANDEX_COUNTER_ID) : null
// const GA_TRACKING_ID = metrics.GA_TRACKING_ID || null
const GA_API_SECRET = process.env.GA_API_SECRET || 'changeit'

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

  // useEffect(() => {
  //   const handleRouteChange = (url: string) => {
  //     pageview(url)
  //   }
  //   // When the component is mounted, subscribe to router changes
  //   // and log those page views
  //   router.events.on('routeChangeComplete', handleRouteChange)

  //   // If the component is unmounted, unsubscribe
  //   // from the event with the `off` method
  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange)
  //   }
  // }, [router.events])

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


  // -- NOTE: Вариант Б. Честный изолированный Web Worker (Для отправки кастомных ивентов)
  const workerRef = useRef<Worker | null>(null);
  useEffect(() => {
    const GA_ID = metrics.GA_TRACKING_ID;
    if (process.env.NODE_ENV !== 'production' || !GA_ID || typeof window === 'undefined') return;

    // 1. Поднимаем Web Worker
    const worker = new Worker(`/static/analytics/analytics-worker.js?t=${Date.now()}`);
    workerRef.current = worker;

    // Генерируем или восстанавливаем clientId сессии
    let clientId = localStorage.getItem('blog_ga_client_id');
    if (!clientId) {
      clientId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('blog_ga_client_id', clientId);
    }

    const isDebugMode = new URLSearchParams(window.location.search).get('ga4_debug') === '1';

    // 2. Инициализируем воркер токеном
    worker.postMessage({ type: 'init', payload: { gaId: GA_ID, gaApiSecret: GA_API_SECRET, isDebug: isDebugMode } });

    // ЦЕНТРАЛЬНЫЙ МОСТ: Ловим кастомные события из утилиты и шлем их в Worker
    const handleAnalyticsEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, payload } = customEvent.detail || {};

      if (type === 'pageview') {
        worker.postMessage({
          type: 'track_pageview',
          // Добавляем title в payload для воркера
          payload: { url: payload.url, title: payload.title, clientId } 
        });
      }

      if (type === 'event') {
        worker.postMessage({
          type: 'track_event',
          payload: { action: payload.action, params: payload.params, clientId }
        });
      }
    };
    window.addEventListener('blog_analytics_event', handleAnalyticsEvent);

    // 3. Логируем первый просмотр страницы при холодном старте
    pageview(window.location.pathname);

    // 4. Логируем просмотры при SPA-переходах Next.js
    const handleRouteChange = (url: string) => {
      // В SPA-переходах query параметр может сохраниться или исчезнуть. 
      // Если вам нужно динамически обновлять флаг дебага при переходах, 
      // раскомментируйте строку ниже для повторной отправки флага в воркер:
      const updatedDebug = new URLSearchParams(window.location.search).get('ga4_debug') === '1';
      worker.postMessage({ type: 'update_debug', payload: { isDebug: updatedDebug } });
      
      // Небольшой таймаут дает Next.js (Head/NextSeo) время обновить document.title в DOM
      setTimeout(() => pageview(url), 50);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      window.removeEventListener('blog_analytics_event', handleAnalyticsEvent);
      worker.terminate();
      workerRef.current = null;
    };
  }, [router.events]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // ... ваш старый рабочий код воркера аналитики без изменений ...

    /* =========================================================================
      СНАЙПЕРСКИЙ КЛИЕНТСКИЙ ИНЖЕКТОР (ZERO LIGHTHOUSE OVERHEAD):
      Eruda больше никогда не запустится автоматически для роботов Lighthouse и пользователей.
      Скрипт активируется строго по секретному query-параметру ?eruda_debug=1.
      ========================================================================= */
    const urlParams = new URLSearchParams(window.location.search);
    const isDebugMode = urlParams.get('eruda_debug') === '1';

    let erudaWrapper: HTMLScriptElement | null = null;

    if (isDebugMode) {
      erudaWrapper = window.document.createElement('script');
      erudaWrapper.src = '/static/common/eruda.custom.js';
      erudaWrapper.async = true;
      window.document.body.appendChild(erudaWrapper);
      console.log('🛠️ [Eruda Engine]: Режим отладки активирован через URL параметр.');
    }

    // Очистка ресурсов при размонтировании приложения
    return () => {
      // ... ваша старая очистка роутера аналитики ...
      if (erudaWrapper && window.document.body.contains(erudaWrapper)) {
        window.document.body.removeChild(erudaWrapper);
      }
    };
  }, [router.events, router.query]); // Добавили router.query в зависимости для мгновенной реакции SPA
  // --

  const store = useStore()
  const isServer = useMemo<boolean>(() => typeof window === 'undefined', [typeof window])

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
                    {/* ИСПРАВЛЕНО: Плеер и кнопка перенесены СЮДА.
                        1. Они рендерятся строго на клиенте (нет ошибок гидратации).
                        2. Находятся внутри ThemeProvider и CssBaseline (стили применятся эталонно).
                        3. По каскаду они перекроют футер страницы, так как лежат внутри того же контекста наложения. */}
                    <GlobalPodcastSidebarButton />
                    <GlobalAudioPlayer />
                    {/* <Script src="/static/common/eruda.custom.js" strategy="lazyOnload" /> */}
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
