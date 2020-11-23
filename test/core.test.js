'use strict'

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
    const pass = Array.isArray(received)
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
let Camera = null
beforeEach(() => {
  const OnvifManager = require('../lib/onvif-nvt')
  Config.setDebugData(TestConfig.cameraType)
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

  test('Camera.core.buildRequest - no methodName', () => {
    return Camera.core.buildRequest()
      .catch(error => {
        expect(error.message).toContain('The "methodName" argument for buildRequest is required.')
      })
  })

  test('Camera.core.buildRequest - invalid methodName', () => {
    return Camera.core.buildRequest(true)
      .catch(error => {
        expect(error.message).toContain('The "methodName" argument for buildRequest is invalid:')
      })
  })

  test('Camera.core.getWsdlUrl (Promise)', () => {
    return Camera.core.getWsdlUrl()
      .then(results => {
        const response = results.data.GetWsdlUrlResponse.WsdlUrl
        if (TestConfig.cameraType === 'axis') {
          expect(response).toMatch(TestConfig.address)
        }
        else if (TestConfig.cameraType === 'hikvision') {
          expect(response).toMatch('http://www.onvif.org/')
        }
      })
  })

  test('Camera.core.getWsdlUrl (Callback)', (done) => {
    Camera.core.getWsdlUrl((error, results) => {
      if (!error) {
        const response = results.data.GetWsdlUrlResponse.WsdlUrl
        if (TestConfig.cameraType === 'axis') {
          expect(response).toMatch(TestConfig.address)
        }
        else if (TestConfig.cameraType === 'hikvision') {
          expect(response).toMatch('http://www.onvif.org/')
        }
      }
      done()
    })
  })

  test('Camera.core.getWsdlUrl (invalid Callback)', () => {
    return Camera.core.getWsdlUrl('callback')
      .then(results => {
      })
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function"')
      })
  })

  test('Camera.core.getServices (Promise)', () => {
    return Camera.core.getServices(true)
      .then(results => {
        const response = results.data.GetServicesResponse
        expect(response).toHaveProperty('Service')
        expect(response.Service).toBeArray()
        const service = response.Service[0]
        expect(service).toHaveProperty('Capabilities')
        expect(service.Capabilities).toHaveProperty('Capabilities')
        expect(service.Capabilities.Capabilities).toHaveProperty('Network')
        expect(service.Capabilities.Capabilities.Network).toHaveProperty('$')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('DHCPv6')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('Dot11Configuration')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('Dot1XConfigurations')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('DynDNS')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('HostnameFromDHCP')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('IPFilter')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('IPVersion6')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('NTP')
        expect(service.Capabilities.Capabilities).toHaveProperty('Security')
        expect(service.Capabilities.Capabilities.Security).toHaveProperty('$')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('AccessPolicyConfig')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('DefaultAccessPolicy')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('Dot1X')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('HttpDigest')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('KerberosToken')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('OnboardKeyGeneration')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('RELToken')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('RemoteUserHandling')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('SAMLToken')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('SupportedEAPMethods')
        // https://github.com/facebook/jest/issues/5653
        // The Jest fix is to pass the string(s) in as array
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty(['TLS1.0'])
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty(['TLS1.1'])
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty(['TLS1.2'])
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('UsernameToken')
        // https://github.com/facebook/jest/issues/5653
        // The Jest fix is to pass the string(s) in as array
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty(['X.509Token'])
        expect(service.Capabilities.Capabilities).toHaveProperty('System')
        expect(service.Capabilities.Capabilities.System).toHaveProperty('$')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('DiscoveryBye')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('DiscoveryResolve')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('FirmwareUpgrade')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('HttpFirmwareUpgrade')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('HttpSupportInformation')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('HttpSystemBackup')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('HttpSystemLogging')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('RemoteDiscovery')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('SystemBackup')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('SystemLogging')
        expect(service).toHaveProperty('Namespace')
        expect(service).toHaveProperty('Version')
        expect(service.Version).toHaveProperty('Major')
        expect(service.Version).toHaveProperty('Minor')
        expect(service).toHaveProperty('XAddr')
        // console.log(results)
      })
  })

  test('Camera.core.getServices (Callback)', (done) => {
    return Camera.core.getServices(true, (error, results) => {
      if (!error) {
        const response = results.data.GetServicesResponse
        expect(response).toHaveProperty('Service')
        expect(response.Service).toBeArray()
        const service = response.Service[0]
        expect(service).toHaveProperty('Capabilities')
        expect(service.Capabilities).toHaveProperty('Capabilities')
        expect(service.Capabilities.Capabilities).toHaveProperty('Network')
        expect(service.Capabilities.Capabilities.Network).toHaveProperty('$')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('DHCPv6')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('Dot11Configuration')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('Dot1XConfigurations')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('DynDNS')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('HostnameFromDHCP')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('IPFilter')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('IPVersion6')
        expect(service.Capabilities.Capabilities.Network.$).toHaveProperty('NTP')
        expect(service.Capabilities.Capabilities).toHaveProperty('Security')
        expect(service.Capabilities.Capabilities.Security).toHaveProperty('$')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('AccessPolicyConfig')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('DefaultAccessPolicy')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('Dot1X')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('HttpDigest')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('KerberosToken')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('OnboardKeyGeneration')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('RELToken')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('RemoteUserHandling')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('SAMLToken')
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('SupportedEAPMethods')
        // https://github.com/facebook/jest/issues/5653
        // The Jest fix is to pass the string(s) in as array
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty(['TLS1.0'])
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty(['TLS1.1'])
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty(['TLS1.2'])
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty('UsernameToken')
        // https://github.com/facebook/jest/issues/5653
        // The Jest fix is to pass the string(s) in as array
        expect(service.Capabilities.Capabilities.Security.$).toHaveProperty(['X.509Token'])
        expect(service.Capabilities.Capabilities).toHaveProperty('System')
        expect(service.Capabilities.Capabilities.System).toHaveProperty('$')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('DiscoveryBye')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('DiscoveryResolve')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('FirmwareUpgrade')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('HttpFirmwareUpgrade')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('HttpSupportInformation')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('HttpSystemBackup')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('HttpSystemLogging')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('RemoteDiscovery')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('SystemBackup')
        expect(service.Capabilities.Capabilities.System.$).toHaveProperty('SystemLogging')
        expect(service).toHaveProperty('Namespace')
        expect(service).toHaveProperty('Version')
        expect(service.Version).toHaveProperty('Major')
        expect(service.Version).toHaveProperty('Minor')
        expect(service).toHaveProperty('XAddr')
      }
      done()
    })
  })

  test('Camera.core.getServices (Promise|Invalid Callback)', () => {
    return Camera.core.getServices(true, 'callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getServices (Promise|Invalid param)', () => {
    return Camera.core.getServices('test')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "boolean".')
      })
  })

  test('Camera.core.getCapabilities (Promise)', () => {
    return Camera.core.getCapabilities()
      .then(results => {
        const response = results.data.GetCapabilitiesResponse.Capabilities
        expect(response).toHaveProperty('Device')
        expect(response).toHaveProperty('Events')
        expect(response).toHaveProperty('Media')
        expect(response).toHaveProperty('PTZ')
      })
  })

  test('Camera.core.getCapabilities (Callback)', (done) => {
    Camera.core.getCapabilities((error, results) => {
      if (!error) {
        const response = results.data.GetCapabilitiesResponse.Capabilities
        expect(response).toHaveProperty('Device')
        expect(response).toHaveProperty('Events')
        expect(response).toHaveProperty('Media')
        expect(response).toHaveProperty('PTZ')
      }
      done()
    })
  })

  test('Camera.core.getCapabilities (Promise|Invalid Callback)', () => {
    return Camera.core.getCapabilities('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getHostname (Promise)', () => {
    return Camera.core.getHostname()
      .then(results => {
        const response = results.data.GetHostnameResponse.HostnameInformation
        expect(response).toHaveProperty('FromDHCP')
        expect(response).toHaveProperty('Name')
      })
  })

  test('Camera.core.getHostname (Callback)', (done) => {
    Camera.core.getHostname((error, results) => {
      if (!error) {
        const response = results.data.GetHostnameResponse.HostnameInformation
        expect(response).toHaveProperty('FromDHCP')
        expect(response).toHaveProperty('Name')
      }
      done()
    })
  })

  test('Camera.core.getHostname (Promise|Invalid Callback)', () => {
    return Camera.core.getHostname('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.setHostname (Promise)', () => {
    return Camera.core.setHostname('localhost')
      .then(results => {
        const response = results.data.SetHostnameResponse
        // axis = ''
        // hikvision = undefined
        expect(response).toBeUndefinedNullOrEmpty()
        console.log(results)
      })
  })

  test('Camera.core.setHostname (Callback)', (done) => {
    Camera.core.setHostname('localhost', (error, results) => {
      if (!error) {
        const response = results.data.SetHostnameResponse
        // axis = ''
        // hikvision = undefined
        expect(response).toBeUndefinedNullOrEmpty()
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.setHostname (Promise|Invalid Callback)', () => {
    return Camera.core.getHostname('test', 'callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.setHostnameFromDHCP (Promise)', () => {
    return Camera.core.setHostnameFromDHCP(true)
      .then(results => {
        const response = results.data.SetHostnameResponse
        // axis = ''
        // hikvision = undefined
        expect(response).toBeUndefinedNullOrEmpty()
        console.log(results)
      })
  })

  test('Camera.core.setHostnameFromDHCP (Callback)', (done) => {
    Camera.core.setHostnameFromDHCP(true, (error, results) => {
      if (!error) {
        const response = results.data.SetHostnameResponse
        // axis = ''
        // hikvision = undefined
        expect(response).toBeUndefinedNullOrEmpty()
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.setHostnameFromDHCP (Promise|Invalid Callback)', () => {
    return Camera.core.setHostnameFromDHCP(true, 'callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.setHostnameFromDHCP (Promise|Invalid Param)', () => {
    return Camera.core.setHostnameFromDHCP('true')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "boolean".')
      })
  })

  test('Camera.core.getDNS (Promise)', () => {
    return Camera.core.getDNS()
      .then(results => {
        const response = results.data.GetDNSResponse
        expect(response).toHaveProperty('DNSInformation')
        expect(response.DNSInformation).toHaveProperty('DNSFromDHCP')
        expect(response.DNSInformation.DNSFromDHCP).toHaveProperty('IPv4Address')
        expect(response.DNSInformation.DNSFromDHCP).toHaveProperty('Type')
        expect(response.DNSInformation).toHaveProperty('FromDHCP')
      })
  })

  test('Camera.core.getDNS (Callback)', (done) => {
    Camera.core.getDNS((error, results) => {
      if (!error) {
        const response = results.data.GetDNSResponse
        expect(response).toHaveProperty('DNSInformation')
        expect(response.DNSInformation).toHaveProperty('DNSFromDHCP')
        expect(response.DNSInformation.DNSFromDHCP).toHaveProperty('IPv4Address')
        expect(response.DNSInformation.DNSFromDHCP).toHaveProperty('Type')
        expect(response.DNSInformation).toHaveProperty('FromDHCP')
      }
      done()
    })
  })

  test('Camera.core.getDNS (Promise|Invalid Callback)', () => {
    return Camera.core.getDNS('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.setDNS (Promise)', () => {
    return Camera.core.setDNS(true)
      .then(results => {
        const response = results.data.SetDNSResponse
        // axis = ''
        // hikvision = undefined
        expect(response).toBeUndefinedNullOrEmpty()
      })
  })

  test('Camera.core.setDNS (Callback)', (done) => {
    Camera.core.setDNS(true, null, null, (error, results) => {
      if (!error) {
        const response = results.data.SetDNSResponse
        // axis = ''
        // hikvision = undefined
        expect(response).toBeUndefinedNullOrEmpty()
      }
      done()
    })
  })

  test('Camera.core.setDNS (Promise|Invalid Callback)', () => {
    return Camera.core.setDNS(true, null, null, 'callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.setDNS (Promise|Invalid Param1)', () => {
    return Camera.core.setDNS('true')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "boolean".')
      })
  })

  test('Camera.core.setDNS (Promise|Invalid Param2)', () => {
    return Camera.core.setDNS(true, 'anArray')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "array".')
      })
  })

  test('Camera.core.setDNS (Promise|Invalid Param3)', () => {
    return Camera.core.setDNS(true, null, 'anArray')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "array".')
      })
  })

  test('Camera.core.getNTP (Promise)', () => {
    return Camera.core.getNTP()
      .then(results => {
        const response = results.data.GetNTPResponse
        expect(response).toHaveProperty('NTPInformation')
        expect(response.NTPInformation).toHaveProperty('FromDHCP')
        expect(response.NTPInformation).toHaveProperty('NTPFromDHCP')
        expect(response.NTPInformation.NTPFromDHCP).toHaveProperty('IPv4Address')
        expect(response.NTPInformation.NTPFromDHCP).toHaveProperty('Type')
      })
  })

  test('Camera.core.getNTP (Callback)', (done) => {
    Camera.core.getNTP((error, results) => {
      if (!error) {
        const response = results.data.GetNTPResponse
        expect(response).toHaveProperty('NTPInformation')
        expect(response.NTPInformation).toHaveProperty('FromDHCP')
        expect(response.NTPInformation).toHaveProperty('NTPFromDHCP')
        expect(response.NTPInformation.NTPFromDHCP).toHaveProperty('IPv4Address')
        expect(response.NTPInformation.NTPFromDHCP).toHaveProperty('Type')
      }
      done()
    })
  })

  test('Camera.core.getNTP (Promise|Invalid Callback)', () => {
    return Camera.core.getNTP('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.setNTP (Promise)', () => {
    return Camera.core.setNTP(true)
      .then(results => {
        const response = results.data.SetNTPResponse
        // axis = ''
        // hikvision = undefined
        expect(response).toBeUndefinedNullOrEmpty()
        console.log(results)
      })
  })

  test('Camera.core.setNTP (Callback)', (done) => {
    Camera.core.setNTP(true, null, (error, results) => {
      if (!error) {
        const response = results.data.SetNTPResponse
        // axis = ''
        // hikvision = undefined
        expect(response).toBeUndefinedNullOrEmpty()
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.setNTP (Promise|Invalid Callback)', () => {
    return Camera.core.setNTP(true, null, 'callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.setNTP (Promise|Invalid Param1)', () => {
    return Camera.core.setNTP('true')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "boolean".')
      })
  })

  test('Camera.core.setNTP (Promise|Invalid Param2)', () => {
    return Camera.core.setNTP(true, 'anArray')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "array".')
      })
  })

  test('Camera.core.getDynamicDNS (Promise)', () => {
    return Camera.core.getDynamicDNS()
      .then(results => {
        const response = results.data.GetDynamicDNSResponse
        expect(response).toHaveProperty('DynamicDNSInformation')
        const info = response.DynamicDNSInformation
        expect(info).toHaveProperty('Name')
        expect(info).toHaveProperty('Type')
        const name = info.Name
        const type = info.Type
        expect(name).toBeUndefinedNullOrEmpty()
        expect(type).toMatch('ClientUpdates')
        console.log(results)
      })
  })

  test('Camera.core.getDynamicDNS (Callback)', (done) => {
    Camera.core.getDynamicDNS((error, results) => {
      if (!error) {
        const response = results.data.GetDynamicDNSResponse
        expect(response).toHaveProperty('DynamicDNSInformation')
        const info = response.DynamicDNSInformation
        expect(info).toHaveProperty('Name')
        expect(info).toHaveProperty('Type')
        const name = info.Name
        const type = info.Type
        expect(name).toBeUndefinedNullOrEmpty()
        expect(type).toMatch('ClientUpdates')
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getDynamicDNS (Promise|Invalid Callback)', () => {
    return Camera.core.getDynamicDNS('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getNetworkInterfaces (Promise)', () => {
    return Camera.core.getNetworkInterfaces()
      .then(results => {
        const response = results.data.GetNetworkInterfacesResponse
        expect(response).toHaveProperty('NetworkInterfaces')
        const interfaces = response.NetworkInterfaces
        expect(interfaces).toHaveProperty('$')
        expect(interfaces).toHaveProperty('Enabled')
        expect(interfaces).toHaveProperty('Info')
        expect(interfaces).toHaveProperty('IPv4')
        expect(interfaces).toHaveProperty('IPv6')
        expect(interfaces).toHaveProperty('Link')
        console.log(results)
      })
  })

  test('Camera.core.getNetworkInterfaces (Callback)', (done) => {
    Camera.core.getNetworkInterfaces((error, results) => {
      if (!error) {
        const response = results.data.GetNetworkInterfacesResponse
        expect(response).toHaveProperty('NetworkInterfaces')
        const interfaces = response.NetworkInterfaces
        expect(interfaces).toHaveProperty('$')
        expect(interfaces).toHaveProperty('Enabled')
        expect(interfaces).toHaveProperty('Info')
        expect(interfaces).toHaveProperty('IPv4')
        expect(interfaces).toHaveProperty('IPv6')
        expect(interfaces).toHaveProperty('Link')
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getNetworkInterfaces (Promise|Invalid Callback)', () => {
    return Camera.core.getNetworkInterfaces('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getNetworkProtocols (Promise)', () => {
    return Camera.core.getNetworkProtocols()
      .then(results => {
        const response = results.data.GetNetworkProtocolsResponse
        expect(response).toHaveProperty('NetworkProtocols')
        const protocols = response.NetworkProtocols
        expect(protocols).toBeArray()
        console.log(results)
      })
  })

  test('Camera.core.getNetworkProtocols (Callbacl)', (done) => {
    Camera.core.getNetworkProtocols((error, results) => {
      if (!error) {
        const response = results.data.GetNetworkProtocolsResponse
        expect(response).toHaveProperty('NetworkProtocols')
        const protocols = response.NetworkProtocols
        expect(protocols).toBeArray()
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getNetworkProtocols (Promise|Invalid Callback)', () => {
    return Camera.core.getNetworkProtocols('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getNetworkDefaultGateway (Promise)', () => {
    return Camera.core.getNetworkDefaultGateway()
      .then(results => {
        const response = results.data.GetNetworkDefaultGatewayResponse
        expect(response).toHaveProperty('NetworkGateway')
        const gateway = response.NetworkGateway
        expect(gateway).toHaveProperty('IPv4Address')
        expect(gateway).toHaveProperty('IPv6Address')
        console.log(results)
      })
  })

  test('Camera.core.getNetworkDefaultGateway (Callback)', (done) => {
    Camera.core.getNetworkDefaultGateway((error, results) => {
      if (!error) {
        const response = results.data.GetNetworkDefaultGatewayResponse
        expect(response).toHaveProperty('NetworkGateway')
        const gateway = response.NetworkGateway
        expect(gateway).toHaveProperty('IPv4Address')
        expect(gateway).toHaveProperty('IPv6Address')
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getNetworkDefaultGateway (Promise|Invalid Callback)', () => {
    return Camera.core.getNetworkDefaultGateway('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getZeroConfiguration (Promise)', () => {
    return Camera.core.getZeroConfiguration()
      .then(results => {
        const response = results.data.GetZeroConfigurationResponse
        expect(response).toHaveProperty('ZeroConfiguration')
        const zero = response.ZeroConfiguration
        expect(zero).toHaveProperty('Addresses')
        expect(zero).toHaveProperty('Enabled')
        expect(zero).toHaveProperty('InterfaceToken')
        console.log(results)
      })
  })

  test('Camera.core.getZeroConfiguration (Callback)', (done) => {
    Camera.core.getZeroConfiguration((error, results) => {
      if (!error) {
        const response = results.data.GetZeroConfigurationResponse
        expect(response).toHaveProperty('ZeroConfiguration')
        const zero = response.ZeroConfiguration
        expect(zero).toHaveProperty('Addresses')
        expect(zero).toHaveProperty('Enabled')
        expect(zero).toHaveProperty('InterfaceToken')
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getZeroConfiguration (Promise|Invalid Callback)', () => {
    return Camera.core.getZeroConfiguration('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getIPAddressFilter (Promise)', () => {
    return Camera.core.getIPAddressFilter()
      .then(results => {
        const response = results.data.GetIPAddressFilterResponse
        expect(response).toHaveProperty('IPAddressFilter')
        const filter = response.IPAddressFilter
        expect(filter).toHaveProperty('Type')
        console.log(results)
      })
  })

  test('Camera.core.getIPAddressFilter (Callback)', (done) => {
    Camera.core.getIPAddressFilter((error, results) => {
      if (!error) {
        const response = results.data.GetIPAddressFilterResponse
        expect(response).toHaveProperty('IPAddressFilter')
        const filter = response.IPAddressFilter
        expect(filter).toHaveProperty('Type')
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getIPAddressFilter (Promise|Invalid Callback)', () => {
    return Camera.core.getIPAddressFilter('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getDeviceInformation (Promise)', () => {
    return Camera.core.getDeviceInformation()
      .then(results => {
        const response = results.data.GetDeviceInformationResponse
        expect(response).toHaveProperty('FirmwareVersion')
        expect(response).toHaveProperty('HardwareId')
        expect(response).toHaveProperty('Manufacturer')
        expect(response).toHaveProperty('Model')
        expect(response).toHaveProperty('SerialNumber')
        console.log(results)
      })
  })

  test('Camera.core.getDeviceInformation (Callback)', (done) => {
    Camera.core.getDeviceInformation((error, results) => {
      if (!error) {
        const response = results.data.GetDeviceInformationResponse
        expect(response).toHaveProperty('FirmwareVersion')
        expect(response).toHaveProperty('HardwareId')
        expect(response).toHaveProperty('Manufacturer')
        expect(response).toHaveProperty('Model')
        expect(response).toHaveProperty('SerialNumber')
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getDeviceInformation (Promise|Invalid Callback)', () => {
    return Camera.core.getDeviceInformation('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getSystemUris (Promise)', () => {
    return Camera.core.getSystemUris()
      .then(results => {
        const response = results.data.GetSystemUrisResponse
        expect(response).toHaveProperty('SupportInfoUri')
        expect(response).toHaveProperty('SystemBackupUri')
        expect(response).toHaveProperty('SystemLogUris')
        const logUris = response.SystemLogUris
        expect(logUris).toHaveProperty('SystemLog')
        const log = logUris.SystemLog
        expect(log).toHaveProperty('Type')
        expect(log).toHaveProperty('Uri')
        console.log(results)
      })
  })

  test('Camera.core.getSystemUris (Callback)', (done) => {
    Camera.core.getSystemUris((error, results) => {
      if (!error) {
        const response = results.data.GetSystemUrisResponse
        expect(response).toHaveProperty('SupportInfoUri')
        expect(response).toHaveProperty('SystemBackupUri')
        expect(response).toHaveProperty('SystemLogUris')
        const logUris = response.SystemLogUris
        expect(logUris).toHaveProperty('SystemLog')
        const log = logUris.SystemLog
        expect(log).toHaveProperty('Type')
        expect(log).toHaveProperty('Uri')
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getSystemUris (Promise|Invalid Callback)', () => {
    return Camera.core.getSystemUris('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getSystemDateAndTime (Promise)', () => {
    return Camera.core.getSystemDateAndTime()
      .then(results => {
        const response = results.data.GetSystemDateAndTimeResponse
        expect(response).toHaveProperty('SystemDateAndTime')
        const sdt = response.SystemDateAndTime
        expect(sdt).toHaveProperty('DateTimeType')
        expect(sdt).toHaveProperty('DaylightSavings')
        expect(sdt).toHaveProperty('LocalDateTime')
        expect(sdt).toHaveProperty('TimeZone')
        expect(sdt).toHaveProperty('UTCDateTime')
        console.log(results)
      })
  })

  test('Camera.core.getSystemDateAndTime (Callback)', (done) => {
    Camera.core.getSystemDateAndTime((error, results) => {
      if (!error) {
        const response = results.data.GetSystemDateAndTimeResponse
        expect(response).toHaveProperty('SystemDateAndTime')
        const sdt = response.SystemDateAndTime
        expect(sdt).toHaveProperty('DateTimeType')
        expect(sdt).toHaveProperty('DaylightSavings')
        expect(sdt).toHaveProperty('LocalDateTime')
        expect(sdt).toHaveProperty('TimeZone')
        expect(sdt).toHaveProperty('UTCDateTime')
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getSystemDateAndTime (Promise|Invalid Callback)', () => {
    return Camera.core.getSystemDateAndTime('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getSystemLog (Promise)', () => {
    return Camera.core.getSystemLog('System')
      .then(results => {
        if (TestConfig.cameraType === 'axis') {
          expect(results).toHaveProperty('raw')
          expect(results.raw).toBeTruthy('raw')
        }
        else if (TestConfig.cameraType === 'hikvision') {
          const response = results.data.GetSystemLogResponse
          expect(response).toHaveProperty('SystemLog')
        }
        console.log(results)
      })
  })

  test('Camera.core.getSystemLog (Callback)', (done) => {
    Camera.core.getSystemLog('System', (error, results) => {
      if (!error) {
        if (TestConfig.cameraType === 'axis') {
          expect(results).toHaveProperty('raw')
          expect(results.raw).toBeTruthy('raw')
        }
        else if (TestConfig.cameraType === 'hikvision') {
          const response = results.data.GetSystemLogResponse
          expect(response).toHaveProperty('SystemLog')
        }
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getSystemLog (Promise|Invalid Callback)', () => {
    return Camera.core.getSystemLog('System', 'callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getSystemLog (Promise|Invalid Param1 (string))', () => {
    return Camera.core.getSystemLog(true)
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "string".')
      })
  })

  test('Camera.core.getSystemLog (Promise|Invalid Param1 (match))', () => {
    return Camera.core.getSystemLog('system')
      .catch(error => {
        expect(error.message).toContain('The value must be either "System" or "Access".')
      })
  })

  test('Camera.core.getSystemSupportInformation (Promise)', () => {
    return Camera.core.getSystemSupportInformation()
      .then(results => {
        if (TestConfig.cameraType === 'axis') {
          expect(results).toHaveProperty('raw')
          expect(results.raw).toBeTruthy('raw')
        }
        else if (TestConfig.cameraType === 'hikvision') {
          const response = results.data.GetSystemSupportInformationResponse
          expect(response).toHaveProperty('SupportInformation')
          const info = response.SupportInformation
          expect(info).toHaveProperty('String')
        }
        console.log(results)
      })
  })

  test('Camera.core.getSystemSupportInformation (Callback)', (done) => {
    Camera.core.getSystemSupportInformation((error, results) => {
      if (!error) {
        if (TestConfig.cameraType === 'axis') {
          expect(results).toHaveProperty('raw')
          expect(results.raw).toBeTruthy('raw')
        }
        else if (TestConfig.cameraType === 'hikvision') {
          const response = results.data.GetSystemSupportInformationResponse
          expect(response).toHaveProperty('SupportInformation')
          const info = response.SupportInformation
          expect(info).toHaveProperty('String')
        }
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getSystemSupportInformation (Promise|Invalid Callback)', () => {
    return Camera.core.getSystemSupportInformation('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getScopes (Promise)', () => {
    return Camera.core.getScopes()
      .then(results => {
        const response = results.data.GetScopesResponse
        expect(response).toHaveProperty('Scopes')
        const scopes = response.Scopes
        expect(scopes).toBeArray()
        console.log(results)
      })
  })

  test('Camera.core.getScopes (Callback)', (done) => {
    Camera.core.getScopes((error, results) => {
      if (!error) {
        const response = results.data.GetScopesResponse
        expect(response).toHaveProperty('Scopes')
        const scopes = response.Scopes
        expect(scopes).toBeArray()
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getScopes (Promise|Invalid Callback)', () => {
    return Camera.core.getScopes('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getDiscoveryMode (Promise)', () => {
    return Camera.core.getDiscoveryMode()
      .then(results => {
        const response = results.data.GetDiscoveryModeResponse
        expect(response).toHaveProperty('DiscoveryMode')
        console.log(results)
      })
  })

  test('Camera.core.getDiscoveryMode (Callback)', (done) => {
    Camera.core.getDiscoveryMode((error, results) => {
      if (!error) {
        const response = results.data.GetDiscoveryModeResponse
        expect(response).toHaveProperty('DiscoveryMode')
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getDiscoveryMode (Promise|Invalid Callback)', () => {
    return Camera.core.getDiscoveryMode('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getRemoteDiscoveryMode (Promise)', () => {
    return Camera.core.getRemoteDiscoveryMode()
      .then(results => {
        const response = results.data.GetRemoteDiscoveryModeResponse
        expect(response).toHaveProperty('RemoteDiscoveryMode')
        console.log(results)
      })
  })

  test('Camera.core.getRemoteDiscoveryMode (Callback)', (done) => {
    Camera.core.getRemoteDiscoveryMode((error, results) => {
      if (!error) {
        const response = results.data.GetRemoteDiscoveryModeResponse
        expect(response).toHaveProperty('RemoteDiscoveryMode')
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getRemoteDiscoveryMode (Promise|Invalid Callback)', () => {
    return Camera.core.getRemoteDiscoveryMode('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getDPAddresses (Promise)', () => {
    return Camera.core.getDPAddresses()
      .then(results => {
        const response = results.data.GetDPAddressesResponse
        expect(response).toHaveProperty('DPAddress')
        const address = response.DPAddress
        expect(address).toHaveProperty('IPv4Address')
        expect(address).toHaveProperty('Type')
        console.log(results)
      })
  })

  test('Camera.core.getDPAddresses (Callback)', (done) => {
    Camera.core.getDPAddresses((error, results) => {
      if (!error) {
        const response = results.data.GetDPAddressesResponse
        expect(response).toHaveProperty('DPAddress')
        const address = response.DPAddress
        expect(address).toHaveProperty('IPv4Address')
        expect(address).toHaveProperty('Type')
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getDPAddresses (Promise|Invalid Callback)', () => {
    return Camera.core.getDPAddresses('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getAccessPolicy (Promise)', () => {
    return Camera.core.getAccessPolicy()
      .then(results => {
        const response = results.data.GetAccessPolicyResponse
        expect(response).toHaveProperty('PolicyFile')
        const file = response.PolicyFile
        expect(file).toHaveProperty('Data')
        console.log(results)
      })
  })

  test('Camera.core.getAccessPolicy (Callback)', (done) => {
    Camera.core.getAccessPolicy((error, results) => {
      if (!error) {
        const response = results.data.GetAccessPolicyResponse
        expect(response).toHaveProperty('PolicyFile')
        const file = response.PolicyFile
        expect(file).toHaveProperty('Data')
        console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getAccessPolicy (Promise|Invalid Callback)', () => {
    return Camera.core.getAccessPolicy('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.core.getUsers (Promise)', () => {
    return Camera.core.getUsers()
      .then(results => {
        const response = results.data.GetUsersResponse
        expect(response).toHaveProperty('User')
        const user = response.User
        expect(user).toHaveProperty('UserLevel')
        expect(user).toHaveProperty('Username')
        // console.log(results)
      })
  })

  test('Camera.core.getUsers (Callback)', (done) => {
    Camera.core.getUsers((error, results) => {
      if (!error) {
        const response = results.data.GetUsersResponse
        expect(response).toHaveProperty('User')
        const user = response.User
        expect(user).toHaveProperty('UserLevel')
        expect(user).toHaveProperty('Username')
        // console.log(results)
      }
      done()
    })
  })

  test('Camera.core.getUsers (Promise|Invalid Callback)', () => {
    return Camera.core.getUsers('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })
})
