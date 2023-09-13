// const moduleAlias = require('module-alias')
// moduleAlias()
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

const _customIO = withTodo2023SocketLogic(io)

// app.use(addRequestId) // NOTE: New additional field req.id
// app.use('*', ipDetectorMW, geoipLiteMW)
// NOTE: For example: const ip = req.clientIp; const geo = req.geo;

nextApp
  .prepare()
  .then(() => {
    // app.use('/e-api', expressRouter)

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
    app.use(api)

    server.listen(PORT, (err: any) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${PORT}`)
    })
  })
  .catch((ex: any) => {
    console.error(ex.stack)
    process.exit(1)
  })
