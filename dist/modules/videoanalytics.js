const Soap = require('../utils/soap');

class VideoAnalytics {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tad="http://www.onvif.org/ver10/analyticsdevice.wsdl"'];
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

  getAnalyticsEngineInputs() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAnalyticsEngineInput() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setAnalyticsEngineInput() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createAnalyticsEngineInputs() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteAnalyticsEngineInputs() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getVideoAnalyticsConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setVideoAnalyticsConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAnalyticsEngines() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAnalyticsEngine() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAnalyticsEngineControls() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAnalyticsEngineControl() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setAnalyticsEngineControl() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createAnalyticsEngineControl() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteAnalyticsEngineControl() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAnalyticsState() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAnalyticsDeviceStreamUri() {
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

module.exports = VideoAnalytics;