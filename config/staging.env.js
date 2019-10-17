var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"staging"',
  API_LOCATION: '"https://development-cap-api.effortlesslegal.com/v1"',
  SPEECH_BASE_URL: JSON.stringify('https://speech-api.effortlesslegal.com'),
  SPEECH_SOCKET_IO_SERVER: '"https://speech-api.effortlesslegal.com"',
  WS_SPEECH_SOCKET_IO_SERVER: '"wss://speech-api.effortlesslegal.com"'
})
