const webpack = require('webpack')
const path = require('path')
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

const fs = require('fs')
const dotenv = require('dotenv')
const isProduction = process.env.NODE_ENV === 'production'
const envFileName = isProduction ? '.env.production' : '.env.dev'
const env = dotenv.parse(fs.readFileSync(envFileName))

// const withCSS = require('@zeit/next-css')
// const withSass = require('@zeit/next-sass')
// const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')

const nextConfig = {
  // cssModules: true,
  // cssLoaderOptions: {
  //   localIdentName: '[local]__[hash:base64:5]',
  //   camelCase: true,
  // },
  // compress: true,
  // poweredByHeader: false,
  // generateEtags: false,

  productionBrowserSourceMaps: false,
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
    // config.module.rules = [
    //   ...config.module.rules,
    //   {
    //     test: /\.scss$/,
    //     use: [
    //       {
    //         loader: 'sass-loader',
    //         options: {
    //           sassOptions: {
    //             sourceMap: true,
    //             outputStyle: 'compressed',
    //             includePaths: [
    //               'node_modules',
    //               path.resolve(__dirname, '/common/styled-mui/template'),
    //             ],
    //           },
    //         },
    //       },
    //     ],
    //   },
    // ];

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
