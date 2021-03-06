'use strict'

const Config = require('../lib/utils/config')
const TestConfig = require('./config')

describe('Camera', () => {
  Config.setDebugData(TestConfig.cameraType)

  test('Camera::constructor()', () => {
    const OnvifManager = require('../lib/onvif-nvt')
    return OnvifManager.connect(TestConfig.address, TestConfig.port, TestConfig.user, TestConfig.pass)
      .then(results => {
        const Camera = results
        expect(Camera.access).toBeNull()
        expect(Camera.accessrules).toBeNull()
        expect(Camera.action).toBeNull()
        expect(Camera.analytics).not.toBeNull()
        expect(Camera.core).not.toBeNull()
        expect(Camera.credential).toBeNull()
        expect(Camera.deviceio).not.toBeNull()
        expect(Camera.display).toBeNull()
        expect(Camera.events).not.toBeNull()
        expect(Camera.imaging).not.toBeNull()
        expect(Camera.media).not.toBeNull()
        expect(Camera.media2).toBeNull()
        expect(Camera.ptz).not.toBeNull()
        expect(Camera.receiver).toBeNull()
        expect(Camera.recording).toBeNull()
        expect(Camera.replay).toBeNull()
        expect(Camera.schedule).toBeNull()
        expect(Camera.search).toBeNull()
        expect(Camera.security).toBeNull()
        expect(Camera.snapshot).toBeNull()
      })
  })

  test('Camera add all', () => {
    const OnvifManager = require('../lib/onvif-nvt')
    return OnvifManager.connect(TestConfig.address, TestConfig.port, TestConfig.user, TestConfig.pass)
      .then(results => {
        const Camera = results
        Camera.add('access')
        Camera.add('accessrules')
        Camera.add('action')
        Camera.add('analytics')
        Camera.add('core')
        Camera.add('credential')
        Camera.add('deviceio')
        Camera.add('display')
        Camera.add('events')
        Camera.add('imaging')
        Camera.add('media')
        Camera.add('media2')
        Camera.add('ptz')
        Camera.add('receiver')
        Camera.add('recording')
        Camera.add('replay')
        Camera.add('schedule')
        Camera.add('search')
        Camera.add('security')
        Camera.add('snapshot')

        expect(Camera.access).not.toBeNull()
        expect(Camera.accessrules).not.toBeNull()
        expect(Camera.action).not.toBeNull()
        expect(Camera.analytics).not.toBeNull()
        expect(Camera.core).not.toBeNull()
        expect(Camera.credential).not.toBeNull()
        expect(Camera.deviceio).not.toBeNull()
        expect(Camera.display).not.toBeNull()
        expect(Camera.events).not.toBeNull()
        expect(Camera.imaging).not.toBeNull()
        expect(Camera.media).not.toBeNull()
        expect(Camera.media2).not.toBeNull()
        expect(Camera.ptz).not.toBeNull()
        expect(Camera.receiver).not.toBeNull()
        expect(Camera.recording).not.toBeNull()
        expect(Camera.replay).not.toBeNull()
        expect(Camera.schedule).not.toBeNull()
        expect(Camera.search).not.toBeNull()
        expect(Camera.security).not.toBeNull()
        expect(Camera.snapshot).not.toBeNull()
      })
  })

  test('Camera connect (no address)', () => {
    const OnvifManager = require('../lib/onvif-nvt')
    return OnvifManager.connect()
      .catch(error => {
        // console.error(error)
        expect(error.message).toContain('The type of the value must be a "string".')
      })
  })

  test('Camera connect (invalid address)', () => {
    const OnvifManager = require('../lib/onvif-nvt')
    return OnvifManager.connect(true)
      .catch(error => {
        // console.error(error)
        expect(error.message).toContain('The type of the value must be a "string".')
      })
  })

  test('Camera setAuth', () => {
    const OnvifManager = require('../lib/onvif-nvt')
    return OnvifManager.connect(TestConfig.address, TestConfig.port, TestConfig.user, TestConfig.pass)
      .catch(results => {
        const Camera = results
        Camera.setAuth()
        expect(Camera.username).toBeNull()
        expect(Camera.password).toBeNull()
        Camera.setAuth('username', 'password')
        expect(Camera.username).not.toBeNull()
        expect(Camera.password).not.toBeNull()
      })
  })
})
