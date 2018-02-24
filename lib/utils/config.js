const Util = require('./util')

let testCameraType = ''
let testService = ''
let testResponseOrError = ''

function setDebugData (cameraType, service, responseOrError) {
  let errMsg = ''
  if ((errMsg = Util.isInvalidValue(cameraType, 'string'))) {
    throw new Error('cameraType is invalid: ' + errMsg)
  }
  if ((errMsg = Util.isInvalidValue(service, 'string'))) {
    throw new Error('cameraType is invalid: ' + errMsg)
  }
  if ((errMsg = Util.isInvalidValue(responseOrError, 'string'))) {
    throw new Error('responseError is invalid: ' + errMsg)
  }
  if (responseOrError !== 'Response' && responseOrError !== 'Error') {
    throw new Error('responseError is invalid: ' + 'Must be "Response" or "Error" (case-sensitive).')
  }

  testCameraType = cameraType
  testService = service
  testResponseOrError = responseOrError
}

function reset () {
  testCameraType = ''
  testResponseOrError = ''
}

function isTest () {
  if (testCameraType.length && testService.length && testResponseOrError.length) {
    return true
  }
  return false
}

function getCameraType () {
  return testCameraType
}

function getService () {
  return testService
}

function getResponseOrError () {
  return testResponseOrError
}

module.exports = {
  setDebugData,
  reset,
  isTest,
  getCameraType,
  getService,
  getResponseOrError
}
