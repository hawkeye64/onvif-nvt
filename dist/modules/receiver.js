const Soap = require('../utils/soap');

class Receiver {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:trv="http://www.onvif.org/ver10/receiver/wsdl"'];
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

  getReceivers() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getReceiver() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createReceiver() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteReceiver() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  configureReceiver() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setReceiverMode() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getReceiverState() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getServiceCapabilitites() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

}

module.exports = Receiver;