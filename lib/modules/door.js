const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/door/ONVIF-DoorControl-Service-Spec-v1712.pdf}<br>
 * {@link https://www.onvif.org/ver10/pacs/doorcontrol.wsdl}<br>
 * </p>
 */
class Door {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    // TODO: Jeff need namespace
    this.namespaceAttributes = [
      'xmlns:tdc="http://www.onvif.org/ver10/doorcontrol/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Door object.
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

  getServiceCapabilities () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getDoorInfoList () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getDoorInfo () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getDoorState () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  accessDoor () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  lockDoor () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  unlockDoor () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  blockDoor () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  lockDownDoor () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  lockDownReleaseDoor () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  lockOpenDoor () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  lockOpenReleaseDoor () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  doubleLockDoor () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }
}

module.exports = Door
