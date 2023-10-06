const Router = require('@koa/router')

const router = new Router()
const { index } = require('./controller')

router.get('/', index)
module.exports = {
  router
}