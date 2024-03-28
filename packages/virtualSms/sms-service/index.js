const Koa = require('koa')
const cors = require('@koa/cors')

const { config } = require('./config')
const { router } = require('./routes')
const { ws } = require('./services')

function start() {
  const app = new Koa()
  app.use(cors())
  app.use(router.routes()).use(router.allowedMethods());

  let server =  app.listen(config.port, () => {
    console.log(`server is running at ${config.host}:${config.port}`)
  })

  const wss = ws.init(server, '')
}

start()
