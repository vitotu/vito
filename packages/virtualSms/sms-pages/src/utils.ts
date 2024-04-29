import { useConfig } from "./config"
import { nanoid } from 'nanoid'

const HOST_CONFIG = useConfig()

interface CBObj {
  [key: string]: Function
}

export class Ws {
  ws: WebSocket|null
  wsId: string
  cb: CBObj = {}
  cbIds: Array<string>
  constructor() {
    this.wsId = nanoid()
    this.cb = {}
    this.cbIds = []
    this.ws = new WebSocket(`${HOST_CONFIG.getWsPrefix()}/ws?id=${this.wsId}`)
    this.ws.onopen = function () {
      console.log('connected')
    }
    this.ws.onmessage = (e) => {
      let data = JSON.parse(e.data)
      if(data.code == 0 && data.taskId){
        this.cbIds.forEach(i => {
          this.cb[i](data)
        })
      } else {
        console.error('error: ', data)
      }
    }
    // 发送心跳， 防止连接断开， 若60s内没有发送消息， 会自动断开连接
    setInterval(() => {
      this.ws?.send(JSON.stringify({
        id: this.wsId,
        msg: 'ping',
      }))
    }, 10000)
  }
  addCb(fun:Function) {
    const id:string = nanoid()
    if(!this.cb[id]) {
      this.cb[id] = fun
    }
    this.cbIds.push(id)
    return id
  }
  close() {
    this.ws?.close()
  }
  removeCbById(id:string) {
    delete this.cb[id]
    this.cbIds = this.cbIds.filter(i => i == id)
  }
}