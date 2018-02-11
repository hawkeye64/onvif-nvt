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
    let promise = new Promise((resolve, reject) => {
      let opts = {
        'explicitRoot': false,
        'explicitArray': false,
        // 'ignoreAttrs'      : true,
        'ignoreAttrs': false,
        'tagNameProcessors': [function (name) {
          /* eslint-disable no-useless-escape */
          let m = name.match(/^([^\:]+)\:([^\:]+)$/)
          /* eslint-enable no-useless-escape */
          return (m ? m[2] : name)
        }]
      }

      Xml2js.parseString(soap, opts, (error, results) => {
        if (error) {
          reject(error)
        }
        else {
          resolve({parsed: results, soap})
        }
      })
    })
    return promise
  };

  /**
   * Internal method used by the module classes.
   * @param {object} params Object containing required parameters to create a SOAP request.
   * @param {string} params.body Description in the &lt;s:Body&gt; of the generated xml.
   * @param {array} params.xmlns A list of xmlns attributes used in the body
   *            e.g., xmlns:tds="http://www.onvif.org/ver10/device/wsdl".
   * @param {number} params.diff Time difference [ms].
   * @param {string} params.username The user name.
   * @param {string} params.password The user Password.
   */
  createRequest (params) {
    let soap = ''
    soap += '<?xml version="1.0" encoding="UTF-8"?>'
    soap += '<s:Envelope'
    soap += ' xmlns:s="http://www.w3.org/2003/05/soap-envelope"'
    if (params['xmlns'] && Array.isArray(params['xmlns'])) {
      params['xmlns'].forEach((ns) => {
        soap += ' ' + ns
      })
    }
    soap += '>'
    soap += '<s:Header>'
    if (params['username']) {
      this.username = params['username']
      this.password = params['password']
      soap += this.createUserToken(params['diff'], params['username'], params['password'])
    }
    soap += '</s:Header>'
    soap += '<s:Body>' + params['body'] + '</s:Body>'
    soap += '</s:Envelope>'

    /* eslint-disable no-useless-escape */
    soap = soap.replace(/\>\s+\</g, '><')
    /* eslint-enable no-useless-escape */
    return soap
  };

  /**
   * Internal method to send a SOAP request to the specified serviceAddress.
   * @param {object} serviceAddress The service address.
   * @param {string} methodName The request name.
   * @param {xml} soapEnvelope The request SOAP envelope.
   */
  makeRequest (serviceAddress, methodName, soapEnvelope) {
    let promise = new Promise((resolve, reject) => {
      Save.saveXml(methodName + '.Request', soapEnvelope)
      let xml = ''
      return this.runRequest(serviceAddress, methodName, soapEnvelope)
        .then(results => {
          xml = results
          return this.parse(xml)
        })
        // results for parse
        .then(results => {
          let fault = this.getFaultReason(results['parsed'])
          if (fault) {
            Save.saveXml(methodName + '.Error', xml)
            let err = new Error(`${methodName}: fault[${fault}]`)
            err.soap = xml
            reject(err)
          }
          else {
            let parsed = this.parseResponse(methodName, results['parsed'])
            if (parsed) {
              let res = {
                'soap': xml,
                'schemas': results['parsed']['$'],
                'data': parsed
              }
              Save.saveXml(methodName + '.Response', xml)
              resolve(res)
            }
            else {
              let err = new Error(methodName + ':The device seems to not support the ' + methodName + '() method.')
              reject(err)
            }
          }
        })
        .catch(error => {
          reject(error)
        })
    })
    return promise
  };

  /**
   * Internal method to send a SOAP request.
   * @param {object} serviceAddress The service address.
   * @param {string} methodName The request name.
   * @param {xml} soapEnvelope The request SOAP envelope.
   */
  runRequest (serviceAddress, methodName, soapEnvelope) {
    return new Promise((resolve, reject) => {
      if (Config.isTest()) {
        // in testing mode (for Jest)
        const Fs = require('fs')
        const Path = require('path')
        const testCameraType = Config.getCameraType()
        const testResponseOrError = Config.getResponseOrError()
        let filePath = Path.resolve(__dirname, `../../test/data/xml/${testCameraType}/${methodName}.${testResponseOrError}.xml`)
        // see if the file exists
        if (!Fs.existsSync(filePath)) {
          throw new Error(`File does not exist for test: ${filePath}`)
        }
        // it's good, read it in
        let xml = Fs.readFileSync(filePath, 'utf8')
        resolve(xml)
      }
      else {
        // some cameras enable HTTP digest or digest realm,
        // so using 'Request' to handle this for us.
        let options = {
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
            resolve(body)
          }
        })
      }
    })
  };

  parseResponse (methodName, response) {
    let s0 = response['Body']
    if (!s0) {
      return null
    }
    if ((methodName + 'Response') in s0) {
      return s0
    }
    else {
      return null
    }
  };

  /**
   * Parses results to see if there is a fault.
   * @param {object} results The results of a communication with a server.
   */
  getFaultReason (results) {
    let reason = ''
    if ('Fault' in results['Body']) {
      try {
        let fault = results['Body']['Fault']
        let faultReason = fault['Reason']
        if (faultReason['Text']) {
          reason = faultReason['Text']
          if ('_' in reason) {
            reason = reason['_']
          }
        }
        else {
          let faultCode = fault['Code']
          if (faultCode['Value']) {
            reason = faultCode['Value']
            let faultSubcode = faultCode['Subcode']
            if (faultSubcode['Value']) {
              reason += ' ' + faultSubcode['Value']
            }
          }
        }
      }
      catch (e) {}
    }
    return reason
  };

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
    let date = (new Date(Date.now() + diff)).toISOString()
    let nonceBuffer = this.createNonce(16)
    let nonceBase64 = nonceBuffer.toString('base64')
    let shasum = Crypto.createHash('sha1')
    shasum.update(Buffer.concat([nonceBuffer, Buffer.from(date), Buffer.from(pass)]))
    let digest = shasum.digest('base64')
    let soap = ''
    soap += '<Security s:mustUnderstand="1" xmlns="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">'
    soap += '  <UsernameToken>'
    soap += '    <Username>' + user + '</Username>'
    soap += '    <Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">' + digest + '</Password>'
    soap += '    <Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">' + nonceBase64 + '</Nonce>'
    soap += '    <Created xmlns="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' + date + '</Created>'
    soap += '  </UsernameToken>'
    soap += '</Security>'
    return soap
  };

  createNonce (digit) {
    let nonce = Buffer.alloc(digit)
    for (let i = 0; i < digit; i++) {
      nonce.writeUInt8(Math.floor(Math.random() * 256), i)
    }
    return nonce
  };
}

module.exports = new Soap()
