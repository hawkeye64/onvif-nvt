const EventEmitter = require('events').EventEmitter
const Soap = require('../utils/soap')
const Util = require('../utils/util')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/ver10/events/wsdl/event.wsdl}<br>
 * {@link https://www.onvif.org/wp-content/uploads/2017/07/ONVIF_Event_Handling_Test_Specification_v17.06.pdf}<br>
 * </p>
 * <h3>Functions</h3>
 * createPullPointSubscription,
 * {@link Events#getEventProperties},
 * {@link Events#getServiceCapabilities},
 * pullMessages,
 * seek,
 * {@link Events#setSynchronizationPoint}
 * <br><br>
 * <h3>Overview</h3>
 * An event is an action or occurrence detected by a device that a client can subscribe to.<br>
 * Events are handled through the event service. This specification defines event handling
 * based on the [WS-BaseNotification] and [WS-Topics] specifications. It extends the event
 * notion to allow clients to track object properties (such as digital input and motion alarm
 * properties) through events. Properties are defined in Section 9.4.<br>
 * The description of event payload and their filtering within subscriptions is discussed in section
 * 9.5. Section 9.6 describes how a synchronization point can be requested by clients using one
 * of the three notification interfaces. Section 9.7 describes the integration of Topics and section
 * 9.10 discusses the handling of faults.<br>
 * Section 9.11 demonstrates the usage of the Real-Time Pull-Point Notification Interface
 * including Message Filtering and Topic Set. Examples for the basic notification interface can
 * be found in the corresponding [WS-BaseNotification] specification.<br>
 * An ONVIF compliant device shall provide an event service as defined in [ONVIF Event WSDL].<br>
 * Both device and client shall support [WS-Addressing] for event services.
 * <br><br>
 * <h3>Push Events</h3>
 * <ul>
 * <li> -> GetEventProperties</li>
 * <li> <- GetEventPropertiesResponse</li>
 * <li> -> Subscribe (specifying URI of your server)</li>
 * <li> <- Notify</li>
 * <li> -> Renew (specifying termination time)</li>
 * <li> <- RenewResponse</li>
 * <li> -> Unsubscribe</li>
 * <li> <- UnsubscribeResponse</li>
 * </ul>
 * <h3>Pull Events</h3>
 * <ul>
 * <li> -> GetEventProperties</li>
 * <li> <- GetEventPropertiesResponse</li>
 * <li> -> CreatePullPointSubscription</li>
 * <li> <- CreatePullPointSubscriptionResponse</li>
 * <li> -> PullMessages</li>
 * <li> -> PullMessagesResponse</li>
 * <li> -> Renew (specifying termination time)</li>
 * <li> <- RenewResponse</li>
 * <li> -> Unsubscribe</li>
 * <li> <- UnsubscribeResponse</li>
 * </ul>
 */
class Events extends EventEmitter {
  constructor () {
    super() // must call super for "this" to be defined.

    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      'xmlns:tev="http://www.onvif.org/ver10/events/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating an Events object.
   * @param {number} timeDiff The onvif device's time difference.
   * @param {object} serviceAddress An url object from url package - require('url').
   * @param {string=} username Optional only if the device does NOT have a user.
   * @param {string=} password Optional only if the device does NOT have a password.
   */
  init (timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff
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

  buildRequest (methodName, xml, callback) {
    let promise = new Promise((resolve, reject) => {
      let soapBody = ''
      if (typeof xml === 'undefined' || xml === null || xml === '') {
        soapBody += `<tev:${methodName}/>`
      }
      else {
        soapBody += `<tev:${methodName}>`
        soapBody += xml
        soapBody += `</tev:${methodName}>`
      }
      let soapEnvelope = this.createRequest(soapBody)
      return Soap.makeRequest(this.serviceAddress, methodName, soapEnvelope)
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

  buildRequest2 (methodName, ns, xml, callback) {
    let promise = new Promise((resolve, reject) => {
      let soapBody = ''
      if (typeof xml === 'undefined' || xml === null || xml === '') {
        soapBody += `<${methodName} ${ns}/>`
      }
      else {
        soapBody += `<${methodName} ${ns}>`
        soapBody += xml
        soapBody += `</${methodName}>`
      }
      let soapEnvelope = this.createRequest(soapBody)
      return Soap.makeRequest(this.serviceAddress, methodName, soapEnvelope)
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

  // ---------------------------------------------
  // Events API
  // ---------------------------------------------

  /**
   * Event Type: Pull Event<br>
   * This method returns a PullPointSubscription that can be polled using PullMessages. This message contains the same elements as the SubscriptionRequest of the WS-BaseNotification without the ConsumerReference.<br>
   * If no Filter is specified the pullpoint notifies all occurring events to the client.<br>
   * This method is mandatory.
   * @param {string=} filter Optional XPATH expression to select specific topics.
   * @param {integer=} initialTerminationTime Optional Initial termination time (in milliseconds)
   * @param {xml=} subscriptionPolicy Optional Refer to {@link http://docs.oasis-open.org/wsn/wsn-ws_base_notification-1.3-spec-os.htm Web Services Base Notification 1.3 (WS-BaseNotification)}.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  createPullPointSubscription (filter, initialTerminationTime, subscriptionPolicy, callback) {
    // Example createPullPointSubscriptionRequest
    // <CreatePullPointSubscription xmlns="http://www.onvif.org/ver10/events/wsdl">
    //   <Filter>
    //     <TopicExpression
    //       Dialect="http://www.onvif.org/ver10/tev/topicExpression/ConcreteSet"
    //       xmlns="http://docs.oasis-open.org/wsn/b-2"
    //       xmlns:tns1="http://www.onvif.org/ver10/topics">tns1:VideoSource/MotionAlarm
    //     </TopicExpression>
    //   </Filter>
    //   <InitialTerminationTime>PT10M</InitialTerminationTime>
    // </CreatePullPointSubscription>

    let promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof filter !== 'undefined' && filter !== null) {
        if ((errMsg = Util.isInvalidValue(filter, 'string'))) {
          reject(new Error('The "filter" argument for createPullPointSubscription is invalid: ' + errMsg))
          return
        }
      }
      if (typeof initialTerminationTime !== 'undefined' && initialTerminationTime !== null) {
        if ((errMsg = Util.isInvalidValue(initialTerminationTime, 'string'))) {
          reject(new Error('The "initialTerminationTime" argument for createPullPointSubscription is invalid: ' + errMsg))
          return
        }
      }
      if (typeof subscriptionPolicy !== 'undefined' && subscriptionPolicy !== null) {
        if ((errMsg = Util.isInvalidValue(subscriptionPolicy, 'string'))) {
          reject(new Error('The "subscriptionPolicy" argument for createPullPointSubscription is invalid: ' + errMsg))
          return
        }
      }

      let soapBody = ''
      if (typeof filter !== 'undefined' && filter !== null) {
        soapBody += '<tev:Filter>' + filter + '</tev:Filter>'
      }
      if (typeof initialTerminationTime !== 'undefined' && initialTerminationTime !== null) {
        soapBody += '<tev:InitialTerminationTime>' + 'PT' + initialTerminationTime / 1000 + 'S' + '</tev:InitialTerminationTime>'
      }
      if (typeof subscriptionPolicy !== 'undefined' && subscriptionPolicy !== null) {
        soapBody += '<tev:SubscriptionPolicy>' + subscriptionPolicy + '</tev:SubscriptionPolicy>'
      }

      this.buildRequest('CreatePullPointSubscription', soapBody)
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
   * Event Type: Agnostic<br>
   * The WS-BaseNotification specification defines a set of OPTIONAL WS-ResouceProperties. This specification does not require the implementation of the WS-ResourceProperty interface. Instead, the subsequent direct interface shall be implemented by an ONVIF compliant device in order to provide information about the FilterDialects, Schema files and topics supported by the device.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getEventProperties (callback) {
    // Example GetEventPropertiesRequest
    // <GetEventProperties xmlns="http://www.onvif.org/ver10/events/wsdl" />
    return this.buildRequest('GetEventProperties', null, callback)
  }

  /**
   * Event Type: Agnostic<br>
   * Returns the capabilities of the event service. The result is returned in a typed answer.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getServiceCapabilities (callback) {
    return this.buildRequest('GetServiceCapabilities', null, callback)
  }

  /**
   * Event Type: Pull Event<br>
   * This method pulls one or more messages from a PullPoint. The device shall provide the following PullMessages command for all SubscriptionManager endpoints returned by the CreatePullPointSubscription command. This method shall not wait until the requested number of messages is available but return as soon as at least one message is available.<br>
   * The command shall at least support a Timeout of one minute. In case a device supports retrieval of less messages than requested it shall return these without generating a fault.
   * @param {integer} timeout [msec] Maximum time to block until this method returns.
   * @param {integer} messageLimit Upper limit for the number of messages to return at once. A server implementation may decide to return less messages.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  pullMessages (timeout, messageLimit, callback) {
    // Example PullMessagesRequest
    // <PullMessages xmlns="http://www.onvif.org/ver10/events/wsdl">
    //   <Timeout>PT1S</Timeout>
    //   <MessageLimit>1</MessageLimit>
    // </PullMessages>

    let promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if ((errMsg = Util.isInvalidValue(timeout, 'integer'))) {
        reject(new Error('The "timeout" argument for pullMessages is invalid: ' + errMsg))
        return
      }
      if ((errMsg = Util.isInvalidValue(messageLimit, 'integer'))) {
        reject(new Error('The "messageLimit" argument for pullMessages is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tev:Timeout>' + 'PT' + timeout / 1000 + 'S' + '</tev:Timeout>'
      soapBody += '<tev:MessageLimit>' + messageLimit + '</tev:MessageLimit>'
      // soapBody += '<tt:Timeout>' + 'PT' + timeout / 1000 + 'S' + '</tt:Timeout>'
      // soapBody += '<tt:MessageLimit>' + messageLimit + '</tt:MessageLimit>'
      // soapBody += '<Timeout>' + 'PT' + timeout / 1000 + 'S' + '</Timeout>'
      // soapBody += '<MessageLimit>' + messageLimit + '</MessageLimit>'

      this.buildRequest('PullMessages', soapBody)
      // this.buildRequest2('PullMessages', 'xmlns="http://www.onvif.org/ver10/events/wsdl"', soapBody)
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
   * Event Type: Agnostic<br>
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  renew (callback) {
    // Example RenewRequest
    // <Renew xmlns="http://docs.oasis-open.org/wsn/b-2">
    // <TerminationTime>PT10M</TerminationTime>
    // </Renew>
    return this.buildRequest('Renew', null, callback)
  }

  /**
   * <strong>Not implemented</strong>
   * Event Type: Pull Event<br>
   * This method readjusts the pull pointer into the past. A device supporting persistent notification storage shall provide the following Seek command for all SubscriptionManager endpoints returned by the CreatePullPointSubscription command. The optional Reverse argument can be used to reverse the pull direction of the PullMessages command.<br>
   * The UtcTime argument will be matched against the UtcTime attribute on a NotificationMessage.
   * @param {string} utcTime The date and time to match against stored messages.
   * @param {boolean=} reverse Reverse the pull direction of PullMessages.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  seek (utcTime, reverse, callback) {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  // notify (callback) {
  //   return this.buildRequest('Notify', null, callback)
  // }

  /**
   * Event Type: Push Event<br>
   * The device shall provide the following Unsubscribe command for all SubscriptionManager
   * endpoints returned by the CreatePullPointSubscription command.<br>
   * This command shall terminate the lifetime of a pull point.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  subscribe (callback) {
    // Example SubscribeRequest
    // <Subscribe xmlns="http://docs.oasis-open.org/wsn/b-2">
    //   <ConsumerReference>
    //     <wsa:Address>http://192.168.0.111:10000/onvif/events</wsa:Address>
    //   </ConsumerReference>
    //   <Filter>
    //     <TopicExpression
    //       Dialect="http://www.onvif.org/ver10/tev/topicExpression/ConcreteSet"
    //       xmlns:tns1="http://www.onvif.org/ver10/topics">tns1:VideoSource/MotionAlarm
    //     </TopicExpression>
    //   </Filter>
    //   <InitialTerminationTime>PT10M</InitialTerminationTime>
    // </Subscribe>
    return this.buildRequest('Subscribe', null, callback)
  }

  /**
   * Event Type: Agnostic<br>
   * The device shall provide the following Unsubscribe command for all SubscriptionManager
   * endpoints returned by the CreatePullPointSubscription command.<br>
   * This command shall terminate the lifetime of a pull point.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  unsubscribe (callback) {
    // Example UnsubscribeRequest
    // <Unsubscribe xmlns="http://docs.oasis-open.org/wsn/b-2" />
    return this.buildRequest('Unsubscribe', null, callback)
  }

  /**
   * Event Type: Agnostic<br>
   * Properties inform a client about property creation, changes and deletion in a uniform way. When a client wants to synchronize its properties with the properties of the device, it can request a synchronization point which repeats the current status of all properties to which a client has subscribed. The PropertyOperation of all produced notifications is set to “Initialized”. The Synchronization Point is requested directly from the SubscriptionManager which was returned in either the SubscriptionResponse or in the CreatePullPointSubscriptionResponse. The property update is transmitted via the notification transportation of the notification interface. This method is mandatory.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  setSynchronizationPoint (callback) {
    return this.buildRequest('SetSynchronizationPoint', null, callback)
  }
}

module.exports = new Events()
