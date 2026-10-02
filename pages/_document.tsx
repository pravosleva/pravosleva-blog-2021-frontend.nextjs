import * as React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import createEmotionCache from '~/createEmotionCache'
import { ServerStyleSheet } from 'styled-components'

const ServerStyleSheets = require('@mui/styles/ServerStyleSheets').default;


export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ru" prefix="og: http://ogp.me/ns#">
        <Head>
          {/* Кодировка: (REMOVE) <meta charSet="utf-8" /> */}
          <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />

          <link rel="manifest" href="/static/manifest.json?v=3" />

          {/* 1. Современный стандарт: отдаем SVG напрямую браузерам (Chrome, Firefox, Edge) */}
          <link rel="icon" type="image/svg+xml" href="/static/img/logo/rocket-thruster.svg" />

          {/* 2. Запасной вариант в формате PNG для десктопного Safari и старых систем */}
          <link rel="icon" type="image/png" sizes="64x64" href="/static/img/pwa/pwa-64x64.png" />

          {/* 3. Для iOS устройств Apple (иконка при добавлении на рабочий стол) */}
          <link rel="apple-touch-icon" href="/static/img/pwa/apple-icon-180.png" />

          {/* 4. Для обратной совместимости со старым софтом (IE) */}
          <link rel="shortcut icon" href="/static/img/pwa/favicon.ico" type="image/x-icon" />

          {/* Активация режима PWA для Safari на iOS */}
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2064-2752.jpg" media="(device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2752-2064.jpg" media="(device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2048-2732.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2732-2048.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1668-2420.jpg" media="(device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2420-1668.jpg" media="(device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1668-2388.jpg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2388-1668.jpg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1668-2224.jpg" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2224-1668.jpg" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1536-2048.jpg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2048-1536.jpg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1640-2360.jpg" media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2360-1640.jpg" media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1620-2160.jpg" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2160-1620.jpg" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1488-2266.jpg" media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2266-1488.jpg" media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1320-2868.jpg" media="(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2868-1320.jpg" media="(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1206-2622.jpg" media="(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2622-1206.jpg" media="(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1260-2736.jpg" media="(device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2736-1260.jpg" media="(device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1290-2796.jpg" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2796-1290.jpg" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1179-2556.jpg" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2556-1179.jpg" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1170-2532.jpg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2532-1170.jpg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1284-2778.jpg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2778-1284.jpg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1080-2340.jpg" media="(device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2340-1080.jpg" media="(device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1242-2688.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2688-1242.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1125-2436.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2436-1125.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-828-1792.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1792-828.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1242-2208.jpg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-2208-1242.jpg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-750-1334.jpg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1334-750.jpg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-640-1136.jpg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
          <link rel="apple-touch-startup-image" href="/static/img/pwa/apple-splash-1136-640.jpg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />

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
          {/* <link rel="stylesheet" href="/static/css/min/gosuslugi.css" fetchpriority="high" /> */}
          
          <link rel="stylesheet" href={`/static/css/min/layout.css?v=${process.env.NEXT_APP_GIT_SHA1}`} fetchpriority="high" />
          <link rel="stylesheet" href='/static/css/min/backdrop-blur.css' />
          
          {/* Наш главный файл темизации — ему точно нужен высокий приоритет */}
          <link rel="stylesheet" href={`/static/css/min/global-theming.css?v=${process.env.NEXT_APP_GIT_SHA1}`} fetchpriority="high" />
          
          <link rel="stylesheet" href="/static/css/min/standart-form.css" />
          <link rel="stylesheet" href="/static/css/min/custom-breadcrumbs.css" />
          <link rel="stylesheet" href={`/static/css/min/variant.react-image-ligthbox.css?v=${process.env.NEXT_APP_GIT_SHA1}`} />

          <link href={`/static/css/min/audio-podcast.css?v=${process.env.NEXT_APP_GIT_SHA1}`} rel="stylesheet" />
          <link href={`/static/css/min/audio-podcast.article.css?v=${process.env.NEXT_APP_GIT_SHA1}`} rel="stylesheet" fetchpriority="high" />
          <link href="/static/css/min/audio-podcast-preview.css" rel="stylesheet" fetchpriority="high" />
          <link href={`/static/css/min/articles-search.css?v=${process.env.NEXT_APP_GIT_SHA1}`} rel="stylesheet" />

          <link rel="stylesheet" href="/static/css/min/link-as-rippled-btn.css" />
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
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const styledComponentSheet = new ServerStyleSheet();
  
  // 🎯 Инициализация исправленного default-класса
  const muiJssSheet = new ServerStyleSheets();
  
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);
  
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) => (props: any) => 
          styledComponentSheet.collectStyles(
            muiJssSheet.collect(
              <App emotionCache={cache} {...props} />
            )
          ),
      });

    const initialProps = await Document.getInitialProps(ctx);
    
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    const styles = [
      ...React.Children.toArray(initialProps.styles),
      muiJssSheet.getStyleElement(), 
      styledComponentSheet.getStyleElement(),
      ...emotionStyleTags,
    ];

    return {
      ...initialProps,
      styles,
    };
  } finally {
    styledComponentSheet.seal();
  }
};