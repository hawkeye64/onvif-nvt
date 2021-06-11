const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/disp/ONVIF-Display-Service-Spec-v230.pdf}<br>
 * {@link https://www.onvif.org/ver10/display.wsdl}<br>
 * </p>
 */
class Display {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      'xmlns:tls="http://www.onvif.org/ver10/display/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Display object.
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
  // Display API
  // ---------------------------------------------

  getPaneConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getPaneConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setPaneConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setPaneConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createPaneConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deletePaneConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getLayout () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setLayout () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getDisplayOptions () {
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

module.exports = Display
