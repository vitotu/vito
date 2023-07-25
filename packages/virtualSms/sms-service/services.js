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
      console.log(id)
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
    })
  }
  static sendToClient(data) { // TODO: 继续完成连接保持
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

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
        iskeep = true
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


exports.SmsService = async function(wsIds, key = 'sms24') {
  let count = 0, id, oldRes
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
      console.log(count)
      if(err) {
        ws.sendToClient({
          ids: wsIds,
          code: 500,
          message: '请求失败',
          err,
          count,
          old: {
            oldNumbers: oldRes
          }
        })
        return
      }
      let result = parseMainPage(res.body)
      // let result= 'debug'
      if(!oldRes) {
        ws.sendToClient({
          ids: wsIds,
          code: 0,
          message: '初始化成功',
          data: result,
          count,
        })
        oldRes = result
        return 200
      }
      let diffNumbers = diff2Array(result, oldRes)
      ws.sendToClient({
        ids: wsIds,
        code: 0,
        message: '请求成功',
        data: diffNumbers,
        count,
      })
      oldRes = result
    })
    SmsModules.set(key, id) // 将该模块标记为已启动
  }
  if(!tasks.Status) {
    let taskStatus = tasks.start()
    return {
      code: 201,
      message: '任务启动成功',
      id,
      // taskStatus,
    }
  }
  else return {
    code: 200,
    message: '任务已经启动',
    id,
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