import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
// import theme from '~/mui/theme';
import createEmotionCache from '~/createEmotionCache';
import { metrics } from '~/constants'
import { ServerStyleSheet } from 'styled-components'
import { ServerStyleSheets } from '@mui/styles';
// import { Partytown } from '@builder.io/partytown/react'

const isProd = process.env.NODE_ENV === 'production'
// const YANDEX_COUNTER_ID = !!metrics.YANDEX_COUNTER_ID ? Number(metrics.YANDEX_COUNTER_ID) : null
const GA_TRACKING_ID = metrics.GA_TRACKING_ID || null

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ru" prefix="og: http://ogp.me/ns#">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />
          <link rel="shortcut icon" href="/static/img/logo/favicon.ico" />

          <link rel="apple-touch-icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-76x76.jpg" sizes="76x76"></link>
          <link rel="apple-touch-icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-120x120.jpg" sizes="120x120"></link>
          <link rel="apple-touch-icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-152x152.jpg" sizes="152x152"></link>
          <link rel="apple-touch-icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-180x180.jpg" sizes="180x180"></link>
          <link rel="shortcut icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-16x16.jpg" sizes="16x16" />
          <link rel="shortcut icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-32x32.jpg" sizes="32x32" />
          <link rel="shortcut icon" href="https://pravosleva.pro/static/img/logo/logo-pravosleva-192x192.jpg" sizes="192x192" />
          <link rel="apple-touch-icon" sizes="180x180" href="https://pravosleva.pro/static/img/logo/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="https://pravosleva.pro/static/img/logo/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="https://pravosleva.pro/static/img/logo/favicon-16x16.png" />

          {/* <link rel="manifest" href="/static/manifest.json" /> */}
          <link rel="mask-icon" href="/static/img/logo/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#0162c8" />
          <meta name="theme-color" content="#0162c8" />
          
          <link rel="canonical" href='https://pravosleva.pro/'></link>
          
          {/* <meta name="application-name" content="Pravosleva" />
          <meta name="apple-mobile-web-app-title" content="Pravosleva" /> */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-tap-highlight" content="no" />
          
          {/* <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          /> */}
          {/* <style>
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
          </style> */}
          {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
          <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet"></link> */}
        </Head>
        <body style={{ fontSize: '0.9em' }}>
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

  const styledSheet = new ServerStyleSheet()
  const muiSheet = new ServerStyleSheets();

  try {
    const originalRenderPage = ctx.renderPage;

    // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
      originalRenderPage({
        // enhanceApp: (App: any) => (props) => <App emotionCache={cache} {...props} />,
        // enhanceApp: (App) => (props) => styledSheet.collectStyles(<App {...props} />),
        // enhanceApp: (App) => (props) => styledSheet.collectStyles(muiSheet.collect(<App {...props} />)),
        enhanceApp: (App: any) => (props) => styledSheet.collectStyles(muiSheet.collect(<App emotionCache={cache} {...props} />)),
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
    const styles = [
      ...React.Children.toArray(initialProps.styles),
      // initialProps.styles,
      styledSheet.getStyleElement(),
      muiSheet.getStyleElement(),
      ...emotionStyleTags,
    ]
//     const yaMetrica = isProd && !!YANDEX_COUNTER_ID ? (
//       <script
//         type="text/javascript"
//         defer
//         dangerouslySetInnerHTML={{
//           __html: `
// (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
// m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
// (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
// ym(${YANDEX_COUNTER_ID}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });
// `,
//         }}
//       />
//     ) : null
//     if (!!yaMetrica) styles.push(yaMetrica)
    const gMetrica = isProd && !!GA_TRACKING_ID ? (
      <>
        {/* <Partytown
          // debug
          forward={['dataLayer.push']}
          lib='/static/~partytown/'
        /> */}
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
        <script
          async
          type='text/javascript'
          dangerouslySetInnerHTML={{
            __html: `function detectBtnsAndSetHandlers () {
const rippledButtons = document.querySelectorAll('.link-as-rippled-btn');
// console.log(rippledButtons);

rippledButtons.forEach(btn => {
  btn.addEventListener('click', function(e) {
    // e.preventDefault();
    // console.log(e.clientX, e.target.offsetLeft)
    // const x = e.clientX - e.target.offsetLeft;
    // const y = e.clientY - e.target.offsetTop;
    const x = e.clientX - e.target.offsetLeft;
    const y = e.clientY;

    const ripples = document.createElement('span');
    ripples.classList.add('ripples');

    // ripples.style.left = x + 'px';
    // ripples.style.top = y + 'px';
    ripples.style.left = x + 'px';
    ripples.style.top = '50%';

    console.log(this);
    this.appendChild(ripples);
    console.log(this)

    setTimeout(() => {
      ripples.remove();
    }, 1000);
  })
})
}

setTimeout(detectBtnsAndSetHandlers, 0);`,
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
  } finally {
    styledSheet.seal()
  }
};
