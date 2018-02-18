const Config = require('./config')

class RunDiscovery {
  constructor () {
    this.OnvifManager = require('../lib/onvif-nvt')
    this.apiErrors = []
  }

  run () {
    return new Promise((resolve, reject) => {
      if (!Config.runDiscovery) {
        resolve({})
        return
      }
      this.OnvifManager.add('discovery')
      this.OnvifManager.discovery.startProbe()
        .then(deviceList => {
          resolve(this.apiErrors)
        })
        .catch(error => {
          this.apiErrors.push('Discovery::startProbe')
          console.error('Discovery::startProbe failed')
          console.error(error)
          resolve(this.apiErrors)
        })
    })
  }
}

module.exports = new RunDiscovery()
