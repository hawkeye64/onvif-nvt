const Soap = require('../utils/soap')
const Util = require('../utils/util')

/**
  * All ONVIF API functions return a Promise, unless an optional callback is supplied.
  * @callback callback
  * @param {Error} error The error object.
  * @param {string} error.message The error message.
  * @param {xml} error.soap Associated SOAP xml that is cause of the error.
  * @param {object} error.fault Fault information
  * @param {string} error.fault.reason Reason for the error.
  * @param {string} error.fault.code Code for the error.
  * @param {string} error.fault.detail Details of the error.
  * @param {data} data The returned data when there is no error.
  */

/**
 * @class
 * Provide core functionality for Onvif Device Management.
 * <p>
 * {@link https://www.onvif.org/onvif/specs/core/ONVIF-Core-Specification-v220.pdf}<br>
 * {@link https://www.onvif.org/ver10/device/wsdl/devicemgmt.wsdl}<br>
 * {@link https://www.onvif.org/ver10/events/wsdl/event.wsdl}<br>
 * </p>
 * <h3>Functions</h3>
 * {@link Core#getWsdlUrl},
 * {@link Core#getServices},
 * {@link Core#getServiceCapabilities},
 * {@link Core#getCapabilities},
 * {@link Core#getHostname},
 * {@link Core#setHostname},
 * {@link Core#setHostnameFromDHCP},
 * {@link Core#getDNS},
 * {@link Core#setDNS},
 * {@link Core#getNTP},
 * {@link Core#setNTP},
 * {@link Core#getDynamicDNS},
 * setDynamicDNS,
 * {@link Core#getNetworkInterfaces},
 * setNetworkInterfaces,
 * {@link Core#getNetworkProtocols},
 * {@link Core#getNetworkDefaultGateway},
 * setNetworkDefaultGateway,
 * {@link Core#getZeroConfiguration},
 * setZeroConfiguration,
 * {@link Core#getIPAddressFilter},
 * setIPAddressFilter,
 * addIPAddressFilter,
 * removeIPAddressFilter,
 * {@link Core#getDot11Capabilities},
 * {@link Core#getDot11Status},
 * {@link Core#scanAvailableDot11Networks},
 * {@link Core#getDeviceInformation},
 * {@link Core#getSystemUris},
 * {@link Core#getSystemBackup},
 * restoreSystem,
 * startSystemRestore,
 * {@link Core#getSystemDateAndTime},
 * setSystemDateAndTime,
 * setSystemFactoryDefault,
 * upgradeSystemFirmware,
 * startFirmwareUpgrade,
 * {@link Core#getSystemLog},
 * {@link Core#getSystemSupportInformation},
 * {@link Core#systemReboot},
 * {@link Core#getScopes},
 * setScopes,
 * addScopes,
 * removeScopes,
 * {@link Core#getGeoLocation},
 * setGeoLocation,
 * deleteGeoLocation,
 * {@link Core#getDiscoveryMode},
 * setDiscoveryMode,
 * {@link Core#getRemoteDiscoveryMode},
 * setRemoteDiscoveryMode,
 * {@link Core#getDPAddresses},
 * setDPAddresses,
 * {@link Core#getAccessPolicy},
 * setAccessPolicy
 * {@link Core#getUsers},
 * createUsers,
 * deleteUsers,
 * setUser,
 * createDot1XConfiguration,
 * setDot1XConfiguration,
 * {@link Core#getDot1XConfiguration},
 * {@link Core#getDot1XConfigurations},
 * deleteDot1XConfigurations,
 * createCertificate,
 * {@link Core#getCertificates},
 * {@link Core#getCACertificates},
 * {@link Core#getCertificatesStatus},
 * setCertificatesStatus,
 * getPkcs10Request,
 * {@link Core#getClientCertificateMode},
 * setClientCertificateMode,
 * loadCertificates,
 * loadCertificateWithPrivateKey,
 * getCertificateInformation,
 * loadCACertificates,
 * deleteCertificates,
 * {@link Core#getRemoteUser},
 * setRemoteUser,
 * {@link Core#getEndpointReference},
 * {@link Core#getRelayOutputs},
 * setRelayOutputSettings,
 * setRelayOutputState,
 * sendAuxiliaryCommand
 * <br><br>
 * <h3>Overview</h3>
 * The Device Service is divided into five different categories: capabilities, network, system, I/O
 * and security commands. This set of commands can be used to get information about the
 * device capabilities and configurations or to set device configurations. An ONVIF compliant
 * device shall support the device management service as specified in [ONVIF DM WSDL]. A
 * basic set of operations are required for the device management service, other operations are
 * recommended or optional to support. The detailed requirements are listed under the command
 * descriptions.
 */
class Core {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      'xmlns:tds="http://www.onvif.org/ver10/device/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Core object.
   * @param {object} serviceAddress An url object from url package - require('url').
   * @param {string=} username Optional only if the device does NOT have a user.
   * @param {string=} password Optional only if the device does NOT have a password.
   */
  init (serviceAddress, username, password) {
    this.serviceAddress = serviceAddress
    this.username = username
    this.password = password
  }

