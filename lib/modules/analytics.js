const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/analytics/ONVIF-Analytics-Service-Spec-v1712.pdf}<br>
 * {@link https://www.onvif.org/ver20/analytics/wsdl/analytics.wsdl}<br>
 * </p>
 *
 */
class Analytics {
  constructor () {
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      'xmlns:tns1="http://www.onvif.org/ver10/topics"',
      'xmlns:axt="http://www.onvif.org/ver10/analytics"',
      'xmlns:ttr="http://www.onvif.org/ver10/analytics/radiometry"'
    ]
  }

  /**
   * Call this function directly after instantiating an Analytics object.
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
  // Analytics API
  // ---------------------------------------------

  getSupportedRules () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getRules () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createRules () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  modifyRules () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteRules () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getRuleOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getSupportedAnalyticsModules () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAnalyticsModules () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createAnalyticsModules () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  modifyAnalyticsModules () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteAnalyticsModules () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAnalyticsModuleOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  capabilities () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }
}

module.exports = new Analytics()
