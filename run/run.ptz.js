const Config = require('./config')

class RunPtz {
  constructor () {
    this.OnvifManager = require('../lib/onvif-nvt')
    this.apiErrors = []
    this.camera = null

    this.ptzNodeToken = '' // retrieved from GetNodes
    this.ptzConfigurationToken = '' // retrieved from GetConfigurations
    this.presets = [] // retrieved from GetPresets
    this.presetToken = '' // retrieved from GetPresets
    this.testPresetName = 'testPreset'
    this.testPresetNameToken = ''
  }

  run () {
    return new Promise((resolve, reject) => {
      if (!Config.runPtz) {
        resolve([])
        return
      }
      this.OnvifManager.connect(Config.address, Config.port, Config.username, Config.password)
        .then(results => {
          this.camera = results

          // verify this camera supports PTZ
          if (!this.camera.ptz) {
            resolve([])
            return
          }

          // let the tests begin
          return this.GetNodes().then(() => {
            return this.GetNode()
          }).then(() => {
            return this.GetConfigurations()
          }).then(() => {
            return this.GetCompatibleConfigurations()
          }).then(() => {
            return this.GetConfiguration()
          }).then(() => {
            return this.GetConfigurationOptions()
          }).then(() => {
            return this.GetStatus()
          }).then(() => {
            return this.GetPresets()
          }).then(() => {
            return this.SetPreset()
          }).then(() => {
            return this.GotoPreset()
          }).then(() => {
            return this.RemovePreset()
          }).then(() => {
            return this.GotoHomePosition()
          }).then(() => {
            return this.SetHomePosition()
          }).then(() => {
            return this.RelativeMove()
          }).then(() => {
            return this.AbsoluteMove()
          }).then(() => {
            return this.ContinuousMove()
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

  GetNodes () {
    return new Promise((resolve, reject) => {
      this.camera.ptz.getNodes()
        .then(results => {
          console.log('GetNodes successful')
          this.ptzNodeToken = results['data']['GetNodesResponse']['PTZNode']['$']['token']
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetNodes')
          console.error('GetNodes failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetNode () {
    return new Promise((resolve, reject) => {
      this.camera.ptz.getNode(this.ptzNodeToken)
        .then(results => {
          console.log('GetNode successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetNode')
          console.error('GetNode failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.ptz.getConfigurations()
        .then(results => {
          console.log('GetConfigurations successful')
          this.ptzConfigurationToken = results['data']['GetConfigurationsResponse']['PTZConfiguration']['$']['token']
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetConfigurations')
          console.error('GetConfigurations failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.ptz.getConfiguration(this.ptzConfigurationToken)
        .then(results => {
          console.log('GetConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetConfiguration')
          console.error('GetConfiguration failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetConfigurationOptions () {
    return new Promise((resolve, reject) => {
      this.camera.ptz.getConfigurationOptions(this.ptzConfigurationToken)
        .then(results => {
          console.log('GetConfigurationOptions successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetConfigurationOptions')
          console.error('GetConfigurationOptions failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetCompatibleConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.ptz.getCompatibleConfigurations()
        .then(results => {
          console.log('GetCompatibleConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCompatibleConfigurations')
          console.error('GetCompatibleConfigurations failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetStatus () {
    return new Promise((resolve, reject) => {
      this.camera.ptz.getStatus()
        .then(results => {
          console.log('GetStatus successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetStatus')
          console.error('GetStatus failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  ContinuousMove () {
    return new Promise((resolve, reject) => {
      let velocity = {
        x: 1,
        y: 0
      }
      this.camera.ptz.continuousMove(null, velocity)
        .then(results => {
          console.log('ContinuousMove successful')
          // stop the camera after 5 seconds
          setTimeout(() => {
            this.camera.ptz.stop()
              .then(results => {
                console.log('Stop successful')
                resolve(results)
              })
              .catch(error => {
                this.apiErrors.push('Stop')
                console.error('Stop failed')
                console.error(error.message)
                console.error(error.fault)
                resolve(error)
              })
          }, 5000)
        })
        .catch(error => {
          this.apiErrors.push('ContinuousMove')
          console.error('ContinuousMove failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  RelativeMove () {
    return new Promise((resolve, reject) => {
      let translation = {
        x: 0.1,
        y: 0.3,
        z: 0
      }
      this.camera.ptz.relativeMove(null, translation)
        .then(results => {
          console.log('RelativeMove successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RelativeMove')
          console.error('RelativeMove failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  AbsoluteMove () {
    return new Promise((resolve, reject) => {
      let position = {
        x: 0.1,
        y: 0.3,
        z: 0
      }
      this.camera.ptz.absoluteMove(null, position)
        .then(results => {
          console.log('AbsoluteMove successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('AbsoluteMove')
          console.error('AbsoluteMove failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetPresets () {
    return new Promise((resolve, reject) => {
      this.camera.ptz.getPresets()
        .then(results => {
          console.log('GetPresets successful')
          this.presets = results['data']['GetPresetsResponse']['Preset']
          // verify presets not empty
          if (this.presets.length > 0) {
          // get the first preset and save it for gotoPreset
            let preset = this.presets[0]
            if (preset) {
              this.presetToken = preset['$']['token']
            }
            // verify the test preset doesn't exist
            this.presets.forEach(preset => {
              if (this.testPresetName === preset.Name) {
              // it does (maybe we stopped debugger in
              // deveopment, or crashed, whatever, deal with it now)
                this.testPresetNameToken = preset.$.token
              }
            })
          }
          if (this.testPresetNameToken.length > 0) {
            this.camera.ptz.removePreset(null, this.testPresetNameToken)
              .then(() => {
                this.testPresetNameToken = ''
                resolve(results)
              })
              .catch(() => {
              // don't care if there was an error here, not testing this functionality
                resolve(results)
              })
          }
          else {
            resolve(results)
          }
        })
        .catch(error => {
          this.apiErrors.push('GetPresets')
          console.error('GetPresets failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GotoPreset () {
    return new Promise((resolve, reject) => {
      if (this.presetToken.length > 0) {
        this.camera.ptz.gotoPreset(null, this.presetToken)
          .then(results => {
            console.log('GotoPreset successful')
            resolve(results)
          })
          .catch(error => {
            this.apiErrors.push('GotoPreset')
            console.error('GotoPreset failed')
            console.error(error.message)
            console.error(error.fault)
            resolve(error)
          })
      }
      else {
        console.log('GotoPreset had nothing to do')
        resolve()
      }
    })
  }

  SetPreset () {
    return new Promise((resolve, reject) => {
      if (this.testPresetName.length === 0) {
        this.camera.ptz.setPreset(null, null, this.testPresetName)
          .then(results => {
            console.log('SetPreset successful')
            // get token for the preset that was just added
            this.testPresetNameToken = results['data']['SetPresetResponse']['PresetToken']
            resolve(results)
          })
          .catch(error => {
            this.apiErrors.push('SetPreset')
            console.error('SetPreset failed')
            console.error(error.message)
            console.error(error.fault)
            resolve(error)
          })
      }
      else {
        console.log('SetPreset had nothing to do')
        resolve()
      }
    })
  }

  RemovePreset () {
    return new Promise((resolve, reject) => {
      if (this.testPresetNameToken.length > 0) {
        this.camera.ptz.removePreset(null, this.testPresetNameToken)
          .then(results => {
            this.testPresetNameToken.length = ''
            console.log('RemovePreset successful')
            resolve(results)
          })
          .catch(error => {
            this.apiErrors.push('RemovePreset')
            console.error('RemovePreset failed')
            console.error(error.message)
            console.error(error.fault)
            resolve(error)
          })
      }
      else {
        console.log('RemovePreset had nothing to do')
        resolve()
      }
    })
  }

  GotoHomePosition () {
    return new Promise((resolve, reject) => {
      this.camera.ptz.gotoHomePosition(null)
        .then(results => {
          console.log('GotoHomePosition successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GotoHomePosition')
          console.error('GotoHomePosition failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  SetHomePosition () {
    return new Promise((resolve, reject) => {
      this.camera.ptz.setHomePosition(null)
        .then(results => {
          console.log('SetHomePosition successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetHomePosition')
          console.error('SetHomePosition failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
}

module.exports = new RunPtz()
