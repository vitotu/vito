const Koa = require('koa')
const cors = require('@koa/cors')

const app = new Koa()


app.use(async (ctx, next) => {
  console.log(ctx)
  ctx.body = 'Hello World'
  await next()
})

app.listen(3000, () => {
  console.log(`server is running at 3000`)
})