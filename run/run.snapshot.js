const Config = require('./config')

class RunSnapshot {
  constructor () {
    this.OnvifManager = require('../lib/onvif-nvt')
    this.apiErrors = []
    this.camera = null

    this.profileToken = ''
  }

  run () {
    return new Promise((resolve, reject) => {
      if (!Config.runSnapshot) {
        resolve([])
        return
      }
      this.OnvifManager.connect(Config.address, Config.port, Config.username, Config.password)
        .then(results => {
          this.camera = results

          // verify this camera supports Media
          if (!this.camera.media) {
            resolve([])
            return
          }

          // let the tests begin
          return this.GetSnapshot().then(() => {
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

  GetSnapshot () {
    return new Promise((resolve, reject) => {
      this.camera.add('snapshot')
      this.camera.snapshot.getSnapshot()
        .then(results => {
          console.log('GetSnapshot successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetSnapshot')
          console.error('GetSnapshot failed')
          console.error(error.message)
          resolve(error)
        })
    })
  }
}

module.exports = new RunSnapshot()
