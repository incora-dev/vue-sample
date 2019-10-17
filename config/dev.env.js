var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CAP_URL: '"http://localhost:3000/admin/dashboard"',
  API_LOCATION: '"http://localhost:3001/v1"',
  SPEECH_BASE_URL: JSON.stringify('http://localhost:4000'),
  SPEECH_SOCKET_IO_SERVER: '"http://localhost:9002"',
  WS_SPEECH_SOCKET_IO_SERVER: '"ws://localhost:9002"'
})
