import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
// import theme from '~/mui/theme';
import createEmotionCache from '~/createEmotionCache';
import { metrics } from '~/constants'

const isProd = process.env.NODE_ENV === 'production'
const YANDEX_COUNTER_ID = !!metrics.YANDEX_COUNTER_ID ? Number(metrics.YANDEX_COUNTER_ID) : null
const GA_TRACKING_ID = metrics.GA_TRACKING_ID || null

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          {/* <meta name="theme-color" content={theme.palette.primary.main} /> */}
          <meta name="application-name" content="Pravosleva" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Pravosleva" />
          <meta name="description" content="Experience" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          {/* <meta name='msapplication-config' content='/static/icons/browserconfig.xml' /> */}
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />
          {/* <link rel="apple-touch-icon" href="/static/icons/touch-icon-iphone.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/static/icons/touch-icon-ipad.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/static/icons/touch-icon-iphone-retina.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/static/icons/touch-icon-ipad-retina.png" /> */}

          <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon-16x16.png" />
          {/*
          <link rel="manifest" href="/static/manifest.json" />
          */}
          <link rel="mask-icon" href="/static/icons/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link rel="stylesheet" href="/static/css/gosuslugi.css" />
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.8.0/css/all.css"
            integrity="sha384-Mmxa0mLqhmOeaE8vgOSbKacftZcsNYDjQzuCOm6D02luYSzBG8vpaOykv9lFQ51Y"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          {
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
          }
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) => (props) => <App emotionCache={cache} {...props} />,
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));
  const styles = [...React.Children.toArray(initialProps.styles), ...emotionStyleTags]
  const yaMetrica = isProd && !!YANDEX_COUNTER_ID ? (
    <script
      type="text/javascript"
      defer
      dangerouslySetInnerHTML={{
        __html: `
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${YANDEX_COUNTER_ID}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });
`,
      }}
    />
  ) : null
  if (!!yaMetrica) styles.push(yaMetrica)
  const gMetrica = isProd && !!GA_TRACKING_ID ? (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}', {
          page_path: window.location.pathname,
        });
      `,
        }}
      />
    </>
  ) : null
  if (!!gMetrica) styles.push(gMetrica)

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles,
  };
};
