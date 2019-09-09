const Soap = require('../utils/soap');

const Util = require('../utils/util');

class Core {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tds="http://www.onvif.org/ver10/device/wsdl"'];
  }

  init(serviceAddress, username, password) {
    this.serviceAddress = serviceAddress;
    this.username = username;
    this.password = password;
  }

  createRequest(body) {
    const soapEnvelope = this.soap.createRequest({
      body: body,
      xmlns: this.namespaceAttributes,
      diff: this.timeDiff,
      username: this.username,
      password: this.password
    });
    return soapEnvelope;
  }

  buildRequest(methodName, xml, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error(`The "callback" argument for ${methodName} is invalid:` + errMsg));
          return;
        }
      }

      if (typeof methodName === 'undefined' || methodName === null) {
        reject(new Error('The "methodName" argument for buildRequest is required.'));
        return;
      } else {
        if (errMsg = Util.isInvalidValue(methodName, 'string')) {
          reject(new Error('The "methodName" argument for buildRequest is invalid:' + errMsg));
          return;
        }
      }

      let soapBody = '';

      if (typeof xml === 'undefined' || xml === null || xml === '') {
        soapBody += `<tds:${methodName}/>`;
      } else {
        soapBody += `<tds:${methodName}>`;
        soapBody += xml;
        soapBody += `</tds:${methodName}>`;
      }

      const soapEnvelope = this.createRequest(soapBody);
      this.soap.makeRequest('core', this.serviceAddress, methodName, soapEnvelope).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getTimeDiff() {
    return this.timeDiff;
  }

  getWsdlUrl(callback) {
    return this.buildRequest('GetWsdlUrl', null, callback);
  }

  getServices(includeCapability, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getServices is invalid:' + errMsg));
          return;
        }
      }

      if (typeof includeCapability !== 'undefined' && includeCapability !== null) {
        if (errMsg = Util.isInvalidValue(includeCapability, 'boolean')) {
          reject(new Error('The "includeCapability" argument for getServices is invalid: ' + errMsg));
          return;
        }
      }

      let soapBody = '';

      if (typeof includeCapability !== 'undefined' && includeCapability !== null) {
        soapBody += '<tds:IncludeCapability>' + includeCapability + '</tds:IncludeCapability>';
      }

      this.buildRequest('GetServices', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getServiceCapabilities(callback) {
    return this.buildRequest('GetServiceCapabilities', null, callback);
  }

  getCapabilities(callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getCapabilities is invalid:' + errMsg));
          return;
        }
      }

      let soapBody = '';
      soapBody += '<tds:Category>All</tds:Category>';
      this.buildRequest('GetCapabilities', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getHostname(callback) {
    return this.buildRequest('GetHostname', null, callback);
  }

  setHostname(name, callback) {
    name = name || '';
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for setHostname is invalid:' + errMsg));
          return;
        }
      }

      let soapBody = '';
      soapBody += '<tds:Name>' + name + '</tds:Name>';
      this.buildRequest('SetHostname', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(result => {
        callback(null, result);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  setHostnameFromDHCP(fromDHCP, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for setHostnameFromDHCP is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(fromDHCP, 'boolean')) {
        reject(new Error('The "fromDHCP" argument for setHostnameFromDHCP is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tds:FromDHCP>' + fromDHCP + '</tds:FromDHCP>';
      this.buildRequest('SetHostnameFromDHCP', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(result => {
        callback(null, result);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getDNS(callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getDNS is invalid:' + errMsg));
          return;
        }
      }

      this.buildRequest('GetDNS').then(result => {
        try {
          const di = result.data.DNSInformation;

          if (!di.SearchDomain) {
            di.SearchDomain = [];
          } else if (!Array.isArray(di.SearchDomain)) {
            di.SearchDomain = [di.SearchDomain];
          }

          if (!di.DNSManual) {
            di.DNSManual = [];
          } else if (!Array.isArray(di.DNSManual)) {
            di.DNSManual = [di.DNSManual];
          }

          result.data = di;
        } catch (e) {}

        resolve(result);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(result => {
        callback(null, result);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  setDNS(fromDHCP, searchDomain, DNSManual, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for setDNS is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(fromDHCP, 'boolean')) {
        reject(new Error('The "fromDHCP" argument for setDNS is invalid: ' + errMsg));
        return;
      }

      if (typeof searchDomain !== 'undefined' && searchDomain !== null) {
        if (errMsg = Util.isInvalidValue(searchDomain, 'array', true)) {
          reject(new Error('The "searchDomain" argument for setDNS is invalid: ' + errMsg));
          return;
        }

        for (let i = 0; i < searchDomain.length; i++) {
          if (errMsg = Util.isInvalidValue(searchDomain[i], 'string')) {
            reject(new Error(`A "searchDomain" property was invalid(${searchDomain[i]}): ` + errMsg));
            return;
          }
        }
      }

      if (typeof DNSManual !== 'undefined' && DNSManual !== null) {
        if (errMsg = Util.isInvalidValue(DNSManual, 'array', true)) {
          reject(new Error('The "DNSManual" argument for setDNS is invalid: ' + errMsg));
          return;
        }

        for (let i = 0; i < DNSManual.length; i++) {
          const d = DNSManual[i];

          if (errMsg = Util.isInvalidValue(d, 'object')) {
            reject(new Error(`A "DNSManual" property for setDNS is invalid(${JSON.stringify(d)}): ` + errMsg));
            return;
          }

          const type = d.type;

          if (errMsg = Util.isInvalidValue(type, 'string')) {
            reject(new Error('The "type" property for setDNS is invalid: ' + errMsg));
            return;
          } else if (!type.match(/^(IPv4|IPv6)$/)) {
            reject(new Error('The "type" value for setDNS is invalid: The value must be either "IPv4" or "IPv6".'));
            return;
          }

          if (type === 'IPv4') {
            if (errMsg = Util.isInvalidValue(d.IPv4Address, 'string')) {
              reject(new Error('The "IPv4Address" property for setDNS is invalid: ' + errMsg));
              return;
            }
          } else if (type === 'IPv6') {
            if (errMsg = Util.isInvalidValue(d.IPv6Address, 'string')) {
              reject(new Error('The "IPv6Address" property for setDNS is invalid: ' + errMsg));
              return;
            }
          }
        }
      }

      let soapBody = '';
      soapBody += '<tds:FromDHCP>' + fromDHCP + '</tds:FromDHCP>';

      if (typeof searchDomain !== 'undefined' && searchDomain !== null) {
        searchDomain.forEach(s => {
          soapBody += '<tds:SearchDomain>' + s + '</tds:SearchDomain>';
        });
      }

      if (typeof DNSManual !== 'undefined' && DNSManual !== null) {
        if (DNSManual.length === 0) {
          soapBody += '<tds:DNSManual></tds:DNSManual>';
        } else {
          DNSManual.forEach(d => {
            soapBody += '<tds:DNSManual>';
            soapBody += '<tt:Type>' + d.type + '</tt:Type>';

            if (d.type === 'IPv4') {
              soapBody += '<tt:IPv4Address>' + d.IPv4Address + '</tt:IPv4Address>';
            } else {
              soapBody += '<tt:IPv6Address>' + d.IPv6Address + '</tt:IPv6Address>';
            }

            soapBody += '</tds:DNSManual>';
          });
        }
      }

      this.buildRequest('SetDNS', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(result => {
        callback(null, result);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getNTP(callback) {
    return this.buildRequest('GetNTP', null, callback);
  }

  setNTP(fromDHCP, NTPManual, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for setNTP is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(fromDHCP, 'boolean')) {
        reject(new Error('The "fromDHCP" argument for setNTP is invalid: ' + errMsg));
        return;
      }

      if (typeof NTPManual !== 'undefined' && NTPManual !== null) {
        if (errMsg = Util.isInvalidValue(NTPManual, 'array', true)) {
          reject(new Error('The "NTPManual" argument for setNTP is invalid: ' + errMsg));
          return;
        }

        for (let i = 0; i < NTPManual.length; i++) {
          const d = NTPManual[i];

          if (errMsg = Util.isInvalidValue(d, 'object')) {
            reject(new Error(`A "NTPManual" property for setNTP is invalid(${JSON.stringify(d)}): ` + errMsg));
            return;
          }

          const type = d.type;

          if (errMsg = Util.isInvalidValue(type, 'string')) {
            reject(new Error('The "type" property for setNTP is invalid: ' + errMsg));
            return;
          } else if (!type.match(/^(IPv4|IPv6)$/)) {
            reject(new Error('The "type" value for setNTP is invalid: The value must be either "IPv4" or "IPv6".'));
            return;
          }

          if (type === 'IPv4') {
            if (errMsg = Util.isInvalidValue(d.IPv4Address, 'string')) {
              reject(new Error('The "IPv4Address" property for setNTP is invalid: ' + errMsg));
              return;
            }
          } else if (type === 'IPv6') {
            if (errMsg = Util.isInvalidValue(d.IPv6Address, 'string')) {
              reject(new Error('The "IPv6Address" property for setNTP is invalid: ' + errMsg));
              return;
            }
          }
        }
      }

      let soapBody = '';
      soapBody += '<tds:FromDHCP>' + fromDHCP + '</tds:FromDHCP>';

      if (typeof NTPManual !== 'undefined' && NTPManual !== null) {
        if (NTPManual.length === 0) {
          soapBody += '<tds:NTPManual></tds:NTPManual>';
        } else {
          NTPManual.forEach(d => {
            soapBody += '<tds:NTPManual>';
            soapBody += '<tt:Type>' + d.type + '</tt:Type>';

            if (d.type === 'IPv4') {
              soapBody += '<tt:IPv4Address>' + d.IPv4Address + '</tt:IPv4Address>';
            } else {
              soapBody += '<tt:IPv6Address>' + d.IPv6Address + '</tt:IPv6Address>';
            }

            soapBody += '</tds:NTPManual>';
          });
        }
      }

      this.buildRequest('SetNTP', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(result => {
        callback(null, result);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getDynamicDNS(callback) {
    return this.buildRequest('GetDynamicDNS', null, callback);
  }

  setDynamicDNS(type, name, ttl, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for setDynamicDNS is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(type, 'string')) {
        reject(new Error('The "type" argument for setDynamicDNS is invalid: ' + errMsg));
        return;
      } else if (!type.match(/^(NoUpdate|ServerUpdates|ClientUpdates)$/)) {
        reject(new Error('The "type" value for setDynamicDNS is invalid: The value must be either "IPv4" or "IPv6".'));
        return;
      }

      if (typeof name !== 'undefined' && name !== null) {
        if (errMsg = Util.isInvalidValue(name, 'string', true)) {
          reject(new Error('The "name" argument for setDynamicDNS is invalid: ' + errMsg));
          return;
        }
      }

      if (typeof ttl !== 'undefined' && ttl !== null) {
        if (errMsg = Util.isInvalidValue(ttl, 'integer')) {
          reject(new Error('The "ttl" argument for setDynamicDNS is invalid: ' + errMsg));
          return;
        }
      }

      let soapBody = '';
      soapBody += '<tds:SetDynamicDNS>';
      soapBody += '<tt:Type>' + type + '</tt:Type>';

      if (typeof name !== 'undefined' && name !== null) {
        soapBody += '<tt:Name>' + name + '</tt:Name>';
      }

      if (typeof ttl !== 'undefined' && ttl !== null) {
        soapBody += '<tt:TTL>' + ttl + '</tt:TTL>';
      }

      soapBody += '</tds:SetDynamicDNS>';
      const soapEnvelope = this.createRequest(soapBody);
      return this.soap.makeRequest('core', this.serviceAddress, 'SetDynamicDNS', soapEnvelope).then(result => {
        resolve(result);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(result => {
        callback(null, result);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getNetworkInterfaces(callback) {
    return this.buildRequest('GetNetworkInterfaces', null, callback);
  }

  setNetworkInterfaces() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getNetworkProtocols(callback) {
    return this.buildRequest('GetNetworkProtocols', null, callback);
  }

  setNetworkProtocols() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getNetworkDefaultGateway(callback) {
    return this.buildRequest('GetNetworkDefaultGateway', null, callback);
  }

  setNetworkDefaultGateway() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getZeroConfiguration(callback) {
    return this.buildRequest('GetZeroConfiguration', null, callback);
  }

  setZeroConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getIPAddressFilter(callback) {
    return this.buildRequest('GetIPAddressFilter', null, callback);
  }

  setIPAddressFilter() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  addIPAddressFilter() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  removeIPAddressFilter() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getDot11Capabilities(callback) {
    return this.buildRequest('GetDot11Capabilities', null, callback);
  }

  getDot11Status(interfaceToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getDot11Status is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(interfaceToken, 'string')) {
        reject(new Error('The "interfaceToken" argument for getDot11Status is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tt:InterfaceToken>' + interfaceToken + '</tt:InterfaceToken>';
      this.buildRequest('GetDot11Status', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(result => {
        callback(null, result);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  scanAvailableDot11Networks(interfaceToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for scanAvailableDot11Networks is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(interfaceToken, 'string')) {
        reject(new Error('The "interfaceToken" argument for scanAvailableDot11Networks is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tt:ReferenceToken>' + interfaceToken + '</tt:ReferenceToken>';
      this.buildRequest('ScanAvailableDot11Networks', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(result => {
        callback(null, result);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getDeviceInformation(callback) {
    return this.buildRequest('GetDeviceInformation', null, callback);
  }

  getSystemUris(callback) {
    return this.buildRequest('GetSystemUris', null, callback);
  }

  getSystemBackup(callback) {
    return this.buildRequest('GetSystemBackup', null, callback);
  }

  restoreSystem() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  startSystemRestore() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getSystemDateAndTime(callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getSystemDateAndTime is invalid:' + errMsg));
          return;
        }
      }

      this.buildRequest('GetSystemDateAndTime').then(results => {
        const parsed = this.parseGetSystemDateAndTime(results.data);

        if (parsed && parsed.date) {
          const deviceTime = parsed.date.getTime();
          const localTime = new Date().getTime();
          this.timeDiff = deviceTime - localTime;
        }

        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(result => {
        callback(null, result);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  parseGetSystemDateAndTime(sdt) {
    const s0 = sdt;

    if (!s0) {
      return null;
    }

    const s1 = s0.GetSystemDateAndTimeResponse;

    if (!s1) {
      return null;
    }

    const s2 = s1.SystemDateAndTime;

    if (!s2) {
      return null;
    }

    const type = s2.DateTimeType || '';
    let dst = null;

    if (s2.DaylightSavings) {
      dst = s2.DaylightSavings === 'true';
    }

    const tz = s2.TimeZone && s2.TimeZone.TZ ? s2.TimeZone.TZ : '';
    let date = null;

    if (s2.UTCDateTime) {
      const udt = s2.UTCDateTime;
      const t = udt.Time;
      const d = udt.Date;

      if (t && d && t.Hour && t.Minute && t.Second && d.Year && d.Month && d.Day) {
        date = new Date();
        date.setUTCFullYear(parseInt(d.Year, 10));
        date.setUTCMonth(parseInt(d.Month, 10) - 1);
        date.setUTCDate(parseInt(d.Day, 10));
        date.setUTCHours(parseInt(t.Hour, 10));
        date.setUTCMinutes(parseInt(t.Minute, 10));
        date.setUTCSeconds(parseInt(t.Second, 10));
      }
    }

    const res = {
      type: type,
      dst: dst,
      tz: tz,
      date: date
    };
    return res;
  }

  setSystemDateAndTime() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setSystemFactoryDefault() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  upgradeSystemFirmware() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  startFirmwareUpgrade() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getSystemLog(logType, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getSystemLog is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(logType, 'string')) {
        reject(new Error('The "logType" argument for getSystemLog is invalid: ' + errMsg));
        return;
      }

      if (!logType.match(/^(System|Access)$/)) {
        reject(new Error('The "logType" value for getSystemLog is invalid: The value must be either "System" or "Access".'));
        return;
      }

      let soapBody = '';
      soapBody += '<tt:LogType>' + logType + '</tt:LogType>';
      this.buildRequest('GetSystemLog', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(result => {
        callback(null, result);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getSystemSupportInformation(callback) {
    return this.buildRequest('GetSystemSupportInformation', null, callback);
  }

  systemReboot(callback) {
    return this.buildRequest('SystemReboot', null, callback);
  }

  getScopes(callback) {
    return this.buildRequest('GetScopes', null, callback);
  }

  setScopes() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  addScopes() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  removeScopes() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getGeoLocation(callback) {
    return this.buildRequest('GetGeoLocation', null, callback);
  }

  setGeoLocation() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteGeoLocation() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getDiscoveryMode(callback) {
    return this.buildRequest('GetDiscoveryMode', null, callback);
  }

  setDiscoveryMode() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getRemoteDiscoveryMode(callback) {
    return this.buildRequest('GetRemoteDiscoveryMode', null, callback);
  }

  setRemoteDiscoveryMode() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getDPAddresses(callback) {
    return this.buildRequest('GetDPAddresses', null, callback);
  }

  setDPAddresses() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAccessPolicy(callback) {
    return this.buildRequest('GetAccessPolicy', null, callback);
  }

  setAccessPolicy() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getUsers(callback) {
    return this.buildRequest('GetUsers', null, callback);
  }

  createUsers() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteUsers() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setUser() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createDot1XConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setDot1XConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getDot1XConfiguration(dot1XConfigurationToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for getDot11XConfiguration is invalid:' + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(dot1XConfigurationToken, 'string')) {
        reject(new Error('The "dot1XConfigurationToken" argument for getDot1XConfiguration is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody += '<tds:Dot1XConfigurationToken>' + dot1XConfigurationToken + '</tds:Dot1XConfigurationToken>';
      this.buildRequest('GetDot1XConfiguration', soapBody).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  getDot1XConfigurations(callback) {
    return this.buildRequest('GetDot1XConfigurations', null, callback);
  }

  deleteDot1XConfigurations() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createCertificate() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getCertificates(callback) {
    return this.buildRequest('GetCertificates', null, callback);
  }

  getCACertificates(callback) {
    return this.buildRequest('GetCACertificates', null, callback);
  }

  getCertificatesStatus(callback) {
    return this.buildRequest('GetCertificatesStatus', null, callback);
  }

  setCertificatesStatus() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getPkcs10Request() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getClientCertificateMode(callback) {
    return this.buildRequest('GetClientCertificateMode', null, callback);
  }

  setClientCertificateMode() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  loadCertificates() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  loadCertificateWithPrivateKey() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getCertificateInformation() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  loadCACertificates() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteCertificates() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getRemoteUser(callback) {
    return this.buildRequest('GetRemoteUser', null, callback);
  }

  setRemoteUser() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getEndpointReference(callback) {
    return this.buildRequest('GetEndpointReference', null, callback);
  }

  getRelayOutputs(callback) {
    return this.buildRequest('GetRelayOutputs', null, callback);
  }

  setRelayOutputSettings() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setRelayOutputState() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  sendAuxiliaryCommand() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

}

module.exports = Core;