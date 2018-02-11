const Config = require('../lib/utils/config')
const TestConfig = require('./config')

describe('Core', () => {
  test('Camera.ptz', () => {
    const OnvifManager = require('../lib/onvif-nvt')
    Config.setDebugData(TestConfig.cameraType, 'Response')
    return OnvifManager.connect(TestConfig.address, TestConfig.port, TestConfig.user, TestConfig.pass)
      .then(results => {
        const Camera = results
        if (TestConfig.cameraType === 'axis' || TestConfig.cameraType === 'hikvision' || TestConfig.cameraType === 'pelco') {
          expect(Camera.ptz).not.toBeNull()
        }
      })
      .catch(error => {
        console.error(error)
      })
  })
})
