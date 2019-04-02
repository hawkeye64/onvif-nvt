const Soap = require('../utils/soap');

class Door {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tdc="http://www.onvif.org/ver10/doorcontrol/wsdl"'];
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

  getDoorInfoList() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getDoorInfo() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getDoorState() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  accessDoor() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  lockDoor() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  unlockDoor() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  blockDoor() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  lockDownDoor() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  lockDownReleaseDoor() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  lockOpenDoor() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  lockOpenReleaseDoor() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  doubleLockDoor() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

}

module.exports = Door;