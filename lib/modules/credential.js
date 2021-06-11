const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/access/ONVIF-Credential-Service-Spec-v1706.pdf}<br>
 * {@link https://www.onvif.org/ver10/credential/wsdl/credential.wsdl}<br>
 * </p>
 *
 */
class Credential {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    // TODO: Jeff needs proper namespaces
    this.namespaceAttributes = [
      'xmlns:tcr="http://www.onvif.org/ver10/credential/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Credential object.
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
  // Credentials API
  // ---------------------------------------------

  getServiceCapabilities () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCredentialInfo () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCredentialInfoList () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCredentials () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCredentialList () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createCredential () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  modifyCredential () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteCredential () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCredentialState () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  enableCredential () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  disableCredential () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  resetAntipassbackViolation () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getSupportedFormatTypes () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCredentialIdentifiers () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setCredentialIdentifier () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteCredentialIdentifier () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCredentialAccessProfiles () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setCredentialAccessProfiles () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteCredentialAccessProfiles () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }
}

module.exports = Credential
