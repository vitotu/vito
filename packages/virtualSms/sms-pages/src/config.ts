import ConfigData from '../../envConfig.json'
const mode = process.env.target || 'dev'
let config:any = ConfigData[mode] || {}

const devConfig:any = config?.local || {}

export const HOST_CONFIG = {
  api: 'http://' + devConfig.host,
  apiPort: devConfig.port || 3080,
  getApiPrefix () {
    let url ='http://' +  window.location.host.split(':')[0] + ':' + this.apiPort
    return url
  },
  getWsPrefix () {
    let url ='ws://' +  window.location.host.split(':')[0] + ':' + this.apiPort
    return url
  }
}