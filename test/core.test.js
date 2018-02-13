const Config = require('../lib/utils/config')
const TestConfig = require('./config')

// Extending jest with a custom matcher
expect.extend({
  toBeUndefinedNullOrEmpty (received, argument) {
    let pass = false
    if (typeof received === 'undefined') {
      pass = true
    }
    else if (received === null) {
      pass = true
    }
    else if (typeof received === 'string' && received.length === 0) {
      pass = true
    }
    if (pass) {
      return { // when used with expect(x).not.matcher
        message: () =>
          `expected ${received} not to be undefined or null`,
        pass: true
      }
    }
    else {
      return {
        message: () =>
          `expected ${received} to be undefined or null`,
        pass: true
      }
    }
  }
})

expect.extend({
  toBeArray (received, argument) {
    let pass = Array.isArray(received)
    if (pass) {
      return { // when used with expect(x).not.matcher
        message: () =>
          `expected ${received} not to be an array`,
        pass: true
      }
    }
    else {
      return {
        message: () =>
          `expected ${received} to be an array`,
        pass: true
      }
    }
  }
})

// Applies to all tests in this file
var Camera = null
beforeEach(() => {
  const OnvifManager = require('../lib/onvif-nvt')
  Config.setDebugData(TestConfig.cameraType, 'Response')
  return OnvifManager.connect(TestConfig.address, TestConfig.port, TestConfig.user, TestConfig.pass)
    .then(results => {
      Camera = results
    })
})

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
        if (TestConfig.cameraType === 'axis') {
          expect(response).toMatch(TestConfig.address)
        }
        else if (TestConfig.cameraType === 'hikvision') {
          expect(response).toMatch('http://www.onvif.org/')
        }
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
        // axis = ''
        // hikvision = undefined
        expect(response).toBeUndefinedNullOrEmpty()
        console.log(results)
      })
  })

  test('Camera.core.setHostnameFromDHCP', () => {
    return Camera.core.setHostnameFromDHCP(true)
      .then(results => {
        let response = results.data.SetHostnameResponse
        // axis = ''
        // hikvision = undefined
        expect(response).toBeUndefinedNullOrEmpty()
        console.log(results)
      })
  })

  test('Camera.core.getDNS', () => {
    return Camera.core.getDNS()
      .then(results => {
        let response = results.data.GetDNSResponse.DNSInformation
        expect(response).toHaveProperty('DNSFromDHCP')
        expect(response).toHaveProperty('FromDHCP')
        if (TestConfig.cameraType === 'axis') {
          expect(response).toHaveProperty('SearchDomain')
        }
      })
  })

  test('Camera.core.setDNS', () => {
    return Camera.core.setDNS(true)
      .then(results => {
        let response = results.data.SetDNSResponse
        // axis = ''
        // hikvision = undefined
        expect(response).toBeUndefinedNullOrEmpty()
      })
  })

  test('Camera.core.getNTP', () => {
    return Camera.core.getNTP()
      .then(results => {
        let response = results.data.GetNTPResponse.NTPInformation
        expect(response).toHaveProperty('FromDHCP')
        if (TestConfig.cameraType === 'axis') {
          expect(response).toHaveProperty('NTPManual')
        }
        else if (TestConfig.cameraType === 'hikvision') {
          expect(response).toHaveProperty('NTPFromDHCP')
        }
      })
  })

  test('Camera.core.setNTP', () => {
    return Camera.core.setNTP(true)
      .then(results => {
        let response = results.data.SetNTPResponse
        // axis = ''
        // hikvision = undefined
        expect(response).toBeUndefinedNullOrEmpty()
        console.log(results)
      })
  })

  test('Camera.core.getDynamicDNS', () => {
    return Camera.core.getDynamicDNS()
      .then(results => {
        let response = results.data.GetDynamicDNSResponse
        expect(response).toHaveProperty('DynamicDNSInformation')
        let info = response.DynamicDNSInformation
        expect(info).toHaveProperty('Name')
        expect(info).toHaveProperty('Type')
        let name = info.Name
        let type = info.Type
        expect(name).toBeUndefinedNullOrEmpty()
        expect(type).toMatch('ClientUpdates')
        console.log(results)
      })
  })

  test('Camera.core.getNetworkInterfaces', () => {
    return Camera.core.getNetworkInterfaces()
      .then(results => {
        let response = results.data.GetNetworkInterfacesResponse
        expect(response).toHaveProperty('NetworkInterfaces')
        let interfaces = response.NetworkInterfaces
        expect(interfaces).toHaveProperty('$')
        expect(interfaces).toHaveProperty('Enabled')
        expect(interfaces).toHaveProperty('Info')
        expect(interfaces).toHaveProperty('IPv4')
        expect(interfaces).toHaveProperty('IPv6')
        expect(interfaces).toHaveProperty('Link')
        console.log(results)
      })
  })

  test('Camera.core.getNetworkProtocols', () => {
    return Camera.core.getNetworkProtocols()
      .then(results => {
        let response = results.data.GetNetworkProtocolsResponse
        expect(response).toHaveProperty('NetworkProtocols')
        let protocols = response.NetworkProtocols
        expect(protocols).toBeArray()
        console.log(results)
      })
  })

  test('Camera.core.getNetworkDefaultGateway', () => {
    return Camera.core.getNetworkDefaultGateway()
      .then(results => {
        let response = results.data.GetNetworkDefaultGatewayResponse
        expect(response).toHaveProperty('NetworkGateway')
        let gateway = response.NetworkGateway
        expect(gateway).toHaveProperty('IPv4Address')
        expect(gateway).toHaveProperty('IPv6Address')
        console.log(results)
      })
  })

  test('Camera.core.getZeroConfiguration', () => {
    return Camera.core.getZeroConfiguration()
      .then(results => {
        let response = results.data.GetZeroConfigurationResponse
        expect(response).toHaveProperty('ZeroConfiguration')
        let zero = response.ZeroConfiguration
        expect(zero).toHaveProperty('Addresses')
        expect(zero).toHaveProperty('Enabled')
        expect(zero).toHaveProperty('InterfaceToken')
        console.log(results)
      })
  })

  test('Camera.core.getIPAddressFilter', () => {
    return Camera.core.getIPAddressFilter()
      .then(results => {
        let response = results.data.GetIPAddressFilterResponse
        expect(response).toHaveProperty('IPAddressFilter')
        let filter = response.IPAddressFilter
        expect(filter).toHaveProperty('Type')
        console.log(results)
      })
  })

  test('Camera.core.getDeviceInformation', () => {
    return Camera.core.getDeviceInformation()
      .then(results => {
        let response = results.data.GetDeviceInformationResponse
        expect(response).toHaveProperty('FirmwareVersion')
        expect(response).toHaveProperty('HardwareId')
        expect(response).toHaveProperty('Manufacturer')
        expect(response).toHaveProperty('Model')
        expect(response).toHaveProperty('SerialNumber')
        console.log(results)
      })
  })

  test('Camera.core.getSystemUris', () => {
    return Camera.core.getSystemUris()
      .then(results => {
        let response = results.data.GetSystemUrisResponse
        expect(response).toHaveProperty('SupportInfoUri')
        expect(response).toHaveProperty('SystemBackupUri')
        expect(response).toHaveProperty('SystemLogUris')
        let logUris = response.SystemLogUris
        expect(logUris).toHaveProperty('SystemLog')
        let log = logUris.SystemLog
        expect(log).toHaveProperty('Type')
        expect(log).toHaveProperty('Uri')
        console.log(results)
      })
  })

  test('Camera.core.getSystemDateAndTime', () => {
    return Camera.core.getSystemDateAndTime()
      .then(results => {
        let response = results.data.GetSystemDateAndTimeResponse
        expect(response).toHaveProperty('SystemDateAndTime')
        let sdt = response.SystemDateAndTime
        expect(sdt).toHaveProperty('DateTimeType')
        expect(sdt).toHaveProperty('DaylightSavings')
        expect(sdt).toHaveProperty('LocalDateTime')
        expect(sdt).toHaveProperty('TimeZone')
        expect(sdt).toHaveProperty('UTCDateTime')
        console.log(results)
      })
  })

  // test('Camera.core.getSystemLog', () => {
  //   return Camera.core.getSystemLog()
  //     .then(results => {
  //       let response = results.data.GetSystemLogResponse
  //       expect(response).toHaveProperty('SystemLog')
  //       console.log(results)
  //     })
  // })

  test('Camera.core.getSystemSupportInformation', () => {
    return Camera.core.getSystemSupportInformation()
      .then(results => {
        let response = results.data.GetSystemSupportInformationResponse
        expect(response).toHaveProperty('SupportInformation')
        let info = response.SupportInformation
        expect(info).toHaveProperty('String')
        console.log(results)
      })
  })

  test('Camera.core.getScopes', () => {
    return Camera.core.getScopes()
      .then(results => {
        let response = results.data.GetScopesResponse
        expect(response).toHaveProperty('Scopes')
        let scopes = response.Scopes
        expect(scopes).toBeArray()
        console.log(results)
      })
  })

  test('Camera.core.getDiscoveryMode', () => {
    return Camera.core.getDiscoveryMode()
      .then(results => {
        let response = results.data.GetDiscoveryModeResponse
        expect(response).toHaveProperty('DiscoveryMode')
        console.log(results)
      })
  })

  test('Camera.core.getRemoteDiscoveryMode', () => {
    return Camera.core.getRemoteDiscoveryMode()
      .then(results => {
        let response = results.data.GetRemoteDiscoveryModeResponse
        expect(response).toHaveProperty('RemoteDiscoveryMode')
        console.log(results)
      })
  })

  test('Camera.core.getDPAddresses', () => {
    return Camera.core.getDPAddresses()
      .then(results => {
        let response = results.data.GetDPAddressesResponse
        expect(response).toHaveProperty('DPAddress')
        let address = response.DPAddress
        expect(address).toHaveProperty('IPv4Address')
        expect(address).toHaveProperty('Type')
        console.log(results)
      })
  })

  test('Camera.core.getAccessPolicy', () => {
    return Camera.core.getAccessPolicy()
      .then(results => {
        let response = results.data.GetAccessPolicyResponse
        expect(response).toHaveProperty('PolicyFile')
        let file = response.PolicyFile
        expect(file).toHaveProperty('Data')
        console.log(results)
      })
  })

  test('Camera.core.getUsers', () => {
    return Camera.core.getUsers()
      .then(results => {
        let response = results.data.GetUsersResponse
        expect(response).toHaveProperty('User')
        let user = response.User
        expect(user).toHaveProperty('UserLevel')
        expect(user).toHaveProperty('Username')
        console.log(results)
      })
  })

})
