const Config = require('./config')

class RunAnalytics {
  constructor () {
    this.OnvifManager = require('../lib/onvif-nvt')
    this.apiErrors = []
    this.camera = null

    this.token = null
    this.type = null
  }

  run () {
    return new Promise((resolve, reject) => {
      if (!Config.runAnalytics) {
        resolve([])
        return
      }
      this.OnvifManager.connect(Config.address, Config.port, Config.username, Config.password)
        .then(results => {
          this.camera = results

          // verify this camera supports Analytics
          if (!this.camera.analytics) {
            console.log('Camera does not support ONVIF Analytics')
            resolve([])
            return
          }

          // get a video analytics configuration token
          this.getVideoAnalyticsProfile()
          if (!this.token) {
            console.log('Camera does have any Video Analytics Profiles')
            resolve([])
            return
          }

          // let the tests begin
          return this.GetServiceCapabilities().then(() => {
          }).then(() => {
            return this.GetSupportedAnalyticsModules()
          }).then(() => {
            return this.GetAnalyticsModules()
          }).then(() => {
            return this.GetAnalyticsModuleOptions()
          }).then(() => {
            return this.GetSupportedRules()
          }).then(() => {
            return this.GetRules()
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

  getVideoAnalyticsProfile () {
    this.camera.profileList.forEach(profile => {
      if (!this.token) {
        if ('VideoAnalyticsConfiguration' in profile) {
          const config = profile.VideoAnalyticsConfiguration
          this.token = config.$.token
          console.log('Video Analytics Token:', this.token)
        }
      }
    })
  }

  GetServiceCapabilities () {
    return new Promise((resolve, reject) => {
      this.camera.analytics.getServiceCapabilities()
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

  GetSupportedAnalyticsModules () {
    return new Promise((resolve, reject) => {
      this.camera.analytics.getSupportedAnalyticsModules(this.token)
        .then(results => {
          console.log('GetSupportedAnalyticsModules successful')
          const response = results.data.GetSupportedAnalyticsModulesResponse
          const modules = response.SupportedAnalyticsModules
          const description = modules.AnalyticsModuleDescription
          description.forEach(desc => {
            if (!this.type) {
              this.type = desc.$.Name
            }
          })
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetSupportedAnalyticsModules')
          console.error('GetSupportedAnalyticsModules failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetAnalyticsModules () {
    return new Promise((resolve, reject) => {
      this.camera.analytics.getAnalyticsModules(this.token)
        .then(results => {
          console.log('GetAnalyticsModules successful')
          const response = results.data.GetAnalyticsModulesResponse
          const analyticsModule = response.AnalyticsModule
          if (analyticsModule && analyticsModule.length > 0) {
            // TBD
          }
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAnalyticsModules')
          console.error('GetAnalyticsModules failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetAnalyticsModuleOptions () {
    return new Promise((resolve, reject) => {
      this.camera.analytics.getAnalyticsModuleOptions(this.token, this.type)
        .then(results => {
          console.log('GetAnalyticsModuleOptions successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAnalyticsModuleOptions')
          console.error('GetAnalyticsModuleOptions failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetSupportedRules () {
    return new Promise((resolve, reject) => {
      this.camera.analytics.getSupportedRules(this.token)
        .then(results => {
          console.log('GetSupportedRules successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetSupportedRules')
          console.error('GetSupportedRules failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetRules () {
    return new Promise((resolve, reject) => {
      this.camera.analytics.getRules(this.token)
        .then(results => {
          console.log('GetRules successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetRules')
          console.error('GetRules failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }
}

module.exports = new RunAnalytics()
