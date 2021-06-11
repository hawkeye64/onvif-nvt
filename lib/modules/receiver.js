const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/rcv/ONVIF-Receiver-Service-Spec-v1706.pdf}<br>
 * {@link https://www.onvif.org/ver10/receiver.wsdl}<br>
 * </p>
 */
class Receiver {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      'xmlns:trv="http://www.onvif.org/ver10/receiver/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Receiver object.
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
  // Receiver API
  // ---------------------------------------------

  getReceivers () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getReceiver () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createReceiver () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteReceiver () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  configureReceiver () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setReceiverMode () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getReceiverState () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getServiceCapabilitites () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }
}

module.exports = Receiver
