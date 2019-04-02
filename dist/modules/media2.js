const Soap = require('../utils/soap');

class Media2 {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tr2="http://www.onvif.org/ver20/media/wsdl"'];
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

  createProfile() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getProfiles() {
    return new Promise((resolve, reject) => {
      let soapBody = '<GetProfiles xmlns="http://www.onvif.org/ver10/media/wsdl"/>';
      let soapEnvelope = this.createRequest(soapBody);
      console.log(soapEnvelope);
      return this.soap.makeRequest('media2', this.serviceAddress, 'GetProfiles', soapEnvelope).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });
  }

  addConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  removeConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteProfile() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getConfigurations() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setConfigurations() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getConfigurationOptions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getVideoEncoderInstances() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getStreamUri() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getSnapshotUri(profileToken) {
    return new Promise((resolve, reject) => {
      let soapBody = '';
      soapBody += '<trt:GetSnapshotUri>';
      soapBody += '<trt:ProfileToken>' + profileToken + '</trt:ProfileToken>';
      soapBody += '</trt:GetSnapshotUri>';
      let soapEnvelope = this.createRequest(soapBody);
      return this.soap.makeRequest('media2', this.serviceAddress, 'GetSnapshotUri', soapEnvelope).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });
  }

  startMulticastStreaming() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  stopMulticastStreaming() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setSynchronizationPoint() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getVideoSourceModes() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createOSD() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteOSD() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getOSDs() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getOSD() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setOSD() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getOSDOptions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createMask() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteMask() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getMasks() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setMask() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getMaskOptions() {
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

module.exports = Media2;