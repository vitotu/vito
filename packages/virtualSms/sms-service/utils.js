const qs = require('qs')
exports.parseQueryByUrl = function(url) {
  const queryString = url.split('?')[1]
  return qs.parse(queryString)
}