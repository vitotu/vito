
exports.host = {
  local: {
    host: 'http://localhost',
    post: 3080
  }
}

exports.config = {
  "proxy":"http://192.168.106.12:10809",
  "mainPath":"https://sms24.me/en/numbers",
  "numberUrlPrefix":"https://sms24.me/en/numbers/"
}
const SmsModules = new Map()
SmsModules.set('sms24', null)

exports.SmsModules = SmsModules
