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

// const isProd = process.env.NODE_ENV === 'production'
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

  // -- NOTE: Optimization exp
  useEffect(() => {
    // Находим на клиенте тег со стилями, который прилетел с сервера
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      // Удаляем его, так как клиентский рантайм @mui/styles уже перехватил управление
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  // --

  // -- NOTE: Web Worker (Для отправки кастомных ивентов)
  useEffect(() => {
    const GA_ID = metrics.GA_TRACKING_ID;
    const YANDEX_COUNTER_ID = metrics.YANDEX_COUNTER_ID;
    if (process.env.NODE_ENV !== 'production' || !GA_ID || typeof window === 'undefined' || process.env.NEXT_METRICS_ENABLED !== '1') return;

    // 1. Инициализируем ссылки под два независимых воркера
    let gaWorker: Worker | null = null;
    let yandexWorker: Worker | null = null;

    try {
      // Google Analytics 4
      gaWorker = new Worker(`/static/common/min/analytics/metrics-worker.google.js?t=${Date.now()}`);
      gaWorker.postMessage({ 
        type: 'init', 
        payload: { gaId: GA_ID, gaApiSecret: GA_API_SECRET, isDebug: false } 
      });
    } catch (e) {
      console.error('❌ Не удалось запустить Google Analytics Worker:', e);
    }

    try {
      // Поднимаем новый выделенный воркер Яндекс.Метрики
      yandexWorker = new Worker(`/static/common/min/analytics/metrics-worker.yandex.js?t=${Date.now()}`);
      yandexWorker.postMessage({ 
        type: 'init', 
        payload: { yandexId: YANDEX_COUNTER_ID } 
      });
    } catch (e) {
      console.error('❌ Не удалось запустить Yandex Metrika Worker:', e);
    }

    // Восстанавливаем или создаем clientId для GA сессии
    let clientId = localStorage.getItem('blog_ga_client_id');
    if (!clientId) {
      clientId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('blog_ga_client_id', clientId);
    }

    // Сборщик системных параметров для Яндекса
    const getBrowserPayload = (url: string) => {
      const screenRes = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}` : '1920x1080x24';
      const userLang = typeof window !== 'undefined' ? (window.navigator.language || (window.navigator as any).userLanguage || 'ru').toLowerCase().split('-') : 'ru';
      const referrer = typeof window !== 'undefined' ? window.document.referrer : '';
      const title = typeof window !== 'undefined' ? window.document.title : '';

      return {
        url: window.location.origin + url,
        title,
        referrer,
        screenResolution: screenRes,
        userLanguage: userLang,
        clientId
      };
    };

    // 2. РАСПРЕДЕЛИТЕЛЬНЫЙ МОСТ: Прокидываем события по нужным воркерам
    const handleAnalyticsEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, payload } = customEvent.detail || {};

      if (type === 'pageview') {
        const browserPayload = getBrowserPayload(payload.url);
        
        // Шлем просмотр страницы в GA
        if (gaWorker) {
          gaWorker.postMessage({ type: 'track_pageview', payload: browserPayload });
        }
        // Шлем просмотр страницы в Яндекс
        if (yandexWorker) {
          yandexWorker.postMessage({ type: 'track_pageview', payload: browserPayload });
        }
      }

      if (type === 'event') {
        // Кастомные клики и ивенты отправляем в GA воркер
        if (gaWorker) {
          gaWorker.postMessage({
            type: 'track_event',
            payload: { action: payload.action, params: payload.params, clientId }
          });
        }
      }
    };
    window.addEventListener('blog_analytics_event', handleAnalyticsEvent);

    // Первичный запуск при холодном старте
    pageview(window.location.pathname);

    // Отслеживание SPA переходов Next.js
    const handleRouteChange = (url: string) => {
      setTimeout(() => pageview(url), 70);
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      window.removeEventListener('blog_analytics_event', handleAnalyticsEvent);
      
      if (gaWorker) gaWorker.terminate();
      if (yandexWorker) yandexWorker.terminate();
    };
  }, [router.events]);

  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NEXT_METRICS_ENABLED !== '1') return;

    const YANDEX_COUNTER_ID = metrics.YANDEX_COUNTER_ID;

    // Вытаскиваем параметры из строки запроса
    const urlParams = new URLSearchParams(window.location.search);
    
    // Проверяем первый отладочный флаг (?_ym_debug=1 или 2)
    const isYandexDebug = urlParams.get('_ym_debug') === '2' || urlParams.get('_ym_debug') === '1';
    
    // Проверяем второй флаг проверки статуса (?_ym_status-check=your-counter-id)
    const isYandexStatusCheck = urlParams.get('_ym_status-check') === String(YANDEX_COUNTER_ID);

    let yandexScript: HTMLScriptElement | null = null;

    // NOTE: Включаем нативный тег, если сработал ХОТЬ ОДИН из диагностических параметров Яндекса
    if ((isYandexDebug || isYandexStatusCheck) && !!window) {
      // 1. Создаем официальный тег скрипта Яндекса на лету
      yandexScript = window.document.createElement('script');
      yandexScript.type = 'text/javascript';
      yandexScript.async = true;
      yandexScript.src = ['https://mc.yandex.ru', 'metrika', 'tag.js'].join('/');
      
      // 2. Инициализируем его в браузере
      window.ym = window.ym || function() { 
        if (window.ym) {
          window.ym.a = window.ym.a || [];
          window.ym.a.push(arguments);
        }
      };
      window.ym.l = Date.now();
      window.ym(YANDEX_COUNTER_ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });

      window.document.head.appendChild(yandexScript);
      console.log('📻 [Yandex Debug Mode]: Официальный tag.js временно внедрен в Main Thread для проверки кабинета.');
    }

    return () => {
      if (yandexScript && window.document.head.contains(yandexScript)) {
        window.document.head.removeChild(yandexScript);
      }
    };
  }, [router.query]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // ... ваш старый рабочий код воркера аналитики без изменений ...

    // NOTE: КЛИЕНТСКИЙ ИНЖЕКТОР (ZERO LIGHTHOUSE OVERHEAD):
    // Eruda больше никогда не запустится автоматически для роботов Lighthouse и пользователей.
    // Скрипт активируется строго по секретному query-параметру ?eruda_debug=1.
    const urlParams = new URLSearchParams(window.location.search);
    const isDebugMode = urlParams.get('eruda_debug') === '1';

    let erudaWrapper: HTMLScriptElement | null = null;

    if (isDebugMode) {
      erudaWrapper = window.document.createElement('script');
      erudaWrapper.src = '/static/common/min/eruda.custom.js';
      erudaWrapper.async = true;
      window.document.body.appendChild(erudaWrapper);
      console.log('🛠️ [Eruda Engine]: Режим отладки активирован через URL параметр.');
    }

    // Очистка ресурсов при размонтировании приложения
    return () => {
      // ...старая очистка роутера аналитики (вынесена в отдельный эффект)
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
        
        {/* Каноническая ссылка по умолчанию (страницы смогут перебивать её своим уникальным URL) EXAMPLE: href='https://pravosleva.pro/' */}
        <link rel="canonical" href={process.env.NEXT_SEO} />

        {/* Facebook Meta Tags */}
        <meta property="og:url" content={process.env.NEXT_SEO} />

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
                    {/* <Script src="/static/common/min/eruda.custom.js" strategy="lazyOnload" /> */}
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
