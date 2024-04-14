const ConfigData = require('../envConfig.json')
console.log('debugger', process.env.target)
const mode = process.env.target || 'dev'
let config = ConfigData[mode] || {}

exports.config = {
  ...(config?.service || {}),
  wsPort: config?.page?.port
}

const SmsModules = new Map()
SmsModules.set('sms24', null)

exports.SmsModules = SmsModules
