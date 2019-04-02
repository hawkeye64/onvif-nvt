const Soap = require('../utils/soap');

class Schedule {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tsch="http://www.onvif.org/ver10/schedule/wsdl"'];
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

  getScheduleInfo() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getScheduleInfoList() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getSchedules() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getScheduleList() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createSchedule() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  modifySchedule() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteSchedule() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getSpecialDayGroupInfo() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getSpecialDayGroupInfoList() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getSpecialDayGroups() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getSpecialDayGroupList() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createSpecialDayGroup() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  modifySpecialDayGroup() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteSpecialDayGroup() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getScheduleState() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

}

module.exports = Schedule;