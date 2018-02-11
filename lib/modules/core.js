const Soap = require('../utils/soap')
const Util = require('../utils/util')

/**
  * All ONVIF API functions return a Promise, unless an optional callback is supplied.
  * @callback callback
  * @param {Error} error The error object.
  * @param {string} error.message The error message.
  * @param {xml} error.xml Associated xml that is cause of the error.
  * @param {data} data
  */

/**
 * @class Core
 * Provide core functionality for Onvif Device Management.
 * <p>
 * {@link https://www.onvif.org/onvif/specs/core/ONVIF-Core-Specification-v220.pdf}<br>
 * {@link https://www.onvif.org/ver10/device/wsdl/devicemgmt.wsdl}<br>
 * {@link https://www.onvif.org/ver10/events/wsdl/event.wsdl}<br>
 * </p>
 * <h3>Functions</h3>
 * <br><br>
 * <h3>Overview</h3>
 *
 */
class Core {
  constructor () {
    this.username = null
    this.password = null

    this.serviceAddress = null
    this.timeDiff = 0

    this.namespaceAttributes = [
      'xmlns:tds="http://www.onvif.org/ver10/device/wsdl"',
      'xmlns:tt="http://www.onvif.org/ver10/schema"'
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
    let soapEnvelope = Soap.createRequest({
      'body': body,
      'xmlns': this.namespaceAttributes,
      'diff': this.timeDiff,
      'username': this.username,
      'password': this.password
    })
    return soapEnvelope
  };

  /**
   * Returns the onvif device's time difference<br>
   * {@link getSystemDateAndTime} must be called first to get an accurate time.
   */
  getTimeDiff () {
    return this.timeDiff
  };

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
    let promise = new Promise((resolve, reject) => {
      let soapBody = '<tds:GetWsdlUrl/>'
      let soapEnvelope = this.createRequest(soapBody)
      return Soap.makeRequest(this.serviceAddress, 'GetWsdlUrl', soapEnvelope)
        .then(results => {
          resolve(results)
        })
        .catch(error => {
          reject(error)
        })
    })
    if (callback) {
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
    let promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof includeCapability !== 'undefined' && includeCapability !== null) {
        if ((errMsg = Util.isInvalidValue(includeCapability, 'boolean'))) {
          reject(new Error('The "includeCapability" argument for getServices is invalid: ' + errMsg))
          return
        }
      }

      let soapBody = ''
      soapBody += '<tds:GetServices>'
      if (typeof includeCapability !== 'undefined' && includeCapability !== null) {
        soapBody += '<tds:IncludeCapability>' + includeCapability + '</tds:IncludeCapability>'
      }
      soapBody += '</tds:GetServices>'
      let soapEnvelope = this.createRequest(soapBody)

      return Soap.makeRequest(this.serviceAddress, 'GetServices', soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (callback) {
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
    let promise = new Promise((resolve, reject) => {
      let soapBody = ''
      soapBody += '<tds:GetServiceCapabilities />'
      let soapEnvelope = this.createRequest(soapBody)

      return Soap.makeRequest(this.serviceAddress, 'GetServiceCapabilities', soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (callback) {
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
   * This method provides a backward compatible interface for the base capabilities. Refer to
   * GetServices for a full set of capabilities.<br>
   * Annex A describes how to interpret the indicated capability. Apart from the addresses, the
   * capabilities only reflect optional functions in this specification.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getCapabilities (callback) {
    let promise = new Promise((resolve, reject) => {
      let soapBody = ''
      soapBody += '<tds:GetCapabilities>'
      soapBody += '  <tds:Category>All</tds:Category>'
      soapBody += '</tds:GetCapabilities>'
      let soapEnvelope = this.createRequest(soapBody)
      return Soap.makeRequest(this.serviceAddress, 'GetCapabilities', soapEnvelope)
        .then(results => {
          resolve(results)
        })
        .catch(error => {
          reject(error)
        })
    })
    if (callback) {
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
    let promise = new Promise((resolve, reject) => {
      let soapBody = '<tds:GetHostname/>'
      let soapEnvelope = this.createRequest(soapBody)
      return Soap.makeRequest(this.serviceAddress, 'GetHostname', soapEnvelope)
        .then(results => {
          resolve(results)
        })
        .catch(error => {
          reject(error)
        })
    })
    if (callback) {
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
    let promise = new Promise((resolve, reject) => {
      let soapBody = ''
      soapBody += '<tds:SetHostname>'
      soapBody += '<tds:Name>' + name + '</tds:Name>'
      soapBody += '</tds:SetHostname>'
      let soapEnvelope = this.createRequest(soapBody)

      return Soap.makeRequest(this.serviceAddress, 'SetHostname', soapEnvelope)
        .then(result => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
    })
    if (callback) {
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
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets the DNS settings from a device. The device shall return its DNS
   * configurations through the GetDNS command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getDNS (callback) {
    let promise = new Promise((resolve, reject) => {
      let soapBody = '<tds:GetDNS/>'
      let soapEnvelope = this.createRequest(soapBody)

      return Soap.makeRequest(this.serviceAddress, 'GetDNS', soapEnvelope)
        .then((result) => {
          try {
            let di = result['data']['DNSInformation']
            if (!di['SearchDomain']) {
              di['SearchDomain'] = []
            }
            else if (!Array.isArray(di['SearchDomain'])) {
              di['SearchDomain'] = [di['SearchDomain']]
            }
            if (!di['DNSManual']) {
              di['DNSManual'] = []
            }
            else if (!Array.isArray(di['DNSManual'])) {
              di['DNSManual'] = [di['DNSManual']]
            }
            result['data'] = di
          }
          catch (e) {}
          resolve(result)
        })
        .catch((error) => {
          reject(error)
        })
    })
    if (callback) {
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
    let promise = new Promise((resolve, reject) => {
      let errMsg = ''
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
          let d = DNSManual[i]
          if ((errMsg = Util.isInvalidValue(d, 'object'))) {
            reject(new Error(`A "DNSManual" property for setDNS is invalid(${JSON.stringify(d)}): ` + errMsg))
            return
          }

          let type = d['type']
          if ((errMsg = Util.isInvalidValue(type, 'string'))) {
            reject(new Error('The "type" property for setDNS is invalid: ' + errMsg))
            return
          }
          else if (!type.match(/^(IPv4|IPv6)$/)) {
            reject(new Error('The "type" property for setDNS is invalid: The value must be either "IPv4" or "IPv6".'))
            return
          }

          if (type === 'IPv4') {
            if ((errMsg = Util.isInvalidValue(d['IPv4Address'], 'string'))) {
              reject(new Error('The "IPv4Address" property for setDNS is invalid: ' + errMsg))
              return
            }
          }
          else if (type === 'IPv6') {
            if ((errMsg = Util.isInvalidValue(d['IPv6Address'], 'string'))) {
              reject(new Error('The "IPv6Address" property for setDNS is invalid: ' + errMsg))
              return
            }
          }
        }
      }

      let soapBody = ''
      soapBody += '<tds:SetDNS>'
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
            soapBody += '<tt:Type>' + d['type'] + '</tt:Type>'
            if (d['type'] === 'IPv4') {
              soapBody += '<tt:IPv4Address>' + d['IPv4Address'] + '</tt:IPv4Address>'
            }
            else {
              soapBody += '<tt:IPv6Address>' + d['IPv6Address'] + '</tt:IPv6Address>'
            }
            soapBody += '</tds:DNSManual>'
          })
        }
      }
      soapBody += '</tds:SetDNS>'
      let soapEnvelope = this.createRequest(soapBody)

      return Soap.makeRequest(this.serviceAddress, 'SetDNS', soapEnvelope)
        .then((result) => {
          resolve(result)
        }).catch((error) => {
          reject(error)
        })
    })
    if (callback) {
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
    let promise = new Promise((resolve, reject) => {
      let soapBody = '<tds:GetNTP/>'
      let soapEnvelope = this.createRequest(soapBody)

      return Soap.makeRequest(this.serviceAddress, 'GetNTP', soapEnvelope)
        .then((result) => {
          resolve(result)
        }).catch((error) => {
          reject(error)
        })
    })
    if (callback) {
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
    let promise = new Promise((resolve, reject) => {
      let errMsg = ''
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
          let d = NTPManual[i]
          if ((errMsg = Util.isInvalidValue(d, 'object'))) {
            reject(new Error(`A "NTPManual" property for setNTP is invalid(${JSON.stringify(d)}): ` + errMsg))
            return
          }

          let type = d['type']
          if ((errMsg = Util.isInvalidValue(type, 'string'))) {
            reject(new Error('The "type" property for setNTP is invalid: ' + errMsg))
            return
          }
          else if (!type.match(/^(IPv4|IPv6)$/)) {
            reject(new Error('The "type" property for setNTP is invalid: The value must be either "IPv4" or "IPv6".'))
            return
          }

          if (type === 'IPv4') {
            if ((errMsg = Util.isInvalidValue(d['IPv4Address'], 'string'))) {
              reject(new Error('The "IPv4Address" property for setNTP is invalid: ' + errMsg))
              return
            }
          }
          else if (type === 'IPv6') {
            if ((errMsg = Util.isInvalidValue(d['IPv6Address'], 'string'))) {
              reject(new Error('The "IPv6Address" property for setNTP is invalid: ' + errMsg))
              return
            }
          }
        }
      }
      let soapBody = ''
      soapBody += '<tds:SetNTP>'
      soapBody += '<tds:FromDHCP>' + fromDHCP + '</tds:FromDHCP>'
      if (typeof NTPManual !== 'undefined' && NTPManual !== null) {
        if (NTPManual.length === 0) {
          soapBody += '<tds:NTPManual></tds:NTPManual>'
        }
        else {
          NTPManual.forEach((d) => {
            soapBody += '<tds:NTPManual>'
            soapBody += '<tt:Type>' + d['type'] + '</tt:Type>'
            if (d['type'] === 'IPv4') {
              soapBody += '<tt:IPv4Address>' + d['IPv4Address'] + '</tt:IPv4Address>'
            }
            else {
              soapBody += '<tt:IPv6Address>' + d['IPv6Address'] + '</tt:IPv6Address>'
            }
            soapBody += '</tds:NTPManual>'
          })
        }
      }
      soapBody += '</tds:SetNTP>'
      let soapEnvelope = this.createRequest(soapBody)

      return Soap.makeRequest(this.serviceAddress, 'SetNTP', soapEnvelope)
        .then((result) => {
          resolve(result)
        }).catch((error) => {
          reject(error)
        })
    })
    if (callback) {
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

  getDynamicDNS () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setDynamicDNS () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getNetworkInterfaces () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setNetworkInterfaces () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getNetworkProtocols () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setNetworkProtocols () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getNetworkDefaultGateway () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setNetworkDefaultGateway () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getZeroConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setZeroConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getIPAddressFilter () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
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

  getDot11Capabilities () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getDot11Status () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  scanAvailableDot11Networks () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation gets device information, such as manufacturer, model and firmware version
   * from a device. The device shall support the return of device information through the
   * GetDeviceInformation command.
   */
  getDeviceInformation () {
    return new Promise((resolve, reject) => {
      let soapBody = '<tds:GetDeviceInformation/>'
      let soapEnvelope = this.createRequest(soapBody)
      return Soap.makeRequest(this.serviceAddress, 'GetDeviceInformation', soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
  }

  getSystemUris () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getSystemBackup () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
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
   */
  getSystemDateAndTime () {
    return new Promise((resolve, reject) => {
      let soapBody = '<tds:GetSystemDateAndTime/>'
      let soapEnvelope = this.createRequest(soapBody)
      return Soap.makeRequest(this.serviceAddress, 'GetSystemDateAndTime', soapEnvelope)
        .then(results => {
          let parsed = this.parseGetSystemDateAndTime(results['data'])
          if (parsed && parsed['date']) {
            let deviceTime = parsed['date'].getTime()
            let localTime = (new Date()).getTime()
            this.timeDiff = deviceTime - localTime
            // console.log('this.timeDiff', this.timeDiff)
          }
          resolve(results)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   *
   * @param {object} s GetSystemDateAndTimeResponse converted to JSON.
   */
  parseGetSystemDateAndTime (s) {
    let s0 = s
    if (!s0) {
      return null
    }
    let s1 = s0['GetSystemDateAndTimeResponse']
    if (!s1) {
      return null
    }
    let s2 = s1['SystemDateAndTime']
    if (!s2) {
      return null
    }

    let type = s2['DateTimeType'] || ''
    let dst = null
    if (s2['DaylightSavings']) {
      dst = (s2['DaylightSavings'] === 'true')
    }
    let tz = (s2['TimeZone'] && s2['TimeZone']['TZ']) ? s2['TimeZone']['TZ'] : ''
    let date = null
    if (s2['UTCDateTime']) {
      let udt = s2['UTCDateTime']
      let t = udt['Time']
      let d = udt['Date']
      if (t && d && t['Hour'] && t['Minute'] && t['Second'] && d['Year'] && d['Month'] && d['Day']) {
        date = new Date()
        date.setUTCFullYear(parseInt(d['Year'], 10))
        date.setUTCMonth(parseInt(d['Month'], 10) - 1)
        date.setUTCDate(parseInt(d['Day'], 10))
        date.setUTCHours(parseInt(t['Hour'], 10))
        date.setUTCMinutes(parseInt(t['Minute'], 10))
        date.setUTCSeconds(parseInt(t['Second'], 10))
      }
    }
    let res = {
      'type': type,
      'dst': dst,
      'tz': tz,
      'date': date
    }
    return res
  };

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

  getSystemLog () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getSystemSupportInformation () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation reboots the device.
   * @returns Contains the reboot message from the device (ie: Rebooting in 90 seconds).
   */
  systemReboot () {
    return new Promise((resolve, reject) => {
      let soapBody = '<tds:SystemReboot/>'
      let soapEnvelope = this.createRequest(soapBody)
      return Soap.makeRequest(this.serviceAddress, 'SystemReboot', soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
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
   * ONVIF™ – 71 – ONVIF Core Spec. – Ver. 17.12
   * scope parameters through the GetScopes command. As some scope parameters are
   * mandatory, the device shall return a non-empty scope list in the response.
   */
  getScopes () {
    return new Promise((resolve, reject) => {
      let soapBody = '<tds:GetScopes/>'
      let soapEnvelope = this.createRequest(soapBody)
      return Soap.makeRequest(this.serviceAddress, 'GetScopes', soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
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

  getGeoLocation () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
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

  getDiscoveryMode () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setDiscoveryMode () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getRemoteDiscoveryMode () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setRemoteDiscoveryMode () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getDPAddresses () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setDPAddresses () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAccessPolicy () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setAccessPolicy () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getUsers () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
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

  getDot1XConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getDot1XConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
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

  getCertificates () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCACertificates () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCertificatesStatus () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
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

  getClientCertificateMode () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
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

  getRemoteUser () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setRemoteUser () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getEndpointReference () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getRelayOutputs () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
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

module.exports = new Core()
