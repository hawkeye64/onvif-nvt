const Config = require('./config')

class RunCore {
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
          }).then(() => {
            return this.SetDynamicDNS()
          }).then(() => {
            return this.GetNetworkInterfaces()
          }).then(() => {
            return this.SetNetworkInterfaces()
          }).then(() => {
            return this.GetNetworkProtocols()
          }).then(() => {
            return this.GetNetworkDefaultGateway()
          }).then(() => {
            return this.SetNetworkDefaultGateway()
          }).then(() => {
            return this.GetZeroConfiguration()
          }).then(() => {
            return this.SetZeroConfiguration()
          }).then(() => {
            return this.GetIPAddressFilter()
          }).then(() => {
            return this.SetIPAddressFilter()
          }).then(() => {
            return this.AddIPAddressFilter()
          }).then(() => {
            return this.RemoveIPAddressFilter()
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
            return this.RestoreSystem()
          }).then(() => {
            return this.StartSystemRestore()
          }).then(() => {
            return this.GetSystemDateAndTime()
          }).then(() => {
            return this.SetSystemDateAndTime()
          }).then(() => {
            return this.SetSystemFactoryDefault()
          }).then(() => {
            return this.UpgradeSystemFirmware()
          }).then(() => {
            return this.StartFirmwareUpgrade()
          }).then(() => {
            return this.GetSystemLog()
          }).then(() => {
            return this.GetSystemSupportInformation()
          // }).then(() => {
          //   return this.SystemReboot()
          }).then(() => {
            return this.GetScopes()
          }).then(() => {
            return this.SetScopes()
          }).then(() => {
            return this.AddScopes()
          }).then(() => {
            return this.RemoveScopes()
          }).then(() => {
            return this.GetGeoLocation()
          }).then(() => {
            return this.SetGeoLocation()
          }).then(() => {
            return this.DeleteGeoLocation()
          }).then(() => {
            return this.GetDiscoveryMode()
          }).then(() => {
            return this.SetDiscoveryMode()
          }).then(() => {
            return this.GetRemoteDiscoveryMode()
          }).then(() => {
            return this.SetRemoteDiscoveryMode()
          }).then(() => {
            return this.GetDPAddresses()
          }).then(() => {
            return this.SetDPAddresses()
          }).then(() => {
            return this.GetAccessPolicy()
          }).then(() => {
            return this.SetAccessPolicy()
          }).then(() => {
            return this.GetUsers()
          }).then(() => {
            return this.CreateUsers()
          }).then(() => {
            return this.DeleteUsers()
          }).then(() => {
            return this.SetUser()
          }).then(() => {
            return this.CreateDot1XConfiguration()
          }).then(() => {
            return this.SetDot1XConfiguration()
          }).then(() => {
            return this.GetDot1XConfiguration()
          }).then(() => {
            return this.GetDot1XConfigurations()
          }).then(() => {
            return this.DeleteDot1XConfigurations()
          }).then(() => {
            return this.CreateCertificate()
          }).then(() => {
            return this.GetCertificates()
          }).then(() => {
            return this.GetCACertificates()
          }).then(() => {
            return this.GetCertificatesStatus()
          }).then(() => {
            return this.SetCertificatesStatus()
          }).then(() => {
            return this.GetPkcs10Request()
          }).then(() => {
            return this.GetClientCertificateMode()
          }).then(() => {
            return this.SetClientCertificateMode()
          }).then(() => {
            return this.LoadCertificates()
          }).then(() => {
            return this.LoadCertificateWithPrivateKey()
          }).then(() => {
            return this.GetCertificateInformation()
          }).then(() => {
            return this.LoadCACertificates()
          }).then(() => {
            return this.DeleteCertificates()
          }).then(() => {
            return this.GetRemoteUser()
          }).then(() => {
            return this.SetRemoteUser()
          }).then(() => {
            return this.GetEndpointReference()
          }).then(() => {
            return this.GetRelayOutputs()
          }).then(() => {
            return this.SetRelayOutputSettings()
          }).then(() => {
            return this.SetRelayOutputState()
          }).then(() => {
            return this.SendAuxiliaryCommand()
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetDynamicDNS () {
    return new Promise((resolve, reject) => {
      this.camera.core.setDynamicDNS('ClientUpdates')
        .then(results => {
          console.log('SetDynamicDNS successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetDynamicDNS')
          console.error('SetDynamicDNS failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetNetworkInterfaces () {
    return new Promise((resolve, reject) => {
      this.camera.core.setNetworkInterfaces()
        .then(results => {
          console.log('SetNetworkInterfaces successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetNetworkInterfaces')
          console.error('SetNetworkInterfaces failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetNetworkDefaultGateway () {
    return new Promise((resolve, reject) => {
      this.camera.core.setNetworkDefaultGateway()
        .then(results => {
          console.log('SetNetworkDefaultGateway successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetNetworkDefaultGateway')
          console.error('SetNetworkDefaultGateway failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetZeroConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.core.setZeroConfiguration()
        .then(results => {
          console.log('SetZeroConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetZeroConfiguration')
          console.error('SetZeroConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetIPAddressFilter () {
    return new Promise((resolve, reject) => {
      this.camera.core.setIPAddressFilter()
        .then(results => {
          console.log('SetIPAddressFilter successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetIPAddressFilter')
          console.error('SetIPAddressFilter failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  AddIPAddressFilter () {
    return new Promise((resolve, reject) => {
      this.camera.core.addIPAddressFilter()
        .then(results => {
          console.log('AddIPAddressFilter successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('AddIPAddressFilter')
          console.error('AddIPAddressFilter failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  RemoveIPAddressFilter () {
    return new Promise((resolve, reject) => {
      this.camera.core.removeIPAddressFilter()
        .then(results => {
          console.log('RemoveIPAddressFilter successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RemoveIPAddressFilter')
          console.error('RemoveIPAddressFilter failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
            if ('fault' in error) {
              console.error(error.fault)
            }
            resolve(error)
          })
      }
      else {
        resolve()
      }
    })
  }

  RestoreSystem () {
    return new Promise((resolve, reject) => {
      this.camera.core.restoreSystem()
        .then(results => {
          console.log('RestoreSystem successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RestoreSystem')
          console.error('RestoreSystem failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  StartSystemRestore () {
    return new Promise((resolve, reject) => {
      this.camera.core.startSystemRestore()
        .then(results => {
          console.log('StartSystemRestore successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('StartSystemRestore')
          console.error('StartSystemRestore failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetSystemDateAndTime () {
    return new Promise((resolve, reject) => {
      this.camera.core.setSystemDateAndTime()
        .then(results => {
          console.log('SetSystemDateAndTime successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetSystemDateAndTime')
          console.error('SetSystemDateAndTime failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetSystemFactoryDefault () {
    return new Promise((resolve, reject) => {
      this.camera.core.setSystemFactoryDefault()
        .then(results => {
          console.log('SetSystemFactoryDefault successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetSystemFactoryDefault')
          console.error('SetSystemFactoryDefault failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  UpgradeSystemFirmware () {
    return new Promise((resolve, reject) => {
      this.camera.core.upgradeSystemFirmware()
        .then(results => {
          console.log('UpgradeSystemFirmware successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('UpgradeSystemFirmware')
          console.error('UpgradeSystemFirmware failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  StartFirmwareUpgrade () {
    return new Promise((resolve, reject) => {
      this.camera.core.startFirmwareUpgrade()
        .then(results => {
          console.log('StartFirmwareUpgrade successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('StartFirmwareUpgrade')
          console.error('StartFirmwareUpgrade failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SystemReboot () {
    return new Promise((resolve, reject) => {
      if (Config.runReboot) {
        this.camera.core.systemReboot()
          .then(results => {
            console.log('Reboot successful')
            resolve(results)
          })
          .catch(error => {
            this.apiErrors.push('Reboot')
            console.error('Reboot failed')
            console.error(error.message)
            if ('fault' in error) {
              console.error(error.fault)
            }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetScopes () {
    return new Promise((resolve, reject) => {
      this.camera.core.setScopes()
        .then(results => {
          console.log('SetScopes successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetScopes')
          console.error('SetScopes failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  AddScopes () {
    return new Promise((resolve, reject) => {
      this.camera.core.addScopes()
        .then(results => {
          console.log('AddScopes successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('AddScopes')
          console.error('AddScopes failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  RemoveScopes () {
    return new Promise((resolve, reject) => {
      this.camera.core.removeScopes()
        .then(results => {
          console.log('RemoveScopes successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('RemoveScopes')
          console.error('RemoveScopes failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetGeoLocation () {
    return new Promise((resolve, reject) => {
      this.camera.core.setGeoLocation()
        .then(results => {
          console.log('SetGeoLocation successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetGeoLocation')
          console.error('SetGeoLocation failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  DeleteGeoLocation () {
    return new Promise((resolve, reject) => {
      this.camera.core.deleteGeoLocation()
        .then(results => {
          console.log('DeleteGeoLocation successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('DeleteGeoLocation')
          console.error('DeleteGeoLocation failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetDiscoveryMode () {
    return new Promise((resolve, reject) => {
      this.camera.core.setDiscoveryMode()
        .then(results => {
          console.log('SetDiscoveryMode successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetDiscoveryMode')
          console.error('SetDiscoveryMode failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetRemoteDiscoveryMode () {
    return new Promise((resolve, reject) => {
      this.camera.core.setRemoteDiscoveryMode()
        .then(results => {
          console.log('SetRemoteDiscoveryMode successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetRemoteDiscoveryMode')
          console.error('SetRemoteDiscoveryMode failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetDPAddresses () {
    return new Promise((resolve, reject) => {
      this.camera.core.setDPAddresses()
        .then(results => {
          console.log('SetDPAddresses successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetDPAddresses')
          console.error('SetDPAddresses failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetAccessPolicy () {
    return new Promise((resolve, reject) => {
      this.camera.core.setAccessPolicy()
        .then(results => {
          console.log('SetAccessPolicy successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetAccessPolicy')
          console.error('SetAccessPolicy failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
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
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  CreateUsers () {
    return new Promise((resolve, reject) => {
      this.camera.core.createUsers()
        .then(results => {
          console.log('CreateUsers successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('CreateUsers')
          console.error('CreateUsers failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  DeleteUsers () {
    return new Promise((resolve, reject) => {
      this.camera.core.deleteUsers()
        .then(results => {
          console.log('DeleteUsers successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('DeleteUsers')
          console.error('DeleteUsers failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetUser () {
    return new Promise((resolve, reject) => {
      this.camera.core.setUser()
        .then(results => {
          console.log('SetUser successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetUser')
          console.error('SetUser failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  CreateDot1XConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.core.createDot1XConfiguration()
        .then(results => {
          console.log('CreateDot1XConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('CreateDot1XConfiguration')
          console.error('CreateDot1XConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetDot1XConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.core.setDot1XConfiguration()
        .then(results => {
          console.log('SetDot1XConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetDot1XConfiguration')
          console.error('SetDot1XConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetDot1XConfiguration () {
    return new Promise((resolve, reject) => {
      this.camera.core.getDot1XConfiguration()
        .then(results => {
          console.log('GetDot1XConfiguration successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetDot1XConfiguration')
          console.error('GetDot1XConfiguration failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetDot1XConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.core.getDot1XConfigurations()
        .then(results => {
          console.log('GetDot1XConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetDot1XConfigurations')
          console.error('GetDot1XConfigurations failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  DeleteDot1XConfigurations () {
    return new Promise((resolve, reject) => {
      this.camera.core.deleteDot1XConfigurations()
        .then(results => {
          console.log('DeleteDot1XConfigurations successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('DeleteDot1XConfigurations')
          console.error('DeleteDot1XConfigurations failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  CreateCertificate () {
    return new Promise((resolve, reject) => {
      this.camera.core.createCertificate()
        .then(results => {
          console.log('CreateCertificate successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('CreateCertificate')
          console.error('CreateCertificate failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetCertificates () {
    return new Promise((resolve, reject) => {
      this.camera.core.getCertificates()
        .then(results => {
          console.log('GetCertificates successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCertificates')
          console.error('GetCertificates failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetCACertificates () {
    return new Promise((resolve, reject) => {
      this.camera.core.getCACertificates()
        .then(results => {
          console.log('GetCACertificates successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCACertificates')
          console.error('GetCACertificates failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetCertificatesStatus () {
    return new Promise((resolve, reject) => {
      this.camera.core.getCertificatesStatus()
        .then(results => {
          console.log('GetCertificatesStatus successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCertificatesStatus')
          console.error('GetCertificatesStatus failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetCertificatesStatus () {
    return new Promise((resolve, reject) => {
      this.camera.core.setCertificatesStatus()
        .then(results => {
          console.log('SetCertificatesStatus successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetCertificatesStatus')
          console.error('SetCertificatesStatus failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetPkcs10Request () {
    return new Promise((resolve, reject) => {
      this.camera.core.getPkcs10Request()
        .then(results => {
          console.log('GetPkcs10Request successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetPkcs10Request')
          console.error('GetPkcs10Request failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetClientCertificateMode () {
    return new Promise((resolve, reject) => {
      this.camera.core.getClientCertificateMode()
        .then(results => {
          console.log('GetClientCertificateMode successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetClientCertificateMode')
          console.error('GetClientCertificateMode failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetClientCertificateMode () {
    return new Promise((resolve, reject) => {
      this.camera.core.setClientCertificateMode()
        .then(results => {
          console.log('SetClientCertificateMode successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetClientCertificateMode')
          console.error('SetClientCertificateMode failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  LoadCertificates () {
    return new Promise((resolve, reject) => {
      this.camera.core.loadCertificates()
        .then(results => {
          console.log('LoadCertificates successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('LoadCertificates')
          console.error('LoadCertificates failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  LoadCertificateWithPrivateKey () {
    return new Promise((resolve, reject) => {
      this.camera.core.loadCertificateWithPrivateKey()
        .then(results => {
          console.log('LoadCertificateWithPrivateKey successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('LoadCertificateWithPrivateKey')
          console.error('LoadCertificateWithPrivateKey failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetCertificateInformation () {
    return new Promise((resolve, reject) => {
      this.camera.core.getCertificateInformation()
        .then(results => {
          console.log('GetCertificateInformation successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetCertificateInformation')
          console.error('GetCertificateInformation failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  LoadCACertificates () {
    return new Promise((resolve, reject) => {
      this.camera.core.loadCACertificates()
        .then(results => {
          console.log('LoadCACertificates successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('LoadCACertificates')
          console.error('LoadCACertificates failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  DeleteCertificates () {
    return new Promise((resolve, reject) => {
      this.camera.core.deleteCertificates()
        .then(results => {
          console.log('DeleteCertificates successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('DeleteCertificates')
          console.error('DeleteCertificates failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetRemoteUser () {
    return new Promise((resolve, reject) => {
      this.camera.core.setRemoteUser()
        .then(results => {
          console.log('GetRemoteUser successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetRemoteUser')
          console.error('GetRemoteUser failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetRemoteUser () {
    return new Promise((resolve, reject) => {
      this.camera.core.setRemoteUser()
        .then(results => {
          console.log('SetRemoteUser successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetRemoteUser')
          console.error('SetRemoteUser failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetEndpointReference () {
    return new Promise((resolve, reject) => {
      this.camera.core.getEndpointReference()
        .then(results => {
          console.log('GetEndpointReference successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetEndpointReference')
          console.error('GetEndpointReference failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  GetRelayOutputs () {
    return new Promise((resolve, reject) => {
      this.camera.core.getRelayOutputs()
        .then(results => {
          console.log('GetRelayOutputs successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('GetRelayOutputs')
          console.error('GetRelayOutputs failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetRelayOutputSettings () {
    return new Promise((resolve, reject) => {
      this.camera.core.setRelayOutputSettings()
        .then(results => {
          console.log('SetRelayOutputSettings successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetRelayOutputSettings')
          console.error('SetRelayOutputSettings failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SetRelayOutputState () {
    return new Promise((resolve, reject) => {
      this.camera.core.setRelayOutputState()
        .then(results => {
          console.log('SetRelayOutputState successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SetRelayOutputState')
          console.error('SetRelayOutputState failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }

  SendAuxiliaryCommand () {
    return new Promise((resolve, reject) => {
      this.camera.core.sendAuxiliaryCommand()
        .then(results => {
          console.log('SendAuxiliaryCommand successful')
          resolve(results)
        })
        .catch(error => {
          this.apiErrors.push('SendAuxiliaryCommand')
          console.error('SendAuxiliaryCommand failed')
          console.error(error.message)
          if ('fault' in error) {
            console.error(error.fault)
          }
          resolve(error)
        })
    })
  }
}

module.exports = new RunCore()
