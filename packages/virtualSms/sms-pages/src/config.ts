import ConfigData from '../../envConfig.json'
const mode = process.env.target || 'dev'
let config:any = ConfigData[mode] || {}


export const HOST_CONFIG = {
  host: config?.page?.host || 'localhost',
  port: config?.page?.port || 8080,
  api: 'http://' + (config?.service?.host || 'localhost'),
  apiPort: config?.service?.port || 3080,
  getApiPrefix () {
    let url ='http://' +  window.location.host.split(':')[0] + ':' + this.apiPort
    return url
  },
  getWsPrefix () {
    let url ='ws://' +  window.location.host.split(':')[0] + ':' + this.apiPort
    return url
  }
}