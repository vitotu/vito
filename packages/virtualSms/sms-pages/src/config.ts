import ConfigData from '../../envConfig.json'

export const useConfig = () => {
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