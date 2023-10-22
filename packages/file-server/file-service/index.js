const fs = require('fs')
const Koa = require('koa')
const cors = require('@koa/cors')
const staticServe = require('koa-static')
const path = require('path')

const staticPath = './' // TODO: move to config.json
const { router } = require('./routes.js')

let configData
try {
  configData = JSON.parse(fs.readFileSync('../config.json', 'utf-8'))
} catch (error) {
  console.log('read config file error: ', error)
}

const config = configData?.local

function start() {
  const app = new Koa()
  app.use(cors())
  app.use(router.routes()).use(router.allowedMethods())
  app.use(staticServe(path.join(__dirname, staticPath)))
  let server = app.listen(config.port, () => {
    console.log(`server is running at ${config.host}:${config.port}`)
  })
}

start()