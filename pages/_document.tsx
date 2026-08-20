import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
// import theme from '~/mui/theme';
import createEmotionCache from '~/createEmotionCache';
import { metrics } from '~/constants'
import { ServerStyleSheet } from 'styled-components'
// import { Partytown } from '@builder.io/partytown/react'
import { ServerStyleSheets } from '@mui/styles' // Для MUI v5 legacy styles (JSS)
// Примечание: Если вы используете MUI v4, импортируйте из '@mui/core/styles' или '@mui/styles'

const isProd = process.env.NODE_ENV === 'production'
// const YANDEX_COUNTER_ID = !!metrics.YANDEX_COUNTER_ID ? Number(metrics.YANDEX_COUNTER_ID) : null
const GA_TRACKING_ID = metrics.GA_TRACKING_ID || null

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ru" prefix="og: http://ogp.me/ns#">
        <Head>
          {/* Кодировка */}
          <meta charSet="utf-8" />
          <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />

          {/* Фавиконки и иконки Apple Touch */}
          <link rel="shortcut icon" href="/static/img/logo/favicon.ico" />
          <link rel="apple-touch-icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-76x76.jpg" sizes="76x76" />
          <link rel="apple-touch-icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-120x120.jpg" sizes="120x120" />
          <link rel="apple-touch-icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-152x152.jpg" sizes="152x152" />
          <link rel="apple-touch-icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-180x180.jpg" sizes="180x180" />
          <link rel="shortcut icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-16x16.jpg" sizes="16x16" />
          <link rel="shortcut icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-32x32.jpg" sizes="32x32" />
          <link rel="shortcut icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-192x192.jpg" sizes="192x192" />
          <link rel="apple-touch-icon" sizes="180x180" href="https://pravosleva.pro/static/img/logo/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="https://pravosleva.pro/static/img/logo/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="https://pravosleva.pro/static/img/logo/favicon-16x16.png" />
          <link rel="mask-icon" href="/static/img/logo/safari-pinned-tab.svg" color="#5bbad5" />

          {/* Настройки отображения системных приложений */}
          <meta name="msapplication-TileColor" content="#0162c8" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-tap-highlight" content="no" />

          {/* Оставляем строго ОДНУ строчку на каждый CSS файл */}
          {/* Атрибут fetchpriority теперь поддерживается всеми современными браузерами напрямую */}
          <link rel="stylesheet" href="/static/css/min/common.css" fetchpriority="high" />
          <link rel="stylesheet" href="/static/css/min/gosuslugi.css" fetchpriority="high" />
          
          <link rel="stylesheet" href='/static/css/min/layout.css' fetchpriority="high" />
          <link rel="stylesheet" href='/static/css/min/backdrop-blur.css' />
          <link rel="stylesheet" href="/static/css/min/audit-list.css" />
          
          {/* Наш главный файл темизации — ему точно нужен высокий приоритет */}
          <link rel="stylesheet" href="/static/css/min/global-theming.css" fetchpriority="high" />
          
          <link rel="stylesheet" href="/static/css/min/standart-form.css" />
          <link rel="stylesheet" href="/static/css/min/rippled-btn.css" />
          <link rel="stylesheet" href="/static/css/min/link-as-rippled-btn.css" />
          <link rel="stylesheet" href="/static/css/min/custom-breadcrumbs.css" />
          <link rel="stylesheet" href="/static/prismjs/themes/prism-material-theme.min.css" />
          <link rel="stylesheet" href="/static/css/min/mapbox-gl@2.6.1.min.css" />
          <link rel="stylesheet" href="/static/css/min/variant.react-image-ligthbox.v2.css" />

          <link href="/static/css/min/article.css" rel="stylesheet" />
          <link href="/static/css/min/audio-podcast.css" rel="stylesheet" />
          <link href="/static/css/min/audio-podcast.article.css" rel="stylesheet" />

          {/* <link href="/static/css/min/animations.css" rel="stylesheet" /> */}
          {/* <link href="/static/css/min/fix.sweetalert2.css" rel="stylesheet" /> */}

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

        </Head>
        <body style={{ fontSize: '0.9em' }}>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var cookies = document.cookie.split('; ');
                    var themeCookie = cookies.find(function(c) { return c.startsWith('theme='); });
                    var theme = themeCookie ? themeCookie.split('=') : 'light';
                    document.body.className = theme;
                  } catch (e) {}
                })();
              `,
            }}
          />
          <Main />
          <NextScript />
          {/*
            isProd && !!YANDEX_COUNTER_ID && (
              <noscript>
                <div>
                  <img
                    src={`https://mc.yandex.ru/watch/${YANDEX_COUNTER_ID}`}
                    style={{ position: 'absolute', left: '-9999px' }}
                    alt=""
                  />
                </div>
              </noscript>
            )
          */}
        </body>
      </Html>
    );
  }
}

// -- NOTE: Fragment
// //     const yaMetrica = isProd && !!YANDEX_COUNTER_ID ? (
// //       <script
// //         type="text/javascript"
// //         defer
// //         dangerouslySetInnerHTML={{
// //           __html: `
// // (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
// // m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
// // (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
// // ym(${YANDEX_COUNTER_ID}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });
// // `,
// //         }}
// //       />
// //     ) : null
// //     if (!!yaMetrica) styles.push(yaMetrica)
// --

// NOTE: `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // 1. Создаем строго по одному инстансу для каждого сборщика стилей
  const styledComponentSheet = new ServerStyleSheet();
  const muiJssSheet = new ServerStyleSheets();
  
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);
  
  const originalRenderPage = ctx.renderPage;

  try {
    // 2. Оборачиваем App последовательно во ВСЕ три сборщика стилей!
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => 
          styledComponentSheet.collectStyles(     // Сборщик 1: styled-components
            muiJssSheet.collect(                  // Сборщик 2: MUI JSS (withStyles)
              // @ts-ignore
              <App emotionCache={cache} {...props} />
            )
          ),
      });

    // 3. Запускаем стандартный рендеринг страницы Next.js
    const initialProps = await Document.getInitialProps(ctx);
    
    // 4. Извлекаем критические стили Emotion (MUI v5 System)
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));
    const gMetrica = isProd && !!GA_TRACKING_ID ? (
      <>
        {/* <Partytown debug forward={['dataLayer.push']} lib='/static/~partytown/' */}
        <script
          async
          type='text/javascript'
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
        `,
          }}
        />
      </>
    ) : null

    // 5. Формируем единый массив стилей для инжекции в <head>
    const styles = [
      ...React.Children.toArray(initialProps.styles),
      
      // Извлекаем РЕАЛЬНО собранные JSS-стили (исправлен нейминг переменной)
      muiJssSheet.getStyleElement(), 
      
      // Извлекаем реально собранные стили styled-components
      styledComponentSheet.getStyleElement(),
      
      // Извлекаем теги Emotion
      ...emotionStyleTags,

      gMetrica,
    ];

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles,
    };
  } finally {
    // Обязательно закрываем синглтон styled-components во избежание утечек памяти
    styledComponentSheet.seal();
  }
};
