const Soap = require('../utils/soap');

const Util = require('../utils/util');

class Imaging {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.defaultProfileToken = null;
    this.namespaceAttributes = ['xmlns:timg="http://www.onvif.org/ver20/imaging/wsdl"', 'xmlns:tt="http://www.onvif.org/ver10/schema"'];
  }

  init(timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff;
    this.serviceAddress = serviceAddress;
    this.username = username;
    this.password = password;
  }

  setDefaultProfileToken(profileToken) {
    this.defaultProfileToken = profileToken;
  }

  createRequest(body) {
    return this.soap.createRequest({
      body: body,
      xmlns: this.namespaceAttributes,
      diff: this.timeDiff,
      username: this.username,
      password: this.password
    });
  }

  buildRequest(methodName, xml, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error(`The "callback" argument for ${methodName} is invalid:` + errMsg));
          return;
        }
      }

      if (typeof methodName === 'undefined' || methodName === null) {
        reject(new Error('The "methodName" argument for buildRequest is required.'));
        return;
      } else {
        if (errMsg = Util.isInvalidValue(methodName, 'string')) {
          reject(new Error('The "methodName" argument for buildRequest is invalid:' + errMsg));
          return;
        }
      }

      let soapBody = '';

      if (typeof xml === 'undefined' || xml === null || xml === '') {
        soapBody += `<timg:${methodName}/>`;
      } else {
        soapBody += `<timg:${methodName}>`;
        soapBody += xml;
        soapBody += `</timg:${methodName}>`;
      }

      const soapEnvelope = this.createRequest(soapBody);
      this.soap.makeRequest('imaging', this.serviceAddress, methodName, soapEnvelope).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getImagingSettings(profileToken, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getImagingSettings is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for getImagingSettings is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody = '<timg:VideoSourceToken>' + profileToken + '</timg:VideoSourceToken>';
      this.buildRequest('GetImagingSettings', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  setImagingSettings(profileToken, options, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getImagingSettings is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for getImagingSettings is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody = '<timg:VideoSourceToken>' + profileToken + '</timg:VideoSourceToken>';
      soapBody += '<timg:ImagingSettings>';

      if (typeof options.Brightness !== 'undefined' && options.Brightness !== null) {
        soapBody += '<tt:Brightness>' + parseFloat(options.Brightness) + '</tt:Brightness>';
      }

      if (typeof options.ColorSaturation !== 'undefined' && options.ColorSaturation !== null) {
        soapBody += '<tt:ColorSaturation>' + parseFloat(options.ColorSaturation) + '</tt:ColorSaturation>';
      }

      if (typeof options.Contrast !== 'undefined' && options.Contrast !== null) {
        soapBody += '<tt:Contrast>' + parseFloat(options.Contrast) + '</tt:Contrast>';
      }

      if (typeof options.Sharpness !== 'undefined' && options.Sharpness !== null) {
        soapBody += '<tt:Sharpness>' + parseFloat(options.Sharpness) + '</tt:Sharpness>';
      }

      soapBody += '</timg:ImagingSettings>';
      this.buildRequest('SetImagingSettings', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getOptions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getPresets() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getCurrentPreset() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setCurrentPreset() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  move() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getImagingStatus() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getCapabilities() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

}

module.exports = Imaging;