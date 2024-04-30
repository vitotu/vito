import ConfigData from '../../envConfig.json'

export const useConfig = () => {
  const mode = process.env.target || 'dev'
  let config:any = ConfigData[mode] || {}
  const getConfigFile = () => {
    if(GBvar) {
      return {
        ...(ConfigData[GBvar?.public?.target || 'dev'] || {}),
        GBvar
      }
    }
    return {}
  }
  return {
    host: config?.page?.host || 'localhost',
    port: config?.page?.port || 8080,
    api: 'http://' + (config?.service?.host || 'localhost'),
    apiPort: config?.service?.port || 3080,
    apiPath: process.env.apiPath || '/api/sms/',
    getApiPrefix () {
      const config = getConfigFile()
      let apiPath = config?.GBvar?.public?.apiPath
      let url =`http://${window.location.host}${apiPath}`
      return url
    },
    getWsPrefix () {
      // TODO: i996 nginx 代理够连接上但， 发送消息有问题
      let config = getConfigFile()
      if(config?.page?.wsUrl) return config?.page?.wsUrl
      else return `ws://${window.location.host}`
    }
  }
}