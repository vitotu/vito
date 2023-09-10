const fs = require('fs')
let config = {}

try {
  config = JSON.parse(fs.readFileSync('../config.json', 'utf-8'))
} catch (e) {
  console.log(e)
}

exports.host = {
  local: config?.local
}

exports.config = {
  ...config
}

const SmsModules = new Map()
SmsModules.set('sms24', null)

exports.SmsModules = SmsModules
