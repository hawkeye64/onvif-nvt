const Config = require('./config')

class RunEvents {
  constructor () {
    this.OnvifManager = require('../lib/onvif-nvt')
    this.apiErrors = []
    this.camera = null

    this.subscriptionId = {}
  }

  run () {
    return new Promise((resolve, reject) => {
      if (!Config.runEvents) {
        resolve([])
        return
      }
      this.OnvifManager.connect(Config.address, Config.port, Config.username, Config.password)
        .then(results => {
          this.camera = results

          if (!this.camera.events) {
            console.warning('Camera does not support ONVIF events')
            resolve([])
            return
          }

          // this.camera.events.on('messages', messages => {
          //   console.log('Messages Received:', messages)
          // })

          // this.camera.events.on('messages:error', error => {
          //   console.error('Messages Error:', error)
          // })

          // this.camera.events.start()

          // let the tests begin
          return this.GetEventProperties().then(() => {
            return this.GetServiceCapabilities()
          }).then(() => {
            return this.CreatePullPointSubscription()
          }).then(() => {
            return this.PullMessages()
          }).then(() => {
            return this.SetSynchronizationPoint()
          }).then(() => {
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

  GetEventProperties () {
    return new Promise((resolve, reject) => {
      this.camera.events.getEventProperties()
        .then(results => {
          console.log('GetEventProperties successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetEventProperties')
          console.error('GetEventProperties failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetServiceCapabilities () {
    return new Promise((resolve, reject) => {
      this.camera.events.getServiceCapabilities()
        .then(results => {
          console.log('GetServiceCapabilities successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetServiceCapabilities')
          console.error('GetServiceCapabilities failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  CreatePullPointSubscription () {
    return new Promise((resolve, reject) => {
      this.camera.events.createPullPointSubscription()
        .then(results => {
          console.log('CreatePullPointSubscription successful')
          let response = results.data.CreatePullPointSubscriptionResponse
          let reference = response.SubscriptionReference
          this.subscriptionId = {}
          if (reference.ReferenceParameters) {
            this.subscriptionId = reference.ReferenceParameters.SubscriptionId
          }
          this.subscriptionId.Address = reference.Address
          console.log(this.subscriptionId)
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('CreatePullPointSubscription')
          console.error('CreatePullPointSubscription failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  PullMessages () {
    return new Promise((resolve, reject) => {
      this.camera.events.pullMessages(this.subscriptionId, 'PT10S', 2)
        .then(results => {
          console.log('PullMessages successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('PullMessages')
          console.error('PullMessages failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetSynchronizationPoint () {
    return new Promise((resolve, reject) => {
      this.camera.events.setSynchronizationPoint()
        .then(results => {
          console.log('SetSynchronizationPoint successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetSynchronizationPoint')
          console.error('SetSynchronizationPoint failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }
}

module.exports = new RunEvents()
