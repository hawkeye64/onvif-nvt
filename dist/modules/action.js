const Soap = require('../utils/soap');

class Action {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tae="http://www.onvif.org/ver10/actionengine/wsdl"'];
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

  getSupportedActions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getActions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createActions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  modifyActions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteActions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getServiceCapabilities() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getActionTriggers() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  modifyActionTriggers() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteActionTriggers() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createActionTriggers() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

}

module.exports = Action;