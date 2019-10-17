var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_LOCATION: '"http://localhost:3000/v1"',
  SPEECH_BASE_URL: JSON.stringify('https://speech-api.effortlesslegal.com'),
})
