const Soap = require('../utils/soap');

const Util = require('../utils/util');

class Media {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:trt="http://www.onvif.org/ver10/media/wsdl"'];
  }

  init(timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff;
    this.serviceAddress = serviceAddress;
    this.username = username;
    this.password = password;
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
        soapBody += `<trt:${methodName}/>`;
      } else {
        soapBody += `<trt:${methodName}>`;
        soapBody += xml;
        soapBody += `</trt:${methodName}>`;
      }

      const soapEnvelope = this.createRequest(soapBody);
      this.soap.makeRequest('media', this.serviceAddress, methodName, soapEnvelope).then(results => {
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

  requestWithProfileToken(methodName, profileToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error(`The "callback" argument for ${methodName} is invalid:` + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error(`The "profileToken" argument for ${methodName} is invalid: ` + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<trt:ProfileToken>' + profileToken + '</trt:ProfileToken>';
      this.buildRequest(methodName, soapBody).then(results => {
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

  requestWithConfigurationToken(methodName, configurationToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error(`The "callback" argument for ${methodName} is invalid:` + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(configurationToken, 'string')) {
        reject(new Error(`The "configurationToken" argument for ${methodName} is invalid: ` + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<trt:ConfigurationToken>' + configurationToken + '</trt:ConfigurationToken>';
      this.buildRequest(methodName, soapBody).then(results => {
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

  requestWithOptionalTokens(methodName, profileToken, configurationToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error(`The "callback" argument for ${methodName} is invalid:` + errMsg));
          return;
        }
      }

      if (typeof profileToken !== 'undefined' && profileToken !== null) {
        if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
          reject(new Error(`The "profileToken" argument for ${methodName} is invalid: ` + errMsg));
          return;
        }
      }

      if (typeof configurationToken !== 'undefined' && configurationToken !== null) {
        if (errMsg = Util.isInvalidValue(configurationToken, 'string')) {
          reject(new Error(`The "ConfigurationToken" argument for ${methodName} is invalid: ` + errMsg));
          return;
        }
      }

      let soapBody = '';

      if (typeof profileToken !== 'undefined' && profileToken !== null) {
        soapBody += '<trt:ProfileToken>' + profileToken + '</trt:ProfileToken>';
      }

      if (typeof configurationToken !== 'undefined' && configurationToken !== null) {
        soapBody += '<trt:ConfigurationToken>' + configurationToken + '</trt:ConfigurationToken>';
      }

      this.buildRequest(methodName, soapBody).then(results => {
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

  addConfiguration(methodName, profileToken, configurationToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error(`The "callback" argument for ${methodName} is invalid:` + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error(`The "profileToken" argument for ${methodName} is invalid: ` + errMsg));
        return;
      }

      if (errMsg = Util.isInvalidValue(configurationToken, 'string')) {
        reject(new Error(`The "ConfigurationToken" argument for ${methodName} is invalid: ` + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<trt:ProfileToken>' + profileToken + '</trt:ProfileToken>';
      soapBody += '<trt:ConfigurationToken>' + configurationToken + '</trt:ConfigurationToken>';
      this.buildRequest(methodName, soapBody).then(results => {
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

  createProfile(name, token, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for createProfile is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(name, 'string')) {
        reject(new Error('The "name" argument for createProfile is invalid: ' + errMsg));
        return;
      }

      if (typeof token !== 'undefined' && token !== null) {
        if (errMsg = Util.isInvalidValue(token, 'string')) {
          reject(new Error('The "token" argument for createProfile is invalid: ' + errMsg));
          return;
        }
      }

      let soapBody = '';
      soapBody += '<trt:Name>' + name + '</trt:Name>';

      if (typeof token !== 'undefined' && token !== null) {
        soapBody += '<trt:Token>' + token + '</trt:Token>';
      }

      this.buildRequest('CreateProfile', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(result => {
        callback(null, result);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getProfiles(callback) {
    return this.buildRequest('GetProfiles', null, callback);
  }

  getProfile(profileToken, callback) {
    return this.requestWithProfileToken('GetProfile', profileToken, callback);
  }

  addVideoSourceConfiguration(profileToken, configurationToken, callback) {
    return this.addConfiguration('AddVideoSourceConfiguration', profileToken, configurationToken, callback);
  }

  addVideoEncoderConfiguration(profileToken, configurationToken, callback) {
    return this.addConfiguration('AddVideoEncoderConfiguration', profileToken, configurationToken, callback);
  }

  addAudioSourceConfiguration(profileToken, configurationToken, callback) {
    return this.addConfiguration('AddAudioSourceConfiguration', profileToken, configurationToken, callback);
  }

  addAudioEncoderConfiguration(profileToken, configurationToken, callback) {
    return this.addConfiguration('AddAudioEncoderConfiguration', profileToken, configurationToken, callback);
  }

  addPTZConfiguration(profileToken, configurationToken, callback) {
    return this.addConfiguration('AddPTZConfiguration', profileToken, configurationToken, callback);
  }

  addVideoAnalyticsConfiguration(profileToken, configurationToken, callback) {
    return this.addConfiguration('AddVideoAnalyticsConfiguration', profileToken, configurationToken, callback);
  }

  addMetadataConfiguration(profileToken, configurationToken, callback) {
    return this.addConfiguration('AddMetadataConfiguration', profileToken, configurationToken, callback);
  }

  addAudioOutputConfiguration(profileToken, configurationToken, callback) {
    return this.addConfiguration('AddAudioOutputConfiguration', profileToken, configurationToken, callback);
  }

  addAudioDecoderConfiguration(profileToken, configurationToken, callback) {
    return this.addConfiguration('AddAudioDecoderConfiguration', profileToken, configurationToken, callback);
  }

  removeVideoSourceConfiguration(profileToken, callback) {
    return this.requestWithProfileToken('RemoveVideoSourceConfiguration', profileToken, callback);
  }

  removeVideoEncoderConfiguration(profileToken, callback) {
    return this.requestWithProfileToken('RemoveVideoEncoderConfiguration', profileToken, callback);
  }

  removeAudioSourceConfiguration(profileToken, callback) {
    return this.requestWithProfileToken('RemoveAudioSourceConfiguration', profileToken, callback);
  }

  removeAudioEncoderConfiguration(profileToken, callback) {
    return this.requestWithProfileToken('RemoveAudioEncoderConfiguration', profileToken, callback);
  }

  removePTZConfiguration(profileToken, callback) {
    return this.requestWithProfileToken('RemovePTZConfiguration', profileToken, callback);
  }

  removeVideoAnalyticsConfiguration(profileToken, callback) {
    return this.requestWithProfileToken('RemoveVideoAnalyticsConfiguration', profileToken, callback);
  }

  removeMetadataConfiguration(profileToken, callback) {
    return this.requestWithProfileToken('RemoveMetadataConfiguration', profileToken, callback);
  }

  removeAudioOutputConfiguration(profileToken, callback) {
    return this.requestWithProfileToken('RemoveAudioOutputConfiguration', profileToken, callback);
  }

  removeAudioDecoderConfiguration(profileToken, callback) {
    return this.requestWithProfileToken('RemoveAudioDecoderConfiguration', profileToken, callback);
  }

  deleteProfile(profileToken, callback) {
    return this.requestWithProfileToken('DeleteProfile', profileToken, callback);
  }

  getVideoSources(callback) {
    return this.buildRequest('GetVideoSources', null, callback);
  }

  getVideoSourceConfigurations(callback) {
    return this.buildRequest('GetVideoSourceConfigurations', null, callback);
  }

  getVideoSourceConfiguration(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetVideoSourceConfiguration', configurationToken, callback);
  }

  getCompatibleVideoSourceConfigurations(profileToken, callback) {
    return this.requestWithProfileToken('GetCompatibleVideoSourceConfigurations', profileToken, callback);
  }

  getVideoSourceConfigurationOptions(profileToken, configurationToken, callback) {
    return this.requestWithOptionalTokens('GetVideoSourceConfigurationOptions', profileToken, configurationToken, callback);
  }

  setVideoSourceConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getVideoEncoderConfigurations(callback) {
    return this.buildRequest('GetVideoEncoderConfigurations', null, callback);
  }

  getVideoEncoderConfiguration(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetVideoEncoderConfiguration', configurationToken, callback);
  }

  getCompatibleVideoEncoderConfigurations(profileToken, callback) {
    return this.requestWithProfileToken('GetCompatibleVideoEncoderConfigurations', profileToken, callback);
  }

  getVideoEncoderConfigurationOptions(profileToken, configurationToken, callback) {
    return this.requestWithOptionalTokens('GetVideoEncoderConfigurationOptions', profileToken, configurationToken, callback);
  }

  setVideoEncoderConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getGuaranteedNumberOfVideoEncoderInstances(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetGuaranteedNumberOfVideoEncoderInstances', configurationToken, callback);
  }

  getAudioSources(callback) {
    return this.buildRequest('GetAudioSources', null, callback);
  }

  getAudioSourceConfigurations(callback) {
    return this.buildRequest('GetAudioSourceConfigurations', null, callback);
  }

  getAudioSourceConfiguration(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetAudioSourceConfiguration', configurationToken, callback);
  }

  getCompatibleAudioSourceConfigurations(profileToken, callback) {
    return this.requestWithProfileToken('GetCompatibleAudioSourceConfigurations', profileToken, callback);
  }

  getAudioSourceConfigurationOptions(profileToken, configurationToken, callback) {
    return this.requestWithOptionalTokens('GetAudioSourceConfigurationOptions', profileToken, configurationToken, callback);
  }

  setAudioSourceConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAudioEncoderConfigurations(callback) {
    return this.buildRequest('GetAudioEncoderConfigurations', null, callback);
  }

  getAudioEncoderConfiguration(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetAudioEncoderConfiguration', configurationToken, callback);
  }

  getCompatibleAudioEncoderConfigurations(profileToken, callback) {
    return this.requestWithProfileToken('GetCompatibleAudioEncoderConfigurations', profileToken, callback);
  }

  getAudioEncoderConfigurationOptions(profileToken, configurationToken, callback) {
    return this.requestWithOptionalTokens('GetAudioEncoderConfigurationOptions', profileToken, configurationToken, callback);
  }

  setAudioEncoderConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getVideoAnalyticsConfigurations(callback) {
    return this.buildRequest('GetVideoAnalyticsConfigurations', null, callback);
  }

  getVideoAnalyticsConfiguration(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetVideoAnalyticsConfiguration', configurationToken, callback);
  }

  getCompatibleVideoAnalyticsConfigurations(profileToken, callback) {
    return this.requestWithProfileToken('GetCompatibleVideoAnalyticsConfigurations', profileToken, callback);
  }

  setVideoAnalyticsConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getMetadataConfigurations(callback) {
    return this.buildRequest('GetMetadataConfigurations', null, callback);
  }

  getMetadataConfiguration(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetMetadataConfiguration', configurationToken, callback);
  }

  getCompatibleMetadataConfigurations(profileToken, callback) {
    return this.requestWithProfileToken('GetCompatibleMetadataConfigurations', profileToken, callback);
  }

  getMetadataConfigurationOptions(profileToken, configurationToken, callback) {
    return this.requestWithOptionalTokens('GetMetadataConfigurationOptions', profileToken, configurationToken, callback);
  }

  setMetadataConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAudioOutputs(callback) {
    return this.buildRequest('GetAudioOutputs', null, callback);
  }

  getAudioOutputConfigurations(callback) {
    return this.buildRequest('GetAudioOutputConfigurations', null, callback);
  }

  getAudioOutputConfiguration(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetAudioOutputConfiguration', configurationToken, callback);
  }

  getCompatibleAudioOutputConfigurations(profileToken, callback) {
    return this.requestWithProfileToken('GetCompatibleAudioOutputConfigurations', profileToken, callback);
  }

  getAudioOutputConfigurationOptions(profileToken, configurationToken, callback) {
    return this.requestWithOptionalTokens('GetAudioOutputConfigurationOptions', profileToken, configurationToken, callback);
  }

  setAudioOutputConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAudioDecoderConfigurations(callback) {
    return this.buildRequest('GetAudioDecoderConfigurations', null, callback);
  }

  getAudioDecoderConfiguration(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetAudioDecoderConfiguration', configurationToken, callback);
  }

  getCompatibleAudioDecoderConfigurations(profileToken, callback) {
    return this.requestWithProfileToken('GetCompatibleAudioDecoderConfigurations', profileToken, callback);
  }

  getAudioDecoderConfigurationOptions(profileToken, configurationToken, callback) {
    return this.requestWithOptionalTokens('GetAudioDecoderConfigurationOptions', profileToken, configurationToken, callback);
  }

  setAudioDecoderConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getStreamUri(streamType, protocolType, profileToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getStreamUri is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(streamType, 'string')) {
        reject(new Error('The "streamType" argument for getStreamUri is invalid: ' + errMsg));
        return;
      } else if (!streamType.match(/^(RTP-Unicast|RTP-Multicast)$/)) {
        reject(new Error('The "streamType" argument for getStreamUri is invalid: The value must be either "UDP", "HTTP", or "RTSP".'));
        return;
      }

      if (errMsg = Util.isInvalidValue(protocolType, 'string')) {
        reject(new Error('The "protocolType" argument for getStreamUri is invalid: ' + errMsg));
        return;
      } else if (!protocolType.match(/^(UDP|HTTP|RTSP)$/)) {
        reject(new Error('The "protocolType" argument for getStreamUri is invalid: The value must be either "UDP", "HTTP", or "RTSP".'));
        return;
      }

      if (errMsg = Util.isInvalidValue(profileToken, 'string')) {
        reject(new Error('The "profileToken" argument for getStreamUri is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<trt:StreamSetup>';
      soapBody += '<tt:Stream>' + streamType + '</tt:Stream>';
      soapBody += '<tt:Transport>';
      soapBody += '<tt:Protocol>' + protocolType + '</tt:Protocol>';
      soapBody += '</tt:Transport>';
      soapBody += '</trt:StreamSetup>';
      soapBody += '<trt:ProfileToken>' + profileToken + '</trt:ProfileToken>';
      this.buildRequest('GetStreamUri', soapBody).then(results => {
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

  getSnapshotUri(profileToken, callback) {
    return this.requestWithProfileToken('GetSnapshotUri', profileToken, callback);
  }

  startMulticastStreaming(profileToken, callback) {
    return this.requestWithProfileToken('StartMulticastStreaming', profileToken, callback);
  }

  stopMulticastStreaming(profileToken, callback) {
    return this.requestWithProfileToken('StopMulticastStreaming', profileToken, callback);
  }

  setSynchronizationPoint(profileToken, callback) {
    return this.requestWithProfileToken('SetSynchronizationPoint', profileToken, callback);
  }

  getVideoSourceModes(videoSourceToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getVideoSourceModes is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(videoSourceToken, 'string')) {
        reject(new Error('The "videoSourceToken" argument for getVideoSourceModes is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<trt:VideoSourceToken>' + videoSourceToken + '</trt:VideoSourceToken>';
      this.buildRequest('GetVideoSourceModes', soapBody).then(results => {
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

  setVideoSourceMode() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createOSD() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteOSD(OSDToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for deleteOSD is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(OSDToken, 'string')) {
        reject(new Error('The "OSDToken" argument for deleteOSD is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<trt:OSDToken>' + OSDToken + '</trt:OSDToken>';
      this.buildRequest('DeleteOSD', soapBody).then(results => {
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

  getOSDs(configurationToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getOSDs is invalid:' + errMsg));
          return;
        }
      }

      if (typeof configurationToken !== 'undefined' && configurationToken !== null) {
        if (errMsg = Util.isInvalidValue(configurationToken, 'string')) {
          reject(new Error('The "configurationToken" argument for getOSDs is invalid: ' + errMsg));
          return;
        }
      }

      let soapBody = '';

      if (typeof configurationToken !== 'undefined' && configurationToken !== null) {
        soapBody += '<trt:ConfigurationToken>' + configurationToken + '</trt:ConfigurationToken>';
      }

      this.buildRequest('GetOSDs', soapBody).then(results => {
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

  getOSD(OSDToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getOSD is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(OSDToken, 'string')) {
        reject(new Error('The "OSDToken" argument for getOSD is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<trt:OSDToken>' + OSDToken + '</trt:OSDToken>';
      this.buildRequest('GetOSD', soapBody).then(results => {
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

  setOSD() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getOSDOptions(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetOSDOptions', configurationToken, callback);
  }

}

module.exports = Media;