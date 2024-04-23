import ConfigData from '../../envConfig.json'
const mode = process.env.target || 'dev'
let config:any = ConfigData[mode] || {}
console.log(process.env.target, mode, config)
export const HOST_CONFIG = {
  host: config?.page?.host || 'localhost',
  port: config?.page?.port || 8080,
  api: 'http://' + (config?.service?.host || 'localhost'),
  apiPort: config?.service?.port || 3080,
  apiPath: process.env.apiPath || '/api/sms/',
  getApiPrefix () {
    let url =`http://${window.location.host}${this.apiPath}`
    return url
  },
  getWsPrefix () {
    // TODO: i996 nginx 代理够连接上但， 发送消息有问题
    if(config?.page?.wsUrl) return config?.page?.wsUrl
    else return `ws://${window.location.host}`
  }
}