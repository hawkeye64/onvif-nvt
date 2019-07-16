const Soap = require('../utils/soap');

class DeviceIO {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tmd="http://www.onvif.org/ver10/deviceIO/wsdl"'];
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

  getVideoOutputs() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getVideoOutputConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setVideoOutputConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getVideoOutputConfigurationOptions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getVideoSources() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAudioOutputs() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAudioSources() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getRelayOutputs() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getRelayOutputOptions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getRelayOutputSettings() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  triggerRelayOutput() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getDigitalInputs() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getDigitalInputConfigurationOptions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setDigitalInputConfigurations() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getSerialPorts() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getSerialPortConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setSerialPortConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getSerialPortConfigurationOptions() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  sendReceiveSerial() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  capabilities() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

}

module.exports = DeviceIO;