  /**
   * Private function for creating a SOAP request.
   * @param {string} body The body of the xml.
   */
  createRequest (body) {
    const soapEnvelope = this.soap.createRequest({
      body: body,
      xmlns: this.namespaceAttributes,
      diff: this.timeDiff,
      username: this.username,
      password: this.password
    })
    return soapEnvelope
  }

  buildRequest (methodName, xml, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error(`The "callback" argument for ${methodName} is invalid:` + errMsg))
          return
        }
      }
      if (typeof methodName === 'undefined' || methodName === null) {
        reject(new Error('The "methodName" argument for buildRequest is required.'))
        return
      }
      else {
        if ((errMsg = Util.isInvalidValue(methodName, 'string'))) {
          reject(new Error('The "methodName" argument for buildRequest is invalid:' + errMsg))
          return
        }
      }
      let soapBody = ''
      if (typeof xml === 'undefined' || xml === null || xml === '') {
        soapBody += `<tds:${methodName}/>`
      }
      else {
        soapBody += `<tds:${methodName}>`
        soapBody += xml
        soapBody += `</tds:${methodName}>`
      }
      const soapEnvelope = this.createRequest(soapBody)
      this.soap.makeRequest('core', this.serviceAddress, methodName, soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * Returns the onvif device's time difference<br>
   * {@link getSystemDateAndTime} must be called first to get an accurate time.
   */
  getTimeDiff () {
    return this.timeDiff
  }

  // ---------------------------------------------
  // Core API
  // ---------------------------------------------

  /**
   * It is possible for an endpoint to request a URL that can be used to retrieve the complete
   * schema and WSDL definitions of a device. The command gives in return a URL entry point
   * where all the necessary product specific WSDL and schema definitions can be retrieved. The
   * device shall provide a URL for WSDL and schema download through the GetWsdlUrl
   * command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getWsdlUrl (callback) {
    return this.buildRequest('GetWsdlUrl', null, callback)
  }

  /**
   * <strong>+++ I get an 'Action Failed' with Axis cameras. Hikvision works fine.</strong><br>
   * Returns a collection of the devices services and possibly their available capabilities. The
   * returned capability response message is untyped to allow future addition of services, service
   * revisions and service capabilities. All returned service capabilities shall be structured by
   * different namespaces which are supported by a device.<br>
   * A device shall implement this method if any of the ONVIF compliant services implements the
   * GetServiceCapabilities. For making sure about the structure of GetServices response with
   * capabilities, please refer to Annex C. Example for GetServices Response with capabilities.<br>
   * The version in GetServicesResponse shall contain the specification version number of the
   * corresponding service that is implemented by a device.
   * @param {boolean=} includeCapability The message contains a request for all services in the device and
   * possibly the capabilities for each service. If the Boolean
   * IncludeCapability is set, then the response shall include the services
   * capabilities.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getServices (includeCapability, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getServices is invalid:' + errMsg))
          return
        }
      }
      if (typeof includeCapability !== 'undefined' && includeCapability !== null) {
        if ((errMsg = Util.isInvalidValue(includeCapability, 'boolean'))) {
          reject(new Error('The "includeCapability" argument for getServices is invalid: ' + errMsg))
          return
        }
      }

      let soapBody = ''
      if (typeof includeCapability !== 'undefined' && includeCapability !== null) {
        // soapBody += '<tds:IncludeCapability>' + (includeCapability ? 1 : 0) + '</tds:IncludeCapability>'
        soapBody += '<tds:IncludeCapability>' + includeCapability + '</tds:IncludeCapability>'
      }

      this.buildRequest('GetServices', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * <strong>+++ I get an 'Action Failed' with Axis cameras. Hikvision works fine.</strong><br>
   * This command returns the capabilities of the device service. The service shall implement this
   * method if the device supports the GetServices method.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getServiceCapabilities (callback) {
    return this.buildRequest('GetServiceCapabilities', null, callback)
  }

  /**
   * This method provides a backward compatible interface for the base capabilities. Refer to
   * GetServices for a full set of capabilities.<br>
   * Annex A describes how to interpret the indicated capability. Apart from the addresses, the
   * capabilities only reflect optional functions in this specification.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getCapabilities (callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getCapabilities is invalid:' + errMsg))
          return
        }
      }
      let soapBody = ''
      soapBody += '<tds:Category>All</tds:Category>'

      this.buildRequest('GetCapabilities', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * This operation is used by an endpoint to get the hostname from a device. The device shall
   * return its hostname configurations through the GetHostname command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getHostname (callback) {
    return this.buildRequest('GetHostname', null, callback)
  }

  /**
   * This operation sets the hostname on a device. It shall be possible to set the device hostname
   * configurations through the SetHostname command. Attention: a call to SetDNS may result in
   * overriding a previously set hostname.<br>
   * A device shall accept strings formated according to RFC 1123 section 2.1 or alternatively to
   * RFC 952, other string shall be considered as invalid strings.<br>
   * A device shall try to retrieve the name via DHCP when the HostnameFromDHCP capability is
   * set and an empty name string is provided.
   * @param {*} name The host name. If Name is an empty string hostname
   * should be retrieved from DHCP, otherwise the specified Name
   * shall be used.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  setHostname (name, callback) {
    name = name || ''
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for setHostname is invalid:' + errMsg))
          return
        }
      }
      let soapBody = ''
      soapBody += '<tds:Name>' + name + '</tds:Name>'

      this.buildRequest('SetHostname', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then((result) => {
        callback(null, result)
      }).catch((error) => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * This operation controls whether the hostname shall be retrieved from DHCP.
   * A device shall support this command if support is signalled via the HostnameFromDHCP
   * capability. Depending on the device implementation the change may only become effective
   * after a device reboot. A device shall accept the command independent whether it is currently
   * using DHCP to retrieve its IPv4 address or not. Note that the device is not required to retrieve
   * its hostname via DHCP while the device is not using DHCP for retrieving its IP address. In the
   * latter case the device may fall back to the statically set hostname.
   * @param {boolean=} fromDHCP True if the hostname shall be obtained via DHCP.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  setHostnameFromDHCP (fromDHCP, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for setHostnameFromDHCP is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(fromDHCP, 'boolean'))) {
        reject(new Error('The "fromDHCP" argument for setHostnameFromDHCP is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      // soapBody += '<tds:FromDHCP>' + (fromDHCP ? 1 : 0) + '</tds:FromDHCP>'
      soapBody += '<tds:FromDHCP>' + fromDHCP + '</tds:FromDHCP>'

      this.buildRequest('SetHostnameFromDHCP', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then((result) => {
        callback(null, result)
      }).catch((error) => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * This operation gets the DNS settings from a device. The device shall return its DNS
   * configurations through the GetDNS command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getDNS (callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getDNS is invalid:' + errMsg))
          return
        }
      }
      this.buildRequest('GetDNS')
        .then((result) => {
          try {
            const di = result.data.DNSInformation
            if (!di.SearchDomain) {
              di.SearchDomain = []
            }
            else if (!Array.isArray(di.SearchDomain)) {
              di.SearchDomain = [di.SearchDomain]
            }
            if (!di.DNSManual) {
              di.DNSManual = []
            }
            else if (!Array.isArray(di.DNSManual)) {
              di.DNSManual = [di.DNSManual]
            }
            result.data = di
          }
          catch (e) {}
          resolve(result)
        })
        .catch((error) => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then((result) => {
        callback(null, result)
      }).catch((error) => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * This operation sets the DNS settings on a device. It shall be possible to set the device DNS
   * configurations through the SetDNS command.<br>
   * It is valid to set the FromDHCP flag while the device is not using DHCP to retrieve its IPv4
   * address.
   * @param {boolean} fromDHCP True if the DNS servers are obtained via DHCP.
   * @param {array=} searchDomain The domain(s) to search if the hostname is not
   * fully qualified.
   * @param {array=} DNSManual A list of manually given DNS servers
   * @param {'IPv4'|'IPv6'} DNSManual.type The type of address in this object. Use only one type of address.
   * @param {string=} DNSManual.IP4Address An IPv4 address.
   * @param {string=} DNSManual.IP6Address An IPv6 address.
   * @param {callback=} callback Optional callback, instead of a Promise.
   * @example
   * DNSManual: [
   *   { type: 'IPv4', IP4Address: '10.10.1.20' }
   * ]
   */
  setDNS (fromDHCP, searchDomain, DNSManual, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for setDNS is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(fromDHCP, 'boolean'))) {
        reject(new Error('The "fromDHCP" argument for setDNS is invalid: ' + errMsg))
        return
      }

      if (typeof searchDomain !== 'undefined' && searchDomain !== null) {
        if ((errMsg = Util.isInvalidValue(searchDomain, 'array', true))) {
          reject(new Error('The "searchDomain" argument for setDNS is invalid: ' + errMsg))
          return
        }
        for (let i = 0; i < searchDomain.length; i++) {
          if ((errMsg = Util.isInvalidValue(searchDomain[i], 'string'))) {
            reject(new Error(`A "searchDomain" property was invalid(${searchDomain[i]}): ` + errMsg))
            return
          }
        }
      }

      if (typeof DNSManual !== 'undefined' && DNSManual !== null) {
        if ((errMsg = Util.isInvalidValue(DNSManual, 'array', true))) {
          reject(new Error('The "DNSManual" argument for setDNS is invalid: ' + errMsg))
          return
        }

        for (let i = 0; i < DNSManual.length; i++) {
          const d = DNSManual[i]
          if ((errMsg = Util.isInvalidValue(d, 'object'))) {
            reject(new Error(`A "DNSManual" property for setDNS is invalid(${JSON.stringify(d)}): ` + errMsg))
            return
          }

          const type = d.type
          if ((errMsg = Util.isInvalidValue(type, 'string'))) {
            reject(new Error('The "type" property for setDNS is invalid: ' + errMsg))
            return
          }
          else if (!type.match(/^(IPv4|IPv6)$/)) {
            reject(new Error('The "type" value for setDNS is invalid: The value must be either "IPv4" or "IPv6".'))
            return
          }

          if (type === 'IPv4') {
            if ((errMsg = Util.isInvalidValue(d.IPv4Address, 'string'))) {
              reject(new Error('The "IPv4Address" property for setDNS is invalid: ' + errMsg))
              return
            }
          }
          else if (type === 'IPv6') {
            if ((errMsg = Util.isInvalidValue(d.IPv6Address, 'string'))) {
              reject(new Error('The "IPv6Address" property for setDNS is invalid: ' + errMsg))
              return
            }
          }
        }
      }

      let soapBody = ''
      // soapBody += '<tds:FromDHCP>' + (fromDHCP ? 1 : 0) + '</tds:FromDHCP>'
      soapBody += '<tds:FromDHCP>' + fromDHCP + '</tds:FromDHCP>'
      if (typeof searchDomain !== 'undefined' && searchDomain !== null) {
        searchDomain.forEach((s) => {
          soapBody += '<tds:SearchDomain>' + s + '</tds:SearchDomain>'
        })
      }
      if (typeof DNSManual !== 'undefined' && DNSManual !== null) {
        if (DNSManual.length === 0) {
          soapBody += '<tds:DNSManual></tds:DNSManual>'
        }
        else {
          DNSManual.forEach((d) => {
            soapBody += '<tds:DNSManual>'
            soapBody += '<tt:Type>' + d.type + '</tt:Type>'
            if (d.type === 'IPv4') {
              soapBody += '<tt:IPv4Address>' + d.IPv4Address + '</tt:IPv4Address>'
            }
            else {
              soapBody += '<tt:IPv6Address>' + d.IPv6Address + '</tt:IPv6Address>'
            }
            soapBody += '</tds:DNSManual>'
          })
        }
      }

      this.buildRequest('SetDNS', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then((result) => {
        callback(null, result)
      }).catch((error) => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * This operation gets the NTP settings from a device. If the device supports NTP, it shall be
   * possible to get the NTP server settings through the GetNTP command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getNTP (callback) {
    return this.buildRequest('GetNTP', null, callback)
  }

  /**
   * This operation sets the NTP settings on a device. If support for NTP is signalled via the NTP
   * capability, it shall be possible to set the NTP server settings through the SetNTP command.<br>
   * A device shall accept string formated according to RFC 1123 section 2.1, other string shall be
   * considered as invalid strings. It is valid to set the FromDHCP flag while the device is not using
   * DHCP to retrieve its IPv4 address.<br>
   * Changes to the NTP server list shall not affect the clock mode DateTimeType. Use
   * SetSystemDateAndTime to activate NTP operation.
   * @param {boolean} fromDHCP True if the NTP servers are obtained via DHCP.
   * @param {array=} NTPManual A list of manually given NTP servers when they
   * not are obtained via DHCP.
   * @param {string=} NTPManual.type True if the NTP servers are obtained via DHCP.
   * @param {string=} NTPManual.IPv4Address An IPv4 address.
   * @param {string=} NTPManual.IP6Address An IPv6 address.
   * @param {callback=} callback Optional callback, instead of a Promise.
   * @example
   * NTPManual: [
   *   { type: 'IPv4', IP4Address: 'time1.goggle.com' }
   * ]
   */
  setNTP (fromDHCP, NTPManual, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for setNTP is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(fromDHCP, 'boolean'))) {
        reject(new Error('The "fromDHCP" argument for setNTP is invalid: ' + errMsg))
        return
      }

      if (typeof NTPManual !== 'undefined' && NTPManual !== null) {
        if ((errMsg = Util.isInvalidValue(NTPManual, 'array', true))) {
          reject(new Error('The "NTPManual" argument for setNTP is invalid: ' + errMsg))
          return
        }

        for (let i = 0; i < NTPManual.length; i++) {
          const d = NTPManual[i]
          if ((errMsg = Util.isInvalidValue(d, 'object'))) {
            reject(new Error(`A "NTPManual" property for setNTP is invalid(${JSON.stringify(d)}): ` + errMsg))
            return
          }

          const type = d.type
          if ((errMsg = Util.isInvalidValue(type, 'string'))) {
            reject(new Error('The "type" property for setNTP is invalid: ' + errMsg))
            return
          }
          else if (!type.match(/^(IPv4|IPv6)$/)) {
            reject(new Error('The "type" value for setNTP is invalid: The value must be either "IPv4" or "IPv6".'))
            return
          }

          if (type === 'IPv4') {
            if ((errMsg = Util.isInvalidValue(d.IPv4Address, 'string'))) {
              reject(new Error('The "IPv4Address" property for setNTP is invalid: ' + errMsg))
              return
            }
          }
          else if (type === 'IPv6') {
            if ((errMsg = Util.isInvalidValue(d.IPv6Address, 'string'))) {
              reject(new Error('The "IPv6Address" property for setNTP is invalid: ' + errMsg))
              return
            }
          }
        }
      }
      let soapBody = ''
      // soapBody += '<tds:FromDHCP>' + (fromDHCP ? 1 : 0) + '</tds:FromDHCP>'
      soapBody += '<tds:FromDHCP>' + fromDHCP + '</tds:FromDHCP>'
      if (typeof NTPManual !== 'undefined' && NTPManual !== null) {
        if (NTPManual.length === 0) {
          soapBody += '<tds:NTPManual></tds:NTPManual>'
        }
        else {
          NTPManual.forEach((d) => {
            soapBody += '<tds:NTPManual>'
            soapBody += '<tt:Type>' + d.type + '</tt:Type>'
            if (d.type === 'IPv4') {
              soapBody += '<tt:IPv4Address>' + d.IPv4Address + '</tt:IPv4Address>'
            }
            else {
              soapBody += '<tt:IPv6Address>' + d.IPv6Address + '</tt:IPv6Address>'
            }
            soapBody += '</tds:NTPManual>'
          })
        }
      }

      this.buildRequest('SetNTP', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then((result) => {
        callback(null, result)
      }).catch((error) => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * This operation gets the dynamic DNS settings from a device. If the device supports dynamic
   * DNS as specified in [RFC 2136] and [RFC 4702], it shall be possible to get the type, name
   * and TTL through the GetDynamicDNS command
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getDynamicDNS (callback) {
    return this.buildRequest('GetDynamicDNS', null, callback)
  }

  /**
   *
   * @param {NoUpdate|ServerUpdates|ClientUpdates} type The type of update. There are three possible types: the
   * device desires no update (NoUpdate), the device wants the
   * DHCP server to update (ServerUpdates) and the device does
   * the update itself (ClientUpdates).
   * @param {string=} name The DNS name in case of the device does the update.
   * @param {integer=} ttl Time to live
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  setDynamicDNS (type, name, ttl, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for setDynamicDNS is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(type, 'string'))) {
        reject(new Error('The "type" argument for setDynamicDNS is invalid: ' + errMsg))
        return
      }
      else if (!type.match(/^(NoUpdate|ServerUpdates|ClientUpdates)$/)) {
        reject(new Error('The "type" value for setDynamicDNS is invalid: The value must be either "IPv4" or "IPv6".'))
        return
      }

      if (typeof name !== 'undefined' && name !== null) {
        if ((errMsg = Util.isInvalidValue(name, 'string', true))) {
          reject(new Error('The "name" argument for setDynamicDNS is invalid: ' + errMsg))
          return
        }
      }

      if (typeof ttl !== 'undefined' && ttl !== null) {
        if ((errMsg = Util.isInvalidValue(ttl, 'integer'))) {
          reject(new Error('The "ttl" argument for setDynamicDNS is invalid: ' + errMsg))
          return
        }
      }

      let soapBody = ''
      soapBody += '<tds:SetDynamicDNS>'
      soapBody += '<tt:Type>' + type + '</tt:Type>'
      if (typeof name !== 'undefined' && name !== null) {
        soapBody += '<tt:Name>' + name + '</tt:Name>'
      }
      if (typeof ttl !== 'undefined' && ttl !== null) {
        soapBody += '<tt:TTL>' + ttl + '</tt:TTL>'
      }
      soapBody += '</tds:SetDynamicDNS>'
      const soapEnvelope = this.createRequest(soapBody)

      return this.soap.makeRequest('core', this.serviceAddress, 'SetDynamicDNS', soapEnvelope)
        .then((result) => {
          resolve(result)
        }).catch((error) => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then((result) => {
        callback(null, result)
      }).catch((error) => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * This operation gets the network interface configuration from a device. The device shall support return of network interface configuration settings as defined by the NetworkInterface type through the GetNetworkInterfaces command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getNetworkInterfaces (callback) {
    return this.buildRequest('GetNetworkInterfaces', null, callback)
  }

  setNetworkInterfaces () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets defined network protocols from a device. The device shall support the GetNetworkProtocols command returning configured network protocols.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getNetworkProtocols (callback) {
    return this.buildRequest('GetNetworkProtocols', null, callback)
  }

  setNetworkProtocols () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets the default gateway settings from a device. The device shall support the GetNetworkDefaultGateway command returning configured default gateway address(es).
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getNetworkDefaultGateway (callback) {
    return this.buildRequest('GetNetworkDefaultGateway', null, callback)
  }

  setNetworkDefaultGateway () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets the zero-configuration from a device. If the device supports dynamic IP configuration according to [RFC3927], it shall support the return of IPv4 zero configuration address and status through the GetZeroConfiguration command.<br>
   * Devices supporting zero configuration on more than one interface shall use the extension to list the additional interface settings.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getZeroConfiguration (callback) {
    return this.buildRequest('GetZeroConfiguration', null, callback)
  }

  setZeroConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets the IP address filter settings from a device. If the device supports device access control based on IP filtering rules (denied or accepted ranges of IP addresses), the device shall support the GetIPAddressFilter command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getIPAddressFilter (callback) {
    return this.buildRequest('GetIPAddressFilter', null, callback)
  }

  setIPAddressFilter () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  addIPAddressFilter () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeIPAddressFilter () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation returns the IEEE802.11 capabilities. The device shall support this operation.<br>
   * <strong>Not all do.</strong>
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getDot11Capabilities (callback) {
    return this.buildRequest('GetDot11Capabilities', null, callback)
  }

  /**
   * This operation returns the status of a wireless network interface. The device shall support this command.<br>
   * <strong>Not all do.</strong>
   * @param {string} interfaceToken Network reference token.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getDot11Status (interfaceToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getDot11Status is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(interfaceToken, 'string'))) {
        reject(new Error('The "interfaceToken" argument for getDot11Status is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tt:InterfaceToken>' + interfaceToken + '</tt:InterfaceToken>'

      this.buildRequest('GetDot11Status', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then((result) => {
        callback(null, result)
      }).catch((error) => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * This operation returns a lists of the wireless networks in range of the device. A device should
   * support this operation. The following status can be returned for each network:
   * <ul>
   * <li>SSID (shall)</li>
   * <li>BSSID (should)</li>
   * <li>Authentication and key management suite(s) (should)</li>
   * <li>Pair cipher(s) (should)</li>
   * <li>Group cipher(s) (should)</li>
   * <li>Signal strength (should)</li>
   * </ul>
   * @param {string} interfaceToken Network reference token.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  scanAvailableDot11Networks (interfaceToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for scanAvailableDot11Networks is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(interfaceToken, 'string'))) {
        reject(new Error('The "interfaceToken" argument for scanAvailableDot11Networks is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tt:ReferenceToken>' + interfaceToken + '</tt:ReferenceToken>'

      this.buildRequest('ScanAvailableDot11Networks', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then((result) => {
        callback(null, result)
      }).catch((error) => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * This operation gets device information, such as manufacturer, model and firmware version
   * from a device. The device shall support the return of device information through the
   * GetDeviceInformation command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getDeviceInformation (callback) {
    return this.buildRequest('GetDeviceInformation', null, callback)
  }

  /**
   * This operation is used to retrieve URIs from which system information may be downloaded
   * using HTTP. URIs may be returned for the following system information:<br>
   * <strong>System Logs.</strong> Multiple system logs may be returned, of different types. The exact format of
   * the system logs is outside the scope of this specification.<br>
   * <strong>Support Information.</strong> This consists of arbitrary device diagnostics information from a device.
   * The exact format of the diagnostic information is outside the scope of this specification.<br>
   * <strong>System Backup.</strong> The received file is a backup file that can be used to restore the current
   * device configuration at a later date. The exact format of the backup configuration file is
   * outside the scope of this specification.<br>
   * If the device allows retrieval of system logs, support information or system backup data, it
   * should make them available via HTTP GET. If it does, it shall support the GetSystemUris
   * command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getSystemUris (callback) {
    return this.buildRequest('GetSystemUris', null, callback)
  }

  /**
   * <i>This interface has been deprecated.</i><br>
   * A device shall implement this command if the capability
   * SystemBackup is signaled. For a replacement method see section 8.3.2 and 8.3.5.<br>
   * This operation retrieves system backup configuration file(s) from a device. The backup is
   * returned with reference to a name and mime-type together with binary data. The format of the
   * backup configuration data is vendor specific. It is expected that after completion of the restore
   * operation the device is working on the same configuration as that of the time the configuration
   * was backed up. Note that the configuration of static IP addresses may differ.<br>
   * Device vendors may put restrictions on the functionality to be restored. The detailed behavior
   * is outside the scope of this specification.<br>
   * The backup configuration file(s) are transmitted through MTOM [MTOM].
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getSystemBackup (callback) {
    return this.buildRequest('GetSystemBackup', null, callback)
  }

  restoreSystem () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  startSystemRestore () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets the device system date and time.
   * The device shall support the return of the daylight
   * saving setting and of the manual system date and time
   * (if applicable) or indication of NTP time (if applicable)
   * through the GetSystemDateAndTime command.<br>
   * A device shall provide the UTCDateTime information although
   * the item is marked as optional to ensure backward compatibility.<br>
   * This is required to be called for devices that
   * support the GetSystemDateAndTime SOAP method so
   * a time diff can be used in subsequent calls to
   * the device.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getSystemDateAndTime (callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getSystemDateAndTime is invalid:' + errMsg))
          return
        }
      }

      this.buildRequest('GetSystemDateAndTime')
        .then(results => {
          const parsed = this.parseGetSystemDateAndTime(results.data)
          if (parsed && parsed.date) {
            const deviceTime = parsed.date.getTime()
            const localTime = (new Date()).getTime()
            this.timeDiff = deviceTime - localTime
            // console.log('this.timeDiff', this.timeDiff)
          }
          resolve(results)
        })
        .catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then((result) => {
        callback(null, result)
      }).catch((error) => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * Private function
   * @param {object} sdt GetSystemDateAndTimeResponse converted to JSON.
   */
  parseGetSystemDateAndTime (sdt) {
    const s0 = sdt
    if (!s0) {
      return null
    }
    const s1 = s0.GetSystemDateAndTimeResponse
    if (!s1) {
      return null
    }
    const s2 = s1.SystemDateAndTime
    if (!s2) {
      return null
    }

    const type = s2.DateTimeType || ''
    let dst = null
    if (s2.DaylightSavings) {
      dst = (s2.DaylightSavings === 'true')
    }
    const tz = (s2.TimeZone && s2.TimeZone.TZ) ? s2.TimeZone.TZ : ''
    let date = null
    if (s2.UTCDateTime) {
      const udt = s2.UTCDateTime
      const t = udt.Time
      const d = udt.Date
      if (t && d && t.Hour && t.Minute && t.Second && d.Year && d.Month && d.Day) {
        date = new Date()
        date.setUTCFullYear(parseInt(d.Year, 10))
        date.setUTCMonth(parseInt(d.Month, 10) - 1)
        date.setUTCDate(parseInt(d.Day, 10))
        date.setUTCHours(parseInt(t.Hour, 10))
        date.setUTCMinutes(parseInt(t.Minute, 10))
        date.setUTCSeconds(parseInt(t.Second, 10))
      }
    }
    const res = {
      type: type,
      dst: dst,
      tz: tz,
      date: date
    }
    return res
  }

  setSystemDateAndTime () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setSystemFactoryDefault () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  upgradeSystemFirmware () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  startFirmwareUpgrade () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets a system log from the device. The exact format of the system logs is outside the scope of this standard.
   * @param {System|Access} logType Specifies the type of system log to get.
   * <ul>
   * <li>System: Indicates that a system log is requested.</li>
   * <li>Access: Indicates that a access log is requested.</li>
   * </ul>
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getSystemLog (logType, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getSystemLog is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(logType, 'string'))) {
        reject(new Error('The "logType" argument for getSystemLog is invalid: ' + errMsg))
        return
      }

      if (!logType.match(/^(System|Access)$/)) {
        reject(new Error('The "logType" value for getSystemLog is invalid: The value must be either "System" or "Access".'))
        return
      }

      let soapBody = ''
      soapBody += '<tt:LogType>' + logType + '</tt:LogType>'

      this.buildRequest('GetSystemLog', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then((result) => {
        callback(null, result)
      }).catch((error) => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * This operation gets arbitary device diagnostics information from the device.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getSystemSupportInformation (callback) {
    return this.buildRequest('GetSystemSupportInformation', null, callback)
  }

  /**
   * This operation reboots the device.
   * @returns Contains the reboot message from the device (ie: Rebooting in 90 seconds).
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  systemReboot (callback) {
    return this.buildRequest('SystemReboot', null, callback)
  }

  /**
   * This operation requests the scope parameters of a device. The scope parameters are used in
   * the device discovery to match a probe message, see Section 7. The Scope parameters are of
   * two different types:
   * <ul>
   *  <li>Fixed</li>
   *  <li>Configurable</li>
   * </ul>
   * Fixed scope parameters are permanent device characteristics and cannot be removed
   * through the device management interface. The scope type is indicated in the scope list
   * returned in the get scope parameters response. A device shall support retrieval of discovery
   * scope parameters through the GetScopes command. As some scope parameters are
   * mandatory, the device shall return a non-empty scope list in the response.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getScopes (callback) {
    return this.buildRequest('GetScopes', null, callback)
  }

  setScopes () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  addScopes () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeScopes () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets the geo location information of a device. A device that signals support for
   * GeoLocation via the capability GeoLocationEntities shall support the retrieval of geo location
   * information via this command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getGeoLocation (callback) {
    return this.buildRequest('GetGeoLocation', null, callback)
  }

  setGeoLocation () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteGeoLocation () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets the discovery mode of a device
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getDiscoveryMode (callback) {
    return this.buildRequest('GetDiscoveryMode', null, callback)
  }

  setDiscoveryMode () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets the remote discovery mode of a device. See Section 7.4 for the definition of remote discovery extensions. A device that supports remote discovery shall support retrieval of the remote discovery mode setting through the GetRemoteDiscoveryMode command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getRemoteDiscoveryMode (callback) {
    return this.buildRequest('GetRemoteDiscoveryMode', null, callback)
  }

  setRemoteDiscoveryMode () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets the remote DP address or addresses from a device. If the device supports remote discovery, as specified in Section 7.4, the device shall support retrieval of the remote DP address(es) through the GetDPAddresses command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getDPAddresses (callback) {
    return this.buildRequest('GetDPAddresses', null, callback)
  }

  setDPAddresses () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * Access to different services and sub-sets of services should be subject
   * to access control. The WS-Security framework gives the prerequisite for
   * end-point authentication. Authorization decisions can then be taken
   * using an access security policy. This standard does not mandate any
   * particular policy description format or security policy but this is
   * up to the device manufacturer or system provider to choose policy and
   * policy description format of choice. However, an access policy (in
   * arbitrary format) can be requested using this command. If the device
   * supports access policy settings based on WS-Security authentication,
   * then the device shall support this command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getAccessPolicy (callback) {
    return this.buildRequest('GetAccessPolicy', null, callback)
  }

  setAccessPolicy () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation lists the registered users and corresponding credentials on a device. The device shall support retrieval of registered device users and their credentials for the user token through the GetUsers command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getUsers (callback) {
    return this.buildRequest('GetUsers', null, callback)
  }

  createUsers () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteUsers () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setUser () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createDot1XConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setDot1XConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets one IEEE 802.1X configuration parameter set from the device by
   * specifying the configuration token (Dot1XConfigurationToken).<br>
   * The device shall support this command if support for IEEE 802.1X is signaled via the Security
   * Dot1X capability.<br>
   * Regardless of whether the 802.1X method in the retrieved configuration has a password or
   * not, the device shall not include the Password element in the response.
   * @param {string} dot1XConfigurationToken Dot1XConfigurationToken [ReferenceToken]
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getDot1XConfiguration (dot1XConfigurationToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getDot11XConfiguration is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(dot1XConfigurationToken, 'string'))) {
        reject(new Error('The "dot1XConfigurationToken" argument for getDot1XConfiguration is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tds:Dot1XConfigurationToken>' + dot1XConfigurationToken + '</tds:Dot1XConfigurationToken>'

      this.buildRequest('GetDot1XConfiguration', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * This operation gets all the existing IEEE 802.1X configuration parameter sets from the device.<br>
   * The device shall respond with all the IEEE 802.1X configurations so that the client can get to
   * know how many IEEE 802.1X configurations are existing and how they are configured.<br>
   * The device shall support this command if support for IEEE 802.1X is signaled via the Security
   * Dot1X capability.<br>
   * Regardless of whether the 802.1X method in the retrieved configuration has a password or
   * not, the device shall not include the Password element in the response.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getDot1XConfigurations (callback) {
    return this.buildRequest('GetDot1XConfigurations', null, callback)
  }

  deleteDot1XConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createCertificate () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets all device server certificates (including self-signed) for the purpose of TLS
   * authentication and all device client certificates for the purpose of IEEE 802.1X authentication.<br>
   * This command lists only the TLS server certificates and IEEE 802.1X client certificates for the
   * device (neither trusted CA certificates nor trusted root certificates). The certificates are
   * returned as binary data. A device that supports TLS shall support this command and the
   * certificates shall be encoded using ASN.1 [X.681], [X.682], [X.683] DER [X.690] encoding
   * rules.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getCertificates (callback) {
    return this.buildRequest('GetCertificates', null, callback)
  }

  /**
   * CA certificates will be loaded into a device and be used for the sake of following two cases.<br>
   * The one is for the purpose of TLS client authentication in TLS server function. The other one
   * is for the purpose of Authentication Server authentication in IEEE 802.1X function. This
   * operation gets all CA certificates loaded into a device. A device that supports either TLS client
   * authentication or IEEE 802.1X shall support this command and the returned certificates shall
   * be encoded using ASN.1 [X.681], [X.682], [X.683] DER [X.690] encoding rules.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getCACertificates (callback) {
    return this.buildRequest('GetCACertificates', null, callback)
  }

  /**
   * This operation is specific to TLS functionality. This operation gets the status
   * (enabled/disabled) of the device TLS server certificates. A device that supports TLS shall
   * support this command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getCertificatesStatus (callback) {
    return this.buildRequest('GetCertificatesStatus', null, callback)
  }

  setCertificatesStatus () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getPkcs10Request () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation is specific to TLS functionality. This operation gets the status
   * (enabled/disabled) of the device TLS client authentication. A device that supports TLS shall
   * support this command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getClientCertificateMode (callback) {
    return this.buildRequest('GetClientCertificateMode', null, callback)
  }

  setClientCertificateMode () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  loadCertificates () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  loadCertificateWithPrivateKey () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCertificateInformation () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  loadCACertificates () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteCertificates () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation returns the configured remote user (if any). A device that signals support for
   * remote user handling via the Security Capability RemoteUserHandling shall support this
   * operation. The user is only valid for the WS-UserToken profile or as a HTTP / RTSP user.<br>
   * The algorithm to use for deriving the password is described in section 5.12.3.1.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getRemoteUser (callback) {
    return this.buildRequest('GetRemoteUser', null, callback)
  }

  setRemoteUser () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * A client can ask for the device service endpoint reference address property that can be used
   * to derive the password equivalent for remote user operation. The device should support the
   * GetEndpointReference command returning the address property of the device service
   * endpoint reference.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getEndpointReference (callback) {
    return this.buildRequest('GetEndpointReference', null, callback)
  }

  /**
   * This operation gets a list of all available relay outputs and their settings.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getRelayOutputs (callback) {
    return this.buildRequest('GetRelayOutputs', null, callback)
  }

  setRelayOutputSettings () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setRelayOutputState () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  sendAuxiliaryCommand () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }
}

module.exports = Core
