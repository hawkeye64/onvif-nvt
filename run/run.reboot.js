const Config = require('./config')

class RunReboot {
  constructor () {
    this.OnvifManager = require('../lib/onvif-nvt')
    this.apiErrors = []
    this.camera = null
  }

  run () {
    return new Promise((resolve, reject) => {
      if (!Config.runReboot) {
        resolve([])
        return
      }
      this.OnvifManager.connect(Config.address, Config.port, Config.username, Config.password)
        .then(results => {
          this.camera = results

          // let the tests begin
          return this.SystemReboot().then(() => {
            resolve(this.apiErrors)
          })
        })
        .catch(error => {
          console.error(error)
        })
    })
  } // run()

  /* -------------------------------------------------
    NOTE: All functional test should resolve(error)
    instead of calling reject(error)
   ------------------------------------------------- */

  SystemReboot () {
    return new Promise((resolve, reject) => {
      this.camera.core.systemReboot()
        .then(results => {
          console.log('SystemReboot successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SystemReboot')
          console.error('SystemReboot failed')
          console.error(error.message)
          resolve(error)
        })
    })
  }
}

module.exports = new RunReboot()
