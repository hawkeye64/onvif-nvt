const Soap = require('../utils/soap')
const Util = require('../utils/util')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/img/ONVIF-Imaging-Service-Spec-v1706.pdf}<br>
 * {@link https://www.onvif.org/ver20/imaging/wsdl/imaging.wsdl}<br>
 * </p>
 * <h3>Functions</h3>
 * {@link Imaging#getImagingSettings}
 * {@link Imaging#setImagingSettings}
 */
class Imaging {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null
    this.defaultProfileToken = null

    this.namespaceAttributes = [
      'xmlns:timg="http://www.onvif.org/ver20/imaging/wsdl"',
      'xmlns:tt="http://www.onvif.org/ver10/schema"'
    ]
  }

  /**
   * Call this function directly after instantiating an Imaging object.
   * @param {number} timeDiff The onvif device's time difference.
   * @param {object} serviceAddress An url object from url package - require('url').
   * @param {string=} username Optional only if the device does NOT have a user.
   * @param {string=} password Optional only if the device does NOT have a password.
   * @private
   */
  init (timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff
    this.serviceAddress = serviceAddress
    this.username = username
    this.password = password
  }

  /**
   * Sets the default profile token. Reference token to the VideoSource where the current Imaging Preset should be requested.
   * @param {string} profileToken The profileToken to use when one is not passed to a method requiring one.
   */
  setDefaultProfileToken (profileToken) {
    this.defaultProfileToken = profileToken
  }

  /**
   * Private function for creating a SOAP request.
   * @param {string} body The body of the xml.
   * @private
   */
  createRequest (body) {
    return this.soap.createRequest({
      body: body,
      xmlns: this.namespaceAttributes,
      diff: this.timeDiff,
      username: this.username,
      password: this.password
    })
  };

  /**
   * @param {string} methodName The method name
   * @param {string} xml The body of the xml
   * @param {callback=} callback Optional callback, instead of a Promise.
   * @private
   */
  buildRequest (methodName, xml, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''

      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error(`The "callback" argument for ${methodName} is invalid:` + errMsg))
          return
        }
      }

      if (typeof methodName === 'undefined' || methodName === null) {
        reject(new Error('The "methodName" argument for buildRequest is required.'))
        return
      }
      else {
        if ((errMsg = Util.isInvalidValue(methodName, 'string'))) {
          reject(new Error('The "methodName" argument for buildRequest is invalid:' + errMsg))
          return
        }
      }

      let soapBody = ''

      if (typeof xml === 'undefined' || xml === null || xml === '') {
        soapBody += `<timg:${methodName}/>`
      }
      else {
        soapBody += `<timg:${methodName}>`
        soapBody += xml
        soapBody += `</timg:${methodName}>`
      }

      const soapEnvelope = this.createRequest(soapBody)
      this.soap
        .makeRequest('imaging', this.serviceAddress, methodName, soapEnvelope)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })

    if (Util.isValidCallback(callback)) {
      promise
        .then((results) => {
          callback(null, results)
        })
        .catch((error) => {
          callback(error)
        })
    }
    else {
      return promise
    }
  }

  // ---------------------------------------------
  // Access Control API
  // ---------------------------------------------

  /**
   * Get the ImagingConfiguration for the requested VideoSource.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getImagingSettings (profileToken, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken
      let errMsg = ''

      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(
            new Error('The "callback" argument for getImagingSettings is invalid:' + errMsg)
          )
          return
        }
      }

      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(
          new Error('The "profileToken" argument for getImagingSettings is invalid: ' + errMsg)
        )
        return
      }

      let soapBody = ''
      soapBody = '<timg:VideoSourceToken>' + profileToken + '</timg:VideoSourceToken>'

      this.buildRequest('GetImagingSettings', soapBody)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })

    if (Util.isValidCallback(callback)) {
      promise
        .then((results) => {
          callback(null, results)
        })
        .catch((error) => {
          callback(error)
        })
    }
    else {
      return promise
    }
  }

  /**
   * Set the ImagingConfiguration for the requested VideoSource.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {Object} options Imaging settings.
   * @param {float=} options.Brightness Image brightness.
   * @param {float=} options.ColorSaturation Color saturation of the image.
   * @param {float=} options.Contrast Contrast of the image.
   * @param {float=} options.Sharpness Sharpness of the Video image.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  setImagingSettings (profileToken, options, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken
      let errMsg = ''

      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(
            new Error('The "callback" argument for getImagingSettings is invalid:' + errMsg)
          )
          return
        }
      }

      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(
          new Error('The "profileToken" argument for getImagingSettings is invalid: ' + errMsg)
        )
        return
      }

      let soapBody = ''
      soapBody = '<timg:VideoSourceToken>' + profileToken + '</timg:VideoSourceToken>'
      soapBody += '<timg:ImagingSettings>'

      if (typeof options.Brightness !== 'undefined' && options.Brightness !== null) {
        soapBody += '<tt:Brightness>' + parseFloat(options.Brightness) + '</tt:Brightness>'
      }

      if (typeof options.ColorSaturation !== 'undefined' && options.ColorSaturation !== null) {
        soapBody += '<tt:ColorSaturation>' + parseFloat(options.ColorSaturation) + '</tt:ColorSaturation>'
      }

      if (typeof options.Contrast !== 'undefined' && options.Contrast !== null) {
        soapBody += '<tt:Contrast>' + parseFloat(options.Contrast) + '</tt:Contrast>'
      }

      if (typeof options.Sharpness !== 'undefined' && options.Sharpness !== null) {
        soapBody += '<tt:Sharpness>' + parseFloat(options.Sharpness) + '</tt:Sharpness>'
      }

      soapBody += '</timg:ImagingSettings>'

      this.buildRequest('SetImagingSettings', soapBody)
        .then((results) => {
          resolve(results)
        })
        .catch((error) => {
          reject(error)
        })
    })

    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
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
