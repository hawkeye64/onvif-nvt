const Config = require('./config')

class RunMedia {
  constructor () {
    this.OnvifManager = require('../lib/onvif-nvt')
    this.apiErrors = []
    this.camera = null

    this.profileToken = ''
  }

  run () {
    return new Promise((resolve, reject) => {
      if (!Config.runMedia) {
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
          return this.CreateProfile().then(() => {
          }).then(() => {
            return this.GetProfiles()
          }).then(() => {
            return this.GetProfile()
          }).then(() => {
            return this.AddVideoSourceConfiguration()
          }).then(() => {
            return this.GetVideoSources()
          }).then(() => {
            return this.GetVideoSourceConfigurations()
          }).then(() => {
            return this.GetVideoEncoderConfigurations()
          }).then(() => {
            return this.GetAudioSources()
          }).then(() => {
            return this.GetAudioSourceConfigurations()
          }).then(() => {
            return this.GetAudioEncoderConfigurations()
          }).then(() => {
            return this.GetVideoAnalyticsConfigurations()
          }).then(() => {
            return this.GetMetadataConfigurations()
          }).then(() => {
            return this.GetAudioOutputs()
          }).then(() => {
            return this.GetAudioOutputConfigurations()
          }).then(() => {
            return this.GetAudioDecoderConfigurations()
          }).then(() => {
            return this.GetStreamUri()
          }).then(() => {
            return this.GetSnapshotUri()
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

  CreateProfile () {
    return new Promise((resolve, reject) => {
      this.camera.media.createProfile()
        .then(results => {
          console.log('CreateProfile successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('CreateProfile')
          console.error('CreateProfile failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetProfiles () {
    return new Promise((resolve, reject) => {
      this.camera.media.getProfiles()
        .then(results => {
          let response = results.data.GetProfilesResponse
          let profiles = response.Profiles
          if (profiles.length > 0) {
            let profile = profiles[0]
            this.profileToken = profile['$']['token']
          }
          console.log('GetProfiles successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetProfiles')
          console.error('GetProfiles failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetProfile () {
    return new Promise((resolve, reject) => {
      this.camera.media.getProfile(this.profileToken)
        .then(results => {
          console.log('GetProfile successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetProfile')
          console.error('GetProfile failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  AddVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.addVideoSourceConfiguration()
        .then(results => {
          console.log('AddVideoSourceConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('AddVideoSourceConfiguration')
          console.error('AddVideoSourceConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  AddVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.addVideoEncoderConfiguration()
        .then(results => {
          console.log('AddVideoEncoderConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('AddVideoEncoderConfiguration')
          console.error('AddVideoEncoderConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  AddAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.addAudioSourceConfiguration()
        .then(results => {
          console.log('AddAudioSourceConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('AddAudioSourceConfiguration')
          console.error('AddAudioSourceConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  AddAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.addAudioEncoderConfiguration()
        .then(results => {
          console.log('AddAudioEncoderConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('AddAudioEncoderConfiguration')
          console.error('AddAudioEncoderConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  AddPTZConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.addPTZConfiguration()
        .then(results => {
          console.log('AddPTZConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('AddPTZConfiguration')
          console.error('AddPTZConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  AddVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.addVideoAnalyticsConfiguration()
        .then(results => {
          console.log('AddVideoAnalyticsConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('AddVideoAnalyticsConfiguration')
          console.error('AddVideoAnalyticsConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  AddMetaDataConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.addMetaDataConfiguration()
        .then(results => {
          console.log('AddMetaDataConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('AddMetaDataConfiguration')
          console.error('AddMetaDataConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  AddAudioOutputConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.addAudioOutputConfiguration()
        .then(results => {
          console.log('AddAudioOutputConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('AddAudioOutputConfiguration')
          console.error('AddAudioOutputConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  AddAudioDecoderConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.addAudioDecoderConfiguration()
        .then(results => {
          console.log('AddAudioDecoderConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('AddAudioDecoderConfiguration')
          console.error('AddAudioDecoderConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  RemoveVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.removeVideoSourceConfiguration()
        .then(results => {
          console.log('RemoveVideoSourceConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RemoveVideoSourceConfiguration')
          console.error('RemoveVideoSourceConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  RemoveVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.removeVideoEncoderConfiguration()
        .then(results => {
          console.log('RemoveVideoEncoderConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RemoveVideoEncoderConfiguration')
          console.error('RemoveVideoEncoderConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  RemoveAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.removeAudioSourceConfiguration()
        .then(results => {
          console.log('RemoveAudioSourceConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RemoveAudioSourceConfiguration')
          console.error('RemoveAudioSourceConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  RemoveAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.removeAudioEncoderConfiguration()
        .then(results => {
          console.log('RemoveAudioEncoderConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RemoveAudioEncoderConfiguration')
          console.error('RemoveAudioEncoderConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  RemovePTZConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.removePTZConfiguration()
        .then(results => {
          console.log('RemovePTZConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RemovePTZConfiguration')
          console.error('RemovePTZConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  RemoveVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.removeVideoAnalyticsConfiguration()
        .then(results => {
          console.log('RemoveVideoAnalyticsConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RemoveVideoAnalyticsConfiguration')
          console.error('RemoveVideoAnalyticsConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  RemoveMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.removeMetadataConfiguration()
        .then(results => {
          console.log('RemoveMetadataConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RemoveMetadataConfiguration')
          console.error('RemoveMetadataConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  RemoveAudioOutputConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.removeAudioOutputConfiguration()
        .then(results => {
          console.log('RemoveAudioOutputConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RemoveAudioOutputConfiguration')
          console.error('RemoveAudioOutputConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  RemoveAudioDecoderConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.removeAudioDecoderConfiguration()
        .then(results => {
          console.log('RemoveAudioDecoderConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RemoveAudioDecoderConfiguration')
          console.error('RemoveAudioDecoderConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  DeleteProfile () {
    return new Promise((resolve, reject) => {
      this.camera.media.deleteProfile()
        .then(results => {
          console.log('DeleteProfile successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('DeleteProfile')
          console.error('DeleteProfile failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetVideoSources () {
    return new Promise((resolve, reject) => {
      this.camera.media.getVideoSources()
        .then(results => {
          console.log('GetVideoSources successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetVideoSources')
          console.error('GetVideoSources failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetVideoSourceConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getVideoSourceConfigurations()
        .then(results => {
          console.log('GetVideoSourceConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetVideoSourceConfigurations')
          console.error('GetVideoSourceConfigurations failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.getVideoSourceConfiguration()
        .then(results => {
          console.log('GetVideoSourceConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetVideoSourceConfiguration')
          console.error('GetVideoSourceConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetCompatibleVideoSourceConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getCompatibleVideoSourceConfigurations()
        .then(results => {
          console.log('GetCompatibleVideoSourceConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCompatibleVideoSourceConfigurations')
          console.error('GetCompatibleVideoSourceConfigurations failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetVideoSourceConfigurationOptions () {
    return new Promise((resolve, reject) => {
      this.camera.media.getVideoSourceConfigurationOptions()
        .then(results => {
          console.log('GetVideoSourceConfigurationOptions successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetVideoSourceConfigurationOptions')
          console.error('GetVideoSourceConfigurationOptions failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.setVideoSourceConfiguration()
        .then(results => {
          console.log('SetVideoSourceConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetVideoSourceConfiguration')
          console.error('SetVideoSourceConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetVideoEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getVideoEncoderConfigurations()
        .then(results => {
          console.log('GetVideoEncoderConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetVideoEncoderConfigurations')
          console.error('GetVideoEncoderConfigurations failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.getVideoEncoderConfiguration()
        .then(results => {
          console.log('GetVideoEncoderConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetVideoEncoderConfiguration')
          console.error('GetVideoEncoderConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetCompatibleVideoEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getCompatibleVideoEncoderConfigurations()
        .then(results => {
          console.log('GetCompatibleVideoEncoderConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCompatibleVideoEncoderConfigurations')
          console.error('GetCompatibleVideoEncoderConfigurations failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetVideoEncoderConfigurationOptions () {
    return new Promise((resolve, reject) => {
      this.camera.media.getVideoEncoderConfigurationOptions()
        .then(results => {
          console.log('GetVideoEncoderConfigurationOptions successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetVideoEncoderConfigurationOptions')
          console.error('GetVideoEncoderConfigurationOptions failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.setVideoEncoderConfiguration()
        .then(results => {
          console.log('SetVideoEncoderConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetVideoEncoderConfiguration')
          console.error('SetVideoEncoderConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetGuarateedNumberOfVideoEncoderInstances () {
    return new Promise((resolve, reject) => {
      this.camera.media.getGuarateedNumberOfVideoEncoderInstances()
        .then(results => {
          console.log('GetGuarateedNumberOfVideoEncoderInstances successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetGuarateedNumberOfVideoEncoderInstances')
          console.error('GetGuarateedNumberOfVideoEncoderInstances failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetAudioSources () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioSources()
        .then(results => {
          console.log('GetAudioSources successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioSources')
          console.error('GetAudioSources failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetAudioSourceConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioSourceConfigurations()
        .then(results => {
          console.log('GetAudioSourceConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioSourceConfigurations')
          console.error('GetAudioSourceConfigurations failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioSourceConfiguration()
        .then(results => {
          console.log('GetAudioSourceConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioSourceConfiguration')
          console.error('GetAudioSourceConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetCompatibleAudioSourceConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getCompatibleAudioSourceConfigurations()
        .then(results => {
          console.log('GetCompatibleAudioSourceConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCompatibleAudioSourceConfigurations')
          console.error('GetCompatibleAudioSourceConfigurations failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetAudioSourceConfiguratonOptions () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioSourceConfiguratonOptions()
        .then(results => {
          console.log('GetAudioSourceConfiguratonOptions successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioSourceConfiguratonOptions')
          console.error('GetAudioSourceConfiguratonOptions failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.setAudioSourceConfiguration()
        .then(results => {
          console.log('SetAudioSourceConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetAudioSourceConfiguration')
          console.error('SetAudioSourceConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetAudioEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioEncoderConfigurations()
        .then(results => {
          console.log('GetAudioEncoderConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioEncoderConfigurations')
          console.error('GetAudioEncoderConfigurations failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioEncoderConfiguration()
        .then(results => {
          console.log('GetAudioEncoderConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioEncoderConfiguration')
          console.error('GetAudioEncoderConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetCompatibleAudioEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getCompatibleAudioEncoderConfigurations()
        .then(results => {
          console.log('GetCompatibleAudioEncoderConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCompatibleAudioEncoderConfigurations')
          console.error('GetCompatibleAudioEncoderConfigurations failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetAudioEncoderConfigurationOptions () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioEncoderConfigurationOptions()
        .then(results => {
          console.log('GetAudioEncoderConfigurationOptions successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioEncoderConfigurationOptions')
          console.error('GetAudioEncoderConfigurationOptions failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.setAudioEncoderConfiguration()
        .then(results => {
          console.log('SetAudioEncoderConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetAudioEncoderConfiguration')
          console.error('SetAudioEncoderConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetVideoAnalyticsConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getVideoAnalyticsConfigurations()
        .then(results => {
          console.log('GetVideoAnalyticsConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetVideoAnalyticsConfigurations')
          console.error('GetVideoAnalyticsConfigurations failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.getVideoAnalyticsConfiguration()
        .then(results => {
          console.log('GetVideoAnalyticsConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetVideoAnalyticsConfiguration')
          console.error('GetVideoAnalyticsConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetCompatibleVideoAnalyticsConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getCompatibleVideoAnalyticsConfigurations()
        .then(results => {
          console.log('GetCompatibleVideoAnalyticsConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCompatibleVideoAnalyticsConfigurations')
          console.error('GetCompatibleVideoAnalyticsConfigurations failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.setVideoAnalyticsConfiguration()
        .then(results => {
          console.log('SetVideoAnalyticsConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetVideoAnalyticsConfiguration')
          console.error('SetVideoAnalyticsConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetMetadataConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getMetadataConfigurations()
        .then(results => {
          console.log('GetMetadataConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetMetadataConfigurations')
          console.error('GetMetadataConfigurations failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.getMetadataConfiguration()
        .then(results => {
          console.log('GetMetadataConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetMetadataConfiguration')
          console.error('GetMetadataConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetCompatibleMetadataConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getCompatibleMetadataConfigurations()
        .then(results => {
          console.log('GetCompatibleMetadataConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCompatibleMetadataConfigurations')
          console.error('GetCompatibleMetadataConfigurations failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetMetadataConfigurationOptions () {
    return new Promise((resolve, reject) => {
      this.camera.media.getMetadataConfigurationOptions()
        .then(results => {
          console.log('GetMetadataConfigurationOptions successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetMetadataConfigurationOptions')
          console.error('GetMetadataConfigurationOptions failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.setMetadataConfiguration()
        .then(results => {
          console.log('SetMetadataConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetMetadataConfiguration')
          console.error('SetMetadataConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetAudioOutputs () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioOutputs()
        .then(results => {
          console.log('GetAudioOutputs successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioOutputs')
          console.error('GetAudioOutputs failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetAudioOutputConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioOutputConfigurations()
        .then(results => {
          console.log('GetAudioOutputConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioOutputConfigurations')
          console.error('GetAudioOutputConfigurationsnapshot failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetAudioOutputConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioOutputConfiguration()
        .then(results => {
          console.log('GetAudioOutputConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioOutputConfiguration')
          console.error('GetAudioOutputConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetCompatibleAudioOutputConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getCompatibleAudioOutputConfigurations()
        .then(results => {
          console.log('GetCompatibleAudioOutputConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCompatibleAudioOutputConfigurations')
          console.error('GetCompatibleAudioOutputConfigurations failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetAudioOutputConfigurationOptions () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioOutputConfigurationOptions()
        .then(results => {
          console.log('GetAudioOutputConfigurationOptions successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioOutputConfigurationOptions')
          console.error('GetAudioOutputConfigurationOptions failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetAudioOutputConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.setAudioOutputConfiguration()
        .then(results => {
          console.log('SetAudioOutputConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetAudioOutputConfiguration')
          console.error('SetAudioOutputConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetAudioDecoderConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioDecoderConfigurations()
        .then(results => {
          console.log('GetAudioDecoderConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioDecoderConfigurations')
          console.error('GetAudioDecoderConfigurations failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetAudioDecoderConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioDecoderConfiguration()
        .then(results => {
          console.log('GetAudioDecoderConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioDecoderConfiguration')
          console.error('GetAudioDecoderConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetCompatibleAudioDecoderConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.media.getCompatibleAudioDecoderConfigurations()
        .then(results => {
          console.log('GetCompatibleAudioDecoderConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCompatibleAudioDecoderConfigurations')
          console.error('GetCompatibleAudioDecoderConfigurations failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetAudioDecoderConfigurationOptions () {
    return new Promise((resolve, reject) => {
      this.camera.media.getAudioDecoderConfigurationOptions()
        .then(results => {
          console.log('GetAudioDecoderConfigurationOptions successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAudioDecoderConfigurationOptions')
          console.error('GetAudioDecoderConfigurationOptions failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetAudioDecoderConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.media.setAudioDecoderConfiguration()
        .then(results => {
          console.log('SetAudioDecoderConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetAudioDecoderConfiguration')
          console.error('SetAudioDecoderConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetStreamUri () {
    return new Promise((resolve, reject) => {
      this.camera.media.getStreamUri('RTP-Unicast', 'HTTP', this.profileToken)
        .then(results => {
          console.log('GetStreamUri successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetStreamUri')
          console.error('GetStreamUri failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  GetSnapshotUri () {
    return new Promise((resolve, reject) => {
      this.camera.media.getSnapshotUri(this.profileToken)
        .then(results => {
          console.log('GetSnapshotUri successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetSnapshotUri')
          console.error('GetSnapshotUri failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }

  StartMulticastStreaming () {
    return new Promise((resolve, reject) => {
      this.camera.media.startMulticastStreaming()
        .then(results => {
          console.log('StartMulticastStreaming successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('StartMulticastStreaming')
          console.error('StartMulticastStreaming failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  StopMulticastStreaming () {
    return new Promise((resolve, reject) => {
      this.camera.media.stopMulticastStreaming()
        .then(results => {
          console.log('StopMulticastStreaming successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('StopMulticastStreaming')
          console.error('StopMulticastStreaming failed')
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
      this.camera.media.setSynchronizationPoint()
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

  GetVideoSourceModes () {
    return new Promise((resolve, reject) => {
      this.camera.media.getVideoSourceModes()
        .then(results => {
          console.log('GetVideoSourceModes successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetVideoSourceModes')
          console.error('GetVideoSourceModes failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetVideoSourceMode () {
    return new Promise((resolve, reject) => {
      this.camera.media.setVideoSourceMode()
        .then(results => {
          console.log('SetVideoSourceMode successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetVideoSourceMode')
          console.error('SetVideoSourceMode failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  CreateOSD () {
    return new Promise((resolve, reject) => {
      this.camera.media.createOSD()
        .then(results => {
          console.log('CreateOSD successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('CreateOSD')
          console.error('CreateOSD failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  DeleteOSD () {
    return new Promise((resolve, reject) => {
      this.camera.media.deleteOSD()
        .then(results => {
          console.log('DeleteOSD successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('DeleteOSD')
          console.error('DeleteOSD failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetOSDs () {
    return new Promise((resolve, reject) => {
      this.camera.media.getOSDs()
        .then(results => {
          console.log('GetOSDs successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetOSDs')
          console.error('GetOSDs failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetOSD () {
    return new Promise((resolve, reject) => {
      this.camera.media.getOSD()
        .then(results => {
          console.log('GetOSD successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetOSD')
          console.error('GetOSD failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetOSD () {
    return new Promise((resolve, reject) => {
      this.camera.media.setOSD()
        .then(results => {
          console.log('SetOSD successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetOSD')
          console.error('SetOSD failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetOSDOptions () {
    return new Promise((resolve, reject) => {
      this.camera.media.getOSDOptions()
        .then(results => {
          console.log('GetOSDOptions successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetOSDOptions')
          console.error('GetOSDOptions failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }
}

module.exports = new RunMedia()
