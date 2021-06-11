const Xml2js = require('xml2js')
const Crypto = require('crypto')
const Save = require('./save-xml')
const Request = require('request')
const Config = require('./config')

/**
 * SOAP management (sending, receiving, parsing) class for ONVIF modules.
 */
class Soap {
  constructor () {
    this.username = ''
    this.password = ''
    this.HTTP_TIMEOUT = 3000 // ms
  }

  /**
   * Internal method for parsing SOAP responses.
   * @param {string} soap The XML to parse.
   */
  parse (soap) {
    const promise = new Promise((resolve, reject) => {
      const prefix = soap.substring(0, 2)
      if (prefix === '--') {
        // this is a multi-part xml with attachment
        // it is up to the receiver to parse. This is
        // usually from GetSystemLog and the binary
        // part could be anything. Reference your
        // camera specs for dealing with it.
        resolve({ raw: true, soap })
      }
      else {
        const opts = {
          explicitRoot: false,
          explicitArray: false,
          // 'ignoreAttrs'      : true,
          ignoreAttrs: false,
          tagNameProcessors: [function (name) {
            // strip namespaces
            /* eslint-disable no-useless-escape */
            const m = name.match(/^([^\:]+)\:([^\:]+)$/)
            /* eslint-enable no-useless-escape */
            return (m ? m[2] : name)
          }]
        }

        // console.log(soap)
        Xml2js.parseString(soap, opts, (error, results) => {
          if (error) {
            error.soap = soap
            reject(error)
          }
          else {
            resolve({ parsed: results, soap })
          }
        })
      }
    })
    return promise
  }

  /**
   * Internal method used by the module classes.
   * @param {object} params Object containing required parameters to create a SOAP request.
   * @param {string} params.body Description in the &lt;s:Body&gt; of the generated xml.
   * @param {array} params.xmlns A list of xmlns attributes used in the body
   *            e.g., xmlns:tds="http://www.onvif.org/ver10/device/wsdl".
   * @param {number} params.diff Time difference [ms].
   * @param {string} params.username The user name.
   * @param {string} params.password The user Password.
   * @param {string=} params.subscriptionId To string (ex: used in Events#pullMessages).
   * @param {string=} params.subscriptionId.Address Action string (ex: used in Events#pullMessages).
   * @param {string=} params.subscriptionId._ MessageID string (ex: used in Events#pullMessages).
   * @param {string=} params.subscriptionId.$ MessageID string (ex: used in Events#pullMessages).
   */
  createRequest (params) {
    let soap = ''
    soap += '<?xml version="1.0" encoding="UTF-8"?>'
    soap += '<s:Envelope'
    soap += ' xmlns:s="http://www.w3.org/2003/05/soap-envelope"'
    soap += ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
    soap += ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"'
    soap += ' xmlns:wsa5="http://www.w3.org/2005/08/addressing"'
    soap += ' xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"'
    soap += ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"'
    soap += ' xmlns:tt="http://www.onvif.org/ver10/schema"'
    soap += ' xmlns:ter="http://www.onvif.org/ver10/error"'
    if (params.xmlns && Array.isArray(params.xmlns)) {
      params.xmlns.forEach((ns) => {
        // make sure we don't add it twice (hikvision will fail)
        const index = soap.indexOf(ns)
        if (index < 0) {
          soap += ' ' + ns
        }
      })
    }
    soap += '>'
    soap += '<s:Header>'
    if (params.subscriptionId) {
      const address = this.getAddress(params.subscriptionId)
      if (address) {
        soap += '<wsa5:To s:mustUnderstand="true">'
        soap += address
        soap += '</wsa5:To>'
      }
      // if (params.subscriptionId) {
      //   soap += '<Action s:mustUnderstand="1">http://www.onvif.org/ver10/events/wsdl/PullPointSubscription/PullMessagesRequest</Action>'
      // }
    }

    // TODO: sample of what should be here
    // soap += '<wsa5:Action s:mustUnderstand="1">'
    // soap += 'http://www.onvif.org/ver10/events/wsdl/EventPortType/CreatePullPointSubscriptionRequest'
    // soap += '</wsa5:Action>'
    // soap += '<wsa5:MessageID>'
    // soap += 'urn:uuid:cca999f8-b0e1-4e4e-ac7e-04a074d49fbf'
    // soap += '</wsa5:MessageID>'
    soap += '<wsa5:ReplyTo>'
    soap += '<wsa5:Address>http://www.w3.org/2005/08/addressing/anonymous</wsa5:Address>'
    soap += '</wsa5:ReplyTo>'
    if (params.username) {
      this.username = params.username
      this.password = params.password
      soap += this.createUserToken(params.diff, params.username, params.password)
    }
    soap += '</s:Header>'
    soap += '<s:Body>' + params.body + '</s:Body>'
    soap += '</s:Envelope>'

    /* eslint-disable no-useless-escape */
    soap = soap.replace(/\>\s+\</g, '><')
    /* eslint-enable no-useless-escape */
    return soap
  }

