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
          
          <link rel="stylesheet" href={`/static/css/min/layout.css?v=${process.env.NEXT_PUBLIC_BUILD_HASH}`} fetchpriority="high" />
          <link rel="stylesheet" href='/static/css/min/backdrop-blur.css' />
          
          {/* Наш главный файл темизации — ему точно нужен высокий приоритет */}
          <link rel="stylesheet" href="/static/css/min/global-theming.css" fetchpriority="high" />
          
          <link rel="stylesheet" href="/static/css/min/standart-form.css" />
          <link rel="stylesheet" href="/static/css/min/custom-breadcrumbs.css" />
          <link rel="stylesheet" href={`/static/css/min/variant.react-image-ligthbox.css?v=${process.env.NEXT_PUBLIC_BUILD_HASH}`} />

          <link href={`/static/css/min/audio-podcast.css?v=${process.env.NEXT_PUBLIC_BUILD_HASH}`} rel="stylesheet" fetchpriority="high" />
          <link href="/static/css/min/audio-podcast.article.css" rel="stylesheet" fetchpriority="high" />
          <link href="/static/css/min/audio-podcast-preview.css" rel="stylesheet" fetchpriority="high" />

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