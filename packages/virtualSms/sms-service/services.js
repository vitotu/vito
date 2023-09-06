const Qs = require('qs')
const WebSocket = require('ws')
const { LoopTask } = require('./taskExector')
const tasks = new LoopTask()
const { getDataByUrl, parseMainPage, diff2Array, parseNumber } = require('../index.js')
const { config, SmsModules } = require('./config')

class ws {
  static online = 0
  static ws = WebSocket.Server
  static cb = new Map()
  static init(server, path = '') {
    this.ws = new WebSocket.Server({
      server,
      path: `${path}/ws`
    })
    this.ws.on('connection', async(ws, request) => {
      if(!request.url.includes(`${path}/ws`)) {
        return ws.close()
      }
      this.online = this.ws.clients.size
      console.log(`socket当前在线${this.online}个连接`)
      const {
        id = ''
      } = Qs.parse(request.url.split('?')[1])
      if(!id) return ws.close()
      let ids = Array.from(this.ws.clients).map(c => c.id)
      if(ids.includes(id)) return ws.close()
      try {
        ws.id = id
        const obj = { 'message': '连接成功', 'code': 200, 'data': { 'id': id } }
        ws.send(JSON.stringify(obj))
      } catch (error) {
        console.log(error)
        return ws.close()
      }
      ws.on('message', (message) => { // 收到对应链接心跳设置链接状态
        let res = JSON.parse(message)
        if(res.id == ws.id) ws.isAlive = true
      })
    })
    setInterval(() => { // 每6秒检查一次心跳， 若无则关闭对应ws链接
      let clients = Array.from(this.ws.clients)
      clients.forEach((client) => {
        if(!client.isAlive) {
          client.close()
          console.log('ws链接关闭, id: ', client.id)
        }
        else client.isAlive = false
      })
    }, 60000)
  }
  static sendToClient(data) {
    let iskeep = false // 加个变量做下发成功判断
    if (!(this.ws instanceof WebSocket.Server)) {
      return iskeep;
    }
    const { ids = [] } = data
    let clients
    if(ids.length > 0) {
      clients = Array.from(this.ws.clients).filter(c => c.readyState === WebSocket.OPEN && ids.includes(c.id))
    } else {
      clients = Array.from(this.ws.clients)
    }
    // TODO: 若clients长度为0， 的逻辑处理 isKeep状态翻转
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
        iskeep = true // 只要有一个client存在且未关闭，则返回存活状态
      }
    });
    return iskeep;
  }
  static onMessage(fn) {
    let key = Symbol()
    this.cb.set(key, fn)
    return key
  }
  static offMessage(key) {
    return this.cb.delete(key)
  }
}
exports.ws = ws

let oldRes

exports.SmsService = async function(wsIds, key = 'sms24') {
  // TODO: 任务已存在时， 则不再启动， 并返回任务中缓存的oldRes
  let count = 0, id
  if(!SmsModules.has(key)) return {
    code: 404,
    message: 'key对应的模块不存在'
  }
  // 仅支持启动内置模块的爬虫任务， 且避免重复启动相同的任务
  if(SmsModules.has(key) && !SmsModules.get(key)) {
    id = tasks.add(async () => {
      let [res, err] = await getDataByUrl(config.mainPath).then(r => [r, null], e => [null, e])
      // let res = { body : ''}
      // let err
      count++
      let wsStatus = false // 初始化ws链接状态
      if(err) {
         wsStatus =  ws.sendToClient({
          ids: wsIds,
          code: 500,
          message: '请求失败',
          err,
          count,
          old: {
            oldNumbers: oldRes
          },
          taskId: id,
        })
        if(!wsStatus) { // 若ws已关闭，则删除对应任务id
          let taskLeftLength = tasks.removeById(id)
          console.log('ws 关闭，任务对应已删除, id: ', id, '剩余任务数： ', taskLeftLength)
          SmsModules.set(key, null) // 由于任务都已关闭，重置模块启动标记
        }
        return
      }
      let result = parseMainPage(res.body)
      // let result= 'debug'
      if(!oldRes) {
        wsStatus =  ws.sendToClient({
          ids: wsIds,
          code: 0,
          message: '初始化成功',
          data: result,
          count,
          taskId: id,
        })
        oldRes = result
        if(!wsStatus) {
          let taskLeftLength = tasks.removeById(id)
          console.log('ws 关闭，任务对应已删除, id: ', id, '剩余任务数： ', taskLeftLength)
          SmsModules.set(key, null) // 由于任务都已关闭，重置模块启动标记
        }
        return 200
      }
      let diffNumbers = diff2Array(result, oldRes)
      wsStatus =  ws.sendToClient({
        ids: wsIds,
        code: 0,
        message: '请求成功',
        data: diffNumbers,
        count,
        taskId: id,
      })
      oldRes = result
      if(!wsStatus) {
        let taskLeftLength = tasks.removeById(id)
        console.log('ws 关闭，任务对应已删除, id: ', id, '剩余任务数： ', taskLeftLength)
        SmsModules.set(key, null) // 由于任务都已关闭，重置模块启动标记
      }
    })
    SmsModules.set(key, id) // 将该模块标记为已启动
  }
  if(!tasks.Status) {
    let taskStatus = tasks.start()
    return {
      code: 201,
      message: '任务启动成功',
      id: SmsModules.get(key),
      cacheNumbers: oldRes,
      // taskStatus,
    }
  }
  else return {
    code: 200,
    message: '任务已经启动',
    id: SmsModules.get(key),
    cacheNumbers: oldRes,
    // taskStatus: tasks.Status,
  }
}

exports.SmsStop = async function(options = {}) {
  if(options.taskIds) {
    let taskIds = options.taskIds.split(','), res = []
    taskIds.forEach(id => {
      res.push(tasks.removeById(id))
    })
    return res
  }
  else if(options.stopLoop) return tasks.stop()
  return false
}

exports.ListenByNumber = async function(numbers, wsIds) {
  let count = 0, taskStatus, ids = []
  numbers.forEach(number => {
    if(number) {
      let taskId = tasks.add(async () => {
        let [res, err] = await getDataByUrl(`${config.numberUrlPrefix}${number}`).then(r => [r, null], e => [null, e])
        count++
        if(err) {
          ws.sendToClient({
            ids: wsIds,
            code: 500,
            message: '请求失败',
            err,
            count,
            taskId,
          })
          return
        }
        let result = parseNumber(res.body)
        ws.sendToClient({
          ids: wsIds,
          code: 0,
          message: '请求成功',
          data: result,
          count,
          taskId,
        })
      })
      ids.push({number, taskId})
    }
  })
  if(!tasks.Status) taskStatus =  tasks.start()
  else taskStatus =  tasks.Status
  return {
    code: 200,
    message: '任务已经启动',
    ids,
  }
}
// ref: https://juejin.cn/post/7062628245291663373