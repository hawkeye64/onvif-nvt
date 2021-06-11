const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/media/ONVIF-Media2-Service-Spec-v1712.pdf}<br>
 * {@link https://www.onvif.org/ver20/media/wsdl/media.wsdl}<br>
 * </p>
 */
class Media2 {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      // 'xmlns:tns1="http://www.onvif.org/ver10/topics"',
      // 'xmlns:trt="http://www.onvif.org/ver10/media/wsdl"'
      // 'xmlns:trt="http://www.onvif.org/ver10/media/wsdl"',
      // 'xmlns:tt="http://www.onvif.org/ver10/schema"'
      'xmlns:tr2="http://www.onvif.org/ver20/media/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Media2 object.
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
    const soapEnvelope = this.soap.createRequest({
      body: body,
      xmlns: this.namespaceAttributes,
      diff: this.timeDiff,
      username: this.username,
      password: this.password
    })
    return soapEnvelope
  }

  // ---------------------------------------------
  // Media2 API
  // ---------------------------------------------

  createProfile () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getProfiles () {
    return new Promise((resolve, reject) => {
      // let soapBody = '<trt:GetProfiles/>'
      const soapBody = '<GetProfiles xmlns="http://www.onvif.org/ver10/media/wsdl"/>'
      const soapEnvelope = this.createRequest(soapBody)
      console.log(soapEnvelope)
      return this.soap.makeRequest('media2', this.serviceAddress, 'GetProfiles', soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
  }

  addConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteProfile () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  // Get<entity>Configurations
  getConfigurations (/* entity */) {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  // Set<entity>Configuration
  setConfigurations (/* entity */) {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  // Get<entity>ConfigurationOptions
  getConfigurationOptions (/* entity */) {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoEncoderInstances () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getStreamUri () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getSnapshotUri (profileToken) {
    return new Promise((resolve, reject) => {
      let soapBody = ''
      soapBody += '<trt:GetSnapshotUri>'
      soapBody += '<trt:ProfileToken>' + profileToken + '</trt:ProfileToken>'
      soapBody += '</trt:GetSnapshotUri>'
      const soapEnvelope = this.createRequest(soapBody)
      return this.soap.makeRequest('media2', this.serviceAddress, 'GetSnapshotUri', soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
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

  createMask () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteMask () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getMasks () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setMask () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getMaskOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getServiceCapabilities () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }
}

module.exports = Media2
