const saveXml = require('../lib/utils/save-xml')
// Uncomment to save XML Requests and Resonses
saveXml.setWritable(true)

// for Axis
const address = '192.168.0.19'
const port = 80
const username = 'root'
const password = 'root'

// for Hikvision (PTZ)
// const address = '10.10.1.60'
// const port = 80
// const username = 'admin'
// const password = '12345'

// for Hikvision (Fixed)
// const address = '10.10.1.65'
// const port = 80
// const username = 'admin'
// const password = '12345'

// for Pelco (PTZ)
// const address = '10.10.1.66'
// const port = 80
// const username = 'admin'
// const password = 'admin'

// for TrendNET (Fixed)
// const address = '10.10.1.67'
// const port = 80
// const username = 'admin'
// const password = 'admin'

// functional tests to run. Set to true to test the suite.
const runDiscovery = false
const runCore = false
const runPtz = false
const runMedia = true
const runSnapshot = false
const runReboot = false
const runBackup = false

module.exports = {
  address,
  port,
  username,
  password,

  runDiscovery,
  runCore,
  runPtz,
  runMedia,
  runSnapshot,
  runReboot,
  runBackup
}