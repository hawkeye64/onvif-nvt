/*-------------------------------------------------
  NOTE: I use this code to interactively test with
  a real camera each new method as it is written.
  -------------------------------------------------*/

const saveXml = require('../lib/utils/save-xml')

// Uncomment to save XML Requests and Resonses
// saveXml.setWritable(true)

// for Axis
const address = '192.168.0.19'
const port = 80
const username = 'root'
const password = 'root'

// for Hikvision (PTZ)
// const address = '10.10.1.60'
// const port = 80
// const username = 'admin'
// const password = '12345'

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
const runCore = false
const runPtz = false
const runSnapshot = true

const OnvifManager = require('../lib/onvif-nvt')

if (runDiscovery) {
  OnvifManager.add('discovery')
  OnvifManager.discovery.startProbe().then(deviceList => {
    console.log(deviceList)
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

OnvifManager.connect(address, port, username, password)
  .then(results => {
    let camera = results
    // console.log('camera', camera)

      testCore(camera.core).then(() => {
        return testPtz(camera.ptz)
      }).then(() => {
        return testSnapshot(camera)
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

    // testCoreReboot(camera.core)
    // //testPtzGetCompatibleConfigurations(camera.ptz)
    // return testCoreReboot(camera.core)


  function testCore (core) {
    if (runCore) {
      return testCoreGetWsdlUrl(core).then(() => {
      }).then(() => {
        return testCoreGetServices(core)
      }).then(() => {
        return testCoreGetServiceCapabilities(core)
      }).then(() => {
        return testCoreGetCapabilities(core)
      }).then(() => {
        return testCoreGetHostname(core)
      })
    }
    else {
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
  
  function testPtz (ptz) {
    if (runPtz) {
      return testPtzGetNodes(ptz).then(() => {
        return testPtzGetNode(ptz)
      }).then(() => {
        return testPtzGetNode(ptz)
      }).then(() => {
        return testPtzGetConfigurations(ptz)
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
  
  /*-------------------------------------------------
    NOTE: All functional test should resolve(error)
    instead of calling reject(error)
    -------------------------------------------------*/
  function testCoreReboot (core) {
  return new Promise((resolve, reject) => {
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
  })
}

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
      presets  = results['data']['GetPresetsResponse']['Preset']
      // verify presets not empty
      if (presets.length > 0) {
        // get the first preset and save it for gotoPreset
        preset = presets[0]
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

function testGetSnapshot (camera) {
  return new Promise((resolve, reject) => {
    camera.add('snapshot')
    camera.snapshot.getSnapshot()
      .then(results => {
        console.log('getSnapshot successful')
        resolve(results)
      })
      .catch(error => {
        apiErrors.push('getSnapshot')
        console.error('getSnapshot failed')
          resolve(error)
      })
  })
}