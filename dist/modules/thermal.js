const Soap = require('../utils/soap');

class Thermal {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tns1="http://www.onvif.org/ver10/topics"', 'xmlns:tth="http://www.onvif.org/ver10/thermal/wsdl"'];
  }

  init(timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff;
    this.serviceAddress = serviceAddress;
    this.username = username;
    this.password = password;
  }

  createRequest(body) {
    let soapEnvelope = this.soapSoap.createRequest({
      'body': body,
      'xmlns': this.namespaceAttributes,
      'diff': this.timeDiff,
      'username': this.username,
      'password': this.password
    });
    return soapEnvelope;
  }

  getConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setConfigurationSettings() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getConfigurationOptions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getConfigurations() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getRadiometryConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setRadiometryConfigurationSettings() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getRadiometryConfigurationOptions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getServiceCapabilities() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

}

module.exports = Thermal;