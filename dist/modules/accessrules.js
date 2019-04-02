const Soap = require('../utils/soap');

class AccessRules {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tar="http://www.onvif.org/ver10/accessrules/wsdl"'];
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

  getServiceCapabilities() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAccessProfileInfo() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAccessProfileInfoList() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAccessProfiles() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAccessProfileList() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createAccessProfile() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  modifyAccessProfile() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteAccessProfile() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

}

module.exports = AccessRules;