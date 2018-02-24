const Config = require('../lib/utils/config')
const TestConfig = require('./config')

describe('OnvifManager', () => {
  // Discovery
  test('OnvifManager::constructor()', () => {
    const OnvifManager = require('../lib/onvif-nvt')
    expect(OnvifManager.discovery).toBeNull()
  })

  // Discovery
  test('OnvifManager::add(\'discovery\')', () => {
    const OnvifManager = require('../lib/onvif-nvt')
    OnvifManager.add('discovery')
    expect(OnvifManager.discovery).not.toBeNull()
  })

  // Connect
  test('OnvifManager::connect()', () => {
    const OnvifManager = require('../lib/onvif-nvt')
    Config.setDebugData(TestConfig.cameraType, 'Response')
    return OnvifManager.connect(TestConfig.address, TestConfig.port, TestConfig.user, TestConfig.pass)
      .then(results => {
        const Camera = results
        expect(Camera.deviceInformation).toBeTruthy()
        expect(Camera.profileList.length).toBeGreaterThanOrEqual(1)
        expect(Camera.defaultProfile).toBeTruthy()
      })
      .catch(error => {
        console.error(error)
      })
  })
})
