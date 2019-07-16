const Soap = require('../utils/soap');

class Search {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tse="http://www.onvif.org/ver10/search/wsdl"'];
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

  getRecordingSummary() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getRecordingInformation() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getMediaAttributes() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  findRecordings() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getRecordingSearchResults() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  findEvents() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getEventSearchResults() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  findPTZPosition() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getPTZPositionSearchResults() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  findMetadata() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getMetadataSearchResults() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  endSearch() {
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

module.exports = Search;