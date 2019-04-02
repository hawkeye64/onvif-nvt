const Soap = require('../utils/soap');

const Util = require('../utils/util');

class Analytics {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tns1="http://www.onvif.org/ver10/topics"', 'xmlns:tan="http://www.onvif.org/ver10/analytics"', 'xmlns:ttr="http://www.onvif.org/ver10/analytics/radiometry"'];
  }

  init(timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff;
    this.serviceAddress = serviceAddress;
    this.username = username;
    this.password = password;
  }

  createRequest(body) {
    let soapEnvelope = this.soap.createRequest({
      'body': body,
      'xmlns': this.namespaceAttributes,
      'diff': this.timeDiff,
      'username': this.username,
      'password': this.password
    });
    return soapEnvelope;
  }

  buildRequest(methodName, xml, callback) {
    let promise = new Promise((resolve, reject) => {
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
        soapBody += `<tan:${methodName}/>`;
      } else {
        soapBody += `<tan:${methodName}>`;
        soapBody += xml;
        soapBody += `</tan:${methodName}>`;
      }

      let soapEnvelope = this.createRequest(soapBody);
      this.soap.makeRequest('analytics', this.serviceAddress, methodName, soapEnvelope).then(results => {
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

  requestWithConfigurationToken(methodName, configurationToken, xml, callback) {
    let promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error(`The "callback" argument for ${methodName} is invalid:` + errMsg));
          return;
        }
      }

      if (errMsg = Util.isInvalidValue(configurationToken, 'string')) {
        reject(new Error(`The "configurationToken" argument for ${methodName} is invalid: ` + errMsg));
        return;
      }

      if (typeof xml !== 'undefined' && xml !== null) {
        if (errMsg = Util.isInvalidValue(xml, 'xml')) {
          reject(new Error(`The "xml" argument for ${methodName} is invalid: ` + errMsg));
          return;
        }
      }

      let soapBody = '';
      soapBody += '<tan:ConfigurationToken>' + configurationToken + '</tan:ConfigurationToken>';

      if (typeof xml !== 'undefined' && xml !== null) {
        soapBody += xml;
      }

      this.buildRequest(methodName, soapBody).then(results => {
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

  createAnalyticsModules(configurationToken, xml, callback) {
    return this.requestWithConfigurationToken('CreateAnalyticsModules', configurationToken, xml, callback);
  }

  deleteAnalyticsModules(configurationToken, analyticsModuleName, callback) {
    let soapBody = '<tan:AnalyticsModuleName>' + analyticsModuleName + '</tan:AnalyticsModuleName>';
    return this.requestWithConfigurationToken('DeleteAnalyticsModules', configurationToken, soapBody, callback);
  }

  getAnalyticsModuleOptions(configurationToken, type, callback) {
    let soapBody = '<tan:Type>' + type + '</tan:Type>';
    return this.requestWithConfigurationToken('GetAnalyticsModuleOptions', configurationToken, soapBody, callback);
  }

  getAnalyticsModules(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetAnalyticsModules', configurationToken, null, callback);
  }

  getServiceCapabilities(callback) {
    return this.buildRequest('GetServiceCapabilities', null, callback);
  }

  getSupportedAnalyticsModules(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetSupportedAnalyticsModules', configurationToken, null, callback);
  }

  modifyAnalyticsModules(configurationToken, xml, callback) {
    return this.requestWithConfigurationToken('ModifyAnalyticsModules', configurationToken, xml, callback);
  }

  createRules(configurationToken, xml, callback) {
    return this.requestWithConfigurationToken('CreateRules', configurationToken, xml, callback);
  }

  deleteRules(configurationToken, ruleName, callback) {
    let soapBody = '<tan:RuleName>' + ruleName + '</tan:RuleName>';
    return this.requestWithConfigurationToken('DeleteRules', configurationToken, soapBody, callback);
  }

  getRuleOptions(configurationToken, ruleType, callback) {
    let soapBody = '<tan:RuleType>' + ruleType + '</tan:RuleType>';
    return this.requestWithConfigurationToken('GetRuleOptions', configurationToken, soapBody, callback);
  }

  getRules(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetRules', configurationToken, null, callback);
  }

  getSupportedRules(configurationToken, callback) {
    return this.requestWithConfigurationToken('GetSupportedRules', configurationToken, null, callback);
  }

  modifyRules(configurationToken, xml, callback) {
    return this.requestWithConfigurationToken('ModifyRules', configurationToken, xml, callback);
  }

}

module.exports = Analytics;