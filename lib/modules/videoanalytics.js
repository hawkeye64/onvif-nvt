const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/analytics/ONVIF-VideoAnalyticsDevice-Service-Spec-v211.pdf}<br>
 * {@link https://www.onvif.org/ver10/analyticsdevice.wsdl}<br>
 * </p>
 */
class VideoAnalytics {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    // TODO: Jeff need namespaces
    this.namespaceAttributes = [
      // TODO: for analyticsdevice (device and video)
      'xmlns:tad="http://www.onvif.org/ver10/analyticsdevice.wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a VideoAnalytics object.
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
  // Video Analytics API
  // ---------------------------------------------

  getAnalyticsEngineInputs () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAnalyticsEngineInput () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setAnalyticsEngineInput () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createAnalyticsEngineInputs () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteAnalyticsEngineInputs () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAnalyticsEngines () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAnalyticsEngine () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAnalyticsEngineControls () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAnalyticsEngineControl () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setAnalyticsEngineControl () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createAnalyticsEngineControl () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteAnalyticsEngineControl () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAnalyticsState () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAnalyticsDeviceStreamUri () {
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

module.exports = VideoAnalytics
