const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/sched/ONVIF-Scheduler-Service-Spec-v100.pdf}<br>
 * {@link https://www.onvif.org/ver10/schedule/wsdl/schedule.wsdl}<br>
 * </p>
 */
class Schedule {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    // ODO: Jeff need namespaces
    this.namespaceAttributes = [
      'xmlns:tsch="http://www.onvif.org/ver10/schedule/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Schedule object.
   * @param {number} timeDiff The onvif device's time difference.
   * @param {object} serviceAddress An url object from url package - require('url').
   * @param {string=} username Optional only if the device does NOT have a user.
   * @param {string=} password Optional only if the device does NOT have a password.
   */
  init (timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff
    this.serviceAddress = serviceAddress
    this.username = username
    this.password = password
  }

  /**
   * Private function for creating a SOAP request.
   * @param {string} body The body of the xml.
   */
  createRequest (body) {
    const soapEnvelope = this.soap.createRequest({
      body: body,
      xmlns: this.namespaceAttributes,
      diff: this.timeDiff,
      username: this.username,
      password: this.password
    })
    return soapEnvelope
  }

  // ---------------------------------------------
  // Search (Recording) API
  // ---------------------------------------------

  getServiceCapabilities () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getScheduleInfo () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getScheduleInfoList () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getSchedules () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getScheduleList () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createSchedule () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  modifySchedule () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteSchedule () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getSpecialDayGroupInfo () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getSpecialDayGroupInfoList () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getSpecialDayGroups () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getSpecialDayGroupList () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createSpecialDayGroup () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  modifySpecialDayGroup () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteSpecialDayGroup () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getScheduleState () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }
}

module.exports = Schedule
