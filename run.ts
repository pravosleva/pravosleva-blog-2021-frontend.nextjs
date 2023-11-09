// const moduleAlias = require('module-alias')
// moduleAlias()
import axios from 'axios'
import betterModuleAlias from 'better-module-alias'
import packageJson from './package.json'
betterModuleAlias(__dirname, packageJson._moduleAliases)

import { rootSocketLogic } from '~/srv.socket-logic'

const next = require('next')
const { api } = require('~/srv.express-next-api')

// const { crossDeviceState } = require('~/utils/next/crossDeviceState')

const isDev = process.env.NODE_ENV !== 'production'
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origin: [
      'http://localhost:5173', // NOTE: Vite dev
      'http://localhost:4173', // NOTE: Vite prod preview
      // 'https://test.smartprice.ru', // NOTE: SP text
    ],
    // NOTE: See also https://socket.io/docs/v4/handling-cors/
    allowRequest: (req: any, callback: (e: any, isCorrect: boolean) => void) => {
      const hasOriginHeader = !!req.headers.origin
      callback({ reqHeaders: req.headers }, hasOriginHeader); // No allow requests without 'origin' header
    },
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  }
})
const nextApp = next({ dev: isDev })
const nextHanlder = nextApp.getRequestHandler()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
// const ipDetectorMW = require('./express-tools/middlewares/ip-detector')
// const geoipLiteMW = require('./express-tools/middlewares/geoip-lite')
// const addRequestId = require('express-request-id')()
const { parse } = require('url')
const { join } = require('path')
const isProd = process.env.NODE_ENV === 'production'
require('dotenv').config({ path: join(__dirname, isProd? './.env.production' : './.env.dev') })

const enhancedIO = rootSocketLogic(io)

// app.use(addRequestId) // NOTE: New additional field req.id
// app.use('*', ipDetectorMW, geoipLiteMW)
// NOTE: For example: const ip = req.clientIp; const geo = req.geo;

const state = {
  startsCounter: 0,
  errsCounter: 0,
}

nextApp
  .prepare()
  .then(() => {
    app.use('/express-next-api', api)
    app.use('/e-api', api)

    app.all('*', (req: any, res: any) => {
      req.io = enhancedIO
      // req.crossDeviceState = crossDeviceState

      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      if (pathname === '/sw.js' || /^\/(workbox|worker|fallback)-\w+\.js$/.test(pathname)) {
        const filePath = join(__dirname, '.next', pathname)
        nextApp.serveStatic(req, res, filePath)
      } else {
        return nextHanlder(req, res, parsedUrl)
      }
    })

    server.listen(PORT, (err: any) => {
      state.startsCounter += 1

      if (err) throw err
      console.log(`> Ready on http://localhost:${PORT}`)

      if (!isDev) axios
        .post('http://pravosleva.pro/tg-bot-2021/notify/kanban-2021/reminder/send', {
          resultId: state.startsCounter,
          chat_id: 432590698, // NOTE: Den Pol
          ts: new Date().getTime(),
          eventCode: 'aux_service',
          about: `\`/frontend.nextjs\`\n🚀 Started on TCP ${PORT} https://pravosleva.pro`,
          targetMD: `\`\`\`json\n${JSON.stringify(
            {
              NODE_ENV: process.env.NODE_ENV,
            },
            null,
            2
          )}\n\`\`\``,
        })
        .then((res) => res.data)
        .catch((err) => err)
    })
  })
  .catch(async (ex: any) => {
    state.errsCounter += 1
    console.error(ex.stack)
    if (!isDev) await axios
      .post('http://pravosleva.pro/tg-bot-2021/notify/kanban-2021/reminder/send', {
        resultId: state.errsCounter,
        chat_id: 432590698, // NOTE: Den Pol
        ts: new Date().getTime(),
        eventCode: 'aux_service',
        about: `\`/frontend.nextjs\`\n⛔ Errored`,
        targetMD: `\`\`\`json\n${ex.stack}\n\`\`\``,
      })
      .then((res) => res.data)
      .catch((err) => err)
    process.exit(1)
  })
