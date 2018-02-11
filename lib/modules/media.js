const Soap = require('../utils/soap')
const Util = require('../utils/util')

/**
 * @class Media
 * <p>
 * {@link https://www.onvif.org/specs/srv/media/ONVIF-Media-Service-Spec-v1706.pdf}<br>
 * {@link https://www.onvif.org/ver10/media/wsdl/media.wsdl}<br>
 * </p>
 */
class Media {
  constructor () {
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      'xmlns:env="http://www.w3.org/2003/05/soap-envelope "',
      'xmlns:ter="http://www.onvif.org/ver10/error"',
      'xmlns:xs="http://www.w3.org/2001/XMLSchema"',
      'xmlns:tt="http://www.onvif.org/ver10/schema"',
      'xmlns:trt="http://www.onvif.org/ver10/media/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Media object.
   * @param {number} timeDiff The onvif device's time difference.
   * @param {object} serviceAddress An url object from url package - require('url').
   * @param {string=} username Optional only if the device does NOT have a user.
   * @param {string=} password Optional only if the device does NOT have a password.
   */
  init (timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff
    this.serviceAddress = serviceAddress
    this.username = username
    this.password = password
  }

  /**
   * Private function for creating a SOAP request.
   * @param {string} body The body of the xml.
   */
  createRequest (body) {
    let soapEnvelope = Soap.createRequest({
      'body': body,
      'xmlns': this.namespaceAttributes,
      'diff': this.timeDiff,
      'username': this.username,
      'password': this.password
    })
    return soapEnvelope
  };

  // ---------------------------------------------
  // Media API
  // ---------------------------------------------

  createProfile () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getProfiles (callback) {
    let promise = new Promise((resolve, reject) => {
      let soapBody = '<trt:GetProfiles/>'
      // let soapBody = '<GetProfiles xmlns="http://www.onvif.org/ver10/media/wsdl"/>'
      let soapEnvelope = this.createRequest(soapBody)
      return Soap.makeRequest(this.serviceAddress, 'GetProfiles', soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (callback) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  getProfile () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  addVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  addVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  addAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  addAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  addPTZConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  addVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  addMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  addAudioOutputConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  addAudioDecoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removePTZConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeAudioOutputConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeAudioDecoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteProfile () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoSources () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoSourceConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleVideoSourceConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoSourceConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleVideoEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoEncoderConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getGuaranteedNumberOfVideoEncoderInstances () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioSources () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioSourceConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleAudioSourceConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioSourceConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleAudioEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioEncoderConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoAnalyticsConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleVideoAnalyticsConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getMetadataConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleMetadataConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getMetadataConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioOutputs () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioOutputConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioOutputConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleAudioOutputConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioOutputConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setAudioOutputConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioDecoderConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioDecoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleAudioDecoderConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioDecoderConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setAudioDecoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getStreamUri (protocol, profileToken, callback) {
    let promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if ((errMsg = Util.isInvalidValue(protocol, 'string'))) {
        reject(new Error('The "protocol" argument for getStreamUri is invalid: ' + errMsg))
        return
      }
      else if (!protocol.match(/^(UDP|HTTP|RTSP)$/)) {
        reject(new Error('The "protocol" argument for getStreamUri is invalid: The value must be either "UDP", "HTTP", or "RTSP".'))
        return
      }

      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for getStreamUri is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<trt:GetStreamUri>'
      soapBody += '<trt:StreamSetup>'
      soapBody += '<tt:Stream>RTP-Unicast</tt:Stream>'
      soapBody += '<tt:Transport>'
      soapBody += '<tt:Protocol>' + protocol + '</tt:Protocol>'
      soapBody += '</tt:Transport>'
      soapBody += '</trt:StreamSetup>'
      soapBody += '<trt:ProfileToken>' + profileToken + '</trt:ProfileToken>'
      soapBody += '</trt:GetStreamUri>'
      let soapEnvelope = this.createRequest(soapBody)

      return Soap.makeRequest(this.serviceAddress, 'GetStreamUri', soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (callback) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  getSnapshotUri (profileToken, callback) {
    let promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for getStreamUri is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<trt:GetSnapshotUri>'
      soapBody += '<trt:ProfileToken>' + profileToken + '</trt:ProfileToken>'
      soapBody += '</trt:GetSnapshotUri>'
      let soapEnvelope = this.createRequest(soapBody)

      return Soap.makeRequest(this.serviceAddress, 'GetSnapshotUri', soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (callback) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  startMulticastStreaming () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  stopMulticastStreaming () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setSynchronizationPoint () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoSourceModes () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setVideoSourceMode () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createOSD () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteOSD () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getOSDs () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getOSD () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setOSD () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getOSDOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }
}

module.exports = new Media()
