const Config = require('./config')

class runCore {
  constructor () {
    this.OnvifManager = require('../lib/onvif-nvt')
    this.apiErrors = []
    this.camera = null

    this.interfaceToken = ''
  }

  run () {
    return new Promise((resolve, reject) => {
      if (!Config.runCore) {
        resolve([])
        return
      }
      this.OnvifManager.connect(Config.address, Config.port, Config.username, Config.password)
        .then(results => {
          this.camera = results

          // let the tests begin
          return this.GetWsdlUrl().then(() => {
            return this.GetServices()
          }).then(() => {
            return this.GetServiceCapabilities()
          }).then(() => {
            return this.GetCapabilities()
          }).then(() => {
            return this.GetHostname()
          }).then(() => {
            return this.SetHostname()
          }).then(() => {
            return this.SetHostnameFromDHCP()
          }).then(() => {
            return this.GetDNS()
          }).then(() => {
            return this.SetDNS()
          }).then(() => {
            return this.GetNTP()
          }).then(() => {
            return this.SetNTP()
          }).then(() => {
            return this.GetDynamicDNS()
          // }).then(() => {
          //   return this.SetDynamicDNS()
          }).then(() => {
            return this.GetNetworkInterfaces()
          }).then(() => {
            return this.GetNetworkProtocols()
          }).then(() => {
            return this.GetNetworkDefaultGateway()
          }).then(() => {
            return this.GetZeroConfiguration()
          }).then(() => {
            return this.GetIPAddressFilter()
          }).then(() => {
            return this.GetDot11Capabilities()
          }).then(() => {
            return this.GetDot11Status()
          }).then(() => {
            return this.ScanAvailableDot11Networks()
          }).then(() => {
            return this.GetDeviceInformation()
          }).then(() => {
            return this.GetSystemUris()
          }).then(() => {
            return this.GetSystemBackup()
          }).then(() => {
            return this.GetSystemDateAndTime()
          }).then(() => {
            return this.GetSystemLog()
          }).then(() => {
            return this.GetSystemSupportInformation()
          // }).then(() => {
          //   return this.SystemReboot()
          }).then(() => {
            return this.GetScopes()
          }).then(() => {
            return this.GetGeoLocation()
          }).then(() => {
            return this.GetDiscoveryMode()
          }).then(() => {
            return this.GetRemoteDiscoveryMode()
          }).then(() => {
            return this.GetDPAddresses()
          }).then(() => {
            return this.GetAccessPolicy()
          }).then(() => {
            return this.GetUsers()
          }).then(() => {
            resolve(this.apiErrors)
          })
        })
        .catch(error => {
            console.error(error)
        })
    })
  } // run()

/* -------------------------------------------------
    NOTE: All functional test should resolve(error)
    instead of calling reject(error)
   ------------------------------------------------- */

