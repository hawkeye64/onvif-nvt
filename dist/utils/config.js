const Util = require('./util');

let testCameraType = '';

function setDebugData(cameraType) {
  let errMsg = '';

  if (errMsg = Util.isInvalidValue(cameraType, 'string')) {
    throw new Error('cameraType is invalid: ' + errMsg);
  }

  testCameraType = cameraType;
}

function reset() {
  testCameraType = '';
}

function isTest() {
  if (testCameraType.length) {
    return true;
  }

  return false;
}

function getCameraType() {
  return testCameraType;
}

module.exports = {
  setDebugData,
  reset,
  isTest,
  getCameraType
};