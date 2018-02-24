'use strict'

const Path = require('path')
const saveXml = require('../lib/utils/save-xml')
// Uncomment to save XML Requests and Resonses
saveXml.setWritable(true)

// for Axis
// const address = '192.168.0.19'
// const port = 80
// const username = 'root'
// const password = 'root'
// const folder = 'axis'

// for Hikvision (PTZ)
const address = '10.10.1.60'
const port = 80
const username = 'admin'
const password = '12345'
const folder = 'hikvision'

// for Hikvision (Fixed)
// const address = '10.10.1.65'
// const port = 80
// const username = 'admin'
// const password = '12345'
// const folder = 'hikvision-fixed'

// for Pelco (PTZ)
// const address = '10.10.1.66'
// const port = 80
// const username = 'admin'
// const password = 'admin'
// const folder = 'pelco'

// for TrendNET (Fixed)
// const address = '10.10.1.67'
// const port = 80
// const username = 'admin'
// const password = 'admin'
// const folder = 'trendnet'

// functional tests to run. Set to true to test the suite.
const runDiscovery = false
const runCore = false
const runPtz = true
const runMedia = false
const runEvents = false
const runAnalytics = false
const runSnapshot = false
const runBackup = false
const runReboot = false

saveXml.setPath(Path.resolve(__dirname, '../test/data/xml/' + folder))

module.exports = {
  address,
  port,
  username,
  password,
  folder,

  runDiscovery,
  runCore,
  runPtz,
  runMedia,
  runEvents,
  runAnalytics,
  runSnapshot,
  runReboot,
  runBackup
}