  /**
   * Internal method to send a SOAP request to the specified serviceAddress.
   * @param {object} service The service name.
   * @param {object} serviceAddress The service address.
   * @param {string} methodName The request name.
   * @param {xml} soapEnvelope The request SOAP envelope.
   * @param {object=} params Used internally.
   */
  makeRequest (service, serviceAddress, methodName, soapEnvelope, params) {
    const promise = new Promise((resolve, reject) => {
      Save.saveXml(service, methodName + '.Request', soapEnvelope)
      let xml = ''
      return this.runRequest(service, serviceAddress, methodName, soapEnvelope)
        .then(results => {
          xml = results
          return this.parse(xml)
        })
        // results for parse
        .then(results => {
          // is this 'raw' data?
          if ('raw' in results) {
            Save.saveXml(service, methodName + '.Response', results.soap)
            resolve(results)
            return
          }

          const fault = this.getFault(results.parsed)
          if (fault) {
            Save.saveXml(service, methodName + '.Error', xml)
            const err = new Error(`${methodName}`)
            err.fault = fault
            err.soap = xml
            reject(err)
          }
          else {
            const parsed = this.parseResponse(methodName, results.parsed)
            if (parsed) {
              const res = {
                soap: xml,
                schemas: results.parsed.$ ? results.parsed.$ : '',
                data: parsed
              }
              Save.saveXml(service, methodName + '.Response', xml)
              resolve(res)
            }
            else {
              const err = new Error(methodName + ':The device seems to not support the ' + methodName + '() method.')
              reject(err)
            }
          }
        })
        .catch(error => {
          reject(error)
        })
    })
    return promise
  }

  /**
   * Internal method to send a SOAP request.
   * @param {object} service The service.
   * @param {object} serviceAddress The service address.
   * @param {string} methodName The request name.
   * @param {xml} soapEnvelope The request SOAP envelope.
   */
  runRequest (service, serviceAddress, methodName, soapEnvelope) {
    return new Promise((resolve, reject) => {
      if (Config.isTest()) {
        // in testing mode (for Jest)
        const Fs = require('fs')
        const Path = require('path')
        const testCameraType = Config.getCameraType()
        const testService = service
        let filePath = Path.resolve(__dirname, `../../test/data/xml/${testCameraType}/${testService}/${methodName}.Response.xml`)
        // see if the file exists
        if (!Fs.existsSync(filePath)) {
          // see if there is an Error file
          filePath = Path.resolve(__dirname, `../../test/data/xml/${testCameraType}/${testService}/${methodName}.Error.xml`)
        }

        if (!Fs.existsSync(filePath)) {
          throw new Error(`File does not exist for test: ${filePath}`)
        }

        // it's good, read it in
        const xml = Fs.readFileSync(filePath, 'utf8')
        resolve(xml)
      }
      else {
        // some cameras enable HTTP digest or digest realm,
        // so using 'Request' to handle this for us.
        const options = {
          method: 'POST',
          uri: serviceAddress.href,
          // gzip: true,
          encoding: 'utf8',
          headers: {
            'Content-Type': 'application/soap+xml; charset=utf-8;',
            'Content-Length': Buffer.byteLength(soapEnvelope)
          },
          body: soapEnvelope,
          auth: {
            user: this.username,
            pass: this.password,
            sendImmediately: false
          }
        }

        Request(options, (error, response, body) => {
          if (error) {
            console.error(error)
            reject(error)
          }
          else {
            if (response.statusCode === 200) {
              resolve(body)
            }
            else {
              reject(response)
            }
          }
        })
      }
    })
  }

  parseResponse (methodName, response) {
    const s0 = response.Body
    if (!s0) {
      return null
    }
    const responseName = methodName + 'Response'
    if (responseName in s0) {
      return s0
    }
    else {
      return null
    }
  }

