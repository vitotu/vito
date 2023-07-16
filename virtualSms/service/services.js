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
      this.online = this.ws._server._connections
      console.log(`socket当前在线${this.online}个连接`)
      const {
        id = ''
      } = Qs.parse(request.url.split('?')[1])
      console.log(id)
      if(!id) return ws.close()
      try {
        ws.id = id
        const obj = { 'message': '连接成功', 'code': 200, 'data': { 'id': id } }
        ws.send(JSON.stringify(obj))
      } catch (error) {
        console.log(error)
        return ws.close()
      }
      // ws.on('message', (msg, ...rest) => {
      //   console.log(msg.toString('utf8'), rest)
      //   this.cb.forEach((fn, key, map) => {
      //     fn(msg, { key, map } ,rest)
      //   })
      //   // ws.send('alived')
      // })
    })
  }
  static sendToClient(data) {
    let iskeep = false // 加个变量做下发成功判断
    if (!(this.ws instanceof WebSocket.Server)) {
      return iskeep;
    }
    const { id } = data
    if(id) {
      let client = this.ws.clients.find(c => c.readyState === WebSocket.OPEN && c.id === id)
      if(client) {
        client.send(JSON.stringify(data));
        iskeep = true
      }
    } else {
      this.ws.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
          iskeep = true
        }
      });
    }
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


exports.SmsService = async function(key = 'sms24') {
  let count = 0, id, oldRes
  if(!SmsModules.has(key)) return {
    code: 404,
    message: 'key对应的模块不存在'
  }
  if(SmsModules.has(key) && !SmsModules.get(key)) {
    id = tasks.add(async () => {
      let [res, err] = await getDataByUrl(config.mainPath).then(r => [r, null], e => [null, e])
      // let res = { body : ''}
      // let err
      count++
      console.log(count)
      if(err) {
        ws.sendToClient({
          id: ws.id,
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
          id: ws.id,
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
        id: ws.id,
        code: 0,
        message: '请求成功',
        data: diffNumbers,
        count,
      })
      oldRes = result
    })
    SmsModules.set(key, id)
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
  if(options.id) return tasks.removeById(options.id)
  else if(options.stopLoop) return tasks.stop()
  return false
}
// TODO: 服务需返回等量的id
exports.ListenByNumber = async function(numbers) {
  let count = 0, id, taskStatus
  if(numbers[0]){
    id = tasks.add(async () => {
      let [res, err] = await getDataByUrl(`${config.numberUrlPrefix}${numbers[0]}`).then(r => [r, null], e => [null, e])

      count++
      if(err) {
        ws.sendToClient({
          id: ws.id,
          code: 500,
          message: '请求失败',
          err,
          count,
        })
        return
      }
      let result = parseNumber(res.body)
      ws.sendToClient({
        id: ws.id,
        code: 0,
        message: '请求成功',
        data: result,
        count,
      })
    })
  }
  if(!tasks.Status) taskStatus =  tasks.start()
  else taskStatus =  tasks.Status
  return {
    code: 200,
    message: '任务已经启动',
    id,
    taskStatus,
  }
}
// ref: https://juejin.cn/post/7062628245291663373