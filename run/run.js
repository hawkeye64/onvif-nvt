/* -------------------------------------------------
  NOTE: I use this code to interactively test with
  a real camera each new method as it is written.
  ------------------------------------------------- */

const saveXml = require('../lib/utils/save-xml')
// Uncomment to save XML Requests and Resonses
saveXml.setWritable(true)

// for Axis
// const address = '192.168.0.19'
// const port = 80
// const username = 'root'
// const password = 'root'

// for Hikvision (PTZ)
const address = '10.10.1.60'
const port = 80
const username = 'admin'
const password = '12345'

// for Hikvision (Fixed)
// const address = '10.10.1.65'
// const port = 80
// const username = 'admin'
// const password = '12345'

// for Pelco (PTZ)
// const address = '10.10.1.66'
// const port = 80
// const username = 'admin'
// const password = 'admin'

// for TrendNET (Fixed)
// const address = '10.10.1.67'
// const port = 80
// const username = 'admin'
// const password = 'admin'

// functional tests to run. Set to true to test the suite.
const runDiscovery = false
const runCore = true
const runPtz = true
const runMedia = true
const runSnapshot = false
const runReboot = false
const runBackup = false

const OnvifManager = require('../lib/onvif-nvt')

if (runDiscovery) {
  OnvifManager.add('discovery')
  OnvifManager.discovery.startProbe().then(deviceList => {
    console.log(deviceList)
  })
    .catch(error => {
      console.error(error)
    })
}

// variables using in functional testing below
let apiErrors = []
let ptzNodeToken = '' // retrieved from GetNodes
let ptzConfigurationToken = '' // retrieved from GetConfigurations
let presets = [] // retrieved from GetPresets
let presetToken = '' // retrieved from GetPresets
let testPresetName = 'testPreset'
let testPresetNameToken = ''
// let DynamicDNSType = ''
// let DynamicDNSName = ''
let interfaceToken = ''
let profileToken = ''

OnvifManager.connect(address, port, username, password)
  .then(results => {
    let camera = results
    // console.log('camera', camera)

    testCore(camera.core).then(() => {
      return testPtz(camera.ptz)
    }).then(() => {
      return testMedia(camera.media)
    }).then(() => {
      return testSnapshot(camera)
    }).then(() => {
      // this should be the last test (obviously)
      return testCoreSystemReboot(camera.core)
    }).then(() => {
      let count = apiErrors.length
      if (count) {
        console.error(`All tests ran, ${count} failed`)
        apiErrors.forEach(api => {
          console.error(`  - ${api}`)
        })
        console.error(' * See above for fault information')
        console.error(' * Just because an API errored, does not indicate an issue with the code.')
        console.error(' * Some cameras do not support various functions. This is expected.')
        console.error(' * It helps to know the capabilities of your specific camera.')
      }
      else {
        console.log('All tests ran successfully')
      }
    }).catch(error => {
      console.error(error)
    })
  })
  .catch(error => {
    console.error(error)
  })

// //testPtzGetCompatibleConfigurations(camera.ptz)

