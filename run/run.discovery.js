const Config = require('./config')

if (runDiscovery) {
  const OnvifManager = require('../lib/onvif-nvt')
  OnvifManager.add('discovery')
  OnvifManager.discovery.startProbe().then(deviceList => {
    console.log(deviceList)
  })
    .catch(error => {
      console.error(error)
    })
}
