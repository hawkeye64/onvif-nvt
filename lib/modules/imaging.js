const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/img/ONVIF-Imaging-Service-Spec-v1706.pdf}<br>
 * {@link https://www.onvif.org/ver20/imaging/wsdl/imaging.wsdl}<br>
 * </p>
 */
class Imaging {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      'xmlns:tns1="http://www.onvif.org/ver10/topics"',
      'xmlns:timg="http://www.onvif.org/ver20/imaging/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating an Imaging object.
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
  // Access Control API
  // ---------------------------------------------

  getImagingSettings () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setImagingSettings () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getPresets () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCurrentPreset () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setCurrentPreset () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  // focus
  move () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  stop () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getImagingStatus () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCapabilities () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }
}

module.exports = Imaging
