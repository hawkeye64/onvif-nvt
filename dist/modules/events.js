const EventEmitter = require('events').EventEmitter;

const Soap = require('../utils/soap');

const Util = require('../utils/util');

const URL = require('url-parse');

class Events extends EventEmitter {
  constructor() {
    super();
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tev="http://www.onvif.org/ver10/events/wsdl"'];
    this.intervalId = null;
  }

  init(timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff;
    this.serviceAddress = serviceAddress;
    this.username = username;
    this.password = password;
  }

  createRequest(body, subscriptionId) {
    const request = {
      body: body,
      xmlns: this.namespaceAttributes,
      diff: this.timeDiff,
      username: this.username,
      password: this.password
    };

    if (subscriptionId) {
      request.subscriptionId = subscriptionId;
    }

    const soapEnvelope = this.soap.createRequest(request);
    return soapEnvelope;
  }

  buildRequest(methodName, xml, subscriptionId, callback) {
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

      if (methodName === 'PullMessages') {
        soapBody = xml;
      } else if (typeof xml === 'undefined' || xml === null || xml === '') {
        soapBody += `<tev:${methodName}/>`;
      } else {
        soapBody += `<tev:${methodName}>`;
        soapBody += xml;
        soapBody += `</tev:${methodName}>`;
      }

      const soapEnvelope = this.createRequest(soapBody, subscriptionId);
      let serviceAddress = this.serviceAddress;

      if (methodName === 'PullMessages') {
        serviceAddress = new URL(subscriptionId.Address);
      }

      this.soap.makeRequest('events', serviceAddress, methodName, soapEnvelope).then(results => {
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

  startPull(loopTimeMS, timeout, messageLimit) {
    loopTimeMS = loopTimeMS || 10000;
    timeout = timeout || 'PT1M';
    messageLimit = messageLimit || 1;

    const getAll = () => {
      this._getMessages(timeout, messageLimit).then(results => {
        this.emit('messages', results);
        console.log(results);
      }).catch(error => {
        this.emit('messages:error', error);
      });
    };

    this.intervalId = setInterval(() => {
      getAll();
    }, loopTimeMS);
  }

  stopPull() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  _getMessages(timeout, messageLimit) {
    return new Promise((resolve, reject) => {
      this._createPullPointSubscription().then(results => {
        this._pullMessages(results, timeout, messageLimit).then(results => {
          resolve(results);
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }

  _createPullPointSubscription() {
    return new Promise((resolve, reject) => {
      this.createPullPointSubscription().then(results => {
        console.log('CreatePullPointSubscription successful');
        const response = results.data.CreatePullPointSubscriptionResponse;
        const reference = response.SubscriptionReference;
        let subscriptionId = {};

        if (reference.ReferenceParameters) {
          subscriptionId = reference.ReferenceParameters.SubscriptionId;
        }

        subscriptionId.Address = reference.Address;
        resolve(subscriptionId);
      }).catch(error => {
        reject(error);
      });
    });
  }

  _pullMessages(subscriptionId, timeout, messageLimit) {
    return new Promise((resolve, reject) => {
      this.pullMessages(subscriptionId, timeout, messageLimit).then(results => {
        resolve(results);
      }).catch(error => {
        reject(error);
      });
    });
  }

  createPullPointSubscription(filter, initialTerminationTime, subscriptionPolicy, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof filter !== 'undefined' && filter !== null) {
        if (errMsg = Util.isInvalidValue(filter, 'string')) {
          reject(new Error('The "filter" argument for createPullPointSubscription is invalid: ' + errMsg));
          return;
        }
      }

      if (typeof initialTerminationTime !== 'undefined' && initialTerminationTime !== null) {
        if (errMsg = Util.isInvalidValue(initialTerminationTime, 'string')) {
          reject(new Error('The "initialTerminationTime" argument for createPullPointSubscription is invalid: ' + errMsg));
          return;
        }
      }

      if (typeof subscriptionPolicy !== 'undefined' && subscriptionPolicy !== null) {
        if (errMsg = Util.isInvalidValue(subscriptionPolicy, 'string')) {
          reject(new Error('The "subscriptionPolicy" argument for createPullPointSubscription is invalid: ' + errMsg));
          return;
        }
      }

      let soapBody = '';

      if (typeof filter !== 'undefined' && filter !== null) {
        soapBody += '<tev:Filter>' + filter + '</tev:Filter>';
      }

      if (typeof initialTerminationTime !== 'undefined' && initialTerminationTime !== null) {
        soapBody += '<tev:InitialTerminationTime>' + 'PT' + initialTerminationTime / 1000 + 'S' + '</tev:InitialTerminationTime>';
      }

      if (typeof subscriptionPolicy !== 'undefined' && subscriptionPolicy !== null) {
        soapBody += '<tev:SubscriptionPolicy>' + subscriptionPolicy + '</tev:SubscriptionPolicy>';
      }

      this.buildRequest('CreatePullPointSubscription', soapBody).then(results => {
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

  getEventProperties(callback) {
    return this.buildRequest('GetEventProperties', null, null, callback);
  }

  getServiceCapabilities(callback) {
    return this.buildRequest('GetServiceCapabilities', null, null, callback);
  }

  pullMessages(subscriptionId, timeout, messageLimit, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (errMsg = Util.isInvalidValue(timeout, 'string')) {
        reject(new Error('The "timeout" argument for pullMessages is invalid: ' + errMsg));
        return;
      }

      if (errMsg = Util.isInvalidValue(messageLimit, 'integer')) {
        reject(new Error('The "messageLimit" argument for pullMessages is invalid: ' + errMsg));
        return;
      }

      let soapBody = '';
      soapBody = '<tev:PullMessages>';
      soapBody += '<tev:Timeout>';
      soapBody += timeout;
      soapBody += '</tev:Timeout>';
      soapBody += '<tev:MessageLimit>';
      soapBody += messageLimit.toString();
      soapBody += '</tev:MessageLimit>';
      soapBody += '</tev:PullMessages>';
      this.buildRequest('PullMessages', soapBody, subscriptionId).then(results => {
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

  renew(callback) {
    return this.buildRequest('Renew', null, null, callback);
  }

  seek(utcTime, reverse, callback) {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  subscribe(callback) {
    return this.buildRequest('Subscribe', null, null, callback);
  }

  unsubscribe(callback) {
    return this.buildRequest('Unsubscribe', null, null, callback);
  }

  setSynchronizationPoint(callback) {
    return this.buildRequest('SetSynchronizationPoint', null, null, callback);
  }

}

module.exports = Events;