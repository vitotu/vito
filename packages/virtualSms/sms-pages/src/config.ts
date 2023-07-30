export const HOST_CONFIG = {
  api: 'http://localhost',
  apiPort: 3080,
  getApiPrefix () {
    let url ='http://' +  window.location.host.split(':')[0] + ':' + this.apiPort
    return url
  },
  getWsPrefix () {
    let url ='ws://' +  window.location.host.split(':')[0] + ':' + this.apiPort
    return url
  }
}