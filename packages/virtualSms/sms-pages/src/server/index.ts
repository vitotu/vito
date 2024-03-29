const Koa = require('koa');
const { Nuxt, Builder } = require('nuxt');
const app = new Koa();
let config = require('../../nuxt.config.js');
config.dev = !(app.env === 'production');

async function start() {
  const nuxt = new Nuxt(config);
  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // 监听所有路由
  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
}

start()