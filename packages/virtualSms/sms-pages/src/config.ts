import ConfigData from '../../envConfig.json'
const mode = process.env.target || 'dev'
let config:any = ConfigData[mode] || {}


export const HOST_CONFIG = {
  host: config?.page?.host || 'localhost',
  port: config?.page?.port || 8080,
  api: 'http://' + (config?.service?.host || 'localhost'),
  apiPort: config?.service?.port || 3080,
  apiPath: process.env.apiPath || '/api/',
  getApiPrefix () {
    let url =`http://${window.location.host}${this.apiPath}`
    console.log('debugger', url)
    return url
  },
  getWsPrefix () {
    let url =`ws://${window.location.host}${this.apiPath}`
    return url
  }
}