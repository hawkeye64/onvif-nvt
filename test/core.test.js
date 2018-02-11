const Config = require('../lib/utils/config')
const TestConfig = require('./config')

// Applies to all tests in this file
var Camera = null
beforeEach(() => {
  const OnvifManager = require('../lib/onvif-nvt')
  Config.setDebugData(TestConfig.cameraType, 'Response')
  return OnvifManager.connect(TestConfig.address, TestConfig.port, TestConfig.user, TestConfig.pass)
  .then(results => {
    Camera = results
  })
});

describe('Core', () => {
  test('Camera.core', () => {
      expect(Camera.core).not.toBeNull()
      expect(Camera.address).toMatch(TestConfig.address)
      expect(Camera.core.serviceAddress.host).toMatch(TestConfig.address)
      expect(Camera.core.username).toMatch(TestConfig.user)
      expect(Camera.core.password).toMatch(TestConfig.pass)
  })

  test('Camera.core.getWsdlUrl', () => {
    return Camera.core.getWsdlUrl()
    .then(results => {
      let response = results.data.GetWsdlUrlResponse.WsdlUrl
      expect(response).toMatch(TestConfig.address)
    })
  })

  // test('Camera.core.getServices', () => {
  //   return Camera.core.getServices(true)
  //   .then(results => {
  //     console.log(results)
  //   })
  // })

  // test('Camera.core.getServiceCapabilities', () => {
  //   return Camera.core.getServiceCapabilities()
  //   .then(results => {
  //     console.log(results)
  //   })
  // })

  test('Camera.core.getCapabilities', () => {
    return Camera.core.getCapabilities()
    .then(results => {
      let response = results.data.GetCapabilitiesResponse.Capabilities
      expect(response).toHaveProperty('Device')
      expect(response).toHaveProperty('Events')
      expect(response).toHaveProperty('Media')
      expect(response).toHaveProperty('PTZ')
    })
  })

  test('Camera.core.getHostname', () => {
    return Camera.core.getHostname()
    .then(results => {
      let response = results.data.GetHostnameResponse.HostnameInformation
      expect(response).toHaveProperty('FromDHCP')
      expect(response).toHaveProperty('Name')
    })
  })

  test('Camera.core.setHostname', () => {
    return Camera.core.setHostname('localhost')
    .then(results => {
      let response = results.data.SetHostnameResponse
      expect(response).toBe('')
      console.log(results)
    })
  })

  // test('Camera.core.setHostnameFromDHCP', () => {
  //   return Camera.core.setHostnameFromDHCP(true)
  //   .then(results => {
  //     let response = results.data.SetHostnameResponse
  //     expect(response).toBe('')
  //     console.log(results)
  //   })
  // })

  test('Camera.core.getDNS', () => {
    return Camera.core.getDNS()
    .then(results => {
      let response = results.data.GetDNSResponse.DNSInformation
      expect(response).toHaveProperty('DNSFromDHCP')
      expect(response).toHaveProperty('FromDHCP')
      expect(response).toHaveProperty('SearchDomain')
    })
  })

  test('Camera.core.setDNS', () => {
    return Camera.core.setDNS(true)
    .then(results => {
      let response = results.data.SetDNSResponse
      expect(response).toBe('')
    })
  })

  test('Camera.core.getNTP', () => {
    return Camera.core.getNTP()
    .then(results => {
      let response = results.data.GetNTPResponse.NTPInformation
      expect(response).toHaveProperty('FromDHCP')
      expect(response).toHaveProperty('NTPManual')
    })
  })

  test('Camera.core.setNTP', () => {
    return Camera.core.setNTP(true)
    .then(results => {
      let response = results.data.SetNTPResponse
      expect(response).toBe('')
      console.log(results)
    })
  })


})