  /**
   * Parses results to see if there is a fault.
   * @param {object} results The results of a communication with a server.
   */
  getFault (results) {
    let fault = ''
    if ('Fault' in results.Body) {
      const bodyFault = results.Body.Fault
      const r1 = this.parseForReason(bodyFault)
      const c1 = this.parseForCode(bodyFault)
      const d1 = this.parseForDetail(bodyFault)
      fault = {}
      fault.reason = r1
      fault.code = c1
      fault.detail = d1
    }
    return fault
  }

  parseForCode (fault) {
    let code = ''
    if ('Code' in fault) {
      const faultCode = fault.Code
      if ('Value' in faultCode) {
        const faultValue = faultCode.Value
        if ('Subcode' in faultCode) {
          const faultSubcode = faultCode.Subcode
          if ('Value' in faultSubcode) {
            const faultSubcodeValue = faultSubcode.Value
            code = faultValue + '|' + faultSubcodeValue
          }
          else {
            code = faultSubcode
          }
        }
        else {
          code = faultValue
        }
      }
    }

    return code
  }

  parseForDetail (fault) {
    let detail = ''
    if ('Detail' in fault) {
      const faultDetail = fault.Detail
      if ('Text' in faultDetail) {
        const faultText = faultDetail.Text
        if (typeof faultText === 'string') {
          detail = faultText
        }
        else if (typeof faultText === 'object' && '_' in faultText) {
          detail = faultText._
        }
      }
    }

    return detail
  }

  parseForReason (fault) {
    let reason = ''
    if ('Reason' in fault) {
      const faultReason = fault.Reason
      if ('Text' in faultReason) {
        const faultText = faultReason.Text
        if (typeof faultText === 'string') {
          reason = faultText
        }
        else if (typeof faultText === 'object' && '_' in faultText) {
          reason = faultText._
        }
      }
    }
    else if ('faultstring' in fault) {
      reason = fault.faultstring
    }

    return reason
  }

  /**
   * Internal method used to create the user token xml.
   * @param {integer} diff The server timeDiff [ms].
   * @param {string} user The user name.
   * @param {string=} pass The user password.
   */
  createUserToken (diff, user, pass) {
    if (!diff) {
      diff = 0
    }
    if (!pass) {
      pass = ''
    }
    const created = (new Date(Date.now() + diff)).toISOString()
    // 10 second expiry
    const expires = (new Date(Date.now() + diff + 10000)).toISOString()
    const nonceBuffer = this.createNonce(16)
    const nonceBase64 = nonceBuffer.toString('base64')
    const shasum = Crypto.createHash('sha1')
    shasum.update(Buffer.concat([nonceBuffer, Buffer.from(created), Buffer.from(pass)]))
    const digest = shasum.digest('base64')
    let soap = ''
    soap += '<wsse:Security s:mustUnderstand="1">'
    soap += '  <wsu:Timestamp wsu:Id="Time">'
    soap += '    <wsu:Created>' + created + '</wsu:Created>'
    soap += '    <wsu:Expires>' + expires + '</wsu:Expires>'
    soap += '  </wsu:Timestamp>'
    soap += '  <wsse:UsernameToken wsu:Id="User">'
    soap += '    <wsse:Username>' + user + '</wsse:Username>'
    soap += '    <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">' + digest + '</wsse:Password>'
    soap += '    <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">' + nonceBase64 + '</wsse:Nonce>'
    soap += '    <wsu:Created xmlns="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' + created + '</wsu:Created>'
    soap += '  </wsse:UsernameToken>'
    soap += '</wsse:Security>'
    return soap
  }

  createNonce (digit) {
    const nonce = Buffer.alloc(digit)
    for (let i = 0; i < digit; i++) {
      nonce.writeUInt8(Math.floor(Math.random() * 256), i)
    }
    return nonce
  }

  getAddress (subscriptionid) {
    if (subscriptionid) {
      if (subscriptionid.Address) {
        return subscriptionid.Address
      }
    }
    return null
  }

  getCustomSubscriptionIdXml (subscriptionId) {
    if (subscriptionId) {
      if (subscriptionId._) {
        const id = subscriptionId._
        let xml = null
        if (subscriptionId.$) {
          const keys = Object.keys(subscriptionId.$)
          const tag = keys[0]
          const url = subscriptionId.$[tag]
          if (id && tag && url) {
            const tags = tag.split(':')
            // don't need Action tag
            xml = '<SubscriptionId s:mustUnderstand="1" s:IsReferenceParameter="1" ' + tags[0] + '="' + url + '">' + id + '</SubscriptionId>'
            console.log(xml)
          }
        }
        return xml
      }
    }
    return null
  }
}

module.exports = Soap
