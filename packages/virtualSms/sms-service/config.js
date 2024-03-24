const ConfigData = require('../envConfig.json')
const mode = process.env.target || 'dev'
let config = ConfigData[mode] || {}

exports.host = {
  local: config?.local
}

exports.config = {
  ...config
}

const SmsModules = new Map()
SmsModules.set('sms24', null)

exports.SmsModules = SmsModules