function testCore (core) {
  if (runCore) {
    return testCoreGetWsdlUrl(core).then(() => {
      return testCoreGetServices(core)
    }).then(() => {
      return testCoreGetServiceCapabilities(core)
    }).then(() => {
      return testCoreGetCapabilities(core)
    }).then(() => {
      return testCoreGetHostname(core)
    }).then(() => {
      return testCoreSetHostname(core)
    }).then(() => {
      return testCoreSetHostnameFromDHCP(core)
    }).then(() => {
      return testCoreGetDNS(core)
    }).then(() => {
      return testCoreSetDNS(core)
    }).then(() => {
      return testCoreGetNTP(core)
    }).then(() => {
      return testCoreSetNTP(core)
    }).then(() => {
      return testCoreGetDynamicDNS(core)
    // }).then(() => {
    //   return testCoreSetDynamicDNS(core)
    }).then(() => {
      return testCoreGetNetworkInterfaces(core)
    }).then(() => {
      return testCoreGetNetworkProtocols(core)
    }).then(() => {
      return testCoreGetNetworkDefaultGateway(core)
    }).then(() => {
      return testCoreGetZeroConfiguration(core)
    }).then(() => {
      return testCoreGetIPAddressFilter(core)
    }).then(() => {
      return testCoreGetDot11Capabilities(core)
    }).then(() => {
      return testCoreGetDot11Status(core)
    }).then(() => {
      return testCoreScanAvailableDot11Networks(core)
    }).then(() => {
      return testCoreGetDeviceInformation(core)
    }).then(() => {
      return testCoreGetSystemUris(core)
    }).then(() => {
      return testCoreGetSystemBackup(core)
    }).then(() => {
      return testCoreGetSystemDateAndTime(core)
    }).then(() => {
      return testCoreGetSystemLog(core)
    }).then(() => {
      return testCoreGetSystemSupportInformation(core)
    // }).then(() => {
    //   return testCoreSystemReboot(core)
    }).then(() => {
      return testCoreGetScopes(core)
    }).then(() => {
      return testCoreGetGeoLocation(core)
    }).then(() => {
      return testCoreGetDiscoveryMode(core)
    }).then(() => {
      return testCoreGetRemoteDiscoveryMode(core)
    }).then(() => {
      return testCoreGetDPAddresses(core)
    }).then(() => {
      return testCoreGetAccessPolicy(core)
    }).then(() => {
      return testCoreGetUsers(core)
    })
      .catch(error => {
        console.error(error)
      })
  }
  else {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
}

function testPtz (ptz) {
  if (ptz && runPtz) {
    return testPtzGetNodes(ptz).then(() => {
      return testPtzGetNode(ptz)
    }).then(() => {
      return testPtzGetNode(ptz)
    }).then(() => {
      return testPtzGetConfigurations(ptz)
    }).then(() => {
      testPtzGetCompatibleConfigurations(ptz)
    }).then(() => {
      return testPtzGetConfiguration(ptz)
    }).then(() => {
      return testPtzGetConfigurationOptions(ptz)
    }).then(() => {
      return testPtzGetStatus(ptz)
    }).then(() => {
      return testPtzGetPresets(ptz)
    }).then(() => {
      return testPtzSetPreset(ptz)
    }).then(() => {
      return testPtzGotoPreset(ptz)
    }).then(() => {
      return testPtzRemovePreset(ptz)
    }).then(() => {
      return testPtzGotoHomePosition(ptz)
    }).then(() => {
      return testPtzSetHomePosition(ptz)
    }).then(() => {
      return testPtzRelativeMove(ptz)
    }).then(() => {
      return testPtzAbsoluteMove(ptz)
    }).then(() => {
      return testPtzContinuousMove(ptz)
    })
      .catch(error => {
        console.error(error)
      })
  }
  else {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
}

function testMedia (media) {
  if (media && runMedia) {
    return testMediaGetProfiles(media).then((results) => {
      return testMediaGetProfile(media)
    }).then(() => {
      return testMediaGetVideoSources(media)
    }).then(() => {
      return testMediaGetVideoSourceConfigurations(media)
    }).then(() => {
      return testMediaGetVideoEncoderConfigurations(media)
    }).then(() => {
      return testMediaGetAudioSources(media)
    }).then(() => {
      return testMediaGetAudioSourceConfigurations(media)
    }).then(() => {
      return testMediaGetAudioEncoderConfigurations(media)
    }).then(() => {
      return testMediaGetVideoAnalyticsConfigurations(media)
    }).then(() => {
      return testMediaGetMetadataConfigurations(media)
    }).then(() => {
      return testMediaGetAudioOutputs(media)
    }).then(() => {
      return testMediaGetAudioOutputConfigurations(media)
    }).then(() => {
      return testMediaGetAudioDecoderConfigurations(media)
    }).then(() => {
      return testMediaGetStreamUri(media)
    }).then(() => {
      return testMediaGetSnapshotUri(media)
    })
      .catch(error => {
        console.error(error)
      })
  }
  else {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
}

function testSnapshot (camera) {
  if (runSnapshot) {
    return testGetSnapshot(camera)
  }
  else {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
}

/* -------------------------------------------------
    NOTE: All functional test should resolve(error)
    instead of calling reject(error)
    ------------------------------------------------- */

function testCoreGetWsdlUrl (core) {
  return new Promise((resolve, reject) => {
    core.getWsdlUrl()
      .then(results => {
        console.log('GetWsdlUrl successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetWsdlUrl')
        console.error('GetWsdlUrl failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetServices (core) {
  return new Promise((resolve, reject) => {
    core.getServices(true)
      .then(results => {
        console.log('GetServices successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetServices')
        console.error('GetServices failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetServiceCapabilities (core) {
  return new Promise((resolve, reject) => {
    core.getServiceCapabilities()
      .then(results => {
        console.log('GetServiceCapabilities successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetServiceCapabilities')
        console.error('GetServiceCapabilities failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetCapabilities (core) {
  return new Promise((resolve, reject) => {
    core.getCapabilities()
      .then(results => {
        console.log('GetCapabilities successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetCapabilities')
        console.error('GetCapabilities failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetHostname (core) {
  return new Promise((resolve, reject) => {
    core.getHostname()
      .then(results => {
        console.log('GetHostname successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetHostname')
        console.error('GetHostname failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreSetHostname (core) {
  return new Promise((resolve, reject) => {
    core.setHostname('localhost')
      .then(results => {
        console.log('SetHostname successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('SetHostname')
        console.error('SetHostname failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreSetHostnameFromDHCP (core) {
  return new Promise((resolve, reject) => {
    core.setHostnameFromDHCP(true)
      .then(results => {
        console.log('SetHostnameFromDHCP successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('SetHostnameFromDHCP')
        console.error('SetHostnameFromDHCP failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetDNS (core) {
  return new Promise((resolve, reject) => {
    core.getDNS()
      .then(results => {
        console.log('GetDNS successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetDNS')
        console.error('GetDNS failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreSetDNS (core) {
  return new Promise((resolve, reject) => {
    core.setDNS(true)
      .then(results => {
        console.log('SetDNS successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('SetDNS')
        console.error('SetDNS failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetNTP (core) {
  return new Promise((resolve, reject) => {
    core.getNTP()
      .then(results => {
        console.log('GetNTP successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetNTP')
        console.error('GetNTP failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreSetNTP (core) {
  return new Promise((resolve, reject) => {
    core.setNTP(true)
      .then(results => {
        console.log('SetNTP successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('SetNTP')
        console.error('SetNTP failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetDynamicDNS (core) {
  return new Promise((resolve, reject) => {
    core.getDynamicDNS()
      .then(results => {
        console.log('GetDynamicDNS successful')
        try {
          // DynamicDNSType = results.data.GetDynamicDNSResponse.DynamicDNSInformation.Type
          // DynamicDNSName = results.data.GetDynamicDNSResponse.DynamicDNSInformation.Type
        }
        catch (e) {}
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetDynamicDNS')
        console.error('GetDynamicDNS failed')
        console.error(error)
        resolve(error)
      })
  })
}

// function testCoreSetDynamicDNS (core) {
//   return new Promise((resolve, reject) => {
//     if (String(DynamicDNSType).length === 0) {
//       DynamicDNSType = 'ClientUpdates'
//     }
//     core.setDynamicDNS(DynamicDNSType, DynamicDNSName)
//       .then(results => {
//         console.log('SetDynamicDNS successful')
//         resolve(results)
//       })
//       .catch(error => {
//         apiErrors.push('SetDynamicDNS')
//         console.error('SetDynamicDNS failed')
//         console.error(error)
//         resolve(error)
//       })
//   })
// }

function testCoreGetNetworkInterfaces (core) {
  return new Promise((resolve, reject) => {
    core.getNetworkInterfaces()
      .then(results => {
        console.log('GetNetworkInterfaces successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetNetworkInterfaces')
        console.error('GetNetworkInterfaces failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetNetworkProtocols (core) {
  return new Promise((resolve, reject) => {
    core.getNetworkProtocols()
      .then(results => {
        console.log('GetNetworkProtocols successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetNetworkProtocols')
        console.error('GetNetworkProtocols failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetNetworkDefaultGateway (core) {
  return new Promise((resolve, reject) => {
    core.getNetworkDefaultGateway()
      .then(results => {
        console.log('GetNetworkDefaultGateway successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetNetworkDefaultGateway')
        console.error('GetNetworkDefaultGateway failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetZeroConfiguration (core) {
  return new Promise((resolve, reject) => {
    core.getZeroConfiguration()
      .then(results => {
        console.log('GetZeroConfiguration successful')
        try {
          interfaceToken = results.data.GetZeroConfigurationResponse.ZeroConfiguration.InterfaceToken
        }
        catch (e) {}
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetZeroConfiguration')
        console.error('GetZeroConfiguration failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetIPAddressFilter (core) {
  return new Promise((resolve, reject) => {
    core.getIPAddressFilter()
      .then(results => {
        console.log('GetIPAddressFilter successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetIPAddressFilter')
        console.error('GetIPAddressFilter failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetDot11Capabilities (core) {
  return new Promise((resolve, reject) => {
    core.getDot11Capabilities()
      .then(results => {
        console.log('GetDot11Capabilities successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetDot11Capabilities')
        console.error('GetDot11Capabilities failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetDot11Status (core) {
  return new Promise((resolve, reject) => {
    core.getDot11Status(interfaceToken)
      .then(results => {
        console.log('GetDot11Status successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetDot11Status')
        console.error('GetDot11Status failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreScanAvailableDot11Networks (core) {
  return new Promise((resolve, reject) => {
    core.scanAvailableDot11Networks(interfaceToken)
      .then(results => {
        console.log('ScanAvailableDot11Networks successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('ScanAvailableDot11Networks')
        console.error('ScanAvailableDot11Networks failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetDeviceInformation (core) {
  return new Promise((resolve, reject) => {
    core.getDeviceInformation()
      .then(results => {
        console.log('GetDeviceInformation successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetDeviceInformation')
        console.error('GetDeviceInformation failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetSystemUris (core) {
  return new Promise((resolve, reject) => {
    core.getSystemUris()
      .then(results => {
        console.log('GetSystemUris successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetSystemUris')
        console.error('GetSystemUris failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetSystemBackup (core) {
  return new Promise((resolve, reject) => {
    if (runBackup) {
      core.getSystemBackup()
        .then(results => {
          console.log('GetSystemBackup successful')
          resolve(results)
        })
        .catch(error => {
          apiErrors.push('GetSystemBackup')
          console.error('GetSystemBackup failed')
          console.error(error)
          resolve(error)
        })
    }
    else {
      resolve()
    }
  })
}

function testCoreGetSystemDateAndTime (core) {
  return new Promise((resolve, reject) => {
    core.getSystemDateAndTime()
      .then(results => {
        console.log('GetSystemDateAndTime successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetSystemDateAndTime')
        console.error('GetSystemDateAndTime failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetSystemLog (core) {
  return new Promise((resolve, reject) => {
    core.getSystemLog('System')
      .then(results => {
        console.log('GetSystemLog successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetSystemLog')
        console.error('GetSystemLog failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetSystemSupportInformation (core) {
  return new Promise((resolve, reject) => {
    core.getSystemSupportInformation()
      .then(results => {
        console.log('GetSystemSupportInformation successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetSystemSupportInformation')
        console.error('GetSystemSupportInformation failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreSystemReboot (core) {
  return new Promise((resolve, reject) => {
    if (runReboot) {
      core.systemReboot()
        .then(results => {
          console.log('Reboot successful')
          resolve(results)
        })
        .catch(error => {
          apiErrors.push('Reboot')
          console.error('Reboot failed')
          console.error(error)
          resolve(error)
        })
    }
    else {
      resolve()
    }
  })
}

function testCoreGetScopes (core) {
  return new Promise((resolve, reject) => {
    core.getScopes()
      .then(results => {
        console.log('GetScopes successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetScopes')
        console.error('GetScopes failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetGeoLocation (core) {
  return new Promise((resolve, reject) => {
    core.getGeoLocation()
      .then(results => {
        console.log('GetGeoLocation successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetGeoLocation')
        console.error('GetGeoLocation failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetDiscoveryMode (core) {
  return new Promise((resolve, reject) => {
    core.getDiscoveryMode()
      .then(results => {
        console.log('GetDiscoveryMode successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetDiscoveryMode')
        console.error('GetDiscoveryMode failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetRemoteDiscoveryMode (core) {
  return new Promise((resolve, reject) => {
    core.getRemoteDiscoveryMode()
      .then(results => {
        console.log('GetRemoteDiscoveryMode successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetRemoteDiscoveryMode')
        console.error('GetRemoteDiscoveryMode failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetDPAddresses (core) {
  return new Promise((resolve, reject) => {
    core.getDPAddresses()
      .then(results => {
        console.log('GetDPAddresses successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetDPAddresses')
        console.error('GetDPAddresses failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetAccessPolicy (core) {
  return new Promise((resolve, reject) => {
    core.getAccessPolicy()
      .then(results => {
        console.log('GetAccessPolicy successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetAccessPolicy')
        console.error('GetAccessPolicy failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testCoreGetUsers (core) {
  return new Promise((resolve, reject) => {
    core.getUsers()
      .then(results => {
        console.log('GetUsers successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetUsers')
        console.error('GetUsers failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzGetNodes (ptz) {
  return new Promise((resolve, reject) => {
    ptz.getNodes()
      .then(results => {
        console.log('GetNodes successful')
        ptzNodeToken = results['data']['GetNodesResponse']['PTZNode']['$']['token']
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetNodes')
        console.error('GetNodes failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzGetNode (ptz) {
  return new Promise((resolve, reject) => {
    ptz.getNode(ptzNodeToken)
      .then(results => {
        console.log('GetNode successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetNode')
        console.error('GetNode failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzGetConfigurations (ptz) {
  return new Promise((resolve, reject) => {
    ptz.getConfigurations()
      .then(results => {
        console.log('GetConfigurations successful')
        ptzConfigurationToken = results['data']['GetConfigurationsResponse']['PTZConfiguration']['$']['token']
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetConfigurations')
        console.error('GetConfigurations failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzGetConfiguration (ptz) {
  return new Promise((resolve, reject) => {
    ptz.getConfiguration(ptzConfigurationToken)
      .then(results => {
        console.log('GetConfiguration successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetConfiguration')
        console.error('GetConfiguration failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzGetConfigurationOptions (ptz) {
  return new Promise((resolve, reject) => {
    ptz.getConfigurationOptions(ptzConfigurationToken)
      .then(results => {
        console.log('GetConfigurationOptions successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetConfigurationOptions')
        console.error('GetConfigurationOptions failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzGetCompatibleConfigurations (ptz) {
  return new Promise((resolve, reject) => {
    ptz.getCompatibleConfigurations()
      .then(results => {
        console.log('GetCompatibleConfigurations successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetCompatibleConfigurations')
        console.error('GetCompatibleConfigurations failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzGetStatus (ptz) {
  return new Promise((resolve, reject) => {
    ptz.getStatus()
      .then(results => {
        console.log('GetStatus successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetStatus')
        console.error('GetStatus failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzContinuousMove (ptz) {
  return new Promise((resolve, reject) => {
    let velocity = {
      x: 1,
      y: 0
    }
    ptz.continuousMove(null, velocity)
      .then(results => {
        console.log('ContinuousMove successful')
        // stop the camera after 5 seconds
        setTimeout(() => {
          ptz.stop()
            .then(results => {
              console.log('Stop successful')
              resolve(results)
            })
            .catch(error => {
              apiErrors.push('Stop')
              console.error('Stop failed')
              console.error(error)
              resolve(error)
            })
        }, 5000)
      })
      .catch(error => {
        apiErrors.push('ContinuousMove')
        console.error('ContinuousMove failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzRelativeMove (ptz) {
  return new Promise((resolve, reject) => {
    let translation = {
      x: 0.1,
      y: 0.3,
      z: 0
    }
    ptz.relativeMove(null, translation)
      .then(results => {
        console.log('RelativeMove successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('RelativeMove')
        console.error('RelativeMove failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzAbsoluteMove (ptz) {
  return new Promise((resolve, reject) => {
    let position = {
      x: 0.1,
      y: 0.3,
      z: 0
    }
    ptz.absoluteMove(null, position)
      .then(results => {
        console.log('AbsoluteMove successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('AbsoluteMove')
        console.error('AbsoluteMove failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzGetPresets (ptz) {
  return new Promise((resolve, reject) => {
    ptz.getPresets()
      .then(results => {
        console.log('GetPresets successful')
        presets = results['data']['GetPresetsResponse']['Preset']
        // verify presets not empty
        if (presets.length > 0) {
        // get the first preset and save it for gotoPreset
          let preset = presets[0]
          if (preset) {
            presetToken = preset['$']['token']
          }
          // verify the test preset doesn't exist
          presets.forEach(preset => {
            if (testPresetName === preset.Name) {
            // it does (maybe we stopped debugger in
            // deveopment, or crashed, whatever, deal with it now)
              testPresetNameToken = preset.$.token
            }
          })
        }
        if (testPresetNameToken.length > 0) {
          ptz.removePreset(null, testPresetNameToken)
            .then(() => {
              testPresetNameToken = ''
              resolve(results)
            })
            .catch(() => {
            // don't care if there was an error here, not testing this functionality
              resolve(results)
            })
        }
        else {
          resolve(results)
        }
      })
      .catch(error => {
        apiErrors.push('GetPresets')
        console.error('GetPresets failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzGotoPreset (ptz) {
  return new Promise((resolve, reject) => {
    if (testPresetNameToken.length > 0) {
      ptz.gotoPreset(null, presetToken)
        .then(results => {
          console.log('GotoPreset successful')
          resolve(results)
        })
        .catch(error => {
          apiErrors.push('GotoPreset')
          console.error('GotoPreset failed')
          console.error(error)
          resolve(error)
        })
    }
    else {
      console.log('GotoPreset had notiing to do')
      resolve()
    }
  })
}

function testPtzSetPreset (ptz) {
  return new Promise((resolve, reject) => {
    if (testPresetNameToken.length === 0) {
      ptz.setPreset(null, null, testPresetName)
        .then(results => {
          console.log('SetPreset successful')
          // get token for the preset that was just added
          testPresetNameToken = results['data']['SetPresetResponse']['PresetToken']
          resolve(results)
        })
        .catch(error => {
          apiErrors.push('SetPreset')
          console.error('SetPreset failed')
          console.error(error)
          resolve(error)
        })
    }
    else {
      console.log('SetPreset had nothing to do')
      resolve()
    }
  })
}

function testPtzRemovePreset (ptz) {
  return new Promise((resolve, reject) => {
    if (testPresetNameToken.length > 0) {
      ptz.removePreset(null, testPresetNameToken)
        .then(results => {
          testPresetNameToken.length = ''
          console.log('RemovePreset successful')
          resolve(results)
        })
        .catch(error => {
          apiErrors.push('RemovePreset')
          console.error('RemovePreset failed')
          console.error(error)
          resolve(error)
        })
    }
    else {
      console.log('RemovePreset had nothing to do')
      resolve()
    }
  })
}

function testPtzGotoHomePosition (ptz) {
  return new Promise((resolve, reject) => {
    ptz.gotoHomePosition(null)
      .then(results => {
        console.log('GotoHomePosition successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GotoHomePosition')
        console.error('GotoHomePosition failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testPtzSetHomePosition (ptz) {
  return new Promise((resolve, reject) => {
    ptz.setHomePosition(null)
      .then(results => {
        console.log('SetHomePosition successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('SetHomePosition')
        console.error('SetHomePosition failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetProfiles (media) {
  return new Promise((resolve, reject) => {
    media.getProfiles()
      .then(results => {
        let response = results.data.GetProfilesResponse
        let profiles = response.Profiles
        if (profiles.length > 0) {
          let profile = profiles[0]
          profileToken = profile['$']['token']
        }
        console.log('GetProfiles successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetProfiles')
        console.error('GetProfiles failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetProfile (media) {
  return new Promise((resolve, reject) => {
    media.getProfile(profileToken)
      .then(results => {
        console.log('GetProfile successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetProfile')
        console.error('GetProfile failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetVideoSources (media) {
  return new Promise((resolve, reject) => {
    media.getVideoSources()
      .then(results => {
        console.log('GetVideoSources successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetVideoSources')
        console.error('GetVideoSources failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetVideoSourceConfigurations (media) {
  return new Promise((resolve, reject) => {
    media.getVideoSourceConfigurations()
      .then(results => {
        console.log('GetVideoSourceConfigurations successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetVideoSourceConfigurations')
        console.error('GetVideoSourceConfigurations failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetVideoEncoderConfigurations (media) {
  return new Promise((resolve, reject) => {
    media.getVideoEncoderConfigurations()
      .then(results => {
        console.log('GetVideoEncoderConfigurations successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetVideoEncoderConfigurations')
        console.error('GetVideoEncoderConfigurations failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetAudioSources (media) {
  return new Promise((resolve, reject) => {
    media.getAudioSources()
      .then(results => {
        console.log('GetAudioSources successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetAudioSources')
        console.error('GetAudioSources failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetAudioSourceConfigurations (media) {
  return new Promise((resolve, reject) => {
    media.getAudioSourceConfigurations()
      .then(results => {
        console.log('GetAudioSourceConfigurations successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetAudioSourceConfigurations')
        console.error('GetAudioSourceConfigurations failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetAudioEncoderConfigurations (media) {
  return new Promise((resolve, reject) => {
    media.getAudioSourceConfigurations()
      .then(results => {
        console.log('GetAudioEncoderConfigurations successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetAudioEncoderConfigurations')
        console.error('GetAudioEncoderConfigurations failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetVideoAnalyticsConfigurations (media) {
  return new Promise((resolve, reject) => {
    media.getVideoAnalyticsConfigurations()
      .then(results => {
        console.log('GetVideoAnalyticsConfigurations successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetVideoAnalyticsConfigurations')
        console.error('GetVideoAnalyticsConfigurations failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetMetadataConfigurations (media) {
  return new Promise((resolve, reject) => {
    media.getMetadataConfigurations()
      .then(results => {
        console.log('GetMetadataConfigurations successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetMetadataConfigurations')
        console.error('GetMetadataConfigurations failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetAudioOutputs (media) {
  return new Promise((resolve, reject) => {
    media.getAudioOutputs()
      .then(results => {
        console.log('GetAudioOutputs successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetAudioOutputs')
        console.error('GetAudioOutputs failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetAudioOutputConfigurations (media) {
  return new Promise((resolve, reject) => {
    media.getAudioOutputConfigurations()
      .then(results => {
        console.log('GetAudioOutputConfigurations successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetAudioOutputConfigurations')
        console.error('getSGetAudioOutputConfigurationsnapshot failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetAudioDecoderConfigurations (media) {
  return new Promise((resolve, reject) => {
    media.getAudioDecoderConfigurations()
      .then(results => {
        console.log('GetAudioDecoderConfigurations successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetAudioDecoderConfigurations')
        console.error('GetAudioDecoderConfigurations failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetStreamUri (media) {
  return new Promise((resolve, reject) => {
    media.getStreamUri('RTP-Unicast', 'HTTP', profileToken)
      .then(results => {
        console.log('GetStreamUri successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetStreamUri')
        console.error('GetStreamUri failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testMediaGetSnapshotUri (media) {
  return new Promise((resolve, reject) => {
    media.getSnapshotUri(profileToken)
      .then(results => {
        console.log('GetSnapshotUri successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetSnapshotUri')
        console.error('GetSnapshotUri failed')
        console.error(error)
        resolve(error)
      })
  })
}

function testGetSnapshot (camera) {
  return new Promise((resolve, reject) => {
    camera.add('snapshot')
    camera.snapshot.getSnapshot()
      .then(results => {
        console.log('GetSnapshot successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('GetSnapshot')
        console.error('GetSnapshot failed')
        console.error(error)
        resolve(error)
      })
  })
}
