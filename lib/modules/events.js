const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/ver10/events/wsdl/event.wsdl}<br>
 * </p>
 */
class Events {
  constructor () {
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      'xmlns:tev="http://www.onvif.org/ver10/events/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating an Events object.
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
}

module.exports = new Events()
