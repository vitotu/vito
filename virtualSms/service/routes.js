const Router = require('@koa/router')
const { index, smsStart, smsStop, ListenNumber }  = require('./controller' )


const router = new Router()

router.get('/stop', smsStop)
router.get('/listenNumber', ListenNumber)
router.get('/', smsStart)

module.exports = {
  router
}