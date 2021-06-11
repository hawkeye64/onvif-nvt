const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/replay/ONVIF-ReplayControl-Service-Spec-v1706.pdf}<br>
 * {@link https://www.onvif.org/ver10/replay.wsdl}<br>
 * </p>
 */
class Replay {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      'xmlns:trp="http://www.onvif.org/ver10/replay/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Replay object.
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
  // Replay API
  // ---------------------------------------------

  getReplayUri () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setReplayConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getReplayConfiguration () {
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

module.exports = Replay
