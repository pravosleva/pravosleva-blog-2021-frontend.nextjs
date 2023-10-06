const webpack = require('webpack')
const path = require('path')
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
// NOTE: https://github.com/PaulLeCam/react-leaflet/issues/881
// const withTM = require("next-transpile-modules")([])

const fs = require('fs')
const dotenv = require('dotenv')
const isProduction = process.env.NODE_ENV === 'production'
const envFileName = isProduction ? '.env.production' : '.env.dev'
const env = dotenv.parse(fs.readFileSync(envFileName))

// const withCSS = require('@zeit/next-css')
// const withSass = require('@zeit/next-sass')
// const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
  // cssModules: true,
  // cssLoaderOptions: {
  //   localIdentName: 'next-cfg-0__[folder]_[local]__[hash:base64:5]',
  //   camelCase: true,
  // },
  // compress: true,
  // poweredByHeader: false,
  // generateEtags: false,
  // sassOptions: {
  //   localIdentName: "next-cfg-0__[folder]__[name]__[local]___[hash:base64:5]",
  //   sourceMap: true,
  //   outputStyle: 'compressed',
  //   includePaths: [
  //     'node_modules',
  //     path.resolve(__dirname, '/src'),
  //   ],
  // },

  productionBrowserSourceMaps: isDev,
  pwa: {
    dest: 'public', // NOTE: By default to .next
    runtimeCaching,
    // disable: process.env.NODE_ENV === 'development',
    register: true,
    scope: '/app',
    sw: 'service-worker.js',
    //...
  },
  exportPathMap: function () {
    return {
      '/': { page: '/' },
    }
  },
  webpack(config) {
    config.resolve.alias['~'] = `${path.resolve(__dirname)}/`
    config.plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV']))

    // SASS support:
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.(css|scss$)/,
        use: [
          // NOTE: Step 1. Creates style nodes from JS strings
          { loader: "style-loader" },
          // NOTE: Step 2. Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: isDev ? "next-cfg-2__[folder]__[name]__[local]___[hash:base64:5]" : "[name]__[local]___[hash:base64:5]",
              },
            },
          },
          // NOTE: Step 3. Compiles Sass to CSS
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                localIdentName: isDev ? "next-cfg-3__[folder]__[name]__[local]___[hash:base64:5]" : "[name]__[local]___[hash:base64:5]",
                sourceMap: isDev,
                outputStyle: 'compressed',
                includePaths: [
                  'node_modules',
                  path.resolve(__dirname, '/src'),
                ],
              },
            },
          },
        ],
      },
    ];

    return config
  },
  env,
  // analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  // analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  // bundleAnalyzerConfig: {
  //   server: {
  //     analyzerMode: 'static',
  //     reportFilename: '../analyze/server.html', // Относительно .next/server/
  //   },
  //   browser: {
  //     analyzerMode: 'static',
  //     reportFilename: './analyze/client.html', // Относительно .next/
  //   },
  // },
}

// module.exports = withPWA(withBundleAnalyzer(nextConfig))
module.exports = withPWA(nextConfig)
