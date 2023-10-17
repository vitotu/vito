import fs from 'fs'

let config:any = {}

try {
  config = JSON.parse(fs.readFileSync('../../config.json', 'utf-8'))
} catch (error) {
  console.log(error)
}

const devConfig:any = config?.local || {}

export const HOST_CONFIG = {
  api: 'http://localhost',
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