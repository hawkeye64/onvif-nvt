const Config = require('../lib/utils/config')
const TestConfig = require('./config')

describe('Core', () => {
  test('Camera.core', () => {
    const OnvifManager = require('../lib/onvif-nvt')
    Config.setDebugData(TestConfig.cameraType, 'Response')
    return OnvifManager.connect(TestConfig.address, TestConfig.port, TestConfig.user, TestConfig.pass)
      .then(results => {
        const Camera = results
        expect(Camera.core).not.toBeNull()
      })
      .catch(error => {
        console.error(error)
      })
  })
})
