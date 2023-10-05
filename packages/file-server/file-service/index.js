const fs = require('fs')

const config = JSON.parse(fs.readFileSync('../config.json', 'utf-8'))

console.log(config)