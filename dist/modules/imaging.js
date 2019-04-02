const Soap = require('../utils/soap');

class Imaging {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tns1="http://www.onvif.org/ver10/topics"', 'xmlns:timg="http://www.onvif.org/ver20/imaging/wsdl"'];
  }

  init(timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff;
    this.serviceAddress = serviceAddress;
    this.username = username;
    this.password = password;
  }

  createRequest(body) {
    let soapEnvelope = this.soap.createRequest({
      'body': body,
      'xmlns': this.namespaceAttributes,
      'diff': this.timeDiff,
      'username': this.username,
      'password': this.password
    });
    return soapEnvelope;
  }

  getImagingSettings() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setImagingSettings() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
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