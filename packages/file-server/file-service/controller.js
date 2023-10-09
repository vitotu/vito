exports.index = async function(ctx, next) {
  ctx.body = {
    data: 'Hello file-service running'
  }
  ctx.status = 200
  await next()
}