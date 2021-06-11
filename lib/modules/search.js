const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/rsrch/ONVIF-RecordingSearch-Service-Spec-v1706.pdf}<br>
 * {@link https://www.onvif.org/ver10/search.wsdl}<br>
 * </p>
 */
class Search {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      'xmlns:tse="http://www.onvif.org/ver10/search/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Search object.
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
  // Search (Recording) API
  // ---------------------------------------------

  getRecordingSummary () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getRecordingInformation () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getMediaAttributes () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  findRecordings () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getRecordingSearchResults () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  findEvents () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getEventSearchResults () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  findPTZPosition () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getPTZPositionSearchResults () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  findMetadata () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getMetadataSearchResults () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  endSearch () {
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

module.exports = Search
