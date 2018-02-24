const Util = require('./util')

let testCameraType = ''
let testService = ''
let testResponseOrError = ''

function setDebugData (cameraType, responseOrError) {
  let errMsg = ''
  if ((errMsg = Util.isInvalidValue(cameraType, 'string'))) {
    throw new Error('cameraType is invalid: ' + errMsg)
  }
  if ((errMsg = Util.isInvalidValue(responseOrError, 'string'))) {
    throw new Error('responseError is invalid: ' + errMsg)
  }
  if (responseOrError !== 'Response' && responseOrError !== 'Error') {
    throw new Error('responseError is invalid: ' + 'Must be "Response" or "Error" (case-sensitive).')
  }

  testCameraType = cameraType
  testResponseOrError = responseOrError
}

function reset () {
  testCameraType = ''
  testResponseOrError = ''
}

function isTest () {
  if (testCameraType.length && testResponseOrError.length) {
    return true
  }
  return false
}

function getCameraType () {
  return testCameraType
}

function getResponseOrError () {
  return testResponseOrError
}

module.exports = {
  setDebugData,
  reset,
  isTest,
  getCameraType,
  getResponseOrError
}
