const Koa = require('koa')
const cors = require('@koa/cors')

const { host } = require('./config')
const { router } = require('./routes')
const { ws } = require('./services')

function start() {
  const app = new Koa()
  app.use(cors())
  app.use(router.routes()).use(router.allowedMethods());

  let server =  app.listen(host.local.post, () => {
    console.log(`server is running at ${host.local.host}:${host.local.post}`)
  })

  const wss = ws.init(server, '')
}

start()
