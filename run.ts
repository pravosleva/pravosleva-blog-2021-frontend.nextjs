// const moduleAlias = require('module-alias')
// moduleAlias()
import axios from 'axios'
import betterModuleAlias from 'better-module-alias'
import packageJson from './package.json'
betterModuleAlias(__dirname, packageJson._moduleAliases)

import { withTodo2023SocketLogic } from '~/srv.socket-logic'

const next = require('next')
const { api } = require('~/srv.express-next-api')

// const { crossDeviceState } = require('~/utils/next/crossDeviceState')

const isDev = process.env.NODE_ENV !== 'production'
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
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

const _customIO = withTodo2023SocketLogic(io)

// app.use(addRequestId) // NOTE: New additional field req.id
// app.use('*', ipDetectorMW, geoipLiteMW)
// NOTE: For example: const ip = req.clientIp; const geo = req.geo;

const state = {
  auxCounter: 0,
  errsCounter: 0,
}

nextApp
  .prepare()
  .then(() => {
    // app.use('/e-api', expressRouter)
    app.use('/express-next-api', api)

    app.all('*', (req: any, res: any) => {
      req.io = _customIO
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
      state.auxCounter += 1

      if (err) throw err
      console.log(`> Ready on http://localhost:${PORT}`)

      if (!isDev) axios
        .post('http://pravosleva.pro/tg-bot-2021/notify/kanban-2021/reminder/send', {
          resultId: state.auxCounter,
          chat_id: 432590698, // NOTE: Den Pol
          ts: new Date().getTime(),
          eventCode: 'aux_service',
          about: `\`/frontend.nextjs\` 🚀 Started on TCP ${PORT}`,
          targetMD: `\`\`\`\n${JSON.stringify(
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
        about: `\`/frontend.nextjs\` ⛔ Errored`,
        targetMD: `\`\`\`\n${ex.stack}\n\`\`\``,
      })
      .then((res) => res.data)
      .catch((err) => err)
    process.exit(1)
  })
