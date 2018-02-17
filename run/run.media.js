const Config = require('./config')

class runMedia {
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
          return this.GetProfiles().then(() => {
            return this.GetProfile()
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
      resolve()
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
      resolve()
    })
  }
  
  AddVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  AddPTZConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  AddVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  AddMetaDataConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  AddVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  RemoveVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  RemovePTZConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  RemoveVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  RemoveMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  DeleteProfile () {
    return new Promise((resolve, reject) => {
      resolve()
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
      resolve()
    })
  }
  
  GetCompatibleVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetVideoSourceConfigurationOptions () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  SetVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetVideoEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetCompatibleVideoEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetVideoEncoderConfigurationOptions () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetGuarateedNumberOfVideoEncoderInstances () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetAudioSources () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetAudioSourceConfigurations () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetCompatibleAudioSourceConfigurations () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetAudioSourceConfiguratonOptions () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  SetAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetAudioEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetCompatibleAudioEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetAudioEncoderConfigurationOptions () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  SetAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetVideoAnalyticsConfigurations () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetCompatibleVideoAnalyticsConfigurations () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  SetVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetMetadataConfigurations () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetCompatibleMetadataConfigurations () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  GetMetadataConfigurationOptions () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  
  SetMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      resolve()
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
}

module.exports = new runMedia()