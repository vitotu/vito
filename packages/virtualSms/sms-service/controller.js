const { SmsService, SmsStop, ListenByNumber } = require('./services')
const { parseQueryByUrl } = require('./utils')

exports.index = async function(ctx, next) {
  ctx.body = {
    data: 'Hello'
  }
  ctx.status = 200
  await next()
}

exports.smsStart = async function(ctx, next) {
  const queryData = parseQueryByUrl(ctx.url)
  let task = await SmsService(queryData.wsIds, queryData.key)
  if(task) {
    ctx.body = JSON.stringify(task)
  } else {
    ctx.body = JSON.stringify({
      code: 500,
      message: '任务启动失败',
    })
  }
  ctx.status = 200
  await next()
}

exports.smsStop = async function(ctx, next) {
  const queryData = parseQueryByUrl(ctx.url)
  if(queryData.stopLoop) {
    await SmsStop({ stopLoop: true })
  } else if(queryData.taskIds) {
    await SmsStop({ taskIds: queryData.taskIds })
  }
  ctx.body = JSON.stringify({
    code: 0,
  })
  ctx.status = 200
  await next()
}

exports.ListenNumber = async function(ctx, next) {
  const queryData = parseQueryByUrl(ctx.url)
  const numbers = queryData.numbers.split(',')
  let task = await ListenByNumber(numbers, queryData.wsIds)
  if(task) {
    ctx.body = JSON.stringify(task)
  } else {
    ctx.body = JSON.stringify({
      code: 500,
      message: '任务启动失败',
    })
  }
  ctx.status = 200
  await next()
}