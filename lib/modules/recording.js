const Soap = require('../utils/soap')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/rec/ONVIF-RecordingControl-Service-Spec-v1712.pdf}<br>
 * {@link https://www.onvif.org/ver10/recording.wsdl}<br>
 * </p>
 */
class Recording {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      'xmlns:trc="http://www.onvif.org/ver10/recording/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Recoding object.
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
  // Recording API
  // ---------------------------------------------

  createRecording () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteRecording () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getRecordings () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setRecordingConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getRecordingConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createTrack () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteTrack () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getTrackConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setTrackConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createRecordingJob () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteRecordingJob () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getRecordingJobs () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setRecordingJobConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getRecordingJobConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setRecordingJobMode () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getRecordingJobState () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getRecordingOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  exportRecordedData () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  stopExportRecordedData () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getExportRecordedDataState () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getServiceCapabilities () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }
}

module.exports = Recording