   GetWsdlUrl () {
    return new Promise((resolve, reject) => {
      this.camera.core.getWsdlUrl()
        .then(results => {
          console.log('GetWsdlUrl successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetWsdlUrl')
          console.error('GetWsdlUrl failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetServices () {
    return new Promise((resolve, reject) => {
      this.camera.core.getServices(true)
        .then(results => {
          console.log('GetServices successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetServices')
          console.error('GetServices failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetServiceCapabilities () {
    return new Promise((resolve, reject) => {
      this.camera.core.getServiceCapabilities()
        .then(results => {
          console.log('GetServiceCapabilities successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetServiceCapabilities')
          console.error('GetServiceCapabilities failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetCapabilities () {
    return new Promise((resolve, reject) => {
      this.camera.core.getCapabilities()
        .then(results => {
          console.log('GetCapabilities successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCapabilities')
          console.error('GetCapabilities failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetHostname () {
    return new Promise((resolve, reject) => {
      this.camera.core.getHostname()
        .then(results => {
          console.log('GetHostname successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetHostname')
          console.error('GetHostname failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  SetHostname () {
    return new Promise((resolve, reject) => {
      this.camera.core.setHostname('localhost')
        .then(results => {
          console.log('SetHostname successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetHostname')
          console.error('SetHostname failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  SetHostnameFromDHCP () {
    return new Promise((resolve, reject) => {
      this.camera.core.setHostnameFromDHCP(true)
        .then(results => {
          console.log('SetHostnameFromDHCP successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetHostnameFromDHCP')
          console.error('SetHostnameFromDHCP failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetDNS () {
    return new Promise((resolve, reject) => {
      this.camera.core.getDNS()
        .then(results => {
          console.log('GetDNS successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetDNS')
          console.error('GetDNS failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  SetDNS () {
    return new Promise((resolve, reject) => {
      this.camera.core.setDNS(true)
        .then(results => {
          console.log('SetDNS successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetDNS')
          console.error('SetDNS failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetNTP () {
    return new Promise((resolve, reject) => {
      this.camera.core.getNTP()
        .then(results => {
          console.log('GetNTP successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetNTP')
          console.error('GetNTP failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  SetNTP () {
    return new Promise((resolve, reject) => {
      this.camera.core.setNTP(true)
        .then(results => {
          console.log('SetNTP successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetNTP')
          console.error('SetNTP failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetDynamicDNS () {
    return new Promise((resolve, reject) => {
      this.camera.core.getDynamicDNS()
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
          this.apiErrors.push('GetDynamicDNS')
          console.error('GetDynamicDNS failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  // SetDynamicDNS () {
  //   return new Promise((resolve, reject) => {
  //     if (String(DynamicDNSType).length === 0) {
  //       DynamicDNSType = 'ClientUpdates'
  //     }
  //     this.camera.core.setDynamicDNS(DynamicDNSType, DynamicDNSName)
  //       .then(results => {
  //         console.log('SetDynamicDNS successful')
  //         resolve(results)
  //       })
  //       .catch(error => {
  //         this.apiErrors.push('SetDynamicDNS')
  //         console.error('SetDynamicDNS failed')
  //         console.error(error.message)
  //         console.error(error.fault)
  //         resolve(error)
  //       })
  //   })
  // }
  
  GetNetworkInterfaces () {
    return new Promise((resolve, reject) => {
      this.camera.core.getNetworkInterfaces()
        .then(results => {
          console.log('GetNetworkInterfaces successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetNetworkInterfaces')
          console.error('GetNetworkInterfaces failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetNetworkProtocols () {
    return new Promise((resolve, reject) => {
      this.camera.core.getNetworkProtocols()
        .then(results => {
          console.log('GetNetworkProtocols successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetNetworkProtocols')
          console.error('GetNetworkProtocols failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetNetworkDefaultGateway () {
    return new Promise((resolve, reject) => {
      this.camera.core.getNetworkDefaultGateway()
        .then(results => {
          console.log('GetNetworkDefaultGateway successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetNetworkDefaultGateway')
          console.error('GetNetworkDefaultGateway failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetZeroConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.core.getZeroConfiguration()
        .then(results => {
          console.log('GetZeroConfiguration successful')
          try {
            this.interfaceToken = results.data.GetZeroConfigurationResponse.ZeroConfiguration.InterfaceToken
          }
          catch (e) {}
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetZeroConfiguration')
          console.error('GetZeroConfiguration failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetIPAddressFilter () {
    return new Promise((resolve, reject) => {
      this.camera.core.getIPAddressFilter()
        .then(results => {
          console.log('GetIPAddressFilter successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetIPAddressFilter')
          console.error('GetIPAddressFilter failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetDot11Capabilities () {
    return new Promise((resolve, reject) => {
      this.camera.core.getDot11Capabilities()
        .then(results => {
          console.log('GetDot11Capabilities successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetDot11Capabilities')
          console.error('GetDot11Capabilities failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetDot11Status () {
    return new Promise((resolve, reject) => {
      this.camera.core.getDot11Status(this.interfaceToken)
        .then(results => {
          console.log('GetDot11Status successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetDot11Status')
          console.error('GetDot11Status failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  ScanAvailableDot11Networks () {
    return new Promise((resolve, reject) => {
      this.camera.core.scanAvailableDot11Networks(this.interfaceToken)
        .then(results => {
          console.log('ScanAvailableDot11Networks successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('ScanAvailableDot11Networks')
          console.error('ScanAvailableDot11Networks failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetDeviceInformation () {
    return new Promise((resolve, reject) => {
      this.camera.core.getDeviceInformation()
        .then(results => {
          console.log('GetDeviceInformation successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetDeviceInformation')
          console.error('GetDeviceInformation failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetSystemUris () {
    return new Promise((resolve, reject) => {
      this.camera.core.getSystemUris()
        .then(results => {
          console.log('GetSystemUris successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetSystemUris')
          console.error('GetSystemUris failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetSystemBackup () {
    return new Promise((resolve, reject) => {
      if (Config.runBackup) {
        this.camera.core.getSystemBackup()
          .then(results => {
            console.log('GetSystemBackup successful')
            resolve(results)
          })
          .catch(error => {
            this.apiErrors.push('GetSystemBackup')
            console.error('GetSystemBackup failed')
            console.error(error.message)
            console.error(error.fault)
            resolve(error)
          })
      }
      else {
        resolve()
      }
    })
  }
  
  GetSystemDateAndTime () {
    return new Promise((resolve, reject) => {
      this.camera.core.getSystemDateAndTime()
        .then(results => {
          console.log('GetSystemDateAndTime successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetSystemDateAndTime')
          console.error('GetSystemDateAndTime failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetSystemLog () {
    return new Promise((resolve, reject) => {
      this.camera.core.getSystemLog('System')
        .then(results => {
          console.log('GetSystemLog successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetSystemLog')
          console.error('GetSystemLog failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetSystemSupportInformation () {
    return new Promise((resolve, reject) => {
      this.camera.core.getSystemSupportInformation()
        .then(results => {
          console.log('GetSystemSupportInformation successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetSystemSupportInformation')
          console.error('GetSystemSupportInformation failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  SystemReboot () {
    return new Promise((resolve, reject) => {
      if (runReboot) {
        this.camera.core.systemReboot()
          .then(results => {
            console.log('Reboot successful')
            resolve(results)
          })
          .catch(error => {
            this.apiErrors.push('Reboot')
            console.error('Reboot failed')
            console.error(error.message)
            console.error(error.fault)
            resolve(error)
          })
      }
      else {
        resolve()
      }
    })
  }
  
  GetScopes () {
    return new Promise((resolve, reject) => {
      this.camera.core.getScopes()
        .then(results => {
          console.log('GetScopes successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetScopes')
          console.error('GetScopes failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetGeoLocation () {
    return new Promise((resolve, reject) => {
      this.camera.core.getGeoLocation()
        .then(results => {
          console.log('GetGeoLocation successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetGeoLocation')
          console.error('GetGeoLocation failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetDiscoveryMode () {
    return new Promise((resolve, reject) => {
      this.camera.core.getDiscoveryMode()
        .then(results => {
          console.log('GetDiscoveryMode successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetDiscoveryMode')
          console.error('GetDiscoveryMode failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetRemoteDiscoveryMode () {
    return new Promise((resolve, reject) => {
      this.camera.core.getRemoteDiscoveryMode()
        .then(results => {
          console.log('GetRemoteDiscoveryMode successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetRemoteDiscoveryMode')
          console.error('GetRemoteDiscoveryMode failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetDPAddresses () {
    return new Promise((resolve, reject) => {
      this.camera.core.getDPAddresses()
        .then(results => {
          console.log('GetDPAddresses successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetDPAddresses')
          console.error('GetDPAddresses failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetAccessPolicy () {
    return new Promise((resolve, reject) => {
      this.camera.core.getAccessPolicy()
        .then(results => {
          console.log('GetAccessPolicy successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetAccessPolicy')
          console.error('GetAccessPolicy failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
  
  GetUsers () {
    return new Promise((resolve, reject) => {
      this.camera.core.getUsers()
        .then(results => {
          console.log('GetUsers successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetUsers')
          console.error('GetUsers failed')
          console.error(error.message)
          console.error(error.fault)
          resolve(error)
        })
    })
  }
}

module.exports = new runCore()