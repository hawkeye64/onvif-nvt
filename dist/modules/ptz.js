const Soap = require('../utils/soap');

const Util = require('../utils/util');

class Ptz {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.defaultProfileToken = null;
    this.namespaceAttributes = ['xmlns:tptz="http://www.onvif.org/ver20/ptz/wsdl"'];
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
    const soapEnvelope = this.soap.createRequest({
      body: body,
      xmlns: this.namespaceAttributes,
      diff: this.timeDiff,
      username: this.username,
      password: this.password
    });
    return soapEnvelope;
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
        soapBody += `<tptz:${methodName}/>`;
      } else {
        soapBody += `<tptz:${methodName}>`;
        soapBody += xml;
        soapBody += `</tptz:${methodName}>`;
      }

      const soapEnvelope = this.createRequest(soapBody);
      this.soap.makeRequest('ptz', this.serviceAddress, methodName, soapEnvelope).then(results => {
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

  panTiltZoomOptions(vectors) {
    let soapBody = '';

    if (typeof vectors !== 'undefined' && vectors !== null) {
      if ('x' in vectors && 'y' in vectors) {
        soapBody += '<tt:PanTilt x="' + vectors.x + '" y="' + vectors.y + '"/>';
      }

      if ('z' in vectors) {
        soapBody += '<tt:Zoom x="' + vectors.z + '"/>';
      }
    }

    return soapBody;
  }

  getNodes(callback) {
    return this.buildRequest('GetNodes', null, callback);
  }

  getNode(nodeToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getNode is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(nodeToken, 'string')) {
        reject(new Error('The "nodeToken" argument for getNode is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tptz:NodeToken>' + nodeToken + '</tptz:NodeToken>';
      this.buildRequest('GetNode', soapBody).then(results => {
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

  getConfigurations(callback) {
    return this.buildRequest('GetConfigurations', null, callback);
  }

  getConfiguration(configurationToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getConfiguration is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(configurationToken, 'string')) {
        reject(new Error('The "configurationToken" argument for getConfiguration is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tptz:PTZConfigurationToken>' + configurationToken + '</tptz:PTZConfigurationToken>';
      this.buildRequest('GetConfiguration', soapBody).then(results => {
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

  getConfigurationOptions(configurationToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getConfigurationOptions is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(configurationToken, 'string')) {
        reject(new Error('The "configurationToken" argument for getConfigurationOptions is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tptz:ConfigurationToken>' + configurationToken + '</tptz:ConfigurationToken>';
      this.buildRequest('GetConfigurationOptions', soapBody).then(results => {
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

  setConfiguration(configurationToken, ptzConfigurationOptions, forcePersistence, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for setConfiguration is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(configurationToken, 'string')) {
        reject(new Error('The "configurationToken" argument for setConfiguration is invalid: ' + errMsg));
        return;
      }

      if (errMsg = Util.isInvalidValue(ptzConfigurationOptions, 'object')) {
        reject(new Error('The "ptzConfigurationOptions" argument for setConfiguration is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tptz:PTZConfigurationToken>' + configurationToken + '</tptz:PTZConfigurationToken>';
      soapBody += '<tptz:PTZConfigurationOptions>' + ptzConfigurationOptions + '</tptz:PTZConfigurationOptions>';
      this.buildRequest('SetConfiguration', soapBody).then(results => {
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

  getCompatibleConfigurations(profileToken, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getCompatibleConfigurations is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for getCompatibleConfigurations is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';
      this.buildRequest('GetCompatibleConfigurations', soapBody).then(results => {
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

  absoluteMove(profileToken, position, speed, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for absoluteMove is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for absoluteMove is invalid: ' + errMsg));
        return;
      }

      if (errMsg = Util.isInvalidValue(position, 'object')) {
        reject(new Error('The "position" argument for absoluteMove is invalid: ' + errMsg));
        return;
      }

      if (typeof speed !== 'undefined' && speed !== null) {
        if (errMsg = Util.isInvalidValue(speed, 'object')) {
          reject(new Error('The "speed" argument for absoluteMove is invalid: ' + errMsg));
          return;
        }
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';
      soapBody += '<tptz:Position>' + this.panTiltZoomOptions(position) + '</tptz:Position>';

      if (typeof speed !== 'undefined' && speed !== null) {
        soapBody += '<tptz:Speed>' + this.panTiltZoomOptions(speed) + '</tptz:Speed>';
      }

      this.buildRequest('AbsoluteMove', soapBody).then(results => {
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

  relativeMove(profileToken, translation, speed, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for relativeMove is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for relativeMove is invalid: ' + errMsg));
        return;
      }

      if (typeof translation !== 'undefined' && translation !== null) {
        if (errMsg = Util.isInvalidValue(translation, 'object')) {
          reject(new Error('The "translation" argument for relativeMove is invalid: ' + errMsg));
          return;
        }
      }

      if (typeof speed !== 'undefined' && speed !== null) {
        if (errMsg = Util.isInvalidValue(speed, 'object')) {
          reject(new Error('The "speed" argument for relativeMove is invalid: ' + errMsg));
          return;
        }
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';

      if (typeof translation !== 'undefined' && translation !== null) {
        soapBody += '<tptz:Translation>' + this.panTiltZoomOptions(translation) + '</tptz:Translation>';
      }

      if (typeof speed !== 'undefined' && speed !== null) {
        soapBody += '<tptz:Speed>' + this.panTiltZoomOptions(speed) + '</tptz:Speed>';
      }

      this.buildRequest('RelativeMove', soapBody).then(results => {
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

  continuousMove(profileToken, velocity, timeout, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for continuousMove is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for continuousMove is invalid: ' + errMsg));
        return;
      }

      if (velocity) {
        if (errMsg = Util.isInvalidValue(velocity, 'object')) {
          reject(new Error('The "velocity" argument for continuousMove is invalid: ' + errMsg));
          return;
        }
      }

      if (typeof timeout !== 'undefined' && timeout !== null) {
        if (errMsg = Util.isInvalidValue(timeout, 'integer')) {
          reject(new Error('The "timeout" property for continuousMove is invalid: ' + errMsg));
          return;
        }
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';

      if (velocity) {
        soapBody += '<tptz:Velocity>' + this.panTiltZoomOptions(velocity) + '</tptz:Velocity>';
      }

      if (timeout) {
        soapBody += '<tptz:Timeout>PT' + timeout + 'S</tptz:Timeout>';
      }

      this.buildRequest('ContinuousMove', soapBody).then(results => {
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

  geoMove(profileToken, geoLocation, speed, areaWidth, areaHeight, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for geoMove is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for geoMove is invalid: ' + errMsg));
        return;
      }

      if (errMsg = Util.isInvalidValue(geoLocation, 'object')) {
        reject(new Error('The "position" argument for geoMove is invalid: ' + errMsg));
        return;
      }

      if (!('lat' in geoLocation)) {
        reject(new Error('The "geoLocation.lat" is a required argument for geoMove: ' + errMsg));
        return;
      }

      if (errMsg = Util.isInvalidValue(geoLocation.lat, 'float')) {
        reject(new Error('The "geoLocation.lat" argument for geoMove is invalid: ' + errMsg));
        return;
      }

      if (!('lon' in geoLocation)) {
        reject(new Error('The "geoLocation.lon" is a required argument for geoMove: ' + errMsg));
        return;
      }

      if (errMsg = Util.isInvalidValue(geoLocation.lon, 'float')) {
        reject(new Error('The "geoLocation.lon" argument for geoMove is invalid: ' + errMsg));
        return;
      }

      if (!('elevation' in geoLocation)) {
        reject(new Error('The "geoLocation.elevation" is a required argument for geoMove: ' + errMsg));
        return;
      }

      if (errMsg = Util.isInvalidValue(geoLocation.elevation, 'float')) {
        reject(new Error('The "geoLocation.elevation" argument for geoMove is invalid: ' + errMsg));
        return;
      }

      if (typeof speed !== 'undefined' && speed !== null) {
        if (errMsg = Util.isInvalidValue(speed, 'object')) {
          reject(new Error('The "speed" argument for geoMove is invalid: ' + errMsg));
          return;
        }
      }

      if (typeof areaWidth !== 'undefined' && areaWidth !== null) {
        if (errMsg = Util.isInvalidValue(areaWidth, 'float')) {
          reject(new Error('The "areaWidth" argument for geoMove is invalid: ' + errMsg));
          return;
        }
      }

      if (typeof areaHeight !== 'undefined' && areaHeight !== null) {
        if (errMsg = Util.isInvalidValue(areaHeight, 'float')) {
          reject(new Error('The "areaHeight" argument for geoMove is invalid: ' + errMsg));
          return;
        }
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';
      soapBody += '<tptz:Target lat="' + geoLocation.lat + '" lon="' + geoLocation.lon + '" elevation="' + geoLocation.elevation + '" />';

      if (typeof speed !== 'undefined' && speed !== null) {
        soapBody += '<tptz:Speed>' + this.panTiltZoomOptions(speed) + '</tptz:Speed>';
      }

      if (typeof areaWidth !== 'undefined' && areaWidth !== null) {
        soapBody += '<tptz:AreaWidth>' + areaWidth + '</tptz:AreaWidth>';
      }

      if (typeof areaHeight !== 'undefined' && areaHeight !== null) {
        soapBody += '<tptz:AreaHeight>' + areaWidth + '</tptz:AreaHeight>';
      }

      this.buildRequest('GeoMove', soapBody).then(results => {
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

  stop(profileToken, panTilt, zoom, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for stop is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for stop is invalid: ' + errMsg));
        return;
      }

      if (typeof panTilt !== 'undefined' && panTilt !== null) {
        if (errMsg = Util.isInvalidValue(panTilt, 'boolean')) {
          reject(new Error('The "panTilt" property for stop is invalid: ' + errMsg));
          return;
        }
      }

      if (typeof zoom !== 'undefined' && zoom !== null) {
        if (errMsg = Util.isInvalidValue(zoom, 'boolean')) {
          reject(new Error('The "zoom" property for stop is invalid: ' + errMsg));
          return;
        }
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';

      if (typeof panTilt !== 'undefined' && panTilt !== null) {
        soapBody += '<tptz:PanTilt>' + panTilt + '</tptz:PanTilt>';
      }

      if (typeof zoom !== 'undefined' && zoom !== null) {
        soapBody += '<tptz:Zoom>' + zoom + '</tptz:Zoom>';
      }

      this.buildRequest('Stop', soapBody).then(results => {
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

  getStatus(profileToken, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getStatus is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for relativeMove is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';
      this.buildRequest('GetStatus', soapBody).then(results => {
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

  setPreset(profileToken, presetToken, presetName, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for setPreset is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for setPreset is invalid: ' + errMsg));
        return;
      }

      if (typeof presetToken !== 'undefined' && presetToken !== null) {
        if (errMsg = Util.isInvalidValue(presetToken, 'string')) {
          reject(new Error('The "presetToken" argument for setPreset is invalid: ' + errMsg));
          return;
        }
      }

      if (typeof presetName !== 'undefined' && presetName !== null) {
        if (errMsg = Util.isInvalidValue(presetName, 'string')) {
          reject(new Error('The "presetName" argument for setPreset is invalid: ' + errMsg));
          return;
        }
      }

      if (!presetToken && !presetName) {
        reject(new Error('Either the "profileToken" or the "presetName" argument must be specified in method "setPreset".'));
        return;
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';

      if (presetToken) {
        soapBody += '<tptz:PresetToken>' + presetToken + '</tptz:PresetToken>';
      }

      if (presetName) {
        soapBody += '<tptz:PresetName>' + presetName + '</tptz:PresetName>';
      }

      this.buildRequest('SetPreset', soapBody).then(results => {
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

  getPresets(profileToken, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getPresets is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for getPresets is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';
      this.buildRequest('GetPresets', soapBody).then(results => {
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

  gotoPreset(profileToken, presetToken, speed, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for gotoPreset is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for gotoPreset is invalid: ' + errMsg));
        return;
      }

      if (errMsg = Util.isInvalidValue(presetToken, 'string')) {
        reject(new Error('The "presetToken" argument for gotoPreset is invalid: ' + errMsg));
        return;
      }

      if (typeof speed !== 'undefined' && speed !== null) {
        if (errMsg = Util.isInvalidValue(speed, 'object')) {
          reject(new Error('The "speed" argument for gotoPreset is invalid: ' + errMsg));
          return;
        }
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';
      soapBody += '<tptz:PresetToken>' + presetToken + '</tptz:PresetToken>';

      if (typeof speed !== 'undefined' && speed !== null) {
        soapBody += '<tptz:Speed>' + this.panTiltZoomOptions(speed) + '</tptz:Speed>';
      }

      this.buildRequest('GotoPreset', soapBody).then(results => {
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

  removePreset(profileToken, presetToken, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for removePreset is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for removePreset is invalid: ' + errMsg));
        return;
      }

      if (errMsg = Util.isInvalidValue(presetToken, 'string')) {
        reject(new Error('The "presetToken" argument for removePreset is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';
      soapBody += '<tptz:PresetToken>' + presetToken + '</tptz:PresetToken>';
      this.buildRequest('RemovePreset', soapBody).then(results => {
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

  gotoHomePosition(profileToken, speed, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for gotoHomePosition is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for gotoHomePosition is invalid: ' + errMsg));
        return;
      }

      if (typeof speed !== 'undefined' && speed !== null) {
        if (errMsg = Util.isInvalidValue(speed, 'object')) {
          reject(new Error('The "speed" argument for gotoHomePosition is invalid: ' + errMsg));
          return;
        }
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';

      if (typeof speed !== 'undefined' && speed !== null) {
        soapBody += '<tptz:Speed>' + this.panTiltZoomOptions(speed) + '</tptz:Speed>';
      }

      this.buildRequest('GotoHomePosition', soapBody).then(results => {
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

  setHomePosition(profileToken, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for setHomePosition is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for setHomePosition is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';
      this.buildRequest('SetHomePosition', soapBody).then(results => {
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

  sendAuxiliaryCommand(profileToken, auxiliaryData, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken;
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for sendAuxiliaryCommand is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for sendAuxiliaryCommand is invalid: ' + errMsg));
        return;
      }

      if (errMsg = Util.isInvalidValue(auxiliaryData, 'string')) {
        reject(new Error('The "auxiliaryData" argument for sendAuxiliaryCommand is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>';
      soapBody += '<tptz:AuxiliaryData>' + auxiliaryData + '<tptz:AuxiliaryData>';
      this.buildRequest('SendAuxiliaryCommand', soapBody).then(results => {
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

}

module.exports = Ptz;