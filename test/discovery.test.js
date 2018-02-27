'use strict'

const Config = require('../lib/utils/config')
const TestConfig = require('./config')

describe('Discovery', () => {
  Config.setDebugData(TestConfig.cameraType)

  test('add discovery', (done) => {
    const OnvifManager = require('../lib/onvif-nvt')
    expect(OnvifManager.discovery).toBeNull()
    OnvifManager.add('discovery')
    expect(OnvifManager.discovery).not.toBeNull()
    done()
  })

  test('startProbe-stopProbe', (done) => {
    const OnvifManager = require('../lib/onvif-nvt')
    OnvifManager.add('discovery')

    OnvifManager.discovery.startProbe()
      .then(results => {
        console.log(results)
      })
      .catch(error => {
        console.error(error)
      })

    setTimeout(() => {
      OnvifManager.discovery.stopProbe()
        .then(results => {
          console.log(results)
          expect(results).toBeUndefined()
          done()
        })
        .catch(error => {
          console.error(error)
          done()
        })
    }, 1000)
  })
})
